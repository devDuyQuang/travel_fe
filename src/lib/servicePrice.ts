import type { Product } from "@/types/product";
import type { BookingType } from "@/lib/bookingLabels";

export function numberValue(
  value?: string | number | boolean | null,
): number | null {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    typeof value === "boolean"
  ) {
    return null;
  }

  const amount = Number(value);

  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function formatCurrencyVnd(value?: string | number | null): string {
  const amount = numberValue(value);

  return amount ? `${amount.toLocaleString("vi-VN")}đ` : "Liên hệ";
}

export function resolveProductBookingType(product?: Product | null): BookingType {
  const layout = product?.category?.layout_key;

  if (layout === "transport") return "transport";
  if (layout === "attraction") return "attraction";
  if (layout === "accommodation") return "hotel";
  if (layout === "tee_time") return "tee_time";
  if (layout === "golf_room") return "golf_room";
  if (layout === "consultation") return "consultation";

  return "tour";
}

export function getServiceUnitLabel(
  bookingType: BookingType,
  optionUnit?: string | null,
): string {
  if (optionUnit?.trim()) {
    return optionUnit.trim();
  }

  if (bookingType === "hotel") return "đêm";
  if (bookingType === "transport") return "chuyến";
  if (bookingType === "attraction") return "vé";
  if (bookingType === "tee_time") return "golfer";
  if (bookingType === "tour") return "khách";

  return "gói";
}

export function getProductStartingPrice(product?: Product | null): {
  amount: number | null;
  unit: string;
  source: "option" | "base" | "none";
} {
  const bookingType = resolveProductBookingType(product);
  const pricedOptions = (product?.service_options || [])
    .map((option) => ({
      amount: numberValue(option.price),
      unit: getServiceUnitLabel(bookingType, option.unit),
    }))
    .filter(
      (
        option,
      ): option is { amount: number; unit: string } =>
        option.amount !== null,
    )
    .sort((a, b) => a.amount - b.amount);

  if (pricedOptions[0]) {
    return { ...pricedOptions[0], source: "option" };
  }

  const basePrice =
    numberValue(product?.display_price)
    ?? numberValue(product?.sale_price)
    ?? numberValue(product?.price_discount)
    ?? numberValue(product?.price)
    ?? numberValue(product?.regular_price)
    ?? numberValue(product?.attributes?.adult_price)
    ?? numberValue(product?.attributes?.room_price)
    ?? numberValue(product?.attributes?.vehicle_price)
    ?? numberValue(product?.attributes?.base_price);

  return {
    amount: basePrice,
    unit: getServiceUnitLabel(bookingType),
    source: basePrice ? "base" : "none",
  };
}

export function formatProductStartingPrice(
  product?: Product | null,
  emptyText = "Liên hệ",
): string {
  const price = getProductStartingPrice(product);

  if (!price.amount) {
    return emptyText;
  }

  return `Từ ${formatCurrencyVnd(price.amount)} / ${price.unit}`;
}
