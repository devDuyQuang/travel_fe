import type { Product } from "@/types/product";

const BA_NA_HILLS_HIGHLIGHTS = [
  "Trải nghiệm các tiện nghi và dịch vụ đẳng cấp thế giới của Ba Na Hills Golf Club, chẳng hạn như câu lạc bộ hiện đại và hơn thế nữa!",
  "Tận hưởng chơi gôn bất cứ lúc nào vì cơ sở này tự hào có sân gôn có đèn pha cho những ai muốn chơi vào ban đêm",
  "Dẫn những người thân yêu của bạn vào trải nghiệm đầy thú vị này, nơi họ có thể đánh giá cao một môn thể thao mới",
  "Tận hưởng dịch vụ đưa đón dễ dàng giữa khách sạn của bạn ở Thành phố Đà Nẵng và Ba Na Hills Golf Club",
];

function plainTextList(value: unknown): string[] {
  if (value === null || value === undefined || typeof value === "boolean") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => plainTextList(item));
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return plainTextList(record.value || record.items || record.highlights);
  }

  const text = String(value).trim();

  if (!text) return [];

  try {
    const parsed = JSON.parse(text) as unknown;
    if (parsed !== text) {
      const parsedItems = plainTextList(parsed);
      if (parsedItems.length > 0) return parsedItems;
    }
  } catch {
    // Plain text and HTML are handled below.
  }

  return text
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .split(/[\n;|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.filter((item) => item.trim())));
}

function isBaNaHills(product: Product | null) {
  const identity = `${product?.slug || ""} ${product?.name || ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return identity.includes("ba-na-hills") || identity.includes("ba na hills");
}

export function normalizeProductHighlights(product: Product | null): string[] {
  const attributes = product?.attributes as Record<string, unknown> | undefined;
  const items = uniqueItems([
    ...plainTextList(attributes?.highlights),
    ...plainTextList(product?.metadata?.highlights),
    ...plainTextList(product?.highlights),
  ]);

  if (isBaNaHills(product)) {
    const hasRequiredContent = BA_NA_HILLS_HIGHLIGHTS.every((highlight) =>
      items.includes(highlight),
    );

    return hasRequiredContent ? items : BA_NA_HILLS_HIGHLIGHTS;
  }

  return items;
}
