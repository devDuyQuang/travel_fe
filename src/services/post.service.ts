import type {
  CmsPost,
  CmsPostDetailResponse,
  CmsPostListResponse,
} from "@/types/cms-post";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

export function resolveMediaUrl(image?: string | null) {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;

  const baseUrl = API_URL.replace(/\/$/, "");
  if (image.startsWith("/")) return `${baseUrl}${image}`;

  return `${baseUrl}/storage/${image.replace(/^storage\//, "")}`;
}

export async function getPostsByCategorySlug(
  categorySlug: string,
): Promise<CmsPost[]> {
  try {
    const params = new URLSearchParams({
      category_slug: categorySlug,
      limit: "100",
    });
    const response = await fetch(`${API_URL}/post?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as CmsPostListResponse;
    return Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.data)
        ? json.data.data
        : [];
  } catch {
    return [];
  }
}

export async function getPosts(limit = 12): Promise<CmsPost[]> {
  try {
    const params = new URLSearchParams({
      type: "post",
      limit: String(limit),
    });
    const response = await fetch(`${API_URL}/post?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as CmsPostListResponse;
    return Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.data)
        ? json.data.data
        : [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<CmsPost | null> {
  try {
    const response = await fetch(`${API_URL}/post/${slug}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    const json = (await response.json()) as CmsPostDetailResponse;
    return json.success && json.data ? json.data : null;
  } catch {
    return null;
  }
}
