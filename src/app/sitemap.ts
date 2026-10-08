import type { MetadataRoute } from "next";
import { metadataBase } from "@/lib/seoMetadata";
import { getSitemapData, realLastModified } from "@/lib/sitemapData";

export const dynamic = "force-dynamic";

const staticPaths = [
  "/", "/ve-golfnity", "/contact", "/cau-hoi-thuong-gap", "/doi-ngu",
  "/voucher-qua-tang", "/tin-tuc", "/cua-hang",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const data = await getSitemapData();
    const paths: Array<{ path: string; updated?: string | null }> = [
      ...staticPaths.map((path) => ({ path })),
      ...data.categories.map((category) => ({ path: `/dich-vu/${category.slug}` })),
      ...(data.categories.some((category) => category.slug === "dat-tee-time" && category.layout_key === "tee_time") ? [{ path: "/dich-vu/dat-tee-time/danh-sach" }] : []),
      ...data.serviceProducts.map((product) => ({ path: `/dich-vu/${product.category!.slug}/${product.slug}`, updated: product.updated_at })),
      ...data.news.map((post) => ({ path: `/tin-tuc/${post.slug}` })),
      ...data.shopProducts.map((product) => ({ path: `/cua-hang/${product.slug}`, updated: product.updated_at })),
    ];
    const seen = new Set<string>();
    return paths.map(({ path, updated }) => {
      if (seen.has(path)) throw new Error("Duplicate canonical sitemap URL");
      seen.add(path);
      const lastModified = realLastModified(updated);
      return { url: new URL(path, metadataBase).href, ...(lastModified ? { lastModified } : {}) };
    });
  } catch (error) {
    console.error("[sitemap] generation failed; refusing partial sitemap", error instanceof Error ? error.message : "Unknown error");
    throw new Error("Sitemap unavailable; retry after public API recovery");
  }
}
