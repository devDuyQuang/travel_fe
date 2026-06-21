import shopData from "@/data/ShopData";
import type { ServiceTemplatePage } from "@/lib/serviceLayoutRegistry";
import { resolveMediaUrl } from "@/services/post.service";
import type { Product as CardItem } from "@/redux/features/productSlice";
import type { CmsPost } from "@/types/cms-post";
import type { Product as CmsProduct } from "@/types/product";
import { buildProductDetailHref } from "@/lib/productLinks";

export function getServiceTemplateItems(
  templatePage: ServiceTemplatePage,
): CardItem[] {
  return shopData.filter(
    (item) => item.page === templatePage,
  ) as unknown as CardItem[];
}

function positiveNumber(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function textValue(value?: string | null) {
  return typeof value === "string" && value.trim() ? value : null;
}

function mediaList(cmsItem: CmsProduct) {
  const values = Array.isArray(cmsItem.gallery) ? cmsItem.gallery : [];

  return values
    .map((value) => resolveMediaUrl(value))
    .filter((value): value is string => Boolean(value));
}

function resolveCardImage(
  cmsItem: CmsProduct | CmsPost,
  templateItem: CardItem,
) {
  const image = resolveMediaUrl(cmsItem.image_url);
  if (!image || typeof templateItem.thumb === "string") {
    return image || templateItem.thumb;
  }

  return {
    src: image,
    width: templateItem.thumb.width,
    height: templateItem.thumb.height,
  };
}

export function mergeCmsProductsWithTemplate({
  cmsItems,
  templateItems,
}: {
  cmsItems?: CmsProduct[];
  templateItems: CardItem[];
}): CardItem[] {
  const hasCmsItems = Array.isArray(cmsItems) && cmsItems.length > 0;

  if (!hasCmsItems) return templateItems;
  if (templateItems.length === 0) return [];

  return cmsItems.map((cmsItem, index) => {
    const templateItem = templateItems[index % templateItems.length];
    const isTeeTime = cmsItem.category?.layout_key === "tee_time";

    return {
      ...templateItem,
      id: cmsItem.id ?? templateItem.id,
      title: textValue(cmsItem.name) || templateItem.title,
      slug: textValue(cmsItem.slug) || templateItem.slug,
      thumb: resolveCardImage(cmsItem, templateItem),
      description: textValue(cmsItem.short_description) || templateItem.description,
      content: textValue(cmsItem.content) || templateItem.content || null,
      location: textValue(cmsItem.location) || templateItem.location,
      duration:
        textValue(cmsItem.duration) ||
        textValue(String(cmsItem.attributes?.visit_duration || "")) ||
        templateItem.duration,
      price:
        positiveNumber(cmsItem.price) ??
        positiveNumber(cmsItem.attributes?.adult_price as string | number | null) ??
        templateItem.price,
      delete_price:
        positiveNumber(cmsItem.price_discount) ?? templateItem.delete_price,
      review:
        positiveNumber(cmsItem.rating) ?? templateItem.review,
      total_review:
        positiveNumber(cmsItem.review_count) ?? templateItem.total_review,
      tag: textValue(cmsItem.badge) || templateItem.tag,
      featured: cmsItem.is_featured
        ? (textValue(cmsItem.badge) || templateItem.featured || "Nổi bật")
        : templateItem.featured,
      amenities:
        (isTeeTime
          ? textValue(cmsItem.facilities)
          : textValue(String(
              cmsItem.attributes?.amenities ||
              cmsItem.attributes?.vehicle_amenities ||
              "",
            ))) ||
        templateItem.amenities,
      language:
        (!isTeeTime
          ? textValue(String(cmsItem.attributes?.languages || cmsItem.attributes?.language || ""))
          : null) ||
        templateItem.language,
      destination:
        (isTeeTime
          ? textValue(cmsItem.location)
          : textValue(String(
              cmsItem.attributes?.destination ||
              cmsItem.attributes?.pickup_location ||
              cmsItem.attributes?.meeting_point ||
              "",
            ))) ||
        templateItem.destination,
      guest:
        (!isTeeTime
          ? textValue(String(
              cmsItem.attributes?.max_guests ||
              cmsItem.attributes?.seat_count ||
              cmsItem.attributes?.group_size ||
              "",
            ))
          : null) ||
        templateItem.guest,
      isCmsItem: true,
      cmsProduct: cmsItem,
    };
  });
}

export function getServiceItemDetailPath(
  item: CardItem,
  existingThemeDetailPath: string,
) {
  return item.isCmsItem && item.cmsProduct
    ? buildProductDetailHref(item.cmsProduct)
    : existingThemeDetailPath;
}

export function mergeCmsProductWithDetailTemplate({
  cmsItem,
  templateItems,
  cmsItems,
}: {
  cmsItem: CmsProduct;
  templateItems: CardItem[];
  cmsItems?: CmsProduct[];
}): CmsProduct {
  const cmsIndex = Math.max(
    0,
    cmsItems?.findIndex((item) => item.slug === cmsItem.slug) ?? 0,
  );
  const templateItem =
    templateItems.length > 0
      ? templateItems[cmsIndex % templateItems.length]
      : null;

  return {
    ...cmsItem,
    name: textValue(cmsItem.name) || templateItem?.title || cmsItem.name,
    slug: textValue(cmsItem.slug) || templateItem?.slug || cmsItem.slug,
    short_description:
      textValue(cmsItem.short_description) || templateItem?.description || null,
    content: textValue(cmsItem.content),
    image_url:
      resolveMediaUrl(cmsItem.image_url) ||
      (typeof templateItem?.thumb === "string"
        ? templateItem.thumb
        : templateItem?.thumb.src) ||
      null,
    location:
      textValue(cmsItem.location) ||
      textValue(String(cmsItem.attributes?.full_address || "")) ||
      templateItem?.location ||
      null,
    duration:
      textValue(cmsItem.duration) ||
      textValue(String(cmsItem.attributes?.visit_duration || "")) ||
      templateItem?.duration ||
      null,
    rating:
      positiveNumber(cmsItem.rating)?.toString() ??
      (templateItem?.review === undefined
        ? null
        : String(templateItem.review)),
    review_count:
      positiveNumber(cmsItem.review_count) ??
      (templateItem?.total_review === undefined
        ? null
        : templateItem.total_review),
    price:
      positiveNumber(cmsItem.price)?.toString() ??
      positiveNumber(cmsItem.attributes?.adult_price as string | number | null)?.toString() ??
      (templateItem?.price === undefined
        ? null
        : String(templateItem.price)),
    price_discount:
      positiveNumber(cmsItem.price_discount)?.toString() ??
      (templateItem?.delete_price === undefined
        ? null
        : String(templateItem.delete_price)),
    badge:
      textValue(cmsItem.badge) ||
      templateItem?.tag ||
      templateItem?.featured ||
      templateItem?.offer ||
      null,
    gallery: mediaList(cmsItem),
    video_url: textValue(cmsItem.video_url),
    highlights: textValue(cmsItem.highlights),
    facilities: textValue(cmsItem.facilities),
  };
}

export function mergeCmsPostWithDetailTemplate({
  cmsItem,
  templateItems,
}: {
  cmsItem: CmsPost;
  templateItems: CardItem[];
}): CmsProduct {
  const templateItem = templateItems[0] ?? null;

  return {
    id: cmsItem.id,
    name: cmsItem.name,
    slug: cmsItem.slug,
    image_url:
      resolveMediaUrl(cmsItem.image_url || cmsItem.image) ||
      (typeof templateItem?.thumb === "string"
        ? templateItem.thumb
        : templateItem?.thumb.src) ||
      null,
    short_description: cmsItem.description,
    content: cmsItem.content,
    location: templateItem?.location ?? null,
    duration: templateItem?.duration ?? null,
    rating:
      templateItem?.review === undefined
        ? null
        : String(templateItem.review),
    review_count:
      templateItem?.total_review === undefined
        ? null
        : templateItem.total_review,
    price:
      templateItem?.price === undefined
        ? null
        : String(templateItem.price),
    price_discount:
      templateItem?.delete_price === undefined
        ? null
        : String(templateItem.delete_price),
    badge:
      templateItem?.tag ||
      templateItem?.featured ||
      templateItem?.offer ||
      null,
    category: cmsItem.categories?.[0] ?? null,
  };
}
