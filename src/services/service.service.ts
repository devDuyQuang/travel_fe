import type {
  CmsCategoryDetailResponse,
  CmsServiceCategory,
} from "@/types/cms-post";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

export async function getServiceCategoryBySlug(
  categorySlug: string,
): Promise<CmsServiceCategory | null> {
  try {
    const response = await fetch(
      `${API_URL}/category/${categorySlug}?limit=100`,
      {
        cache: "no-store",
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) return null;

    const json = (await response.json()) as CmsCategoryDetailResponse;
    if (!json.success || !json.data) return null;

    return {
      id: json.data.id,
      name: json.data.name,
      slug: json.data.slug,
      type: json.data.type,
      layout_key: json.data.layout_key,
      image: json.data.image,
      description: json.data.description,
      content: json.data.content,
    };
  } catch {
    return null;
  }
}
