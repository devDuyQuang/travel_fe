import type { Product } from "@/types/product";
import type { CmsPost, CmsServiceCategory } from "@/types/cms-post";
import { stripHtml } from "@/lib/blog";
import { isServiceLayoutKey } from "@/lib/serviceLayoutRegistry";
import { isCanonicalServiceProduct } from "@/lib/legacyProductRedirect";

const api = `${(process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000").replace(/\/$/, "")}/api`;
const canonicalCategories = new Set([
  "dat-tee-time", "tour-golf-viet-nam", "khach-san-nghi-duong",
  "thue-xe-dua-don", "tham-quan-trai-nghiem",
]);
const validSlug = (value: unknown): value is string => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

async function request(endpoint: string): Promise<Record<string, any>> {
  const response = await fetch(`${api}/${endpoint}`, { cache: "no-store", headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Sitemap API ${endpoint.split("?")[0]} returned ${response.status}`);
  const json = await response.json();
  if (json?.success !== true) throw new Error("Invalid sitemap API response");
  return json;
}

async function allPages<T extends { id: number }>(endpoint: string): Promise<T[]> {
  const records: T[] = [];
  const ids = new Set<number>();
  let expectedTotal: number | undefined;
  let expectedLast: number | undefined;
  for (let page = 1; page <= 1000; page++) {
    const json = await request(`${endpoint}&limit=100&page=${page}`);
    const rows = Array.isArray(json.data) ? json.data : json.data?.data;
    const meta = Array.isArray(json.data) ? json.meta : json.data;
    if (!Array.isArray(rows) || !Number.isInteger(meta?.last_page) || !Number.isInteger(meta?.total) || meta.current_page !== page || meta.last_page < page || meta.total < 0) throw new Error("Invalid sitemap pagination");
    expectedTotal ??= meta.total;
    expectedLast ??= meta.last_page;
    if (expectedTotal !== meta.total || expectedLast !== meta.last_page) throw new Error("Sitemap pagination changed during fetch; retry required");
    for (const record of rows) {
      if (!Number.isInteger(record?.id) || ids.has(record.id)) throw new Error("Duplicate/invalid sitemap API record");
      ids.add(record.id);
      records.push(record);
    }
    if (page === meta.last_page) {
      if (records.length !== expectedTotal) throw new Error("Incomplete sitemap API collection");
      return records;
    }
    if (!rows.length) throw new Error("Empty intermediate sitemap page");
  }
  throw new Error("Sitemap pagination safety limit exceeded");
}

async function categories(type: string): Promise<CmsServiceCategory[]> {
  const json = await request(`category?type=${type}`);
  if (!Array.isArray(json.data)) throw new Error("Invalid sitemap category collection");
  function flatten(rows: CmsServiceCategory[]): CmsServiceCategory[] {
    return rows.flatMap((row) => {
      if (!row || !Number.isInteger(row.id) || !validSlug(row.slug) || row.type !== type || (row.children !== undefined && !Array.isArray(row.children))) throw new Error("Invalid sitemap category");
      return [row, ...flatten(row.children || [])];
    });
  }
  return flatten(json.data);
}

export function realLastModified(value?: string | null): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}T/.test(value)) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function getSitemapData() {
  const [serviceCategories, postCategories, services, physical, posts] = await Promise.all([
    categories("service"), categories("post"),
    allPages<Product>("product?product_type=service&type=service"),
    allPages<Product>("product?product_type=physical&type=product"),
    allPages<CmsPost>("post?type=post"),
  ]);
  const categoryById = new Map(serviceCategories.filter((category) => canonicalCategories.has(category.slug) && isServiceLayoutKey(category.layout_key)).map((category) => [category.id, category]));
  const activePostIds = new Set(postCategories.map((category) => category.id));
  const excluded: Array<{ slug: string; reason: string }> = [];
  const serviceProducts = services.filter((product) => {
    const category = product.category && categoryById.get(product.category.id);
    let reason = "";
    if (!isCanonicalServiceProduct(product) || !validSlug(product.slug) || !category || category.slug !== product.category?.slug || category.layout_key !== product.category?.layout_key) reason = "INVALID_PUBLIC_CANONICAL_PRODUCT";
    else if (category.slug === "dat-tee-time" && product.slug === "danh-sach") reason = "RESERVED_PATH_COLLISION";
    else if (!stripHtml(product.short_description) || /lorem ipsum|Vatican Museums|Brooklyn/iu.test(`${product.short_description || ""} ${product.content || ""}`)) reason = "EXCLUDED_PENDING_CONTENT_REVIEW";
    if (reason) excluded.push({ slug: product.slug, reason });
    return !reason;
  });
  const news = posts.filter((post) => validSlug(post.slug) && post.categories?.some((category) => category.type === "post" && activePostIds.has(category.id)));
  if (news.length !== posts.length) throw new Error("News sitemap records could not be verified as public articles");
  const shopProducts = physical.filter((product) => product.status === 1 && product.product_type === "physical" && product.category?.type === "product" && validSlug(product.slug));
  if (shopProducts.length !== physical.length) throw new Error("Physical sitemap records failed validation");
  if (excluded.length) console.warn("[sitemap] excluded products", excluded);
  return { categories: [...categoryById.values()], serviceProducts, news, shopProducts };
}
