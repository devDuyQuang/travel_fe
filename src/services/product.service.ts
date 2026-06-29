import type {
  Product,
  ProductCategory,
  ProductDetailResponse,
  ProductListResponse,
} from "@/types/product";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";
const API_URL = `${API_ORIGIN.replace(/\/$/, "")}/api`;

export type ProductListMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ProductListResult = {
  data: Product[];
  meta: ProductListMeta;
};

type CategoryResponse = {
  success?: boolean;
  data?: Array<ProductCategory & { children?: ProductCategory[]; posts_count?: number }>;
};

function normalizeProductList(json: ProductListResponse, fallbackPerPage: number): ProductListResult {
  const payload = json.data;
  const data = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
  const currentPage = Array.isArray(payload) ? 1 : payload?.current_page || 1;
  const perPage = Array.isArray(payload) ? fallbackPerPage : payload?.per_page || fallbackPerPage;
  const total = Array.isArray(payload) ? data.length : payload?.total || data.length;
  const lastPage = Array.isArray(payload) ? Math.max(1, Math.ceil(data.length / perPage)) : payload?.last_page || Math.max(1, Math.ceil(total / perPage));
  return { data, meta: { current_page: currentPage, last_page: lastPage, per_page: perPage, total } };
}

function flattenCategories(categories: Array<ProductCategory & { children?: ProductCategory[] }> = []): ProductCategory[] {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children || [])]);
}

export async function getProducts(
  limit = 12,
  featuredFirst = false,
): Promise<Product[]> {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      featured_first: featuredFirst ? "1" : "0",
    });
    const response = await fetch(`${API_URL}/product?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as ProductListResponse;
    const products = Array.isArray(json.data)
      ? json.data
      : Array.isArray(json.data?.data)
        ? json.data.data
        : [];
    return products;
  } catch {
    return [];
  }
}

export async function getShopProducts(query: {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  sort?: string;
} = {}): Promise<ProductListResult> {
  const limit = query.limit || 9;
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      product_type: "physical",
      type: "product",
    });
    if (query.page && query.page > 1) params.set("page", String(query.page));
    if (query.search?.trim()) params.set("search", query.search.trim());
    if (query.categorySlug?.trim()) params.set("category_slug", query.categorySlug.trim());
    if (query.sort?.trim()) params.set("sort", query.sort.trim());

    const response = await fetch(`${API_URL}/product?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error("Shop product API error");
    return normalizeProductList((await response.json()) as ProductListResponse, limit);
  } catch {
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: limit, total: 0 } };
  }
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const params = new URLSearchParams({ type: "product", sort_name: "sort", sort_by: "asc" });
    const response = await fetch(`${API_URL}/category?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const json = (await response.json()) as CategoryResponse;
    return flattenCategories(json.data || []).filter((category) => category.type === "product");
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
