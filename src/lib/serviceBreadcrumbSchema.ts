import type { Product } from "@/types/product";
import { metadataBase } from "@/lib/seoMetadata";

export function serviceBreadcrumbSchema(product: Product) {
  const category = product.category!;
  const categoryPath = `/dich-vu/${encodeURIComponent(category.slug)}`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", metadataBase).href },
      { "@type": "ListItem", position: 2, name: category.name, item: new URL(categoryPath, metadataBase).href },
      { "@type": "ListItem", position: 3, name: product.name, item: new URL(`${categoryPath}/${encodeURIComponent(product.slug)}`, metadataBase).href },
    ],
  };
}

export function serializeServiceBreadcrumb(product: Product): string {
  return JSON.stringify(serviceBreadcrumbSchema(product)).replace(/</g, "\\u003c");
}
