import type { CmsPost } from "@/types/cms-post";

export const BLOG_FALLBACK_IMAGE = "/assets/img/breadcrumb/breadcrumb.jpg";

export function stripHtml(value?: string | null) {
  return (value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sanitizePostHtml(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+style\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/javascript:/gi, "");
}

export function formatVietnameseDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function getPostAuthorName(post: CmsPost) {
  return (
    post.author?.full_name ||
    post.author?.name ||
    post.creator?.full_name ||
    post.creator?.name ||
    post.user?.full_name ||
    post.user?.name ||
    "Ban biên tập"
  );
}

export function getPostReadMinutes(post: Pick<CmsPost, "content" | "description">) {
  const text = stripHtml(`${post.description || ""} ${post.content || ""}`);
  if (!text) return 1;

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function getPostExcerpt(post: CmsPost, maxLength = 180) {
  const raw = stripHtml(post.description) || stripHtml(post.content);
  if (raw.length <= maxLength) return raw;

  return `${raw.slice(0, maxLength).trimEnd()}...`;
}

export function getPostTags(post: CmsPost) {
  if (!post.tags) return [];
  const tags = Array.isArray(post.tags)
    ? post.tags
    : post.tags.split(",").map((tag) => tag.trim());

  return tags
    .map((tag) => (typeof tag === "string" ? tag : tag.name || tag.slug || ""))
    .filter(Boolean);
}
