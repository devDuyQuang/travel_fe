"use client";
//component chính của booking form
//xử lý state form
// xác định booking type
//render field theo từng loại dịch vụ,
//validate cơ bản phía frontend 
//build payload và gọi API khi user xác nhận booking. 

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn";

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
  return firstPrice(option?.price);
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

const FeatureSidebar = ({
  product,
}: {
  product?: Product | null;
}) => {
  const searchParams = useBrowserSearchParams();
  const bookingType =
    resolveBookingType(product);
  const bookingCopy =
    getBookingCopy(bookingType);

  const idempotencyKeyRef =
    useRef<string | null>(null);

  const isSubmittingRef = useRef(false);

  const fieldRefs = useRef<
    Record<
      string,
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null
    >
  >({});

const startPickerRef =
  useRef<InstanceType<typeof Flatpickr> | null>(null);

const endPickerRef =
  useRef<InstanceType<typeof Flatpickr> | null>(null);
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
  ] = useState("");

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
  const [mailDispatched, setMailDispatched] =
    useState(true);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState<FieldErrors>({});

  const [
    isStartDateOpen,
    setIsStartDateOpen,
  ] = useState(false);

  const [
    isEndDateOpen,
    setIsEndDateOpen,
  ] = useState(false);

  const minDate = useMemo(
    () => todayIso(),
    [],
  );

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
      visibleServiceOptions.find(
        (option) =>
          String(option.id) ===
          selectedServiceOptionId,
      ) || null,
    [
      selectedServiceOptionId,
      visibleServiceOptions,
    ],
  );

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
      return selectedOptionPrice === null
        ? null
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

  const setFieldRef =
    (name: string) =>
    (
      element:
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
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
        "Vui lòng chọn tùy chọn dịch vụ.";
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

    if (
      bookingType === "tee_time" &&
      !effectiveStartTime
    ) {
      nextErrors.start_time =
        "Vui lòng chọn giờ chơi.";
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

  const bookingDetails =
    (): Array<[string, string]> => {
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
            bookingType === "tee_time"
              ? "Số golfer"
              : "Số khách",
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
      setIsConfirmOpen(false);
      return;
    }

    idempotencyKeyRef.current ||=
      createIdempotencyKey("booking");

    const typedPayload = buildPayload();

    if (!typedPayload) {
      setIsConfirmOpen(false);
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
      setMailDispatched(response.meta?.mail_dispatched !== false);
      setIsSuccessOpen(true);
    } catch (caughtError) {
      setIsConfirmOpen(false);

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
              value={selectedServiceOptionId}
              onChange={(event) => {
                setSelectedServiceOptionId(
                  event.target.value,
                );
                clearFieldError(
                  "service_option_id",
                );
                resetSubmitKey();
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

  const renderMissingOptionsNotice = (
    message = "Chưa có tùy chọn trong CMS. Chúng tôi sẽ tư vấn theo yêu cầu của quý khách.",
  ) => (
    <p className="booking-option-empty">
      {message}
    </p>
  );

  return (
    <form
      className={styles.bookingSidebarForm}
      onSubmit={handleSubmit}
      noValidate
    >
      <h4 className="tg-tour-about-title title-2 mb-15">
        {bookingCopy.title}
      </h4>

      <div className="booking-section">
        <div className="tg-booking-form-parent-inner mb-10">
          <label className="booking-field-label">
            {bookingCopy.dateLabel}
          </label>
          <div
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
              placeholder={
                bookingCopy.datePlaceholder
              }
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

          {renderError("start_date")}
        </div>

      {bookingType === "hotel" && (
        <div className="tg-booking-form-parent-inner mb-10">
          <label className="booking-field-label">
            {bookingCopy.endDateLabel}
          </label>
          <div
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

      {bookingType !== "consultation" &&
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

      {(bookingType === "transport" ||
        bookingType === "tee_time") &&
        serviceTimes.length === 0 && (
        <div className="tg-booking-form-parent-inner mb-10">
          <label className="booking-field-label">
            {bookingType === "transport" ? "Giờ đón" : "Giờ chơi"}
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
            aria-label={bookingType === "transport" ? "Giờ đón" : "Giờ chơi"}
          />
          {renderError("start_time")}
        </div>
      )}

      {bookingType === "hotel" &&
        serviceTimes.length === 1 && (
        <div className="booking-policy-note">
          <strong>Nhận phòng từ {checkInTimeText}</strong>
          <span>Trả phòng trước {checkOutTimeText}.</span>
        </div>
      )}

      </div>

      <div className="tg-tour-about-border-doted mb-15" />

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
        <div className="tg-tour-about-tickets-wrap mb-15">
          <span className="tg-tour-about-sidebar-title">
            Số golfer:
          </span>

          {renderServiceOptionSelect(
            "Chọn gói golf",
            teeTimeServiceOptions,
          )}
          {teeTimeServiceOptions.length === 0 &&
            renderMissingOptionsNotice("Chưa có gói golf hoặc khung giờ trong CMS. Quý khách vẫn có thể gửi yêu cầu để được kiểm tra tee time.")}

          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Số golfer</span>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                className="select item-first"
                options={
                  positiveQuantityOptions
                }
                defaultCurrent={0}
                onChange={updateNumber(
                  setGolfers,
                  1,
                )}
                name="golfers"
                placeholder=""
              />
            </div>
          </div>
        </div>
      )}

      <div className="tg-tour-about-border-doted mb-15" />

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

      <div className="tg-tour-about-border-doted mb-15" />

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

      <div className="tg-tour-about-border-doted mb-15" />

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

      <button
        type="submit"
        disabled={
          isSubmitting || !product?.id
        }
        className="tg-btn tg-btn-switch-animation w-100"
      >
        {isSubmitting
          ? "Đang gửi..."
          : bookingCopy.submitLabel}
      </button>

      {isConfirmOpen && (
        <div
          className="booking-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-confirm-title"
        >
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
