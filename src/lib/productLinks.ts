import type { Product } from "@/types/product";

export function buildProductDetailHref(product: Product): string {
  const slug = product.slug?.trim();
  const categorySlug = product.category?.slug?.trim();

  if (!slug) return "#";

  if (product.product_type === "physical" || product.category?.type === "product") {
    return `/cua-hang/${slug}`;
  }

  if (product.product_type === "service" && product.category?.type === "service" && categorySlug) {
    return `/dich-vu/${encodeURIComponent(categorySlug)}/${encodeURIComponent(slug)}`;
  }

  return `/${encodeURIComponent(slug)}`;
}
