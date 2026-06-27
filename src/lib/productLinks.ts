import type { Product } from "@/types/product";

export function buildProductDetailHref(product: Product): string {
  const slug = product.slug?.trim();
  const layoutKey = product.category?.layout_key?.trim();

  if (!slug) return "#";

  if (product.product_type === "physical" || product.category?.type === "product") {
    return `/cua-hang/${slug}`;
  }

  if (!layoutKey) {
    return `/${slug}`;
  }

  return `/${slug}?layout=${encodeURIComponent(layoutKey)}`;
}
