import type { Metadata } from "next";
import { stripHtml } from "@/lib/blog";

const productionOrigin = "https://travel.voduyquang.com";
function siteOrigin(): string {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || productionOrigin);
    if (url.origin === productionOrigin) return url.origin;
  } catch { /* Use the production origin for invalid configuration. */ }
  return productionOrigin;
}
export const metadataBase = new URL(siteOrigin());
export const siteDescription = "GOLFNITY cung cấp dịch vụ đặt tee time, tour golf, nghỉ dưỡng, đưa đón và trải nghiệm dành cho golfer.";

export function metadataDescription(value?: string | null): string | undefined {
  const text = stripHtml(value);
  return text ? (text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text) : undefined;
}

export function safeMetadataImage(value?: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value, metadataBase);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : undefined;
  } catch { return undefined; }
}

export function pageMetadata(title: string, pathname: string, description?: string, image?: string, article = false): Metadata {
  const canonical = new URL(pathname, metadataBase).href;
  const images = image ? [{ url: image }] : undefined;
  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: "GOLFNITY", locale: "vi_VN", type: article ? "article" : "website", images },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : undefined },
  };
}

export function paginationPath(pathname: string, page?: string): string {
  const number = Number(page);
  return Number.isSafeInteger(number) && number > 1 ? `${pathname}?page=${number}` : pathname;
}
