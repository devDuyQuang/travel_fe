import type {
  CmsCategorySummary,
  CmsPaginationMeta,
  CmsPost,
  CmsPostDetailResponse,
  CmsPostListResponse,
  CmsTag,
} from "@/types/cms-post";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";
const API_URL = `${API_ORIGIN.replace(/\/$/, "")}/api`;

export function resolveMediaUrl(image?: string | null) {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;

  const baseUrl = API_ORIGIN.replace(/\/$/, "");
  const normalized = image.trim().replace(/^\/+/, "");
  if (normalized.startsWith("assets/") || normalized.startsWith("_next/")) {
    return `/${normalized}`;
  }

  return `${baseUrl}/storage/${normalized.replace(/^storage\//, "")}`;
}

export type PostListQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  categorySlug?: string;
  tag?: string;
  limit?: number;
};

export type PostListResult = {
  data: CmsPost[];
  meta: CmsPaginationMeta;
};

type CategoryListResponse = {
  success?: boolean;
  data?: CmsCategorySummary[];
};

type TagListResponse = {
  success?: boolean;
  data?: CmsTag[];
};

function flattenCategories(categories: CmsCategorySummary[] = []): CmsCategorySummary[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children || []),
  ]);
}

function normalizePostList(json: CmsPostListResponse, fallbackPerPage: number): PostListResult {
  const payload = json.data;
  const data = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : [];
  const currentPage = Array.isArray(payload) ? 1 : payload?.current_page || json.meta?.current_page || 1;
  const perPage = Array.isArray(payload) ? fallbackPerPage : payload?.per_page || json.meta?.per_page || fallbackPerPage;
  const total = Array.isArray(payload) ? data.length : payload?.total || json.meta?.total || data.length;
  const lastPage = Array.isArray(payload)
    ? Math.max(1, Math.ceil(data.length / Math.max(1, fallbackPerPage)))
    : payload?.last_page || json.meta?.last_page || Math.max(1, Math.ceil(total / Math.max(1, perPage)));

  return {
    data,
    meta: {
      current_page: currentPage,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  };
}

export async function getPostList(query: PostListQuery = {}): Promise<PostListResult> {
  const perPage = query.perPage || query.limit || 8;

  try {
    const params = new URLSearchParams({
      type: "post",
      limit: String(perPage),
      sort_name: "created_at",
      sort_by: "desc",
    });

    if (query.page && query.page > 1) params.set("page", String(query.page));
    if (query.search?.trim()) params.set("name", query.search.trim());
    if (query.categorySlug?.trim()) params.set("category_slug", query.categorySlug.trim());
    if (query.tag?.trim()) params.set("tag", query.tag.trim());

    const response = await fetch(`${API_URL}/post?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`Post API error: ${response.status}`);

    return normalizePostList((await response.json()) as CmsPostListResponse, perPage);
  } catch {
    return {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: 0,
      },
    };
  }
}

export async function getPostTags(): Promise<CmsTag[]> {
  try {
    const response = await fetch(`${API_URL}/tags`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as TagListResponse;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function getPostCategories(): Promise<CmsCategorySummary[]> {
  try {
    const params = new URLSearchParams({
      type: "post",
      sort_name: "sort",
      sort_by: "asc",
    });
    const response = await fetch(`${API_URL}/category?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as CategoryListResponse;
    if (!Array.isArray(json.data)) return [];

    return flattenCategories(json.data).filter((category) => category.type === "post");
  } catch {
    return [];
  }
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
  const result = await getPostList({ limit });
  return result.data;
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
