import sanitizeHtml from 'sanitize-html';
import type { Product } from '@/types/product';
import { resolveMediaUrl } from '@/services/post.service';
import { isCanonicalServiceProduct } from '@/lib/legacyProductRedirect';

export function safeEditorialImage(value: string) {
  if (!value.trim() || /^(?:javascript|data|vbscript):/i.test(value.trim()) || value.startsWith('//')) return null;
  const url = resolveMediaUrl(value);
  if (!url) return null;
  try { return ['http:', 'https:'].includes(new URL(url, 'https://travel.voduyquang.com').protocol) ? url : null; } catch { return null; }
}

/** Extract media only; the existing description sanitizer still owns rendered HTML. */
export function embeddedEditorialImages(html: string) {
  const images: string[] = [];
  sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
    transformTags: {
      img: (tagName, attributes) => {
        const url = attributes.src && safeEditorialImage(attributes.src);
        if (url && !images.includes(url)) images.push(url);
        return { tagName, attribs: {} };
      },
    },
  });
  return images;
}

export function relatedContentProducts(product: Product, products: Product[]) {
  const seen = new Set<number>();
  return products.filter(p => {
    if (p.id === product.id || p.slug === product.slug || !isCanonicalServiceProduct(p) || !safeEditorialImage(p.image_url || '') || seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  }).sort((a, b) => Number(b.location === product.location) - Number(a.location === product.location)).slice(0, 4);
}

// Fictional interface examples only. Never use in ratings, counts or JSON-LD.
export const demoServiceReviews = [
  { author: 'Khách hàng mẫu 01', text: 'Ví dụ giao diện: cân nhắc ngày sử dụng và thông tin của từng gói trước khi gửi yêu cầu.' },
  { author: 'Khách hàng mẫu 02', text: 'Ví dụ giao diện: hỏi rõ các khoản bao gồm nếu phần mô tả gói chưa cung cấp đầy đủ.' },
  { author: 'Khách hàng mẫu 03', text: 'Ví dụ giao diện: kiểm tra lại số lượng và thông tin liên hệ ở bước lựa chọn dịch vụ.' },
];
