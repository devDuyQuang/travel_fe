"use client";
//component chính của booking form
//xử lý state form
// xác định booking type
//render field theo từng loại dịch vụ,
//validate cơ bản phía frontend 
//build payload và gọi API khi user xác nhận booking. 

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ChangeEvent,
  FormEvent,
  ReactNode,
} from "react";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";

import {
  applyBookingCalendarVariant,
  toggleBookingCalendar,
} from "@/lib/bookingCalendar";
import {
  formatBookingPrice,
  getBookingCopy,
  type BookingType,
} from "@/lib/bookingLabels";
import {
  formatCurrencyVnd,
  getServiceUnitLabel,
  resolveProductBookingType,
} from "@/lib/servicePrice";
import {
  clampQuantityForOption,
  getInitialQuantityForOption,
  resolveOptionDetail,
  resolveTeeTimeQuantityRule,
  type TeeTimeOptionDetailSection,
} from "@/lib/teeTimeOptionSelection";
import {
  readBookingSearchValues,
  searchBookingTypeFromBookingType,
} from "@/lib/bookingSearchParams";
import { useBrowserSearchParams } from "@/hooks/useBrowserSearchParams";
import {
  ApiError,
  createBooking,
  createIdempotencyKey,
} from "@/services/transaction.service";
import type {
  Product,
  ProductServiceOption,
} from "@/types/product";
import NiceSelect from "@/ui/NiceSelect";

import styles from "./FeatureSidebar.module.css";

type PaymentMethod = "cash" | "bank_transfer";

type FieldErrors = Record<string, string>;

type ResolvedTeeTimeOptionDetail = ReturnType<
  typeof resolveOptionDetail
>;

const fieldStyle = {
  width: "100%",
  minHeight: "40px",
  border: "1px solid #ece8df",
  borderRadius: "6px",
  background: "#f7f7f7",
  color: "#353844",
  fontSize: "14px",
  lineHeight: "1.4",
  outline: "none",
  padding: "8px 12px",
  boxShadow: "none",
} as const;

const dateInputStyle = {
  ...fieldStyle,
  cursor: "pointer",
  paddingLeft: "42px",
  paddingRight: "42px",
} as const;

const errorStyle = {
  color: "#d93025",
  fontSize: "13px",
  lineHeight: "1.35",
  marginTop: "5px",
} as const;

function numericValue(
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

  const number = Number(value);

  return Number.isFinite(number) && number > 0
    ? number
    : null;
}

function resolveBookingType(
  product?: Product | null,
): BookingType {
  return resolveProductBookingType(product);
}

function firstPrice(
  ...values: Array<
    string | number | boolean | null | undefined
  >
): number | null {
  for (const value of values) {
    const number = numericValue(value);

    if (number !== null) {
      return number;
    }
  }

  return null;
}

function normalizePhone(value: string): string {
  const phone = value.replace(/[\s().-]+/g, "");

  return phone.startsWith("84")
    ? `+${phone}`
    : phone;
}

function todayIso(): string {
  const date = new Date();
  const timezoneOffset =
    date.getTimezoneOffset() * 60000;

  return new Date(
    date.getTime() - timezoneOffset,
  )
    .toISOString()
    .slice(0, 10);
}

function formatVietnameseDate(
  value: string,
): string {
  if (!value) {
    return "";
  }

  const [year, month, day] = value.split("-");

  return year && month && day
    ? `${day}/${month}/${year}`
    : value;
}

function formatCompactVietnameseDate(
  value: string,
): string {
  return formatVietnameseDate(value);
}

function formatIsoDate(date?: Date): string {
  if (!date) {
    return "";
  }

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}`;
}

function splitAttributeOptions(
  value?: string | number | boolean | null,
): string[] {
  if (
    value === null ||
    value === undefined ||
    typeof value === "boolean"
  ) {
    return [];
  }

  return String(value)
    .split(/[\n,;|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toSelectOptions(items: string[]) {
  return items.map((item) => ({
    value: item,
    text: item,
  }));
}

function optionPrice(
  option?: ProductServiceOption | null,
): number | null {
  return firstPrice(
    option?.metadata?.sale_price as string | number | null | undefined,
    option?.metadata?.price_discount as string | number | null | undefined,
    option?.sale_price,
    option?.price_discount,
    option?.price,
  );
}

function optionPricingMode(
  option?: ProductServiceOption | null,
): "per_person" | "per_package" {
  const rawMode =
    option?.metadata?.pricing_mode ||
    option?.metadata?.price_mode ||
    option?.metadata?.pricing_type;
  const mode = String(rawMode || "").toLowerCase();

  return mode === "per_package" ||
    mode === "per_booking" ||
    mode === "fixed"
    ? "per_package"
    : "per_person";
}

function resolveCheckInTimes(
  product?: Product | null,
) {
  const times = splitAttributeOptions(
    product?.attributes?.check_in_time_options,
  );

  if (times.length > 0) {
    return times;
  }

  const checkInTime =
    product?.attributes?.check_in_time;

  return typeof checkInTime === "string" &&
    checkInTime.trim()
    ? [checkInTime.trim()]
    : ["14:00"];
}

const paymentLabels: Record<
  PaymentMethod,
  string
> = {
  cash: "Thanh toán tại nơi sử dụng dịch vụ",
  bank_transfer: "Chuyển khoản sau khi xác nhận",
};

const teeTimeCalendarLocale = {
  ...Vietnamese,
  firstDayOfWeek: 0,
};

const quantityOptions = Array.from(
  { length: 9 },
  (_, index) => ({
    value: String(index),
    text:
      index === 0
        ? "0"
        : String(index).padStart(2, "0"),
  }),
);

const positiveQuantityOptions =
  quantityOptions.slice(1);

function optionDiscountLabel(
  option: ProductServiceOption,
): string {
  const value =
    option.metadata?.discount_label ||
    option.metadata?.discountLabel ||
    option.metadata?.badge_label ||
    option.metadata?.badgeLabel;

  return typeof value === "string" ? value.trim() : "";
}

function numericPriceValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
}

function calendarDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatCompactVndPrice(value: number): string {
  const millions = value / 1_000_000;
  const formatted = Number.isInteger(millions)
    ? String(millions)
    : millions.toFixed(1);

  return `${formatted}m+`;
}

function collectDailyPriceMap(
  source: unknown,
  target: Map<string, number>,
) {
  if (!source || typeof source !== "object") {
    return;
  }

  if (Array.isArray(source)) {
    source.forEach((entry) => {
      if (!entry || typeof entry !== "object") return;

      const record = entry as Record<string, unknown>;
      const date =
        record.date ||
        record.start_date ||
        record.available_date;
      const status = String(record.status || "").toLowerCase();

      if (
        typeof date !== "string" ||
        status === "sold_out" ||
        status === "unavailable" ||
        status === "disabled"
      ) {
        return;
      }

      const price = numericPriceValue(
        record.lowest_price ||
          record.price ||
          record.sale_price ||
          record.amount,
      );

      if (price !== null) {
        target.set(date.slice(0, 10), price);
      }
    });

    return;
  }

  Object.entries(source as Record<string, unknown>).forEach(
    ([date, value]) => {
      const price =
        numericPriceValue(value) ??
        (value && typeof value === "object"
          ? numericPriceValue(
              (value as Record<string, unknown>).lowest_price ||
                (value as Record<string, unknown>).price ||
                (value as Record<string, unknown>).sale_price ||
                (value as Record<string, unknown>).amount,
            )
          : null);

      if (price !== null) {
        target.set(date.slice(0, 10), price);
      }
    },
  );
}

function resolveDailyPriceMap(
  option?: ProductServiceOption | null,
  product?: Product | null,
): Map<string, number> | null {
  const sources = [
    option?.metadata?.daily_prices,
    option?.metadata?.dailyPrices,
    option?.metadata?.calendar_prices,
    option?.metadata?.calendarPrices,
    option?.metadata?.date_prices,
    option?.metadata?.datePrices,
    option?.metadata?.availability,
    product?.metadata?.daily_prices,
    product?.metadata?.dailyPrices,
    product?.metadata?.calendar_prices,
    product?.metadata?.calendarPrices,
    product?.metadata?.date_prices,
    product?.metadata?.datePrices,
    product?.metadata?.availability,
  ];

  const map = new Map<string, number>();
  sources.forEach((source) => collectDailyPriceMap(source, map));

  return map.size > 0 ? map : null;
}

function resolveLowestDailyPriceMap(
  options: ProductServiceOption[],
  product?: Product | null,
): Map<string, number> | null {
  const aggregate = new Map<string, number>();

  options
    .filter((option) => option.is_active !== false && option.is_active !== 0)
    .forEach((option) => {
      const optionMap = resolveDailyPriceMap(option, product);

      optionMap?.forEach((price, date) => {
        const current = aggregate.get(date);

        if (current === undefined || price < current) {
          aggregate.set(date, price);
        }
      });
    });

  return aggregate.size > 0 ? aggregate : null;
}

const FeatureSidebar = ({
  product,
  formId,
  onTeeTimeSelectionChange,
}: {
  product?: Product | null;
  formId?: string;
  onTeeTimeSelectionChange?: (
    selection: {
      optionName: string;
      unitPrice: number | null;
      totalPrice: number | null;
      quantity: number;
      isReady: boolean;
    } | null,
  ) => void;
}) => {
  const searchParams = useBrowserSearchParams();
  const bookingType =
    resolveBookingType(product);
  const bookingCopy =
    getBookingCopy(bookingType);

  const idempotencyKeyRef =
    useRef<string | null>(null);

  const isSubmittingRef = useRef(false);
  const optionDetailCloseRef =
    useRef<HTMLButtonElement | null>(null);
  const optionDetailTriggerRef =
    useRef<HTMLElement | null>(null);
  const optionDetailModalRef =
    useRef<HTMLDivElement | null>(null);
  const teeTimeDetailCardRef =
    useRef<HTMLElement | null>(null);
  const teeTimeDetailRailBodyRef =
    useRef<HTMLDivElement | null>(null);

  const fieldRefs = useRef<
    Record<
      string,
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | HTMLElement
      | null
    >
  >({});

const startPickerRef =
  useRef<InstanceType<typeof Flatpickr> | null>(null);

const endPickerRef =
  useRef<InstanceType<typeof Flatpickr> | null>(null);
  const startDateFieldRef =
    useRef<HTMLElement | null>(null);
  const endDateFieldRef =
    useRef<HTMLDivElement | null>(null);
  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [passengers, setPassengers] =
    useState(1);
  const [rooms, setRooms] = useState(1);
  const [golfers, setGolfers] = useState(1);

  const [
    pickupLocation,
    setPickupLocation,
  ] = useState("");

  const [
    dropoffLocation,
    setDropoffLocation,
  ] = useState("");

  const [vehicleType, setVehicleType] =
    useState("");

  const [roomType, setRoomType] =
    useState("");

  const [roomNumber, setRoomNumber] =
    useState("");

  const [
    selectedServiceOptionId,
    setSelectedServiceOptionId,
  ] = useState<string | null>(null);
  const [
    detailServiceOption,
    setDetailServiceOption,
  ] = useState<ProductServiceOption | null>(null);
  const [
    isOptionDetailOpen,
    setIsOptionDetailOpen,
  ] = useState(false);
  const [itineraryFeedback, setItineraryFeedback] =
    useState<"yes" | "no" | null>(null);

  const [customerName, setCustomerName] =
    useState("");

  const [
    customerEmail,
    setCustomerEmail,
  ] = useState("");

  const [
    customerPhone,
    setCustomerPhone,
  ] = useState("");

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>("cash");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isConfirmOpen, setIsConfirmOpen] =
    useState(false);

  const [isSuccessOpen, setIsSuccessOpen] =
    useState(false);
  const [bookingCode, setBookingCode] =
    useState("");
  const [mailDispatched, setMailDispatched] =
    useState(true);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [
    isStartDateOpen,
    setIsStartDateOpen,
  ] = useState(false);
  const isStartDateOpenRef = useRef(false);

  const [
    isEndDateOpen,
    setIsEndDateOpen,
  ] = useState(false);
  const [
    showDailyPrices,
    setShowDailyPrices,
  ] = useState(false);
  const [
    isCalendarModeLoading,
    setIsCalendarModeLoading,
  ] = useState(false);
  const calendarModeLoadingTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const minDate = useMemo(
    () => todayIso(),
    [],
  );
  const isTeeTime = bookingType === "tee_time";
  const teeTimeHasDate = isTeeTime && Boolean(startDate);

  useEffect(() => {
    const values =
      readBookingSearchValues(searchParams);
    const searchType =
      searchBookingTypeFromBookingType(
        bookingType,
      );

    if (searchType === "hotel") {
      if (values.check_in) {
        setStartDate(values.check_in);
      }

      if (values.check_out) {
        setEndDate(values.check_out);
      }

      if (values.rooms) {
        setRooms(values.rooms);
      }

      if (values.adults) {
        setAdults(values.adults);
      }

      if (values.children !== undefined) {
        setChildren(values.children);
      }

      return;
    }

    if (searchType === "transport") {
      if (values.pickup_date) {
        setStartDate(values.pickup_date);
      }

      if (values.pickup_time) {
        setStartTime(values.pickup_time);
      }

      if (values.pickup_location) {
        setPickupLocation(
          values.pickup_location,
        );
      }

      if (values.dropoff_location) {
        setDropoffLocation(
          values.dropoff_location,
        );
      }

      if (values.passengers) {
        setPassengers(values.passengers);
      }

      return;
    }

    if (searchType === "tee_time") {
      if (values.play_date) {
        setStartDate(values.play_date);
      }

      if (values.play_time) {
        setStartTime(values.play_time);
      }

      if (values.golfers) {
        setGolfers(values.golfers);
      }

      return;
    }

    if (searchType === "attraction") {
      if (values.visit_date) {
        setStartDate(values.visit_date);
      }
    } else if (values.start_date) {
      setStartDate(values.start_date);
    }

    if (values.adults) {
      setAdults(values.adults);
    }

    if (values.children !== undefined) {
      setChildren(values.children);
    }
  }, [bookingType, searchParams]);

  const checkInTimes = useMemo(
    () => resolveCheckInTimes(product),
    [product],
  );

  const serviceTimes = useMemo(() => {
    if (bookingType === "hotel") {
      return checkInTimes;
    }

    return splitAttributeOptions(
      product?.attributes?.start_time_options,
    );
  }, [bookingType, checkInTimes, product]);

  const checkInTimeText =
    serviceTimes[0] || "14:00";

  const checkOutTimeText =
    typeof product?.attributes?.check_out_time ===
      "string" &&
    product.attributes.check_out_time.trim()
      ? product.attributes.check_out_time.trim()
      : "12:00";

  const effectiveStartTime =
    startTime || serviceTimes[0] || "";

  const serviceOptions =
    product?.service_options || [];

  const optionsByType = (
    ...types: string[]
  ) =>
    serviceOptions.filter((option) =>
      types.includes(option.type),
    );

  const roomServiceOptions = useMemo(
    () => optionsByType("room_type"),
    [serviceOptions],
  );

  const vehicleServiceOptions = useMemo(
    () => optionsByType("vehicle_type"),
    [serviceOptions],
  );

  const tourServiceOptions = useMemo(
    () => optionsByType("tour_package"),
    [serviceOptions],
  );

  const attractionServiceOptions = useMemo(
    () => optionsByType("ticket_type"),
    [serviceOptions],
  );

  const teeTimeServiceOptions = useMemo(
    () =>
      optionsByType(
        "golf_package",
        "time_slot",
      ),
    [serviceOptions],
  );

  const visibleServiceOptions = useMemo(() => {
    if (bookingType === "hotel") {
      return roomServiceOptions;
    }

    if (bookingType === "transport") {
      return vehicleServiceOptions;
    }

    if (bookingType === "attraction") {
      return attractionServiceOptions;
    }

    if (bookingType === "tee_time") {
      return teeTimeServiceOptions;
    }

    if (bookingType === "tour") {
      return tourServiceOptions;
    }

    return [];
  }, [
    attractionServiceOptions,
    bookingType,
    roomServiceOptions,
    teeTimeServiceOptions,
    tourServiceOptions,
    vehicleServiceOptions,
  ]);

  const selectedServiceOption = useMemo(
    () =>
      selectedServiceOptionId
        ? visibleServiceOptions.find(
            (option) =>
              String(option.id) ===
              selectedServiceOptionId,
          ) || null
        : null,
    [
      selectedServiceOptionId,
      visibleServiceOptions,
    ],
  );
  const teeTimeHasPackage = isTeeTime && Boolean(selectedServiceOption);
  const teeTimeCanShowCompactControls =
    teeTimeHasPackage;
  const teeTimeDailyPriceMap = useMemo(
    () =>
      bookingType !== "tee_time"
        ? null
        : selectedServiceOption && showDailyPrices
          ? resolveDailyPriceMap(selectedServiceOption, product)
          : resolveLowestDailyPriceMap(teeTimeServiceOptions, product),
    [
      bookingType,
      product,
      selectedServiceOption,
      showDailyPrices,
      teeTimeServiceOptions,
    ],
  );
  const teeTimeDatePriceLabel = useMemo<
    ((date: Date) => string | null) | null
  >(() => {
    if (
      bookingType !== "tee_time" ||
      !teeTimeDailyPriceMap
    ) {
      return null;
    }

    return (date: Date) => {
      const price = teeTimeDailyPriceMap.get(calendarDateKey(date));

      return price ? formatCompactVndPrice(price) : null;
    };
  }, [
    bookingType,
    teeTimeDailyPriceMap,
  ]);

  useEffect(() => {
    isStartDateOpenRef.current = isStartDateOpen;
  }, [isStartDateOpen]);

  useEffect(() => {
    return () => {
      if (calendarModeLoadingTimerRef.current) {
        clearTimeout(calendarModeLoadingTimerRef.current);
      }
    };
  }, []);

  const syncTeeTimeCalendarContent = (
    instance: FlatpickrInstance,
  ) => {
    if (bookingType !== "tee_time") {
      return;
    }

    const calendar = instance.calendarContainer;
    const contextClass = "tee-time-calendar-context";
    const footerClass = "tee-time-calendar-footer";

    calendar.classList.add("open", "booking-calendar--inline");

    calendar
      .querySelector(`.${contextClass}`)
      ?.remove();
    calendar
      .querySelector(`.${footerClass}`)
      ?.remove();

    if (selectedServiceOption) {
      const contextTitle = showDailyPrices
        ? selectedServiceOption.name
        : "Tất cả gói dịch vụ";
      const contextToggleCopy = showDailyPrices
        ? "Nhấn để hiển thị giá cho các gói"
        : "Chỉ hiện giá cho các gói đã chọn";
      const context = document.createElement("div");
      context.className = contextClass;
      context.innerHTML = `
        <strong class="tee-time-calendar-context__title"></strong>
        <div class="tee-time-calendar-context__row">
          <span></span>
          <button class="tee-time-calendar-price-toggle${
            showDailyPrices ? " is-on" : ""
          }${
            isCalendarModeLoading ? " is-loading" : ""
          }" type="button" aria-pressed="${showDailyPrices}"${
            isCalendarModeLoading ? " disabled" : ""
          }>
            <span></span>
          </button>
        </div>
      `;

      const title = context.querySelector(
        ".tee-time-calendar-context__title",
      );
      if (title) {
        title.textContent = contextTitle;
      }

      const toggleCopy = context.querySelector(
        ".tee-time-calendar-context__row > span",
      );
      if (toggleCopy) {
        toggleCopy.textContent = contextToggleCopy;
      }

      const toggle = context.querySelector<HTMLButtonElement>(
        ".tee-time-calendar-price-toggle",
      );
      if (toggle) {
        toggle.onclick = (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (calendarModeLoadingTimerRef.current) {
            clearTimeout(calendarModeLoadingTimerRef.current);
          }

          setIsCalendarModeLoading(true);
          calendarModeLoadingTimerRef.current = setTimeout(() => {
            setShowDailyPrices((current) => !current);
            setIsCalendarModeLoading(false);
            calendarModeLoadingTimerRef.current = null;
          }, 220);
        };
      }

      calendar.prepend(context);
    }

    const footer = document.createElement("div");
    footer.className = footerClass;

    footer.innerHTML = `
      <div class="tee-time-calendar-legend">
        <span class="tee-time-calendar-legend__row">
          <i aria-hidden="true">ⓢ</i>
          <span>Mệnh giá: ₫</span>
        </span>
        <span class="tee-time-calendar-legend__row">
          <i aria-hidden="true">⊘</i>
          <span>Bán hết</span>
        </span>
        <span class="tee-time-calendar-legend__row${
          selectedServiceOption && showDailyPrices
            ? " is-hidden"
            : ""
        }">
          <i aria-hidden="true">ⓘ</i>
          <span>Các tuỳ chọn và mức giá rẻ nhất</span>
        </span>
      </div>
      <button class="tee-time-calendar-clear" type="button">Xóa</button>
    `;

    const clearButton =
      footer.querySelector<HTMLButtonElement>(
        ".tee-time-calendar-clear",
      );
    if (clearButton) {
      clearButton.onclick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        instance.clear(false);
        setStartDate("");
        clearFieldError("start_date");
        resetSubmitKey();
      };
    }

    calendar.append(footer);
  };

  useEffect(() => {
    const instance = startPickerRef.current?.flatpickr;

    if (bookingType !== "tee_time" || !instance) {
      return;
    }

    instance.redraw();
    syncTeeTimeCalendarContent(instance);
  }, [
    bookingType,
    selectedServiceOption?.name,
    showDailyPrices,
    isCalendarModeLoading,
    teeTimeDailyPriceMap,
  ]);

  useEffect(() => {
    if (
      bookingType !== "tee_time" ||
      typeof window === "undefined"
    ) {
      return;
    }

    const requestedOptionId =
      searchParams.get("option_id") ||
      searchParams.get("service_option_id") ||
      new URLSearchParams(window.location.search).get("option_id") ||
      new URLSearchParams(window.location.search).get("service_option_id");

    if (!requestedOptionId) return;

    const requestedOption = visibleServiceOptions.find(
      (option) =>
        String(option.id) ===
        requestedOptionId,
    );

    if (!requestedOption) return;

    setSelectedServiceOptionId(String(requestedOption.id));
    setGolfers(getInitialQuantityForOption(requestedOption));
    setShowDailyPrices(true);
  }, [
    bookingType,
    searchParams,
    visibleServiceOptions,
  ]);

  const selectedTeeTimeQuantityRule = useMemo(
    () =>
      bookingType === "tee_time"
        ? resolveTeeTimeQuantityRule(selectedServiceOption)
        : null,
    [bookingType, selectedServiceOption],
  );

  useEffect(() => {
    if (
      bookingType !== "tee_time" ||
      !selectedServiceOption
    ) {
      return;
    }

    setGolfers((currentGolfers) =>
      clampQuantityForOption(selectedServiceOption, currentGolfers),
    );
  }, [bookingType, selectedServiceOption]);

  useEffect(() => {
    if (!isOptionDetailOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      optionDetailCloseRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOptionDetail();
        return;
      }

      if (event.key !== "Tab" || !optionDetailModalRef.current) {
        return;
      }

      const focusable = Array.from(
        optionDetailModalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOptionDetailOpen]);

  useEffect(() => {
    if (!isConfirmOpen && !isSuccessOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmittingRef.current) {
        setIsConfirmOpen(false);
        setIsSuccessOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isConfirmOpen, isSuccessOpen]);

  const roomTypeOptions = useMemo(
    () =>
      toSelectOptions(
        splitAttributeOptions(
          product?.attributes?.room_types,
        ),
      ),
    [product],
  );

  const roomNumberOptions = useMemo(
    () =>
      toSelectOptions(
        splitAttributeOptions(
          product?.attributes?.room_numbers,
        ),
      ),
    [product],
  );

  const adultPrice = firstPrice(
    product?.attributes?.adult_price,
    product?.display_price,
    product?.price,
    product?.price_discount,
    product?.sale_price,
    product?.regular_price,
  );

  const childPrice = firstPrice(
    product?.attributes?.child_price,
    adultPrice,
  );

  const vehiclePrice = firstPrice(
    product?.attributes?.vehicle_price,
    product?.attributes?.base_price,
    product?.display_price,
    product?.price,
    product?.price_discount,
    product?.sale_price,
    product?.regular_price,
  );

  const roomPrice = firstPrice(
    product?.attributes?.room_price,
    product?.attributes?.base_price,
    product?.display_price,
    product?.price,
    product?.price_discount,
    product?.sale_price,
    product?.regular_price,
  );

  const selectedOptionPrice = optionPrice(
    selectedServiceOption,
  );

  const nights = useMemo(() => {
    if (
      bookingType !== "hotel" ||
      !startDate ||
      !endDate
    ) {
      return 1;
    }

    const start = new Date(
      `${startDate}T00:00:00`,
    ).getTime();
    const end = new Date(
      `${endDate}T00:00:00`,
    ).getTime();
    const days = Math.round(
      (end - start) / 86400000,
    );

    return Math.max(1, days);
  }, [bookingType, endDate, startDate]);

  const totalPrice = useMemo(() => {
    if (bookingType === "transport") {
      return selectedOptionPrice ?? vehiclePrice;
    }

    if (bookingType === "hotel") {
      const price =
        selectedOptionPrice ?? roomPrice;

      return price === null
        ? null
        : price * rooms * nights;
    }

    if (bookingType === "tee_time") {
      if (selectedOptionPrice === null) {
        return null;
      }

      return optionPricingMode(selectedServiceOption) === "per_package"
        ? selectedOptionPrice
        : selectedOptionPrice * golfers;
    }

    if (
      bookingType === "tour" ||
      bookingType === "attraction"
    ) {
      if (selectedOptionPrice !== null) {
        return (
          selectedOptionPrice *
          Math.max(1, adults + children)
        );
      }

      if (
        adultPrice === null &&
        childPrice === null
      ) {
        return null;
      }

      return (
        (adultPrice || 0) * adults +
        (childPrice || 0) * children
      );
    }

    return null;
  }, [
    adultPrice,
    adults,
    bookingType,
    childPrice,
    children,
    golfers,
    nights,
    roomPrice,
    rooms,
    selectedServiceOption,
    selectedOptionPrice,
    vehiclePrice,
  ]);

  const quantitySummary = useMemo(() => {
    if (bookingType === "transport") {
      return `Số khách: ${passengers}`;
    }

    if (bookingType === "hotel") {
      return `Số phòng: ${rooms}, Số đêm: ${nights}, Người lớn: ${adults}, Trẻ em: ${children}`;
    }

    if (bookingType === "tee_time") {
      return `Số golfer: ${golfers}`;
    }

    if (bookingType === "consultation") {
      return "Tư vấn theo yêu cầu";
    }

    return `Người lớn: ${adults}, Trẻ em: ${children}`;
  }, [
    adults,
    bookingType,
    children,
    golfers,
    nights,
    passengers,
    rooms,
  ]);

  const unitPrice =
    selectedOptionPrice ??
    (bookingType === "hotel"
      ? roomPrice
      : bookingType === "transport"
        ? vehiclePrice
        : null);

  const priceUnit = getServiceUnitLabel(
    bookingType,
    selectedServiceOption?.unit,
  );

  const priceQuantityLabel = useMemo(() => {
    if (bookingType === "hotel") {
      return `${nights} đêm x ${rooms} phòng`;
    }

    if (bookingType === "transport") {
      return "1 chuyến";
    }

    if (bookingType === "tee_time") {
      return `${golfers} golfer`;
    }

    if (
      bookingType === "tour" ||
      bookingType === "attraction"
    ) {
      return `${Math.max(1, adults + children)} khách`;
    }

    return "Theo yêu cầu";
  }, [
    adults,
    bookingType,
    children,
    golfers,
    nights,
    rooms,
  ]);

  const displayTotalPrice =
    visibleServiceOptions.length > 0 &&
    !selectedServiceOption
      ? null
      : totalPrice;

  const isTeeTimeSelectionReady =
    bookingType !== "tee_time" ||
    Boolean(
      product?.id &&
        startDate &&
        startDate >= minDate &&
        selectedServiceOption &&
        golfers >= (selectedTeeTimeQuantityRule?.min || 1) &&
        golfers <=
          (selectedTeeTimeQuantityRule?.max || Number.MAX_SAFE_INTEGER),
    );

  const selectedPackageName =
    selectedServiceOption?.name ||
    (bookingType === "tee_time" ? "Chưa chọn gói tee time" : "Chưa chọn tùy chọn");
  const hasTeeTimeDraft =
    bookingType === "tee_time" &&
    Boolean(
      selectedServiceOption ||
        startDate ||
        startTime ||
        customerName ||
        customerEmail ||
        customerPhone,
    );

  useEffect(() => {
    if (
      bookingType !== "tee_time" ||
      !onTeeTimeSelectionChange
    ) {
      return;
    }

    onTeeTimeSelectionChange(
      selectedServiceOption
        ? {
            optionName: selectedServiceOption.name,
            unitPrice: selectedOptionPrice,
            totalPrice,
            quantity: golfers,
            isReady: isTeeTimeSelectionReady,
          }
        : null,
    );
  }, [
    bookingType,
    golfers,
    isTeeTimeSelectionReady,
    onTeeTimeSelectionChange,
    selectedOptionPrice,
    selectedServiceOption,
    totalPrice,
  ]);

  const resetSubmitKey = () => {
    idempotencyKeyRef.current = null;
  };

  const clearFieldError = (name: string) => {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[name];

      return nextErrors;
    });
  };

  useEffect(() => {
    if (bookingType !== "tee_time") {
      return;
    }

    const instance = startPickerRef.current?.flatpickr;

    if (!instance) {
      return;
    }

    if (isStartDateOpen) {
      if (!instance.isOpen) {
        instance.open();
      }

      syncTeeTimeCalendarContent(instance);
      return;
    }

    if (instance.isOpen) {
      instance.close();
    }
  }, [bookingType, isStartDateOpen]);

  const handleSelectServiceOption = (
    option: ProductServiceOption,
  ) => {
    const optionId = String(option.id);
    const isActiveOption =
      optionId === selectedServiceOptionId;

    if (isActiveOption) {
      setSelectedServiceOptionId(null);
      setDetailServiceOption(null);
      setIsOptionDetailOpen(false);

      if (bookingType === "tee_time") {
        setGolfers(1);
        setShowDailyPrices(false);
        setIsStartDateOpen(false);
      }

      clearFieldError("service_option_id");
      resetSubmitKey();
      return;
    }

    setSelectedServiceOptionId(optionId);

    if (bookingType === "tee_time") {
      setGolfers(getInitialQuantityForOption(option));
      setShowDailyPrices(true);
      setIsStartDateOpen(false);
    }

    clearFieldError("service_option_id");
    resetSubmitKey();
  };

  const openOptionDetail = (
    option?: ProductServiceOption | null,
  ) => {
    if (!option) return;

    optionDetailTriggerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setDetailServiceOption(option);
    setIsOptionDetailOpen(true);
  };

  const closeOptionDetail = () => {
    setIsOptionDetailOpen(false);
    window.setTimeout(() => {
      optionDetailTriggerRef.current?.focus({
        preventScroll: true,
      });
    }, 0);
  };

  const resetTeeTimeSelection = () => {
    setSelectedServiceOptionId(null);
    setDetailServiceOption(null);
    setIsOptionDetailOpen(false);
    setStartDate("");
    setStartTime("");
    setGolfers(1);
    setIsStartDateOpen(false);
    setShowDailyPrices(false);
    startPickerRef.current?.flatpickr.close();
    endPickerRef.current?.flatpickr.close();
    setIsEndDateOpen(false);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setPaymentMethod("cash");
    setIsConfirmOpen(false);
    setIsSuccessOpen(false);
    setBookingCode("");
    setMailDispatched(true);
    setError("");
    setFieldErrors({});
    resetSubmitKey();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isInsideCalendar = (
      target: EventTarget | null,
      instance?: FlatpickrInstance,
    ) => {
      return Boolean(
        target instanceof Node &&
          instance?.calendarContainer.contains(target),
      );
    };

    const isInsideElement = (
      target: EventTarget | null,
      element: HTMLElement | null,
    ) => {
      return Boolean(
        target instanceof Node && element?.contains(target),
      );
    };

    const onMouseDown = (event: MouseEvent) => {
      const target = event.target;
      const startInstance = startPickerRef.current?.flatpickr;
      const endInstance = endPickerRef.current?.flatpickr;

      if (
        isStartDateOpenRef.current &&
        !isInsideElement(target, startDateFieldRef.current) &&
        !isInsideCalendar(target, startInstance)
      ) {
        setIsStartDateOpen(false);
      }

      if (
        endInstance?.isOpen &&
        !isInsideElement(target, endDateFieldRef.current) &&
        !isInsideCalendar(target, endInstance)
      ) {
        endInstance.close();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsStartDateOpen(false);
        endPickerRef.current?.flatpickr.close();
      }
    };

    document.addEventListener("mousedown", onMouseDown, {
      capture: true,
    });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown, {
        capture: true,
      });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const setFieldRef =
    (name: string) =>
    (
      element:
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | HTMLElement
        | null,
    ) => {
      fieldRefs.current[name] = element;
    };

  const updateText =
    (
      name: string,
      setter: (value: string) => void,
    ) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) => {
      setter(event.target.value);
      clearFieldError(name);
      resetSubmitKey();
    };

  const updateNumber =
    (
      setter: (value: number) => void,
      minimum: number,
    ) =>
    (item: { value: string }) => {
      const nextValue = Math.max(
        minimum,
        Number(item.value || minimum),
      );

      setter(nextValue);
      resetSubmitKey();
    };

  const updateTeeTimeGolfers = (
    nextQuantity: number,
  ) => {
    const normalizedQuantity = clampQuantityForOption(
      selectedServiceOption,
      nextQuantity,
    );

    setGolfers(normalizedQuantity);
    clearFieldError("golfers");
    resetSubmitKey();
  };

  const focusFirstError = (
    errors: FieldErrors,
  ) => {
    const firstKey = Object.keys(errors).find(
      (key) => key !== "form",
    );

    if (!firstKey) {
      return;
    }

    window.requestAnimationFrame(() => {
      fieldRefs.current[firstKey]?.focus();
    });
  };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};
    const normalizedPhone =
      normalizePhone(customerPhone);

    if (!product?.id) {
      nextErrors.form =
        "Không tìm thấy dịch vụ để booking.";
    }

    if (!startDate) {
      nextErrors.start_date =
        `Vui lòng chọn ${bookingCopy.dateLabel.toLowerCase()}.`;
    }

    if (
      bookingType === "hotel" &&
      !endDate
    ) {
      nextErrors.end_date =
        "Vui lòng chọn ngày trả phòng.";
    }

    if (
      startDate &&
      startDate < minDate
    ) {
      nextErrors.start_date =
        "Vui lòng chọn ngày từ hôm nay trở đi.";
    }

    if (
      endDate &&
      endDate < minDate
    ) {
      nextErrors.end_date =
        "Vui lòng chọn ngày từ hôm nay trở đi.";
    }

    if (
      bookingType === "hotel" &&
      startDate &&
      endDate &&
      endDate <= startDate
    ) {
      nextErrors.end_date =
        "Ngày trả phòng phải sau ngày nhận phòng.";
    }

    if (
      visibleServiceOptions.length > 0 &&
      !selectedServiceOption
    ) {
      nextErrors.service_option_id =
        bookingType === "tee_time"
          ? "Vui lòng chọn gói tee time."
          : "Vui lòng chọn tùy chọn dịch vụ.";
    }

    if (
      bookingType === "hotel" &&
      roomServiceOptions.length === 0 &&
      !roomType.trim()
    ) {
      nextErrors.room_type =
        "Vui lòng chọn hoặc nhập loại phòng.";
    }

    if (
      bookingType === "hotel" &&
      roomNumberOptions.length > 0 &&
      !roomNumber.trim()
    ) {
      nextErrors.room_number =
        "Vui lòng chọn phòng còn trống.";
    }

    if (
      (bookingType === "tour" ||
        bookingType === "attraction") &&
      adults + children < 1
    ) {
      nextErrors.adults =
        "Vui lòng chọn ít nhất một khách.";
    }

    if (bookingType === "transport") {
      if (!effectiveStartTime) {
        nextErrors.start_time =
          "Vui lòng chọn giờ đón.";
      }

      if (!pickupLocation.trim()) {
        nextErrors.pickup_location =
          "Vui lòng nhập điểm đón.";
      }

      if (!dropoffLocation.trim()) {
        nextErrors.dropoff_location =
          "Vui lòng nhập điểm trả.";
      }

      if (passengers < 1) {
        nextErrors.passengers =
          "Vui lòng nhập số hành khách.";
      }

      if (
        vehicleServiceOptions.length === 0 &&
        !vehicleType.trim()
      ) {
        nextErrors.vehicle_type =
          "Vui lòng nhập loại xe.";
      }
    }

    if (!customerName.trim()) {
      nextErrors.customer_name =
        "Vui lòng nhập họ tên.";
    }

    if (!customerEmail.trim()) {
      nextErrors.customer_email =
        "Vui lòng nhập email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        customerEmail.trim(),
      )
    ) {
      nextErrors.customer_email =
        "Email không đúng định dạng.";
    }

    if (!normalizedPhone) {
      nextErrors.customer_phone =
        "Vui lòng nhập số điện thoại.";
    } else if (
      !/^(0[0-9]{9,10}|\+84[0-9]{9,10})$/.test(
        normalizedPhone,
      )
    ) {
      nextErrors.customer_phone =
        "Số điện thoại Việt Nam không hợp lệ.";
    }

    setFieldErrors(nextErrors);
    focusFirstError(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const validateTeeTimeSelection = (): boolean => {
    const nextErrors: FieldErrors = {};

    if (!product?.id) {
      nextErrors.form =
        "Không tìm thấy dịch vụ để booking.";
    }

    if (!startDate) {
      nextErrors.start_date = "Vui lòng chọn ngày chơi.";
      setIsStartDateOpen(true);
      window.requestAnimationFrame(() => {
        startDateFieldRef.current?.focus({
          preventScroll: true,
        });
      });
    }

    if (startDate && startDate < minDate) {
      nextErrors.start_date =
        "Vui lòng chọn ngày từ hôm nay trở đi.";
    }

    if (
      visibleServiceOptions.length > 0 &&
      !selectedServiceOption
    ) {
      nextErrors.service_option_id =
        "Vui lòng chọn gói tee time.";
    }

    if (
      golfers < (selectedTeeTimeQuantityRule?.min || 1) ||
      golfers > (selectedTeeTimeQuantityRule?.max || Number.MAX_SAFE_INTEGER)
    ) {
      nextErrors.golfers =
        "Số golfer chưa phù hợp với gói đã chọn.";
    }

    setFieldErrors(nextErrors);
    focusFirstError(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const bookingDetails =
    (): Array<[string, string]> => {
      if (bookingType === "tee_time") {
        return [
          [
            "Dịch vụ",
            product?.name ||
              "Dịch vụ đang chọn",
          ],
          [
            "Ngày chơi",
            formatVietnameseDate(startDate),
          ],
          [
            "Gói",
            selectedPackageName,
          ],
          [
            "Số golfer",
            `${golfers} golfer`,
          ],
          ["Họ tên", customerName.trim()],
          ["Email", customerEmail.trim()],
          [
            "Số điện thoại",
            normalizePhone(customerPhone),
          ],
          [
            "Phương thức thanh toán dự kiến",
            paymentLabels[paymentMethod],
          ],
          [
            "Giá dự kiến",
            formatBookingPrice(
              totalPrice,
              bookingCopy.priceQuoteText,
            ),
          ],
        ];
      }

      const rows: Array<[string, string]> =
        [
          [
            "Dịch vụ",
            product?.name ||
              "Dịch vụ đang chọn",
          ],
          [
            bookingType === "hotel"
              ? "Ngày nhận phòng"
              : bookingCopy.dateLabel,
            formatVietnameseDate(startDate),
          ],
          [
            bookingType === "hotel"
              ? "Giờ nhận phòng dự kiến"
              : bookingCopy.timeLabel?.replace(":", "") ||
                "Thời gian",
            bookingType === "consultation"
              ? "Theo tư vấn"
              : effectiveStartTime || "Theo lịch dịch vụ",
          ],
          [
            "Số khách",
            quantitySummary,
          ],
          ["Họ tên", customerName.trim()],
          ["Email", customerEmail.trim()],
          [
            "Số điện thoại",
            normalizePhone(customerPhone),
          ],
          [
            "Phương thức thanh toán",
            paymentLabels[paymentMethod],
          ],
          [
            bookingCopy.priceLabel.replace(":", ""),
            formatBookingPrice(
              totalPrice,
              bookingCopy.priceQuoteText,
            ),
          ],
        ];

      if (
        bookingType === "hotel" &&
        endDate
      ) {
        rows.splice(2, 0, [
          "Ngày trả phòng",
          formatVietnameseDate(endDate),
        ]);
        rows.splice(
          4,
          0,
          [
            "Loại phòng",
            selectedServiceOption?.name ||
              roomType.trim(),
          ],
          ["Phòng", roomNumber.trim() || "Theo tư vấn"],
        );
      }

      if (
        bookingType !== "hotel" &&
        selectedServiceOption
      ) {
        rows.splice(4, 0, [
          "Tùy chọn",
          selectedServiceOption.name,
        ]);
      }

      if (bookingType === "transport") {
        rows.splice(
          4,
          0,
          [
            "Điểm đón",
            pickupLocation.trim(),
          ],
          [
            "Điểm trả",
            dropoffLocation.trim(),
          ],
        );
      }

      return rows;
    };

  const buildPayload = () => {
    if (
      !product?.id ||
      !idempotencyKeyRef.current
    ) {
      return null;
    }

    const basePayload = {
      service_product_id: product.id,
      booking_type: bookingType,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim(),
      customer_phone:
        normalizePhone(customerPhone),
      start_date: startDate,
      start_time: effectiveStartTime || undefined,
      customer_note: "",
      payment_method: paymentMethod,
      idempotency_key:
        idempotencyKeyRef.current,
    };

    if (bookingType === "transport") {
      return {
        ...basePayload,
        quantity: passengers,
        booking_details: {
          service_option_id:
            selectedServiceOption?.id,
          pickup_location:
            pickupLocation.trim(),
          dropoff_location:
            dropoffLocation.trim(),
          vehicle_type:
            selectedServiceOption?.name ||
            vehicleType.trim(),
          passengers,
        },
      };
    }

    if (bookingType === "hotel") {
      return {
        ...basePayload,
        end_date: endDate,
        adults,
        children,
        quantity: rooms,
        booking_details: {
          service_option_id:
            selectedServiceOption?.id,
          room_type:
            selectedServiceOption?.name ||
            roomType.trim(),
          room_number: roomNumber.trim(),
          rooms,
          nights,
          adults,
          children,
          check_in_time: effectiveStartTime,
        },
      };
    }

    if (bookingType === "tee_time") {
      return {
        ...basePayload,
        quantity: golfers,
        booking_details: {
          service_option_id:
            selectedServiceOption?.id,
          option_name:
            selectedServiceOption?.name,
          golfers,
        },
      };
    }

    return {
      ...basePayload,
      adults,
      children,
      quantity: Math.max(
        1,
        adults + children,
      ),
      booking_details: {
        service_option_id:
          selectedServiceOption?.id,
        option_name:
          selectedServiceOption?.name,
      },
    };
  };

  const applyBackendErrors = (
    caughtError: unknown,
  ): boolean => {
    if (
      !(caughtError instanceof ApiError) ||
      !caughtError.errors
    ) {
      return false;
    }

    const mappedErrors: FieldErrors = {};

    Object.entries(
      caughtError.errors,
    ).forEach(([key, messages]) => {
      const localKey = key.replace(
        "booking_details.",
        "",
      );

      mappedErrors[localKey] =
        messages[0] ||
        "Dữ liệu chưa hợp lệ.";
    });

    setFieldErrors(mappedErrors);
    focusFirstError(mappedErrors);

    return true;
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    setError("");

    if (bookingType === "tee_time") {
      if (!validateTeeTimeSelection() || !product?.id) {
        return;
      }

      idempotencyKeyRef.current ||=
        createIdempotencyKey("booking");

      setIsConfirmOpen(true);
      return;
    }

    if (!validate() || !product?.id) {
      return;
    }

    idempotencyKeyRef.current ||=
      createIdempotencyKey("booking");

    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    if (isSubmittingRef.current) {
      return;
    }

    setError("");

    if (!validate() || !product?.id) {
      return;
    }

    idempotencyKeyRef.current ||=
      createIdempotencyKey("booking");

    const typedPayload = buildPayload();

    if (!typedPayload) {
      setError(
        "Không thể tạo dữ liệu booking. Vui lòng thử lại.",
      );
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await createBooking(typedPayload);

      idempotencyKeyRef.current = null;

      setIsConfirmOpen(false);
      setBookingCode(response.data?.booking_code || "");
      setMailDispatched(response.meta?.mail_dispatched !== false);
      setIsSuccessOpen(true);
    } catch (caughtError) {
      if (
        !applyBackendErrors(caughtError)
      ) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Không gửi được booking, vui lòng thử lại.",
        );
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const renderError = (name: string) => {
    if (!fieldErrors[name]) {
      return null;
    }

    return (
      <p style={errorStyle}>
        {fieldErrors[name]}
      </p>
    );
  };

  const renderServiceOptionSelect = (
    label: string,
    options: ProductServiceOption[],
  ) => {
    if (options.length === 0) {
      return null;
    }

    return (
      <div className="tg-filter-list mb-10">
        <ul>
          <li>
            <select
              ref={setFieldRef(
                "service_option_id",
              )}
              className="booking-text-field"
              style={fieldStyle}
              value={selectedServiceOptionId ?? ""}
              onChange={(event) => {
                const option = options.find(
                  (item) =>
                    String(item.id) ===
                    event.target.value,
                );

                if (option) {
                  handleSelectServiceOption(option);
                } else {
                  setSelectedServiceOptionId(null);
                  clearFieldError("service_option_id");
                  resetSubmitKey();
                }
              }}
              aria-label={label}
            >
              <option value="">{label}</option>

              {options.map((option) => {
                const price = optionPrice(option);
                const unit = ` / ${getServiceUnitLabel(
                  bookingType,
                  option.unit,
                )}`;
                const priceText =
                  price !== null
                    ? ` - ${formatCurrencyVnd(price)}${unit}`
                    : "";

                return (
                  <option
                    key={option.id}
                    value={option.id}
                  >
                    {option.name}
                    {priceText}
                  </option>
                );
              })}
            </select>

            {renderError("service_option_id")}
          </li>
        </ul>

        {selectedServiceOption && (
          <div className="booking-option-info">
            <strong>
              {selectedServiceOption.name}
            </strong>
            {selectedOptionPrice !== null && (
              <span>
                {formatCurrencyVnd(selectedOptionPrice)} / {priceUnit}
              </span>
            )}
            {selectedServiceOption.capacity ? (
              <small>
                Phù hợp tối đa {selectedServiceOption.capacity} khách
              </small>
            ) : null}
            {selectedServiceOption.description ? (
              <small>
                {selectedServiceOption.description}
              </small>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  const renderTeeTimeOptionCards = (
    options: ProductServiceOption[],
  ) => {
    if (options.length === 0) return null;

    return (
      <div className="tee-time-package-selector">
        <div
          ref={setFieldRef("service_option_id")}
          className="tee-time-package-grid"
          tabIndex={-1}
        >
          {options.map((option) => {
            const isActive =
              String(option.id) === selectedServiceOptionId;
            const discountLabel = optionDiscountLabel(option);

            return (
              <article
                key={option.id}
                className={`tee-time-package-card ${
                  isActive ? "is-active" : ""
                } ${
                  discountLabel ? "has-discount" : ""
                }`}
              >
                {discountLabel && (
                  <span className="tee-time-package-card__badge">
                    {discountLabel}
                  </span>
                )}
                <button
                  type="button"
                  className="tee-time-package-card__select"
                  aria-pressed={isActive}
                  onClick={() =>
                    handleSelectServiceOption(option)
                  }
                >
                  <span className="tee-time-package-card__name">
                    {option.name}
                  </span>
                </button>
              </article>
            );
          })}
        </div>
        {renderError("service_option_id")}
      </div>
    );
  };

  const renderTeeTimeDetailAccordions = (
    sections: ReturnType<typeof resolveOptionDetail>["sections"],
    className: string,
    forceOpen = false,
  ) => (
    <div className={className}>
      {sections.map((section) => (
        <details key={section.title} open={forceOpen || section.defaultOpen}>
          <summary>
            <span>{section.title}</span>
            <i className="fa-regular fa-chevron-down" aria-hidden="true" />
          </summary>
          {isItineraryDetailSection(section) ? (
            renderTeeTimeSidebarTimeline(section)
          ) : (
            <ul>
              {section.items.map((item) => (
                <li
                  key={item.text}
                  className={`tone-${item.tone || section.tone || "neutral"}`}
                >
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </details>
      ))}
    </div>
  );

  const storefrontSafeText = (value?: string | null) => {
    const text = typeof value === "string" ? value.trim() : "";

    return text &&
      !/(demo|cms|seed|internal data|dữ\s*liệu\s*demo|tee\s*time\s*trong\s*cms)/i.test(text)
      ? text
      : "";
  };

  const storefrontSafeItems = (
    section?: TeeTimeOptionDetailSection,
  ) =>
    section?.items.filter((item) => storefrontSafeText(item.text)) || [];

  const hasStorefrontItems = (
    section?: TeeTimeOptionDetailSection,
  ) => storefrontSafeItems(section).length > 0;

  const firstStorefrontItemMatching = (
    section: TeeTimeOptionDetailSection | undefined,
    patterns: RegExp[],
  ) =>
    storefrontSafeItems(section).find((item) =>
      patterns.some((pattern) => pattern.test(item.text)),
    )?.text || "";

  const splitReturnInfo = (value: string) => {
    const parts = value
      .split(/[·•]/)
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length >= 2) {
      return {
        time: parts[0],
        label: parts.slice(1).join(" · "),
      };
    }

    const timeMatch = value.match(/\b\d{1,2}:\d{2}\b/);
    const label = value
      .replace(/\b\d{1,2}:\d{2}\b/, "")
      .replace(/[·•]/g, "")
      .trim();

    return {
      time: timeMatch?.[0] || "",
      label,
    };
  };

  const resolvePickupDetailInfo = (
    pickupSection?: TeeTimeOptionDetailSection,
    itinerarySection?: TeeTimeOptionDetailSection,
  ) => {
    const pickupItems = storefrontSafeItems(pickupSection);
    const searchLabel = firstStorefrontItemMatching(pickupSection, [
      /tìm\s*địa\s*điểm/i,
      /available\s*location/i,
    ]);
    const confirmation = firstStorefrontItemMatching(pickupSection, [
      /thời\s*gian.*xác\s*nhận/i,
      /confirmed.*booking/i,
      /confirmation/i,
    ]);
    const meetingPoint = firstStorefrontItemMatching(pickupSection, [
      /khu\s*đón\s*khách/i,
      /điểm\s*đón/i,
      /meeting\s*point/i,
      /pickup\s*area/i,
    ]);
    const note = firstStorefrontItemMatching(pickupSection, [
      /nhà\s*điều\s*hành.*xác\s*nhận/i,
      /operator.*confirm/i,
      /xác\s*nhận\s*lại/i,
    ]);
    const pickupReturnText =
      firstStorefrontItemMatching(pickupSection, [
        /\b\d{1,2}:\d{2}\b.*(về|return|địa\s*chỉ)/i,
        /(về\s*khách\s*sạn|địa\s*chỉ\s*riêng|return)/i,
      ]) ||
      firstStorefrontItemMatching(itinerarySection, [
        /\b\d{1,2}:\d{2}\b.*(quay\s*về|return|trở\s*về)/i,
        /(quay\s*về|return|trở\s*về)/i,
      ]);
    const returnInfo = splitReturnInfo(pickupReturnText);

    return {
      searchLabel,
      confirmation,
      meetingPoint,
      note,
      returnTime: returnInfo.time,
      returnLabel: returnInfo.label,
      hasDepartureData:
        Boolean(searchLabel || confirmation || meetingPoint || note) ||
        pickupItems.length > 0,
      hasReturnData: Boolean(returnInfo.time || returnInfo.label),
    };
  };

  const renderSidebarItems = (
    section: TeeTimeOptionDetailSection,
  ) =>
    isItineraryDetailSection(section) ? (
      renderTeeTimeSidebarTimeline(section)
    ) : (
      <ul>
        {storefrontSafeItems(section).map((item) => (
          <li
            key={item.text}
            className={`tone-${item.tone || section.tone || "neutral"}`}
          >
            {item.text}
          </li>
        ))}
      </ul>
    );

  const renderSidebarSubsections = (
    sections: TeeTimeOptionDetailSection[],
  ) => (
    <div className="tee-time-sidebar-subsections">
      {sections.filter(hasStorefrontItems).map((section) => (
        <section key={section.title}>
          <h6>{section.title}</h6>
          {renderSidebarItems(section)}
        </section>
      ))}
    </div>
  );

  const renderSidebarPickupDetails = (
    pickupSection?: TeeTimeOptionDetailSection,
    itinerarySection?: TeeTimeOptionDetailSection,
    option?: ProductServiceOption | null,
  ) => {
    const pickupInfo = resolvePickupDetailInfo(
      pickupSection,
      itinerarySection,
    );
    const map = resolveModalMap(option);
    const hasDepartureData =
      pickupInfo.hasDepartureData || Boolean(map);
    const hasReturnData = pickupInfo.hasReturnData;

    if (!hasDepartureData && !hasReturnData) return null;

    return (
      <div className="tee-time-sidebar-pickup">
        {hasDepartureData && (
          <section
            className="tee-time-sidebar-pickup__section"
            data-tee-time-detail-target="departure"
          >
            <h6>Khởi hành</h6>
            {pickupInfo.searchLabel && (
              <div
                className="tee-time-sidebar-pickup__search"
                data-tee-time-detail-target="location"
              >
                <i className="fa-regular fa-magnifying-glass" aria-hidden="true" />
                <span>{pickupInfo.searchLabel}</span>
              </div>
            )}
            {map && (
              <div
                className="tee-time-sidebar-pickup__map"
                data-tee-time-detail-target="location"
              >
                <iframe
                  src={map.src}
                  title={`Bản đồ ${map.label}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            <div className="tee-time-sidebar-pickup__rows">
              {pickupInfo.confirmation && (
                <p>
                  <i className="fa-regular fa-clock" aria-hidden="true" />
                  <span>{pickupInfo.confirmation}</span>
                </p>
              )}
              {pickupInfo.meetingPoint && (
                <p>
                  <i className="fa-regular fa-location-dot" aria-hidden="true" />
                  <span>{pickupInfo.meetingPoint}</span>
                </p>
              )}
              {pickupInfo.note && (
                <p>
                  <i className="fa-regular fa-circle-info" aria-hidden="true" />
                  <span>{pickupInfo.note}</span>
                </p>
              )}
            </div>
          </section>
        )}

        {hasReturnData && (
          <section
            className="tee-time-sidebar-pickup__section"
            data-tee-time-detail-target="return"
          >
            <h6>Quay về</h6>
            <div className="tee-time-sidebar-pickup__rows">
              {pickupInfo.returnTime && (
                <p>
                  <i className="fa-regular fa-clock" aria-hidden="true" />
                  <span>{pickupInfo.returnTime}</span>
                </p>
              )}
              {pickupInfo.returnLabel && (
                <p>
                  <i className="fa-regular fa-route" aria-hidden="true" />
                  <span>{pickupInfo.returnLabel}</span>
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    );
  };

  const renderTeeTimeStructuredDetailAccordions = (
    detail: ResolvedTeeTimeOptionDetail,
    className: string,
    option?: ProductServiceOption | null,
  ) => {
    const itinerarySection = findDetailSection(detail.sections, [
      "Lịch trình",
    ]);
    const includeSection = findDetailSection(detail.sections, [
      "Bao gồm",
    ]);
    const pickupSection = findDetailSection(detail.sections, [
      "Thông tin tập trung / đón khách",
    ]);
    const bookingNoteSections = collectDetailSections(detail.sections, [
      "Lưu ý trước khi đặt",
      "Điều kiện",
      "Thông tin thêm",
      "Thông tin bổ sung",
      "Nghiêm cấm & Hạn chế",
      "Giới hạn",
      "Trang phục nên mặc",
      "Quy định trang phục",
    ]);
    const termSections = collectDetailSections(detail.sections, [
      "Điều khoản chung",
      "Xác nhận",
      "Chính sách xác nhận",
      "Chính sách hủy",
    ]);
    const usageSections = collectDetailSections(detail.sections, [
      "Thời hạn sử dụng",
      "Loại voucher",
      "Thông tin voucher",
      "Thông tin đón/nhận",
      "Thông tin đón khách",
    ]);
    const pickupContent = renderSidebarPickupDetails(
      pickupSection,
      itinerarySection,
      option,
    );
    const orderedSections = [
      hasStorefrontItems(itinerarySection)
        ? {
            title: "Lịch trình",
            content: renderSidebarItems(itinerarySection as TeeTimeOptionDetailSection),
          }
        : null,
      hasStorefrontItems(includeSection)
        ? {
            title: "Bao gồm",
            content: renderSidebarItems(includeSection as TeeTimeOptionDetailSection),
          }
        : null,
      pickupContent
        ? {
            title: "Thông tin tập trung / đón khách",
            content: pickupContent,
          }
        : null,
      bookingNoteSections.some(hasStorefrontItems)
        ? {
            title: "Lưu ý trước khi đặt",
            content: renderSidebarSubsections(bookingNoteSections),
          }
        : null,
      termSections.some(hasStorefrontItems)
        ? {
            title: "Điều khoản chung",
            content: renderSidebarSubsections(termSections),
          }
        : null,
      usageSections.some(hasStorefrontItems)
        ? {
            title: "Hướng dẫn sử dụng",
            content: renderSidebarSubsections(usageSections),
          }
        : null,
    ].filter(Boolean) as Array<{
      title: string;
      content: ReactNode;
    }>;

    return (
      <div className={className}>
        {orderedSections.map((section) => (
          <details key={section.title} open>
            <summary>
              <span>{section.title}</span>
              <i className="fa-regular fa-chevron-down" aria-hidden="true" />
            </summary>
            {section.content}
          </details>
        ))}
      </div>
    );
  };

  const normalizeDetailTitle = (title: string) =>
    title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const findDetailSection = (
    sections: TeeTimeOptionDetailSection[],
    titles: string[],
  ) => {
    const normalizedTitles = titles.map(normalizeDetailTitle);

    return sections.find((section) =>
      normalizedTitles.includes(normalizeDetailTitle(section.title)),
    );
  };

  const collectDetailSections = (
    sections: TeeTimeOptionDetailSection[],
    titles: string[],
  ) => {
    const normalizedTitles = titles.map(normalizeDetailTitle);

    return sections.filter((section) =>
      normalizedTitles.includes(normalizeDetailTitle(section.title)),
    );
  };

  const isItineraryDetailSection = (
    section: TeeTimeOptionDetailSection,
  ) =>
    normalizeDetailTitle(section.title) ===
    normalizeDetailTitle("Lịch trình");

  const scrollTeeTimeDetailTo = (
    target:
      | "departure"
      | "location"
      | "return",
    root?: HTMLElement | null,
  ) => {
    const container = root || optionDetailModalRef.current;
    if (!container) return;

    const targetElement =
      container.querySelector<HTMLElement>(
        `[data-tee-time-detail-target="${target}"]`,
      );

    if (!targetElement) return;

    const details = targetElement.closest("details");
    if (details instanceof HTMLDetailsElement) {
      details.open = true;
    }

    const railScrollBody = container.querySelector<HTMLElement>(
      ".tee-time-package-detail-card__body",
    );
    const modalScrollBody = container.querySelector<HTMLElement>(
      ".tee-time-detail-modal__body",
    );
    const canScrollContainer =
      container.scrollHeight > container.clientHeight &&
      /auto|scroll/i.test(window.getComputedStyle(container).overflowY);
    const scrollBody =
      railScrollBody ||
      modalScrollBody ||
      (canScrollContainer ? container : null);

    if (scrollBody) {
      const bodyRect = scrollBody.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();

      scrollBody.scrollTo({
        behavior: "smooth",
        top:
          scrollBody.scrollTop +
          targetRect.top -
          bodyRect.top -
          12,
      });
    }
  };

  const scrollOptionDetailTo = (
    target:
      | "departure"
      | "location"
      | "return",
  ) => scrollTeeTimeDetailTo(target, optionDetailModalRef.current);

  const renderTeeTimeSidebarTimeline = (
    section: TeeTimeOptionDetailSection,
  ) => {
    const timelineItems = section.items.filter(
      (item) =>
        storefrontSafeText(item.text) &&
        !/lịch\s*trình\s*có\s*thể\s*thay\s*đổi/i.test(item.text),
    );
    const icons = [
      "fa-location-dot",
      "fa-flag",
      "fa-clock",
    ];

    return (
      <>
        <div className="tee-time-package-timeline">
          {timelineItems.map((item, index) => {
            const isActionRow =
              index === 0 || /quay\s*về|return|trở\s*về/i.test(item.text);
            const target =
              index === 0
                ? "departure"
                : index === 1
                  ? "location"
                  : /quay\s*về|return|trở\s*về/i.test(item.text)
                    ? "return"
                    : null;

            return (
              <div
                className="tee-time-package-timeline__item"
                key={`${item.text}-${index}`}
              >
                <span
                  className="tee-time-package-timeline__icon"
                  aria-hidden="true"
                >
                  <i className={`fa-regular ${icons[index] || "fa-circle-dot"}`} />
                </span>
                <button
                  type="button"
                  className="tee-time-package-timeline__link"
                  disabled={!target}
                  onClick={() => {
                    if (target) {
                      scrollTeeTimeDetailTo(
                        target,
                        teeTimeDetailCardRef.current,
                      );
                    }
                  }}
                >
                  <span>{item.text}</span>
                  {isActionRow && (
                    <i
                      className="fa-regular fa-chevron-right"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>
        <p className="tee-time-package-timeline__note">
          * Lịch trình có thể thay đổi tùy vào điều kiện sân,
          giao thông và thời tiết.
        </p>
        <div className="tee-time-itinerary-feedback">
          <span>Lịch trình này có hữu ích không?</span>
          <button
            type="button"
            className={itineraryFeedback === "yes" ? "is-selected" : ""}
            onClick={() => setItineraryFeedback("yes")}
          >
            Có
          </button>
          <button
            type="button"
            className={itineraryFeedback === "no" ? "is-selected" : ""}
            onClick={() => setItineraryFeedback("no")}
          >
            Không
          </button>
        </div>
      </>
    );
  };

  const metadataString = (
    source: Record<string, unknown> | undefined,
    keys: string[],
  ) => {
    for (const key of keys) {
      const value = source?.[key];

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    return "";
  };

  const resolveModalMap = (
    option?: ProductServiceOption | null,
  ) => {
    const optionMetadata = option?.metadata || {};
    const productMetadata = product?.metadata || {};
    const productAttributes = product?.attributes || {};
    const iframeUrl = metadataString(optionMetadata, [
      "map_embed_url",
      "mapEmbedUrl",
      "map_url",
      "mapUrl",
      "google_map_url",
      "googleMapUrl",
    ]) || metadataString(productMetadata, [
      "map_embed_url",
      "mapEmbedUrl",
      "map_url",
      "mapUrl",
      "google_map_url",
      "googleMapUrl",
    ]) || metadataString(productAttributes, [
      "map_embed_url",
      "mapEmbedUrl",
      "map_url",
      "mapUrl",
      "google_map_url",
      "googleMapUrl",
    ]);
    const location =
      metadataString(optionMetadata, [
        "meeting_point",
        "pickup_location",
        "location",
      ]) ||
      metadataString(productAttributes, [
        "meeting_point",
        "pickup_location",
        "location",
      ]) ||
      product?.location ||
      "";

    if (iframeUrl) {
      return { src: iframeUrl, label: location || product?.name || "Bản đồ" };
    }

    if (location) {
      return {
        src: `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`,
        label: location,
      };
    }

    return null;
  };

  const renderModalItemRows = (
    items: TeeTimeOptionDetailSection["items"],
    fallbackTone?: TeeTimeOptionDetailSection["tone"],
  ) => (
    <ul className="tee-time-detail-modal__list">
      {items.filter((item) => storefrontSafeText(item.text)).map((item) => {
        const tone = item.tone || fallbackTone || "neutral";

        return (
          <li
            key={item.text}
            className={`tone-${tone}`}
          >
            <span aria-hidden="true">
              {tone === "include"
                ? "✓"
                : tone === "exclude"
                  ? "×"
                  : "•"}
            </span>
            <p>{item.text}</p>
          </li>
        );
      })}
    </ul>
  );

  const renderModalAccordion = (
    title: string,
    children: ReactNode,
    defaultOpen = false,
  ) => (
    <details
      className="tee-time-detail-modal__section"
      open={defaultOpen}
    >
      <summary>
        <span>{title}</span>
        <i className="fa-regular fa-chevron-down" aria-hidden="true" />
      </summary>
      <div className="tee-time-detail-modal__section-body">
        {children}
      </div>
    </details>
  );

  const renderModalSubsections = (
    sections: TeeTimeOptionDetailSection[],
  ) => (
    <div className="tee-time-detail-modal__subsections">
      {sections.map((section) => (
        hasStorefrontItems(section) && (
        <section key={section.title}>
          <h5>{section.title}</h5>
          {renderModalItemRows(section.items, section.tone)}
        </section>
        )
      ))}
    </div>
  );

  const renderModalItinerary = (
    section?: TeeTimeOptionDetailSection,
  ) => {
    if (!section || section.items.length === 0) {
      return (
        <p className="tee-time-detail-modal__empty">
          Lịch trình đang được cập nhật.
        </p>
      );
    }

    const icons = [
      "fa-location-dot",
      "fa-flag",
      "fa-clock",
    ];
    const timelineItems = section.items.filter(
      (item) =>
        storefrontSafeText(item.text) &&
        !/lịch\s*trình\s*có\s*thể\s*thay\s*đổi/i.test(item.text),
    );
    const targetByIndex = [
      "departure",
      "location",
      "return",
    ] as const;

    return (
      <>
        <div className="tee-time-detail-modal__timeline">
          {timelineItems.map((item, index) => {
            const target = targetByIndex[index];

            return (
              <div
                className="tee-time-detail-modal__timeline-item"
                key={item.text}
              >
                <span aria-hidden="true">
                  <i className={`fa-regular ${icons[index] || "fa-circle-dot"}`} />
                </span>
                {target ? (
                  <button
                    type="button"
                    className="tee-time-detail-modal__timeline-link"
                    onClick={() =>
                      scrollOptionDetailTo(target)
                    }
                  >
                    <span>{item.text}</span>
                    {(index === 0 || index === 2) && (
                      <i className="fa-regular fa-chevron-right" aria-hidden="true" />
                    )}
                  </button>
                ) : (
                  <p>{item.text}</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="tee-time-detail-modal__note">
          * Lịch trình có thể thay đổi tùy vào điều kiện sân,
          giao thông và thời tiết.
        </p>
        <div className="tee-time-detail-modal__feedback">
          <span>Lịch trình này có hữu ích không?</span>
          <button
            type="button"
            className={itineraryFeedback === "yes" ? "is-selected" : ""}
            onClick={() => setItineraryFeedback("yes")}
          >
            Có
          </button>
          <button
            type="button"
            className={itineraryFeedback === "no" ? "is-selected" : ""}
            onClick={() => setItineraryFeedback("no")}
          >
            Không
          </button>
        </div>
      </>
    );
  };

  const renderModalPickup = (
    section?: TeeTimeOptionDetailSection,
    option?: ProductServiceOption | null,
    itinerary?: TeeTimeOptionDetailSection,
  ) => {
    const map = resolveModalMap(option);
    const pickupInfo = resolvePickupDetailInfo(section, itinerary);
    const hasDepartureData =
      pickupInfo.hasDepartureData || Boolean(map);

    return (
      <div className="tee-time-detail-modal__pickup">
        {hasDepartureData ? (
          <>
            <h5 data-tee-time-detail-target="departure">Khởi hành</h5>
            {pickupInfo.searchLabel && (
              <div
                className="tee-time-detail-modal__search"
                data-tee-time-detail-target="location"
              >
                <i className="fa-regular fa-magnifying-glass" aria-hidden="true" />
                <span>{pickupInfo.searchLabel}</span>
              </div>
            )}
            {map && (
              <div
                className="tee-time-detail-modal__map"
                data-tee-time-detail-target="location"
              >
                <iframe
                  src={map.src}
                  title={`Bản đồ ${map.label}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            <div className="tee-time-detail-modal__info-stack">
              {pickupInfo.confirmation && (
                <p>
                  <i className="fa-regular fa-clock" aria-hidden="true" />
                  <span>{pickupInfo.confirmation}</span>
                </p>
              )}
              {pickupInfo.meetingPoint && (
                <p>
                  <i className="fa-regular fa-location-dot" aria-hidden="true" />
                  <span>{pickupInfo.meetingPoint}</span>
                </p>
              )}
              {pickupInfo.note && (
                <p>
                  <i className="fa-regular fa-circle-info" aria-hidden="true" />
                  <span>{pickupInfo.note}</span>
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="tee-time-detail-modal__empty">
            Thông tin điểm đón đang được cập nhật.
          </p>
        )}
      </div>
    );
  };

  const renderModalReturn = (
    itinerary?: TeeTimeOptionDetailSection,
    pickup?: TeeTimeOptionDetailSection,
  ) => {
    const pickupInfo = resolvePickupDetailInfo(pickup, itinerary);

    if (!pickupInfo.hasReturnData) return null;

    return renderModalAccordion(
      "Quay về",
      <div
        className="tee-time-detail-modal__return"
        data-tee-time-detail-target="return"
      >
        {pickupInfo.returnTime && (
          <p>
            <i className="fa-regular fa-clock" aria-hidden="true" />
            <span>{pickupInfo.returnTime}</span>
          </p>
        )}
        {pickupInfo.returnLabel && (
          <p>{pickupInfo.returnLabel}</p>
        )}
      </div>,
      true,
    );
  };

  const renderTeeTimeOptionDetailModalContent = (
    detail: ResolvedTeeTimeOptionDetail,
  ) => {
    const itinerarySection = findDetailSection(detail.sections, [
      "Lịch trình",
    ]);
    const includeSection = findDetailSection(detail.sections, [
      "Bao gồm",
    ]);
    const pickupSection = findDetailSection(detail.sections, [
      "Thông tin tập trung / đón khách",
    ]);
    const bookingNoteSections = collectDetailSections(detail.sections, [
      "Lưu ý trước khi đặt",
      "Điều kiện",
      "Thông tin thêm",
      "Thông tin bổ sung",
      "Nghiêm cấm & Hạn chế",
      "Giới hạn",
      "Trang phục nên mặc",
      "Quy định trang phục",
    ]);
    const termSections = collectDetailSections(detail.sections, [
      "Điều khoản chung",
      "Xác nhận",
      "Chính sách xác nhận",
      "Chính sách hủy",
    ]);
    const usageSections = collectDetailSections(detail.sections, [
      "Thời hạn sử dụng",
      "Loại voucher",
      "Thông tin voucher",
      "Thông tin đón/nhận",
      "Thông tin đón khách",
    ]);
    const safeDescription = storefrontSafeText(detail.description);
    const hasPickupDetails =
      Boolean(pickupSection && pickupSection.items.length > 0) ||
      Boolean(resolveModalMap(detailServiceOption));

    return (
      <>
        <div className="tee-time-detail-modal__header">
          <div>
            <h4 id="tee-time-option-detail-title">
              Chi tiết gói dịch vụ
            </h4>
            <p>{detail.title}</p>
          </div>
          {detail.badges.length > 0 && (
            <div className="tee-time-detail-modal__badges">
              {detail.badges.map((badge) => (
                <em key={badge}>{badge}</em>
              ))}
            </div>
          )}
        </div>

        <div className="tee-time-detail-modal__body">
          {safeDescription && (
            <p className="tee-time-detail-modal__description">
              {safeDescription}
            </p>
          )}

          {hasStorefrontItems(itinerarySection) &&
            renderModalAccordion(
              "Lịch trình",
              renderModalItinerary(itinerarySection as TeeTimeOptionDetailSection),
              true,
            )}

          {hasStorefrontItems(includeSection) &&
            renderModalAccordion(
              "Bao gồm",
              renderModalItemRows(
                (includeSection as TeeTimeOptionDetailSection).items,
                (includeSection as TeeTimeOptionDetailSection).tone,
              ),
              true,
            )}

          {hasPickupDetails &&
            renderModalAccordion(
              "Thông tin tập trung / đón khách",
              renderModalPickup(
                pickupSection,
                detailServiceOption,
                itinerarySection,
              ),
              true,
            )}

          {renderModalReturn(itinerarySection, pickupSection)}

          {bookingNoteSections.some(hasStorefrontItems) &&
            renderModalAccordion(
              "Lưu ý trước khi đặt",
              renderModalSubsections(bookingNoteSections),
              true,
            )}

          {termSections.some(hasStorefrontItems) &&
            renderModalAccordion(
              "Điều khoản chung",
              renderModalSubsections(termSections),
              true,
            )}

          {usageSections.some(hasStorefrontItems) &&
            renderModalAccordion(
              "Hướng dẫn sử dụng",
              renderModalSubsections(usageSections),
              true,
            )}
        </div>
      </>
    );
  };

  const renderTeeTimePackageDetailsCard = (
    option?: ProductServiceOption | null,
  ) => {
    if (!option) return null;

    const detail = resolveOptionDetail(option, product);
    const safeDescription = storefrontSafeText(detail.description);

    return (
      <aside
        ref={teeTimeDetailCardRef}
        className="teeTimePackageDetails tee-time-package-details-card tee-time-package-detail-card"
      >
        <div className="tee-time-package-detail-card__header">
          <span>Chi tiết gói dịch vụ</span>
          <button
            type="button"
            className="tee-time-package-detail-card__expand"
            aria-label={`Mở chi tiết ${option.name}`}
            onClick={() => openOptionDetail(option)}
          >
            <i className="fa-regular fa-up-right-and-down-left-from-center" />
          </button>
        </div>
        <div
          ref={teeTimeDetailRailBodyRef}
          className="tee-time-package-detail-card__body"
        >
          <h5 className="tee-time-package-detail-card__name">{option.name}</h5>
          {detail.badges.length > 0 && (
            <div className="tee-time-package-detail-card__badges">
              {detail.badges.map((badge) => (
                <em key={badge}>{badge}</em>
              ))}
            </div>
          )}

          {safeDescription && (
            <p>{safeDescription}</p>
          )}

          {detail.sections.length > 0 ? (
            renderTeeTimeStructuredDetailAccordions(
              detail,
              "tee-time-package-detail-card__sections",
              option,
            )
          ) : (
            <p className="tee-time-package-detail-card__empty">
              Thông tin chi tiết gói đang được cập nhật.
            </p>
          )}
        </div>
      </aside>
    );
  };

  const renderMissingOptionsNotice = (
    message = "Chưa có tùy chọn trong CMS. Chúng tôi sẽ tư vấn theo yêu cầu của quý khách.",
  ) => (
    <p className="booking-option-empty">
      {message}
    </p>
  );

  const teeTimeCtaLabel =
    bookingType === "tee_time" &&
    selectedServiceOption &&
    !isTeeTimeSelectionReady
      ? "Chọn ngày để tiếp tục"
      : "Tiếp tục đặt tee time";

  const renderStartTimeSelector = () => (
    <>
      {bookingType !== "consultation" &&
        (bookingType !== "tee_time" || teeTimeHasDate) &&
        serviceTimes.length > 0 &&
        !(
          bookingType === "hotel" &&
          serviceTimes.length === 1
        ) && (
        <div className="booking-option-block mb-10">
          <span className="time">
            {bookingCopy.timeLabel}
          </span>

          <div className="booking-radio-options">
            {serviceTimes.map((time) => (
              <div
                className="form-check"
                key={time}
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="serviceTime"
                  id={`service-time-${time.replace(/[^a-zA-Z0-9]/g, "-")}`}
                  checked={
                    effectiveStartTime === time
                  }
                  onChange={() => {
                    setStartTime(time);
                    resetSubmitKey();
                  }}
                />

                <label
                  className="form-check-label"
                  htmlFor={`service-time-${time.replace(/[^a-zA-Z0-9]/g, "-")}`}
                >
                  {time}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookingType === "transport" && serviceTimes.length === 0 && (
        <div className="tg-booking-form-parent-inner mb-10">
          <label className="booking-field-label">
            Giờ đón
          </label>
          <input
            ref={setFieldRef("start_time")}
            className="booking-text-field"
            style={fieldStyle}
            type="time"
            value={startTime}
            onChange={(event) => {
              setStartTime(event.target.value);
              clearFieldError("start_time");
              resetSubmitKey();
            }}
            aria-label="Giờ đón"
          />
          {renderError("start_time")}
        </div>
      )}
    </>
  );

  return (
    <form
      id={formId}
      className={`${styles.bookingSidebarForm} ${
        bookingType === "tee_time" ? styles.teeTimeBookingForm : ""
      }`}
      onSubmit={handleSubmit}
      noValidate
    >
      <div
        className={
          bookingType === "tee_time"
            ? "teeTimePackagesLayout tee-time-packages-layout package-layout"
            : "booking-flow-grid"
        }
      >
        <div
          className={
            bookingType === "tee_time"
              ? `teeTimePackageSelector tee-time-package-selector-card package-selector ${
                  selectedServiceOption
                    ? "has-tee-time-selection"
                    : ""
                }`
              : "booking-flow-card"
          }
        >
      <div className="booking-card-header">
        <div className="booking-card-heading-row">
          <h4 className="tg-tour-about-title title-2 mb-10">
            {bookingType === "tee_time"
              ? "Vui lòng chọn ngày & gói dịch vụ"
              : bookingCopy.title}
          </h4>
          {bookingType === "tee_time" && hasTeeTimeDraft && (
            <button
              type="button"
              className="tee-time-clear-selection"
              onClick={resetTeeTimeSelection}
            >
              Xóa tất cả
            </button>
          )}
        </div>
      </div>

        <div
          className={
            bookingType === "tee_time"
              ? "tee-time-package-selector-main"
              : "booking-flow-main"
          }
        >

      <div className="booking-section">
        <div className="tg-booking-form-parent-inner mb-10">
          {bookingType !== "tee_time" && (
            <label className="booking-field-label">
              {bookingCopy.dateLabel}
            </label>
          )}
          {bookingType === "tee_time" && (
            <span className="tee-time-date-helper">
              Xin chọn ngày tham gia
            </span>
          )}
          {bookingType === "tee_time" ? (
            <div className="tee-time-calendar-anchor">
              <button
                ref={(element) => {
                  startDateFieldRef.current = element;
                }}
                type="button"
                className="tee-time-date-trigger"
                aria-expanded={isStartDateOpen}
                onClick={() => {
                  setIsStartDateOpen((current) => !current);
                }}
              >
                <span
                  className="booking-date-icon"
                  aria-hidden="true"
                >
                  <i className="fa-regular fa-calendar" />
                </span>
                <span>
                  {startDate
                    ? formatCompactVietnameseDate(startDate)
                    : "Xem trạng thái dịch vụ"}
                </span>
              </button>

              <div
                className={`tee-time-calendar-inline-shell ${
                  isStartDateOpen ? "is-open" : ""
                }`}
              >
                <Flatpickr
                  ref={startPickerRef}
                  value={
                    startDate
                      ? new Date(
                          `${startDate}T00:00:00`,
                        )
                      : undefined
                  }
                  onChange={(dates) => {
                    const nextStartDate =
                      formatIsoDate(dates[0]);

                    setStartDate(nextStartDate);
                    clearFieldError("start_date");

                    if (
                      endDate &&
                      nextStartDate &&
                      endDate < nextStartDate
                    ) {
                      setEndDate("");
                    }

                    resetSubmitKey();
                    setIsStartDateOpen(false);
                  }}
                  options={{
                    inline: true,
                    clickOpens: false,
                    closeOnSelect: false,
                    allowInput: false,
                    dateFormat: "d M, Y",
                    disableMobile: true,
                    locale: teeTimeCalendarLocale,
                    minDate,
                    monthSelectorType: "static",
                    shorthandCurrentMonth: true,

                    onReady: (
                      _selectedDates,
                      _dateString,
                      instance,
                    ) => {
                      applyBookingCalendarVariant(
                        instance,
                        "sidebar",
                      );
                      syncTeeTimeCalendarContent(instance);
                    },

                    onDayCreate: (
                      _selectedDates,
                      _dateString,
                      _instance,
                      dayElement,
                    ) => {
                      if (!teeTimeDatePriceLabel) return;

                      const label = teeTimeDatePriceLabel(dayElement.dateObj);

                      if (!label) return;

                      const priceElement = document.createElement("span");
                      priceElement.className = "booking-date-price-hint";
                      priceElement.textContent = label;
                      dayElement.appendChild(priceElement);
                    },
                  }}
                  className="tee-time-calendar-hidden-input"
                  aria-hidden="true"
                  readOnly
                />
              </div>
            </div>
          ) : (
            <div
              ref={(element) => {
                startDateFieldRef.current = element;
              }}
              className="booking-date-field p-relative"
              onClick={() =>
                toggleBookingCalendar(
                  startPickerRef.current,
                  endPickerRef.current,
                )
              }
            >
              <span
                className="booking-date-icon"
                aria-hidden="true"
              >
                <i className="fa-regular fa-calendar" />
              </span>

              <Flatpickr
                ref={startPickerRef}
                value={
                  startDate
                    ? new Date(
                        `${startDate}T00:00:00`,
                      )
                    : undefined
                }
                onChange={(dates) => {
                  const nextStartDate =
                    formatIsoDate(dates[0]);

                  setStartDate(nextStartDate);
                  clearFieldError("start_date");

                  if (
                    endDate &&
                    nextStartDate &&
                    endDate < nextStartDate
                  ) {
                    setEndDate("");
                  }

                  resetSubmitKey();
                }}
                options={{
                  clickOpens: false,
                  allowInput: false,
                  dateFormat: "d/m/Y",
                  disableMobile: true,
                  locale: Vietnamese,
                  minDate,
                  monthSelectorType: "static",

                  onClose: () => {
                    setIsStartDateOpen(false);
                  },

                  onOpen: (
                    _selectedDates,
                    _dateString,
                    instance,
                  ) => {
                    applyBookingCalendarVariant(
                      instance,
                      "sidebar",
                    );
                    setIsStartDateOpen(true);
                  },

                  onReady: (
                    _selectedDates,
                    _dateString,
                    instance,
                  ) => {
                    applyBookingCalendarVariant(
                      instance,
                      "sidebar",
                    );
                  },
                }}
                className="input booking-date-input"
                placeholder={bookingCopy.datePlaceholder}
                style={dateInputStyle}
                aria-label={bookingCopy.dateLabel}
                aria-invalid={Boolean(
                  fieldErrors.start_date,
                )}
                readOnly
              />

              <span
                className={`booking-date-caret ${
                  isStartDateOpen
                    ? "is-open"
                    : ""
                }`}
                aria-hidden="true"
              >
                <i className="fa-sharp fa-solid fa-angle-down" />
              </span>
            </div>
          )}

          {renderError("start_date")}
        </div>

      {bookingType === "hotel" && (
        <div className="tg-booking-form-parent-inner mb-10">
          <label className="booking-field-label">
            {bookingCopy.endDateLabel}
          </label>
          <div
            ref={endDateFieldRef}
            className="booking-date-field p-relative"
            onClick={() =>
              toggleBookingCalendar(
                endPickerRef.current,
                startPickerRef.current,
              )
            }
          >
            <span
              className="booking-date-icon"
              aria-hidden="true"
            >
              <i className="fa-regular fa-calendar" />
            </span>

            <Flatpickr
              ref={endPickerRef}
              value={
                endDate
                  ? new Date(
                      `${endDate}T00:00:00`,
                    )
                  : undefined
              }
              onChange={(dates) => {
                setEndDate(
                  formatIsoDate(dates[0]),
                );

                clearFieldError("end_date");
                resetSubmitKey();
                endPickerRef.current?.flatpickr.close();
              }}
              options={{
                clickOpens: false,
                allowInput: false,
                dateFormat: "d/m/Y",
                disableMobile: true,
                locale: Vietnamese,
                minDate:
                  startDate || minDate,
                monthSelectorType: "static",

                onClose: () => {
                  setIsEndDateOpen(false);
                },

                onOpen: (
                  _selectedDates,
                  _dateString,
                  instance,
                ) => {
                  applyBookingCalendarVariant(
                    instance,
                    "sidebar",
                  );

                  setIsEndDateOpen(true);
                },

                onReady: (
                  _selectedDates,
                  _dateString,
                  instance,
                ) => {
                  applyBookingCalendarVariant(
                    instance,
                    "sidebar",
                  );
                },
              }}
              className="input booking-date-input"
              placeholder={
                bookingCopy.endDatePlaceholder ||
                "Chọn ngày kết thúc"
              }
              style={dateInputStyle}
              aria-label={
                bookingCopy.endDateLabel ||
                "Ngày kết thúc"
              }
              aria-invalid={Boolean(
                fieldErrors.end_date,
              )}
              readOnly
            />

            <span
              className={`booking-date-caret ${
                isEndDateOpen
                  ? "is-open"
                  : ""
              }`}
              aria-hidden="true"
            >
              <i className="fa-sharp fa-solid fa-angle-down" />
            </span>
          </div>

          {renderError("end_date")}
        </div>
      )}

      {bookingType !== "tee_time" && renderStartTimeSelector()}

      {bookingType === "hotel" &&
        serviceTimes.length === 1 && (
        <div className="booking-policy-note">
          <strong>Nhận phòng từ {checkInTimeText}</strong>
          <span>Trả phòng trước {checkOutTimeText}.</span>
        </div>
      )}

      </div>

      {bookingType !== "tee_time" && (
        <div className="tg-tour-about-border-doted mb-15" />
      )}

      {(bookingType === "tour" ||
        bookingType === "attraction") && (
        <div className="tg-tour-about-tickets-wrap mb-15">
          <span className="tg-tour-about-sidebar-title">
            {bookingCopy.participantSectionTitle}
          </span>

          {bookingType === "tour" &&
            renderServiceOptionSelect(
              "Chọn gói tour",
              tourServiceOptions,
            )}
          {bookingType === "tour" &&
            tourServiceOptions.length === 0 &&
            renderMissingOptionsNotice("Chưa có gói tour trong CMS. Chúng tôi sẽ tư vấn gói phù hợp theo số khách và thời gian đi.")}

          {bookingType === "attraction" &&
            renderServiceOptionSelect(
              "Chọn loại vé",
              attractionServiceOptions,
            )}
          {bookingType === "attraction" &&
            attractionServiceOptions.length === 0 &&
            renderMissingOptionsNotice("Chưa có loại vé trong CMS. Chúng tôi sẽ kiểm tra và tư vấn giá vé phù hợp.")}

          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Người lớn</span>

              <p className="mb-0">
                <span>
                  {formatBookingPrice(
                    adultPrice,
                    bookingCopy.priceQuoteText,
                  )}
                </span>
              </p>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                className="select item-first"
                options={
                  positiveQuantityOptions
                }
                defaultCurrent={0}
                onChange={updateNumber(
                  setAdults,
                  1,
                )}
                name="adults"
                placeholder=""
              />
            </div>
          </div>

          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Trẻ em</span>

              <p className="mb-0">
                <span>
                  {formatBookingPrice(
                    childPrice,
                    bookingCopy.priceQuoteText,
                  )}
                </span>
              </p>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                className="select item-first"
                options={quantityOptions}
                defaultCurrent={0}
                onChange={updateNumber(
                  setChildren,
                  0,
                )}
                name="children"
                placeholder=""
              />
            </div>
          </div>

          {renderError("adults")}
        </div>
      )}

      {bookingType === "transport" && (
        <div className="tg-tour-about-extra mb-15">
          <span className="tg-tour-about-sidebar-title">
            {bookingCopy.participantSectionTitle}
          </span>

          {renderServiceOptionSelect(
            "Chọn loại xe",
            vehicleServiceOptions,
          )}

          <div className="tg-filter-list">
            <ul>
              <li>
                <input
                  ref={setFieldRef(
                    "pickup_location",
                  )}
                  style={fieldStyle}
                  value={pickupLocation}
                  onChange={updateText(
                    "pickup_location",
                    setPickupLocation,
                  )}
                  placeholder="Điểm đón *"
                />

                {renderError(
                  "pickup_location",
                )}
              </li>

              <li>
                <input
                  ref={setFieldRef(
                    "dropoff_location",
                  )}
                  style={fieldStyle}
                  value={dropoffLocation}
                  onChange={updateText(
                    "dropoff_location",
                    setDropoffLocation,
                  )}
                  placeholder="Điểm trả *"
                />

                {renderError(
                  "dropoff_location",
                )}
              </li>

              {vehicleServiceOptions.length === 0 && (
                <li>
                  <input
                    style={fieldStyle}
                    value={vehicleType}
                    onChange={updateText(
                      "vehicle_type",
                      setVehicleType,
                    )}
                    placeholder="Loại xe *"
                  />

                  {renderError("vehicle_type")}
                </li>
              )}
            </ul>
          </div>

          <div className="tg-tour-about-tickets mt-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Số hành khách</span>

              <p className="mb-0">
                <span>
                  {formatBookingPrice(
                    vehiclePrice,
                    bookingCopy.priceQuoteText,
                  )}
                </span>
              </p>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                className="select item-first"
                options={
                  positiveQuantityOptions
                }
                defaultCurrent={0}
                onChange={updateNumber(
                  setPassengers,
                  1,
                )}
                name="passengers"
                placeholder=""
              />
            </div>
          </div>

          {renderError("passengers")}
        </div>
      )}

      {bookingType === "hotel" && (
        <div className="tg-tour-about-extra mb-15">
          <span className="tg-tour-about-sidebar-title">
            {bookingCopy.participantSectionTitle}
          </span>

          {renderServiceOptionSelect(
            "Chọn loại phòng",
            roomServiceOptions,
          )}

          <div className="tg-filter-list">
            <ul>
              {roomServiceOptions.length === 0 && (
                <li>
                  {roomTypeOptions.length > 0 ? (
                    <select
                      ref={setFieldRef(
                        "room_type",
                      )}
                      className="booking-text-field"
                      style={fieldStyle}
                      value={roomType}
                      onChange={(event) => {
                        setRoomType(
                          event.target.value,
                        );
                        clearFieldError(
                          "room_type",
                        );
                        resetSubmitKey();
                      }}
                      aria-label="Loại phòng"
                    >
                      <option value="">
                        Chọn loại phòng
                      </option>

                      {roomTypeOptions.map(
                        (option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.text}
                          </option>
                        ),
                      )}
                    </select>
                  ) : (
                    <input
                      ref={setFieldRef(
                        "room_type",
                      )}
                      style={fieldStyle}
                      value={roomType}
                      onChange={updateText(
                        "room_type",
                        setRoomType,
                      )}
                      placeholder="Loại phòng mong muốn"
                      aria-label="Loại phòng"
                    />
                  )}

                  {renderError("room_type")}
                </li>
              )}

              {roomNumberOptions.length > 0 && (
                <li>
                  <select
                    ref={setFieldRef(
                      "room_number",
                    )}
                    className="booking-text-field"
                    style={fieldStyle}
                    value={roomNumber}
                    onChange={(event) => {
                      setRoomNumber(
                        event.target.value,
                      );
                      clearFieldError(
                        "room_number",
                      );
                      resetSubmitKey();
                    }}
                    aria-label="Phòng còn trống"
                  >
                    <option value="">
                      Chọn phòng còn trống *
                    </option>

                    {roomNumberOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.text}
                        </option>
                      ),
                    )}
                  </select>

                  {renderError(
                    "room_number",
                  )}
                </li>
              )}

            </ul>
          </div>

          <span className="booking-subsection-title">
            Số lượng khách
          </span>

          <div className="tg-tour-about-tickets mt-15 mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Người lớn</span>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                className="select item-first"
                options={positiveQuantityOptions}
                defaultCurrent={0}
                onChange={updateNumber(
                  setAdults,
                  1,
                )}
                name="hotel_adults"
                placeholder=""
              />
            </div>
          </div>

          <div className="tg-tour-about-tickets mt-10 mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Trẻ em</span>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                className="select item-first"
                options={quantityOptions}
                defaultCurrent={0}
                onChange={updateNumber(
                  setChildren,
                  0,
                )}
                name="hotel_children"
                placeholder=""
              />
            </div>
          </div>

          <div className="tg-tour-about-tickets mt-15 mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Số phòng cần đặt</span>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                className="select item-first"
                options={
                  positiveQuantityOptions
                }
                defaultCurrent={0}
                onChange={updateNumber(
                  setRooms,
                  1,
                )}
                name="rooms"
                placeholder=""
              />
            </div>
          </div>
        </div>
      )}

      {bookingType === "tee_time" && (
        <div className="tg-tour-about-tickets-wrap tee-time-package-block mb-15">
          <span className="tee-time-package-block__label">
            Loại gói dịch vụ
          </span>
          {renderTeeTimeOptionCards(teeTimeServiceOptions)}
          {teeTimeServiceOptions.length === 0 &&
            renderMissingOptionsNotice("Chưa có gói golf hoặc khung giờ trong CMS. Quý khách vẫn có thể gửi yêu cầu để được kiểm tra tee time.")}

          {teeTimeCanShowCompactControls && (
          <div className="tee-time-quantity-price-row">
            <div className="tee-time-stepper-block">
              <span>Số lượng</span>
              <small>
                {selectedTeeTimeQuantityRule?.fixed
                  ? `Bạn cần chọn đúng số lượng là ${selectedTeeTimeQuantityRule.min} để có thể đặt gói dịch vụ này`
                  : selectedTeeTimeQuantityRule
                    ? `Bạn phải chọn từ ${selectedTeeTimeQuantityRule.min} - ${selectedTeeTimeQuantityRule.max} với gói này`
                    : ""}
              </small>
              <div className="tee-time-quantity-control-row">
                <span>Người</span>
                <div className="tee-time-stepper">
                  <button
                    type="button"
                    aria-label="Giảm số golfer"
                    disabled={
                      golfers <=
                      (selectedTeeTimeQuantityRule?.min || 1)
                    }
                    onClick={() =>
                      updateTeeTimeGolfers(golfers - 1)
                    }
                  >
                    <i className="fa-regular fa-minus" />
                  </button>
                  <strong>{golfers}</strong>
                  <button
                    type="button"
                    aria-label="Tăng số golfer"
                    disabled={
                      golfers >=
                      (selectedTeeTimeQuantityRule?.max ||
                        Number.MAX_SAFE_INTEGER)
                    }
                    onClick={() =>
                      updateTeeTimeGolfers(golfers + 1)
                    }
                  >
                    <i className="fa-regular fa-plus" />
                  </button>
                </div>
              </div>
              {renderError("golfers")}
            </div>

            <div className="tee-time-total-block">
              <span>Từ</span>
              <strong>
                {unitPrice !== null
                  ? formatBookingPrice(
                      unitPrice,
                      bookingCopy.priceQuoteText,
                    )
                  : "Liên hệ tư vấn"}
              </strong>
              <small>
                Vui lòng hoàn tất các mục cần thiết để đến bước tiếp theo
              </small>
            </div>
          </div>
          )}
        </div>
      )}

      {bookingType !== "tee_time" && (
        <div className="tg-tour-about-border-doted mb-15" />
      )}

      {bookingType !== "tee_time" && (
        <div className="tg-tour-about-extra mb-10">
          <span className="tg-tour-about-sidebar-title">
            {bookingCopy.customerSectionTitle}
          </span>

          <div className="tg-filter-list">
            <ul>
              <li>
                <input
                  ref={setFieldRef(
                    "customer_name",
                  )}
                  className="booking-text-field"
                  style={fieldStyle}
                  value={customerName}
                  onChange={updateText(
                    "customer_name",
                    setCustomerName,
                  )}
                  placeholder="Họ tên *"
                  autoComplete="name"
                />

                {renderError(
                  "customer_name",
                )}
              </li>

              <li>
                <input
                  ref={setFieldRef(
                    "customer_email",
                  )}
                  className="booking-text-field"
                  style={fieldStyle}
                  type="email"
                  value={customerEmail}
                  onChange={updateText(
                    "customer_email",
                    setCustomerEmail,
                  )}
                  placeholder="Email *"
                  autoComplete="email"
                />

                {renderError(
                  "customer_email",
                )}
              </li>

              <li>
                <input
                  ref={setFieldRef(
                    "customer_phone",
                  )}
                  className="booking-text-field"
                  style={fieldStyle}
                  type="tel"
                  value={customerPhone}
                  onChange={updateText(
                    "customer_phone",
                    setCustomerPhone,
                  )}
                  placeholder="Số điện thoại *"
                  autoComplete="tel"
                  inputMode="tel"
                />

                {renderError(
                  "customer_phone",
                )}
              </li>

            </ul>
          </div>
        </div>
      )}

      {bookingType !== "tee_time" && (
        <div className="tg-tour-about-border-doted mb-15" />
      )}

      {bookingType !== "tee_time" && (
        <div className="booking-option-block mb-10">
          <span className="time">
            {bookingCopy.paymentTitle}
          </span>

          <div className="booking-radio-options payment-options">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="pay-cash"
                checked={
                  paymentMethod === "cash"
                }
                onChange={() => {
                  setPaymentMethod("cash");
                  resetSubmitKey();
                }}
              />

              <label
                className="form-check-label"
                htmlFor="pay-cash"
              >
                Tiền mặt
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="pay-bank"
                checked={
                  paymentMethod ===
                  "bank_transfer"
                }
                onChange={() => {
                  setPaymentMethod(
                    "bank_transfer",
                  );

                  resetSubmitKey();
                }}
              />

              <label
                className="form-check-label"
                htmlFor="pay-bank"
              >
                Chuyển khoản
              </label>
            </div>
          </div>

        </div>
      )}

      {bookingType !== "tee_time" && (
        <div className="tg-tour-about-border-doted mb-15" />
      )}

      {bookingType !== "tee_time" && (
      <div className="booking-price-summary mb-20">
        <span className="tg-tour-about-sidebar-title">
          Thanh toán
        </span>

        {selectedServiceOption ? (
          <div className="booking-price-breakdown">
            <strong>
              {selectedServiceOption.name}
            </strong>
            {unitPrice ? (
              <span>
                {formatCurrencyVnd(unitPrice)} x {priceQuantityLabel}
              </span>
            ) : (
              <span>
                Giá sẽ được tư vấn sau khi chúng tôi kiểm tra tình trạng dịch vụ.
              </span>
            )}
          </div>
        ) : visibleServiceOptions.length > 0 ? (
          null
        ) : (
          <p className="booking-helper-text mb-0">
            Giá sẽ được tư vấn sau khi chúng tôi kiểm tra tình trạng dịch vụ.
          </p>
        )}

        {displayTotalPrice !== null &&
          displayTotalPrice > 0 && (
          <div className="booking-price-total">
            <span>Tổng cộng</span>
            <h5 className="total-price">
              {formatBookingPrice(
                displayTotalPrice,
                bookingCopy.priceQuoteText,
              )}
            </h5>
          </div>
        )}
      </div>
      )}

      {fieldErrors.form && (
        <p className="form_error">
          {fieldErrors.form}
        </p>
      )}

      {error && (
        <p className="form_error">
          {error}
        </p>
      )}

      {(bookingType !== "tee_time" || selectedServiceOption) && (
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !product?.id
          }
          className="tg-btn tg-btn-switch-animation w-100"
        >
          {isSubmitting
            ? "Đang gửi..."
            : bookingType === "tee_time"
              ? teeTimeCtaLabel
              : bookingCopy.submitLabel}
        </button>
      )}

        </div>
        </div>

        {bookingType === "tee_time" && selectedServiceOption && (
          <aside className="teeTimePackageDetailsRail tee-time-package-details tee-time-package-details--notched package-detail">
            {renderTeeTimePackageDetailsCard(selectedServiceOption)}
          </aside>
        )}
      </div>

      {isOptionDetailOpen && detailServiceOption && (
        <div
          className="booking-confirm-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeOptionDetail();
            }
          }}
        >
          <div
            ref={optionDetailModalRef}
            className="booking-confirm-modal tee-time-option-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tee-time-option-detail-title"
          >
            <button
              ref={optionDetailCloseRef}
              type="button"
              className="tee-time-option-detail-close"
              aria-label="Đóng chi tiết gói"
              onClick={closeOptionDetail}
            >
              <i className="fa-regular fa-xmark" />
            </button>

            {(() => {
              const detail = resolveOptionDetail(
                detailServiceOption,
                product,
              );

              return renderTeeTimeOptionDetailModalContent(detail);
            })()}
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div
          className="booking-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-confirm-title"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isSubmitting
            ) {
              setIsConfirmOpen(false);
            }
          }}
        >
          {bookingType === "tee_time" ? (
            <div className="booking-confirm-modal tee-time-confirm-modal">
              <button
                type="button"
                className="tee-time-option-detail-close"
                aria-label="Đóng xác nhận booking"
                disabled={isSubmitting}
                onClick={() => setIsConfirmOpen(false)}
              >
                <i className="fa-regular fa-xmark" />
              </button>

              <div className="tee-time-confirm-modal__header">
                <h4 id="booking-confirm-title">
                  Xác nhận yêu cầu đặt tee time
                </h4>
              </div>

              <div className="tee-time-confirm-modal__body">
                <div className="tee-time-confirm-section">
                  <span className="tee-time-confirm-section-title">
                    Tóm tắt yêu cầu
                  </span>
                  <div className="booking-summary-list tee-time-confirm-summary">
                    {[
                      [
                        "Sân golf",
                        product?.name || "Dịch vụ đang chọn",
                      ],
                      [
                        "Ngày chơi",
                        formatVietnameseDate(startDate),
                      ],
                      ["Gói", selectedPackageName],
                      [
                        "Đơn giá",
                        unitPrice
                          ? `${formatCurrencyVnd(unitPrice)} / golfer`
                          : bookingCopy.priceQuoteText,
                      ],
                      [
                        "Số golfer",
                        `${golfers} golfer`,
                      ],
                      [
                        "Tổng dự kiến",
                        formatBookingPrice(
                          totalPrice,
                          bookingCopy.priceQuoteText,
                        ),
                      ],
                    ].map(([label, value]) => (
                      <div
                        className="booking-summary-row"
                        key={label}
                      >
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tee-time-confirm-section">
                  <span className="tee-time-confirm-section-title">
                    Thông tin khách hàng
                  </span>
                  <div className="tg-filter-list">
                    <ul>
                      <li>
                        <input
                          ref={setFieldRef(
                            "customer_name",
                          )}
                          className="booking-text-field"
                          style={fieldStyle}
                          value={customerName}
                          onChange={updateText(
                            "customer_name",
                            setCustomerName,
                          )}
                          placeholder="Họ tên *"
                          autoComplete="name"
                        />
                        {renderError("customer_name")}
                      </li>
                      <li>
                        <input
                          ref={setFieldRef(
                            "customer_email",
                          )}
                          className="booking-text-field"
                          style={fieldStyle}
                          type="email"
                          value={customerEmail}
                          onChange={updateText(
                            "customer_email",
                            setCustomerEmail,
                          )}
                          placeholder="Email *"
                          autoComplete="email"
                        />
                        {renderError("customer_email")}
                      </li>
                      <li>
                        <input
                          ref={setFieldRef(
                            "customer_phone",
                          )}
                          className="booking-text-field"
                          style={fieldStyle}
                          type="tel"
                          value={customerPhone}
                          onChange={updateText(
                            "customer_phone",
                            setCustomerPhone,
                          )}
                          placeholder="Số điện thoại *"
                          autoComplete="tel"
                          inputMode="tel"
                        />
                        {renderError("customer_phone")}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="tee-time-confirm-section">
                  <span className="tee-time-confirm-section-title">
                    Phương thức thanh toán dự kiến
                  </span>
                  <div className="booking-radio-options payment-options">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="teeTimePaymentMethod"
                        id="tee-time-pay-cash"
                        checked={paymentMethod === "cash"}
                        onChange={() => {
                          setPaymentMethod("cash");
                          resetSubmitKey();
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="tee-time-pay-cash"
                      >
                        {paymentLabels.cash}
                      </label>
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="teeTimePaymentMethod"
                        id="tee-time-pay-bank"
                        checked={
                          paymentMethod === "bank_transfer"
                        }
                        onChange={() => {
                          setPaymentMethod("bank_transfer");
                          resetSubmitKey();
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="tee-time-pay-bank"
                      >
                        {paymentLabels.bank_transfer}
                      </label>
                    </div>
                  </div>
                </div>

                {fieldErrors.form && (
                  <p className="form_error">
                    {fieldErrors.form}
                  </p>
                )}

                {error && (
                  <p className="form_error">
                    {error}
                  </p>
                )}
              </div>

              <div className="booking-confirm-actions tee-time-confirm-modal__footer">
                <button
                  type="button"
                  className="booking-edit-btn"
                  disabled={isSubmitting}
                  onClick={() =>
                    setIsConfirmOpen(false)
                  }
                >
                  Quay lại
                </button>

                <button
                  type="button"
                  className={`tg-btn tg-btn-switch-animation${isSubmitting ? " is-loading" : ""}`}
                  disabled={isSubmitting}
                  onClick={confirmSubmit}
                >
                  {isSubmitting && (
                    <i className="fa-solid fa-spinner" />
                  )}
                  <span>
                    {isSubmitting
                      ? "Đang gửi yêu cầu..."
                      : "Xác nhận gửi yêu cầu"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="booking-confirm-modal">
              <h4 id="booking-confirm-title">
                Xác nhận thông tin booking
              </h4>

              <div className="booking-summary-list">
                {bookingDetails().map(
                  ([label, value]) => (
                    <div
                      className="booking-summary-row"
                      key={label}
                    >
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ),
                )}
              </div>

              <div className="booking-confirm-actions">
                <button
                  type="button"
                  className="booking-edit-btn"
                  disabled={isSubmitting}
                  onClick={() =>
                    setIsConfirmOpen(false)
                  }
                >
                  Chỉnh sửa
                </button>

                <button
                  type="button"
                  className="tg-btn tg-btn-switch-animation"
                  disabled={isSubmitting}
                  onClick={confirmSubmit}
                >
                  {isSubmitting
                    ? "Đang gửi..."
                    : bookingCopy.confirmSubmitLabel}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isSuccessOpen && (
        <div
          className="booking-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-success-title"
        >
          <div className="booking-confirm-modal booking-success-modal">
            <div
              className="booking-success-icon"
              aria-hidden="true"
            >
              <i className="fa-regular fa-check" />
            </div>

            <h4 id="booking-success-title">
              {bookingCopy.successTitle}
            </h4>

            <p className="booking-success-message">
              {mailDispatched
                ? bookingCopy.successMessage
                : "Chúng tôi đã nhận thông tin của quý khách, nhưng email xác nhận chưa gửi được. Đội ngũ tư vấn sẽ liên hệ lại trong thời gian sớm nhất."}
            </p>

            {bookingCode && (
              <div className="booking-success-code">
                <span>Mã booking</span>
                <strong>{bookingCode}</strong>
              </div>
            )}

            <button
              type="button"
              className="tg-btn tg-btn-switch-animation w-100"
              onClick={() => setIsSuccessOpen(false)}
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

    </form>
  );
};

export default FeatureSidebar;
