import type { Product, ProductServiceOption } from "@/types/product";

type OptionMetadata = NonNullable<ProductServiceOption["metadata"]>;

export type TeeTimeQuantityRule = {
  min: number;
  max: number;
  fixed: boolean;
};

export type TeeTimeOptionDetailItem = {
  text: string;
  tone?: "include" | "exclude" | "neutral";
};

export type TeeTimeOptionDetailSection = {
  title: string;
  items: TeeTimeOptionDetailItem[];
  tone?: "include" | "exclude" | "neutral";
  defaultOpen?: boolean;
};

type PackageDetails = {
  badges?: unknown;
  booking_badges?: unknown;
  bookingBadges?: unknown;
  itinerary?: Record<string, unknown>;
  inclusions?: unknown;
  exclusions?: unknown;
  pickup?: Record<string, unknown>;
  meeting_pickup?: unknown;
  meetingPickup?: unknown;
  booking_notes?: Record<string, unknown>;
  bookingNotes?: Record<string, unknown>;
  conditions?: unknown;
  additional_information?: unknown;
  additionalInformation?: unknown;
  restrictions?: unknown;
  dress_code?: unknown;
  dressCode?: unknown;
  confirmation_policy?: unknown;
  confirmationPolicy?: unknown;
  cancellation_policy?: unknown;
  cancellationPolicy?: unknown;
  voucher_information?: unknown;
  voucherInformation?: unknown;
  pickup_information?: unknown;
  pickupInformation?: unknown;
  terms?: Record<string, unknown>;
  generalTerms?: Record<string, unknown>;
  general_terms?: Record<string, unknown>;
  usage?: Record<string, unknown>;
};

export type TeeTimePackageDetailsData = {
  badges: string[];
  itinerary?: Record<string, unknown>;
  inclusions: string[];
  exclusions: string[];
  pickup?: Record<string, unknown>;
  bookingNotes?: Record<string, unknown>;
  generalTerms?: Record<string, unknown>;
  usage?: Record<string, unknown>;
};

const DEFAULT_MAX_GOLFERS = 12;

function formatVnd(value: string | number): string {
  const amount = Number(value);

  return Number.isFinite(amount) && amount > 0
    ? `${amount.toLocaleString("vi-VN")}đ`
    : "Liên hệ";
}

function positiveInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : null;
}

function metadataInteger(
  metadata: OptionMetadata | undefined,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = positiveInteger(metadata?.[key]);

    if (value !== null) return value;
  }

  return null;
}

function metadataText(
  metadata: OptionMetadata | undefined,
  keys: string[],
): string {
  for (const key of keys) {
    const value = metadata?.[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function splitTextItems(value?: unknown): string[] {
  if (
    value === null ||
    value === undefined ||
    typeof value === "boolean"
  ) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return String(value)
    .replace(/<[^>]+>/g, "\n")
    .split(/[\n;|]+/)
    .map((item) => item.replace(/^[-•✓×]\s*/, "").trim())
    .filter(Boolean);
}

function stringItem(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function packageDetailsValue(value: unknown): PackageDetails | null {
  const details = objectValue(value);

  return Object.keys(details).length > 0 ? details : null;
}

function combineItems(...values: unknown[]): string[] {
  return values.flatMap(splitTextItems);
}

function firstItems(...values: unknown[]): string[] {
  for (const value of values) {
    const items = splitTextItems(value);

    if (items.length > 0) return items;
  }

  return [];
}

function firstObject(...values: unknown[]): Record<string, unknown> {
  for (const value of values) {
    const object = objectValue(value);

    if (Object.keys(object).length > 0) return object;
  }

  return {};
}

function itineraryItems(itinerary?: Record<string, unknown>): string[] {
  if (!itinerary) return [];

  return [
    stringItem(itinerary.departureLabel || itinerary.departure_title),
    stringItem(itinerary.venueName || itinerary.venue_name),
    [stringItem(itinerary.returnTime || itinerary.return_time), stringItem(itinerary.returnLabel || itinerary.return_label)]
      .filter(Boolean)
      .join(" · "),
    stringItem(itinerary.note),
  ].filter(Boolean);
}

function pickupItems(pickup?: Record<string, unknown>): string[] {
  if (!pickup) return [];

  return [
    stringItem(pickup.title),
    stringItem(pickup.departureTitle || pickup.departure_title),
    pickup.searchableLocation || pickup.searchable_location ? "Tìm địa điểm khả dụng" : "",
    stringItem(pickup.confirmationLabel || pickup.confirmation_title),
    stringItem(pickup.meetingPointLabel || pickup.meeting_point_title),
    stringItem(pickup.meetingPointNote || pickup.meeting_point_note),
    [stringItem(pickup.returnTime || pickup.return_time), stringItem(pickup.returnLabel || pickup.return_label)]
      .filter(Boolean)
      .join(" · "),
  ].filter(Boolean);
}

function structuredItems(
  value: unknown,
  formatter: (object: Record<string, unknown>) => string[],
): string[] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return formatter(value as Record<string, unknown>);
  }

  return splitTextItems(value);
}

function firstStructuredItems(
  formatter: (object: Record<string, unknown>) => string[],
  ...values: unknown[]
): string[] {
  for (const value of values) {
    const items = structuredItems(value, formatter);

    if (items.length > 0) return items;
  }

  return [];
}

function sectionFromItems(
  title: string,
  items: string[],
  tone: TeeTimeOptionDetailSection["tone"] = "neutral",
  defaultOpen = false,
): TeeTimeOptionDetailSection | null {
  return items.length > 0
    ? {
        title,
        items: items.map((item) => ({ text: item, tone })),
        tone,
        defaultOpen,
      }
    : null;
}

function includeExcludeSection(
  inclusions: string[],
  exclusions: string[],
): TeeTimeOptionDetailSection | null {
  const items: TeeTimeOptionDetailItem[] = [
    ...inclusions.map((item) => ({ text: item, tone: "include" as const })),
    ...exclusions.map((item) => ({ text: item, tone: "exclude" as const })),
  ];

  return items.length > 0
    ? {
        title: "Bao gồm",
        items,
        defaultOpen: true,
      }
    : null;
}

export function parseQuantityRuleFromOptionName(
  name?: string | null,
): Partial<TeeTimeQuantityRule> {
  const normalized = (name || "").toLowerCase();

  const rangeMatch = normalized.match(/(\d+)\s*[-–]\s*(\d+)/);
  if (rangeMatch) {
    const min = positiveInteger(rangeMatch[1]);
    const max = positiveInteger(rangeMatch[2]);

    if (min && max) {
      return { min, max: Math.max(min, max), fixed: min === max };
    }
  }

  const fromMatch = normalized.match(/(?:từ|from)\s*(\d+)\s*\+?/);
  if (fromMatch) {
    const min = positiveInteger(fromMatch[1]);

    if (min) return { min, fixed: false };
  }

  const plusMatch = normalized.match(/(\d+)\s*\+/);
  if (plusMatch) {
    const min = positiveInteger(plusMatch[1]);

    if (min) return { min, fixed: false };
  }

  const singleMatch = normalized.match(/(?:nhóm|group)?\s*(\d+)\s*(?:khách|người|golfer|golfers)/);
  if (singleMatch) {
    const quantity = positiveInteger(singleMatch[1]);

    if (quantity) return { min: quantity, max: quantity, fixed: true };
  }

  return {};
}

export function resolveTeeTimeQuantityRule(
  option?: ProductServiceOption | null,
): TeeTimeQuantityRule {
  const metadata = option?.metadata ?? undefined;
  const nameRule = parseQuantityRuleFromOptionName(option?.name);
  const fixedQuantity = metadataInteger(metadata, [
    "quantity",
    "golfers",
    "group_size",
    "fixed_quantity",
  ]);
  const min =
    fixedQuantity ??
    positiveInteger(option?.min_quantity) ??
    metadataInteger(metadata, [
      "min_quantity",
      "min_golfers",
      "min_people",
      "min_participants",
      "group_size_min",
    ]) ??
    nameRule.min ??
    1;
  const max =
    fixedQuantity ??
    positiveInteger(option?.max_quantity) ??
    metadataInteger(metadata, [
      "max_quantity",
      "max_golfers",
      "max_people",
      "max_participants",
      "group_size_max",
    ]) ??
    positiveInteger(option?.capacity) ??
    nameRule.max ??
    Math.max(min, DEFAULT_MAX_GOLFERS);

  return {
    min,
    max: Math.max(min, max),
    fixed: fixedQuantity !== null || min === max || nameRule.fixed === true,
  };
}

export function getInitialQuantityForOption(
  option?: ProductServiceOption | null,
): number {
  return resolveTeeTimeQuantityRule(option).min;
}

export function clampQuantityForOption(
  option: ProductServiceOption | null | undefined,
  quantity: number,
): number {
  const rule = resolveTeeTimeQuantityRule(option);

  return Math.min(rule.max, Math.max(rule.min, quantity));
}

export function getQuantityOptionsForOption(
  option?: ProductServiceOption | null,
) {
  const rule = resolveTeeTimeQuantityRule(option);

  return Array.from(
    { length: rule.max - rule.min + 1 },
    (_, index) => {
      const value = String(rule.min + index);

      return {
        value,
        text: value,
      };
    },
  );
}

export function resolveOptionDetail(
  option: ProductServiceOption | null | undefined,
  product?: Product | null,
) {
  const metadata = option?.metadata || {};
  const productAttributes = objectValue(product?.attributes);
  const productMetadata = objectValue(product?.metadata);
  const optionPackageDetails =
    packageDetailsValue(metadata.package_details) ||
    packageDetailsValue(metadata.packageDetails);
  const productPackageDetails =
    packageDetailsValue(productAttributes.package_details) ||
    packageDetailsValue(productAttributes.packageDetails) ||
    packageDetailsValue(productMetadata.package_details) ||
    packageDetailsValue(productMetadata.packageDetails);
  const packageDetails = optionPackageDetails || productPackageDetails;
  const directBookingNotesObject = objectValue(
    metadata.booking_notes || metadata.bookingNotes,
  );
  const productBookingNotesObject = firstObject(
    productAttributes.booking_notes,
    productAttributes.bookingNotes,
    productPackageDetails?.booking_notes,
    productPackageDetails?.bookingNotes,
    productMetadata.booking_notes,
    productMetadata.bookingNotes,
  );
  const directGeneralTermsObject = objectValue(
    metadata.general_terms || metadata.generalTerms,
  );
  const directUsageObject = objectValue(metadata.usage);
  const bookingNotesObject = objectValue(
    packageDetails?.bookingNotes || packageDetails?.booking_notes,
  );
  const termsObject = objectValue(
    packageDetails?.generalTerms ||
      packageDetails?.general_terms ||
      packageDetails?.terms,
  );
  const description = option?.description || product?.short_description || "";
  const inclusions = firstItems(
    optionPackageDetails?.inclusions,
    metadata.inclusions,
    metadata.included_items,
    option?.inclusions ||
      "",
    productPackageDetails?.inclusions,
    productAttributes.inclusions,
    productAttributes.included_items,
    productMetadata.inclusions,
    productMetadata.included_items,
    product?.facilities,
  );
  const exclusions = firstItems(
    optionPackageDetails?.exclusions,
    metadata.exclusions,
    metadata.excluded_items,
    option?.exclusions ||
      "",
    productPackageDetails?.exclusions,
    productAttributes.exclusions,
    productAttributes.excluded_items,
    productMetadata.exclusions,
    productMetadata.excluded_items,
  );
  const confirmationPolicyItems = firstItems(
    termsObject.confirmation,
    metadata.confirmation_policy,
    metadata.confirmationPolicy,
    metadata.confirm_policy,
    optionPackageDetails?.confirmation_policy,
    optionPackageDetails?.confirmationPolicy,
    productAttributes.confirmation_policy,
    productAttributes.confirmationPolicy,
    productAttributes.confirm_policy,
    productMetadata.confirmation_policy,
    productMetadata.confirmationPolicy,
    productMetadata.confirm_policy,
  );
  const confirmationPolicy = confirmationPolicyItems[0] || "";
  const cancellationPolicy =
    firstItems(
      termsObject.cancellation,
      metadata.cancellation_policy,
      metadata.cancellationPolicy,
      metadata.cancel_policy,
      optionPackageDetails?.cancellation_policy,
      optionPackageDetails?.cancellationPolicy,
      productAttributes.cancellation_policy,
      productAttributes.cancellationPolicy,
      productAttributes.cancel_policy,
      productMetadata.cancellation_policy,
      productMetadata.cancellationPolicy,
      productMetadata.cancel_policy,
    )[0] || "";
  const usageInstruction = metadataText(metadata, [
    "usage_instruction",
    "usage_instructions",
    "terms",
  ]);
  const meetingPoint = metadataText(metadata, [
    "meeting_point",
    "pickup_information",
    "pickup_info",
  ]);
  const metadataItinerary = structuredItems(metadata.itinerary, itineraryItems);
  const productItinerary = firstStructuredItems(
    itineraryItems,
    productPackageDetails?.itinerary,
    productAttributes.itinerary,
    productMetadata.itinerary,
  );
  const metadataPickup = firstStructuredItems(
    pickupItems,
    metadata.meeting_pickup,
    metadata.meetingPickup,
    metadata.pickup,
  );
  const productPickup = firstStructuredItems(
    pickupItems,
    productPackageDetails?.meeting_pickup,
    productPackageDetails?.meetingPickup,
    productPackageDetails?.pickup,
    productAttributes.meeting_pickup,
    productAttributes.meetingPickup,
    productAttributes.pickup,
    productMetadata.meeting_pickup,
    productMetadata.meetingPickup,
    productMetadata.pickup,
  );
  const directBookingNotes = combineItems(
    directBookingNotesObject.conditions,
    directBookingNotesObject.additionalInformation,
    directBookingNotesObject.additional_information,
    directBookingNotesObject.restrictions,
    directBookingNotesObject.dressCode,
    directBookingNotesObject.dress_code,
  );
  const directGeneralTerms = combineItems(
    directGeneralTermsObject.confirmation,
    directGeneralTermsObject.cancellation,
  );
  const itinerary = firstItems(
    optionPackageDetails ? itineraryItems(objectValue(optionPackageDetails.itinerary)) : [],
    metadataItinerary,
    splitTextItems(metadata.schedule),
    productItinerary,
    splitTextItems(productAttributes.schedule),
  );
  const pickup = firstItems(
    metadataPickup,
    meetingPoint ? [meetingPoint] : [],
    productPickup,
  );
  const bookingNotes = firstItems(
    combineItems(
      bookingNotesObject.conditions,
      bookingNotesObject.additionalInformation,
      bookingNotesObject.additional_information,
      bookingNotesObject.restrictions,
      bookingNotesObject.dressCode,
      bookingNotesObject.dress_code,
    ),
    directBookingNotes,
    usageInstruction ? [usageInstruction] : [],
    combineItems(
      productBookingNotesObject.conditions,
      productBookingNotesObject.additionalInformation,
      productBookingNotesObject.additional_information,
      productBookingNotesObject.restrictions,
      productBookingNotesObject.dressCode,
      productBookingNotesObject.dress_code,
    ),
  );
  const conditions = firstItems(
    metadata.conditions,
    optionPackageDetails?.conditions,
    bookingNotesObject.conditions,
    productBookingNotesObject.conditions,
    productAttributes.conditions,
    productPackageDetails?.conditions,
    productMetadata.conditions,
  );
  const additionalInformation = firstItems(
    metadata.additional_information,
    metadata.additionalInformation,
    optionPackageDetails?.additional_information,
    optionPackageDetails?.additionalInformation,
    bookingNotesObject.additional_information,
    bookingNotesObject.additionalInformation,
    productBookingNotesObject.additional_information,
    productBookingNotesObject.additionalInformation,
    productAttributes.additional_information,
    productAttributes.additionalInformation,
    productPackageDetails?.additional_information,
    productPackageDetails?.additionalInformation,
    productMetadata.additional_information,
    productMetadata.additionalInformation,
  );
  const restrictions = firstItems(
    metadata.restrictions,
    optionPackageDetails?.restrictions,
    bookingNotesObject.restrictions,
    productBookingNotesObject.restrictions,
    productAttributes.restrictions,
    productPackageDetails?.restrictions,
    productMetadata.restrictions,
  );
  const dressCode = firstItems(
    metadata.dress_code,
    metadata.dressCode,
    optionPackageDetails?.dress_code,
    optionPackageDetails?.dressCode,
    bookingNotesObject.dress_code,
    bookingNotesObject.dressCode,
    productBookingNotesObject.dress_code,
    productBookingNotesObject.dressCode,
    productAttributes.dress_code,
    productAttributes.dressCode,
    productPackageDetails?.dress_code,
    productPackageDetails?.dressCode,
    productMetadata.dress_code,
    productMetadata.dressCode,
  );
  const terms = firstItems(
    combineItems(termsObject.confirmation, termsObject.cancellation),
    directGeneralTerms,
  );
  const usageObject = objectValue(optionPackageDetails?.usage);
  const productUsageObject = objectValue(productPackageDetails?.usage);
  const validityInformation = firstItems(
    directUsageObject.validity,
    usageObject.validity,
    usageObject.validity_information,
    usageObject.validityInformation,
    productUsageObject.validity,
    productUsageObject.validity_information,
    productUsageObject.validityInformation,
  );
  const voucherInformation = firstItems(
    metadata.voucher_information,
    metadata.voucherInformation,
    directUsageObject.voucherType,
    directUsageObject.voucher_type,
    usageObject.voucherInformation,
    usageObject.voucher_information,
    usageObject.voucherType,
    usageObject.voucher_type,
    productAttributes.voucher_information,
    productAttributes.voucherInformation,
    productUsageObject.voucherInformation,
    productUsageObject.voucher_information,
    productUsageObject.voucherType,
    productUsageObject.voucher_type,
    productMetadata.voucher_information,
    productMetadata.voucherInformation,
  );
  const pickupInformation = firstItems(
    metadata.pickup_information,
    metadata.pickupInformation,
    directUsageObject.pickupInformation,
    directUsageObject.pickup_information,
    usageObject.pickupInformation,
    usageObject.pickup_information,
    productAttributes.pickup_information,
    productAttributes.pickupInformation,
    productUsageObject.pickupInformation,
    productUsageObject.pickup_information,
    productMetadata.pickup_information,
    productMetadata.pickupInformation,
  );
  const sections: TeeTimeOptionDetailSection[] = [
    sectionFromItems("Lịch trình", itinerary, "neutral", true),
    includeExcludeSection(inclusions, exclusions),
    sectionFromItems("Thông tin tập trung / đón khách", pickup),
    sectionFromItems("Lưu ý trước khi đặt", bookingNotes),
    sectionFromItems("Điều kiện", conditions),
    sectionFromItems("Thông tin thêm", additionalInformation),
    sectionFromItems("Nghiêm cấm & Hạn chế", restrictions),
    sectionFromItems("Trang phục nên mặc", dressCode),
    sectionFromItems("Xác nhận", confirmationPolicyItems),
    sectionFromItems("Chính sách hủy", cancellationPolicy ? [cancellationPolicy] : []),
    sectionFromItems("Điều khoản chung", terms),
    sectionFromItems("Thời hạn sử dụng", validityInformation),
    sectionFromItems("Loại voucher", voucherInformation),
    sectionFromItems("Thông tin đón/nhận", pickupInformation),
  ].filter(Boolean) as TeeTimeOptionDetailSection[];
  const quantityRule = resolveTeeTimeQuantityRule(option);

  return {
    title: option?.name || "Gói tee time",
    description,
    badges: firstItems(
      metadata.booking_badges,
      metadata.bookingBadges,
      metadata.badges,
      optionPackageDetails?.booking_badges,
      optionPackageDetails?.bookingBadges,
      optionPackageDetails?.badges,
      productAttributes.booking_badges,
      productAttributes.bookingBadges,
      productAttributes.badges,
      productPackageDetails?.booking_badges,
      productPackageDetails?.bookingBadges,
      productPackageDetails?.badges,
      productMetadata.booking_badges,
      productMetadata.bookingBadges,
      productMetadata.badges,
    ),
    rows: [
      ["Đơn giá", option?.price ? `${formatVnd(option.price)} / ${option.unit || "golfer"}` : "Kiểm tra giá"],
      ["Số golfer", `${quantityRule.min}${quantityRule.fixed ? "" : ` - ${quantityRule.max}`}`],
      confirmationPolicy ? ["Xác nhận", confirmationPolicy] : null,
      cancellationPolicy ? ["Chính sách hủy", cancellationPolicy] : null,
    ].filter(Boolean) as Array<[string, string]>,
    sections,
  };
}

export function normalizeTeeTimePackageDetails(
  option: ProductServiceOption | null | undefined,
  product?: Product | null,
) {
  return resolveOptionDetail(option, product);
}
