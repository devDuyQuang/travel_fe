import { isServiceLayoutKey } from "@/lib/serviceLayoutConfig";
import { buildProductDetailHref } from "@/lib/productLinks";
import type { Product } from "@/types/product";

export type LegacySearchParams = Record<string, string | string[] | undefined>;

export function isCanonicalServiceProduct(product: Product): boolean {
  return product.product_type === "service" && product.status === 1 &&
    product.category?.type === "service" && Boolean(product.category.slug?.trim()) &&
    Boolean(product.slug?.trim()) && isServiceLayoutKey(product.category.layout_key);
}

const preservedKeys = new Set([
  "option_id", "service_option_id", "location", "course_location", "destination",
  "pickup_location", "dropoff_location", "check_in", "check_out", "start_date",
  "pickup_date", "pickup_time", "visit_date", "play_date", "play_time",
  "rooms", "adults", "children", "passengers", "golfers",
]);

export function withLegacyDetailQuery(pathname: string, query: LegacySearchParams = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (!preservedKeys.has(key) && !/^utm_[a-z0-9_]+$/i.test(key)) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) params.append(key, item);
    }
  }
  const suffix = params.toString();
  return suffix ? `${pathname}?${suffix}` : pathname;
}

export function legacyProductTarget(product: Product, query: LegacySearchParams = {}): string {
  return withLegacyDetailQuery(buildProductDetailHref(product), query);
}
