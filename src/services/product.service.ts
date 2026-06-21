import type {
  Product,
  ProductDetailResponse,
  ProductListResponse,
} from "@/types/product";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

export async function getProducts(limit = 12): Promise<Product[]> {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    const response = await fetch(`${API_URL}/product?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as ProductListResponse;
    return Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.data)
        ? json.data.data
        : [];
  } catch {
    return [];
  }
}

export async function getProductsByCategorySlug(
  categorySlug: string,
): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      category_slug: categorySlug,
      limit: "100",
    });
    const response = await fetch(`${API_URL}/product?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as ProductListResponse;
    return Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.data)
        ? json.data.data
        : [];
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/product/${slug}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as ProductDetailResponse;

    if (Array.isArray(json.data)) {
      return json.data[0] ?? null;
    }

    return json.data ?? null;
  } catch {
    return null;
  }
}
