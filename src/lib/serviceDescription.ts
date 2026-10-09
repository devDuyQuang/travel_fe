import sanitizeHtml from "sanitize-html";

/** Identical allowlist parsing on the server and during client hydration. */
export function sanitizeServiceDescription(value: unknown): string {
  if (typeof value !== "string") return "";

  const html = sanitizeHtml(value, {
    allowedTags: ["p", "h2", "h3", "ul", "ol", "li", "strong", "em", "b", "i", "a", "br", "blockquote", "div", "span"],
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: { h1: "h2" },
    nonTextTags: ["script", "style", "textarea", "option", "iframe", "object", "embed", "svg", "math", "template"],
  }).trim();

  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&(?:nbsp|#160|#x0*a0);/gi, " ")
    .trim();
  return text ? html : "";
}

/** Pick one description; empty/unsafe-only editor HTML falls back to legacy data. */
export function resolveServiceDescription(content: unknown, ...fallbacks: unknown[]): string {
  const editable = sanitizeServiceDescription(content);
  if (editable) return editable;

  for (const value of fallbacks) {
    if (typeof value !== "string" || /(demo|cms|seed|internal|dữ liệu demo|tee time trong cms)/i.test(value)) continue;
    const html = sanitizeServiceDescription(value);
    if (html) return html;
  }
  return "";
}
