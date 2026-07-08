import type { BookingType } from "@/lib/bookingLabels";
import type { ServiceLayoutKey } from "@/lib/serviceLayoutRegistry";

export type SearchBookingType =
  | "hotel"
  | "tour"
  | "transport"
  | "attraction"
  | "tee_time";

export type SearchParamReader = {
  get(name: string): string | null;
  toString(): string;
};

export type BookingSearchValues = {
  location?: string;
  course_location?: string;
  destination?: string;
  pickup_location?: string;
  dropoff_location?: string;
  check_in?: string;
  check_out?: string;
  start_date?: string;
  pickup_date?: string;
  pickup_time?: string;
  visit_date?: string;
  play_date?: string;
  play_time?: string;
  rooms?: number;
  adults?: number;
  children?: number;
  passengers?: number;
  golfers?: number;
};

const relevantParamKeys = [
  "location",
  "course_location",
  "destination",
  "pickup_location",
  "dropoff_location",
  "check_in",
  "check_out",
  "start_date",
  "pickup_date",
  "pickup_time",
  "visit_date",
  "play_date",
  "play_time",
  "rooms",
  "adults",
  "children",
  "passengers",
  "golfers",
];

function positiveInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function nonNegativeInt(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function searchBookingTypeFromLayout(
  layoutKey?: string | null,
): SearchBookingType {
  if (layoutKey === "accommodation") {
    return "hotel";
  }

  if (
    layoutKey === "transport" ||
    layoutKey === "attraction" ||
    layoutKey === "tee_time"
  ) {
    return layoutKey;
  }

  return "tour";
}

export function searchBookingTypeFromBookingType(
  bookingType: BookingType,
): SearchBookingType {
  if (bookingType === "hotel") return "hotel";
  if (bookingType === "transport") return "transport";
  if (bookingType === "attraction") return "attraction";
  if (bookingType === "tee_time") return "tee_time";

  return "tour";
}

export function readBookingSearchValues(
  params: SearchParamReader,
): BookingSearchValues {
  return {
    location: params.get("location") || undefined,
    course_location: params.get("course_location") || undefined,
    destination: params.get("destination") || undefined,
    pickup_location: params.get("pickup_location") || undefined,
    dropoff_location: params.get("dropoff_location") || undefined,
    check_in: params.get("check_in") || undefined,
    check_out: params.get("check_out") || undefined,
    start_date: params.get("start_date") || undefined,
    pickup_date: params.get("pickup_date") || undefined,
    pickup_time: params.get("pickup_time") || undefined,
    visit_date: params.get("visit_date") || undefined,
    play_date: params.get("play_date") || undefined,
    play_time: params.get("play_time") || undefined,
    rooms: positiveInt(params.get("rooms")),
    adults: positiveInt(params.get("adults")),
    children: nonNegativeInt(params.get("children")),
    passengers: positiveInt(params.get("passengers")),
    golfers: positiveInt(params.get("golfers")),
  };
}

export function bookingSearchDefaults(
  type: SearchBookingType,
): Required<
  Pick<
    BookingSearchValues,
    "rooms" | "adults" | "children" | "passengers" | "golfers"
  >
> {
  return {
    rooms: 1,
    adults: 1,
    children: 0,
    passengers: 1,
    golfers: 1,
  };
}

export function normalizeBookingSearchValues(
  type: SearchBookingType,
  values: BookingSearchValues,
): BookingSearchValues {
  const defaults = bookingSearchDefaults(type);

  return {
    ...values,
    rooms: values.rooms || defaults.rooms,
    adults: values.adults || defaults.adults,
    children: values.children ?? defaults.children,
    passengers: values.passengers || defaults.passengers,
    golfers: values.golfers || defaults.golfers,
  };
}

export function formatSearchDate(value?: string): string {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function formatShortSearchDate(value?: string): string {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  return year && month && day ? `${day}/${month}` : value;
}

export function calculateSearchNights(
  checkIn?: string,
  checkOut?: string,
): number {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const diff = end.getTime() - start.getTime();

  if (!Number.isFinite(diff) || diff <= 0) {
    return 0;
  }

  return Math.ceil(diff / 86400000);
}

export function formatSearchDateRange(
  checkIn?: string,
  checkOut?: string,
): string {
  if (!checkIn && !checkOut) {
    return "Chọn ngày";
  }

  if (checkIn && checkOut) {
    const nights = calculateSearchNights(checkIn, checkOut);
    const suffix = nights > 0 ? ` · ${nights} đêm` : "";

    return `${formatShortSearchDate(checkIn)} - ${formatShortSearchDate(checkOut)}${suffix}`;
  }

  return checkIn
    ? `Nhận ${formatSearchDate(checkIn)}`
    : `Trả ${formatSearchDate(checkOut)}`;
}

export function buildSearchParams(
  type: SearchBookingType,
  values: BookingSearchValues,
): URLSearchParams {
  const params = new URLSearchParams();
  const setText = (key: keyof BookingSearchValues) => {
    const value = values[key];

    if (typeof value === "string" && value.trim()) {
      params.set(key, value.trim());
    }
  };
  const setNumber = (key: keyof BookingSearchValues, min = 1) => {
    const value = values[key];

    if (typeof value === "number" && value >= min) {
      params.set(key, String(value));
    }
  };

  if (type === "hotel") {
    setText("location");
    setText("check_in");
    setText("check_out");
    setNumber("rooms");
    setNumber("adults");
    setNumber("children", 0);
    return params;
  }

  if (type === "transport") {
    setText("pickup_location");
    setText("dropoff_location");
    setText("pickup_date");
    setText("pickup_time");
    setNumber("passengers");
    return params;
  }

  if (type === "attraction") {
    setText("destination");
    setText("visit_date");
    setNumber("adults");
    setNumber("children", 0);
    return params;
  }

  if (type === "tee_time") {
    setText("course_location");
    setText("play_date");
    setText("play_time");
    setNumber("golfers");
    return params;
  }

  setText("destination");
  setText("start_date");
  setNumber("adults");
  setNumber("children", 0);

  return params;
}

export function hasBookingSearchParams(params: SearchParamReader): boolean {
  return relevantParamKeys.some((key) => Boolean(params.get(key)));
}

export function appendBookingSearchParamsToHref(
  href: string,
  params: SearchParamReader,
): string {
  const current = params.toString();

  if (!current || href === "#") {
    return href;
  }

  const [withoutHash, hash = ""] = href.split("#");
  const [path, query = ""] = withoutHash.split("?");
  const nextParams = new URLSearchParams(query);
  const sourceParams = new URLSearchParams(current);

  relevantParamKeys.forEach((key) => {
    const value = sourceParams.get(key);

    if (value) {
      nextParams.set(key, value);
    }
  });

  const search = nextParams.toString();
  const nextHref = `${path}${search ? `?${search}` : ""}`;

  return hash ? `${nextHref}#${hash}` : nextHref;
}

export function buildServiceSearchHref(
  categorySlug: string,
  type: SearchBookingType,
  values: BookingSearchValues,
): string {
  const params = buildSearchParams(type, values);
  const search = params.toString();
  const path = categorySlug ? `/dich-vu/${categorySlug}` : "/dich-vu";

  return `${path}${search ? `?${search}` : ""}`;
}

export function searchSummaryItems(
  type: SearchBookingType,
  values: BookingSearchValues,
): string[] {
  if (type === "hotel") {
    return [
      values.location,
      values.check_in && `Nhận phòng ${values.check_in}`,
      values.check_out && `Trả phòng ${values.check_out}`,
      values.rooms && `${values.rooms} phòng`,
      `${values.adults || 1} người lớn`,
      `${values.children || 0} trẻ em`,
    ].filter(Boolean) as string[];
  }

  if (type === "transport") {
    return [
      values.pickup_location && `Đón: ${values.pickup_location}`,
      values.dropoff_location && `Trả: ${values.dropoff_location}`,
      values.pickup_date,
      values.pickup_time,
      values.passengers && `${values.passengers} khách`,
    ].filter(Boolean) as string[];
  }

  if (type === "attraction") {
    return [
      values.destination,
      values.visit_date && `Ngày ${values.visit_date}`,
      `${values.adults || 1} người lớn`,
      `${values.children || 0} trẻ em`,
    ].filter(Boolean) as string[];
  }

  if (type === "tee_time") {
    return [
      values.location,
      values.play_date && `Ngày ${values.play_date}`,
      values.play_time && `Giờ ${values.play_time}`,
      `${values.golfers || 1} golfer`,
    ].filter(Boolean) as string[];
  }

  return [
    values.destination,
    values.start_date && `Ngày ${values.start_date}`,
    `${values.adults || 1} người lớn`,
    `${values.children || 0} trẻ em`,
  ].filter(Boolean) as string[];
}
