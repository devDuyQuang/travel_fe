"use client";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn";

import { applyBookingCalendarVariant } from "@/lib/bookingCalendar";
import {
  ApiError,
  createBooking,
  createIdempotencyKey,
} from "@/services/transaction.service";
import type { Product } from "@/types/product";
import NiceSelect from "@/ui/NiceSelect";

import styles from "./FeatureSidebar.module.css";

type BookingType =
  | "tour"
  | "attraction"
  | "hotel"
  | "transport"
  | "tee_time"
  | "golf_room"
  | "consultation";

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

  return Number.isFinite(number) && number > 0 ? number : null;
}

function resolveBookingType(product?: Product | null): BookingType {
  const layout = product?.category?.layout_key;

  if (layout === "transport") return "transport";
  if (layout === "attraction") return "attraction";
  if (layout === "accommodation") return "hotel";
  if (layout === "tee_time") return "tee_time";
  if (layout === "golf_room") return "golf_room";
  if (layout === "consultation") return "consultation";

  return "tour";
}

function firstPrice(
  ...values: Array<string | number | boolean | null | undefined>
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

  return phone.startsWith("84") ? `+${phone}` : phone;
}

function formatPrice(value: number | null): string {
  return value && value > 0
    ? `${value.toLocaleString("vi-VN")} ₫`
    : "Cần báo giá";
}

function todayIso(): string {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 10);
}

function formatVietnameseDate(value: string): string {
  if (!value) return "";

  const [year, month, day] = value.split("-");

  return year && month && day ? `${day}/${month}/${year}` : value;
}

function formatIsoDate(date?: Date): string {
  if (!date) return "";

  const pad = (number: number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

const paymentLabels = {
  cash: "Tiền mặt",
  bank_transfer: "Chuyển khoản",
} as const;

const quantityOptions = Array.from({ length: 9 }, (_, index) => ({
  value: String(index),
  text: index === 0 ? "0" : String(index).padStart(2, "0"),
}));

const positiveQuantityOptions = quantityOptions.slice(1);

const FeatureSidebar = ({
  product,
}: {
  product?: Product | null;
}) => {
  const bookingType = resolveBookingType(product);

  const idempotencyKeyRef = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);
  const fieldRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("12:00");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [golfers, setGolfers] = useState(1);

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [roomType, setRoomType] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "bank_transfer"
  >("cash");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [successDetails, setSuccessDetails] = useState<
    Array<[string, string]>
  >([]);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [selectResetKey, setSelectResetKey] = useState(0);

  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  const minDate = useMemo(() => todayIso(), []);

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

  const totalPrice = useMemo(() => {
    if (bookingType === "transport") {
      return vehiclePrice;
    }

    if (
      bookingType === "tour" ||
      bookingType === "attraction"
    ) {
      if (adultPrice === null && childPrice === null) {
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
    vehiclePrice,
  ]);

  const quantitySummary = useMemo(() => {
    if (bookingType === "transport") {
      return `Số khách: ${passengers}`;
    }

    if (bookingType === "hotel") {
      return `Số phòng: ${rooms}, Người lớn: ${adults}, Trẻ em: ${children}`;
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
    passengers,
    rooms,
  ]);

  const resetSubmitKey = () => {
    idempotencyKeyRef.current = null;
    setSuccessDetails([]);
  };

  const setFieldRef =
    (name: string) =>
    (
      element: HTMLInputElement | HTMLTextAreaElement | null,
    ) => {
      fieldRefs.current[name] = element;
    };

  const updateText =
    (setter: (value: string) => void) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >,
    ) => {
      setter(event.target.value);
      resetSubmitKey();
    };

  const updateNumber =
    (setter: (value: number) => void, minimum: number) =>
    (item: { value: string }) => {
      setter(
        Math.max(
          minimum,
          Number(item.value || minimum),
        ),
      );

      resetSubmitKey();
    };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};
    const normalizedPhone = normalizePhone(customerPhone);

    if (!product?.id) {
      nextErrors.form =
        "Không tìm thấy dịch vụ để booking.";
    }

    if (!startDate) {
      nextErrors.start_date =
        "Vui lòng chọn ngày sử dụng.";
    }

    if (bookingType === "hotel" && !endDate) {
      nextErrors.end_date =
        "Vui lòng chọn ngày trả phòng.";
    }

    if (startDate && startDate < minDate) {
      nextErrors.start_date =
        "Vui lòng chọn ngày từ hôm nay trở đi.";
    }

    if (endDate && endDate < minDate) {
      nextErrors.end_date =
        "Vui lòng chọn ngày từ hôm nay trở đi.";
    }

    if (
      bookingType === "hotel" &&
      startDate &&
      endDate &&
      endDate < startDate
    ) {
      nextErrors.end_date =
        "Ngày trả phòng phải từ ngày nhận phòng trở đi.";
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

    const firstKey = Object.keys(nextErrors).find(
      (key) => key !== "form",
    );

    if (firstKey) {
      window.requestAnimationFrame(() => {
        fieldRefs.current[firstKey]?.focus();
      });
    }

    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setStartTime("12:00");

    setAdults(1);
    setChildren(0);
    setPassengers(1);
    setRooms(1);
    setGolfers(1);

    setPickupLocation("");
    setDropoffLocation("");
    setVehicleType("");
    setRoomType("");

    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerNote("");

    setPaymentMethod("cash");

    setFieldErrors({});
    setError("");
    setIsConfirmOpen(false);
    setIsStartDateOpen(false);
    setIsEndDateOpen(false);

    setSelectResetKey((key) => key + 1);
  };

  const bookingDetails = (): Array<[string, string]> => {
    const rows: Array<[string, string]> = [
      [
        "Dịch vụ",
        product?.name || "Dịch vụ đang chọn",
      ],
      [
        "Ngày sử dụng",
        formatVietnameseDate(startDate),
      ],
      [
        "Giờ sử dụng",
        bookingType === "consultation"
          ? "Theo tư vấn"
          : startTime,
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
        "Ghi chú",
        customerNote.trim() || "Không có",
      ],
      [
        "Phương thức thanh toán",
        paymentLabels[paymentMethod],
      ],
      [
        "Tổng tạm tính",
        formatPrice(totalPrice),
      ],
    ];

    if (bookingType === "hotel" && endDate) {
      rows.splice(2, 0, [
        "Ngày trả phòng",
        formatVietnameseDate(endDate),
      ]);
    }

    if (bookingType === "transport") {
      rows.splice(
        4,
        0,
        ["Điểm đón", pickupLocation.trim()],
        ["Điểm trả", dropoffLocation.trim()],
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
      customer_phone: normalizePhone(customerPhone),
      start_date: startDate,
      start_time: startTime,
      customer_note: customerNote.trim(),
      payment_method: paymentMethod,
      idempotency_key: idempotencyKeyRef.current,
    };

    if (bookingType === "transport") {
      return {
        ...basePayload,
        quantity: passengers,
        booking_details: {
          pickup_location: pickupLocation.trim(),
          dropoff_location: dropoffLocation.trim(),
          vehicle_type: vehicleType.trim(),
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
          room_type: roomType.trim(),
          rooms,
          adults,
          children,
        },
      };
    }

    if (bookingType === "tee_time") {
      return {
        ...basePayload,
        quantity: golfers,
        booking_details: {
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

    const mapped: FieldErrors = {};

    Object.entries(caughtError.errors).forEach(
      ([key, messages]) => {
        const localKey = key.replace(
          "booking_details.",
          "",
        );

        mapped[localKey] =
          messages[0] || "Dữ liệu chưa hợp lệ.";
      },
    );

    setFieldErrors(mapped);

    const firstKey = Object.keys(mapped)[0];

    if (firstKey) {
      window.requestAnimationFrame(() => {
        fieldRefs.current[firstKey]?.focus();
      });
    }

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
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await createBooking(typedPayload);

      idempotencyKeyRef.current = null;

      const submittedDetails = bookingDetails();

      resetForm();
      setSuccessDetails(submittedDetails);
    } catch (caughtError) {
      setIsConfirmOpen(false);

      if (!applyBackendErrors(caughtError)) {
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

  return (
    <form
      className={styles.bookingSidebarForm}
      onSubmit={handleSubmit}
      noValidate
    >
      <h4 className="tg-tour-about-title title-2 mb-15">
        Đặt dịch vụ
      </h4>

      <div className="tg-booking-form-parent-inner mb-10">
        <div className="booking-date-field p-relative">
          <span
            className="booking-date-icon"
            aria-hidden="true"
          >
            <i className="fa-regular fa-calendar"></i>
          </span>

          <Flatpickr
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
              clickOpens: true,
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
            placeholder="Chọn ngày"
            style={dateInputStyle}
            aria-label="Ngày sử dụng"
            aria-invalid={Boolean(
              fieldErrors.start_date,
            )}
            readOnly
          />

          <span
            className={`booking-date-caret ${
              isStartDateOpen ? "is-open" : ""
            }`}
            aria-hidden="true"
          >
            <i className="fa-sharp fa-solid fa-angle-down"></i>
          </span>
        </div>

        {renderError("start_date")}
      </div>

      {bookingType === "hotel" && (
        <div className="tg-booking-form-parent-inner p-relative mb-10">
          <div className="booking-date-field p-relative">
            <span
              className="booking-date-icon"
              aria-hidden="true"
            >
              <i className="fa-regular fa-calendar"></i>
            </span>

            <Flatpickr
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

                resetSubmitKey();
              }}
              options={{
                clickOpens: true,
                allowInput: false,
                dateFormat: "d/m/Y",
                disableMobile: true,
                locale: Vietnamese,
                minDate: startDate || minDate,
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
              placeholder="Chọn ngày trả phòng"
              style={dateInputStyle}
              aria-label="Ngày trả phòng"
              aria-invalid={Boolean(
                fieldErrors.end_date,
              )}
              readOnly
            />

            <span
              className={`booking-date-caret ${
                isEndDateOpen ? "is-open" : ""
              }`}
              aria-hidden="true"
            >
              <i className="fa-sharp fa-solid fa-angle-down"></i>
            </span>
          </div>

          {renderError("end_date")}
        </div>
      )}

      {bookingType !== "consultation" && (
        <div className="booking-option-block mb-10">
          <span className="time">
            Giờ sử dụng:
          </span>

          <div className="booking-radio-options">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="tourTime"
                id="time1"
                checked={startTime === "12:00"}
                onChange={() => {
                  setStartTime("12:00");
                  resetSubmitKey();
                }}
              />

              <label
                className="form-check-label"
                htmlFor="time1"
              >
                12:00
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="tourTime"
                id="time2"
                checked={startTime === "19:00"}
                onChange={() => {
                  setStartTime("19:00");
                  resetSubmitKey();
                }}
              />

              <label
                className="form-check-label"
                htmlFor="time2"
              >
                19:00
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="tg-tour-about-border-doted mb-15"></div>

      {(bookingType === "tour" ||
        bookingType === "attraction") && (
        <div className="tg-tour-about-tickets-wrap mb-15">
          <span className="tg-tour-about-sidebar-title">
            Số vé / Số khách:
          </span>

          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Người lớn</span>

              <p className="mb-0">
                <span>
                  {formatPrice(adultPrice)}
                </span>
              </p>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                key={`adults-${selectResetKey}`}
                className="select item-first"
                options={positiveQuantityOptions}
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
                  {formatPrice(childPrice)}
                </span>
              </p>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                key={`children-${selectResetKey}`}
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
          <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">
            Thông tin đưa đón:
          </span>

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
                    setDropoffLocation,
                  )}
                  placeholder="Điểm trả *"
                />

                {renderError(
                  "dropoff_location",
                )}
              </li>

              <li>
                <input
                  style={fieldStyle}
                  value={vehicleType}
                  onChange={updateText(
                    setVehicleType,
                  )}
                  placeholder="Loại xe"
                />
              </li>
            </ul>
          </div>

          <div className="tg-tour-about-tickets mt-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Số hành khách</span>

              <p className="mb-0">
                <span>
                  {formatPrice(vehiclePrice)}
                </span>
              </p>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                key={`passengers-${selectResetKey}`}
                className="select item-first"
                options={positiveQuantityOptions}
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
          <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">
            Thông tin phòng:
          </span>

          <div className="tg-filter-list">
            <ul>
              <li>
                <input
                  style={fieldStyle}
                  value={roomType}
                  onChange={updateText(
                    setRoomType,
                  )}
                  placeholder="Loại phòng"
                />
              </li>
            </ul>
          </div>

          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Số phòng</span>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                key={`rooms-${selectResetKey}`}
                className="select item-first"
                options={positiveQuantityOptions}
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

          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Số golfer</span>
            </div>

            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect
                key={`golfers-${selectResetKey}`}
                className="select item-first"
                options={positiveQuantityOptions}
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

      <div className="tg-tour-about-border-doted mb-15"></div>

      <div className="tg-tour-about-extra mb-10">
        <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">
          Thông tin khách hàng:
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
                  setCustomerName,
                )}
                placeholder="Họ tên *"
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
                  setCustomerEmail,
                )}
                placeholder="Email *"
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
                value={customerPhone}
                onChange={updateText(
                  setCustomerPhone,
                )}
                placeholder="Số điện thoại *"
              />

              {renderError("customer_phone")}
            </li>

            <li>
              <textarea
                className="booking-text-field"
                style={{
                  ...fieldStyle,
                  minHeight: "70px",
                  resize: "vertical",
                }}
                value={customerNote}
                onChange={updateText(
                  setCustomerNote,
                )}
                placeholder="Ghi chú"
                rows={3}
              />
            </li>
          </ul>
        </div>
      </div>

      <div className="tg-tour-about-border-doted mb-15"></div>

      <div className="booking-option-block mb-10">
        <span className="time">
          Thanh toán:
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

      <div className="tg-tour-about-border-doted mb-15"></div>

      <div className="tg-tour-about-coast d-flex align-items-center flex-wrap justify-content-between mb-20">
        <span className="tg-tour-about-sidebar-title d-inline-block">
          Tổng tạm tính:
        </span>

        <h5 className="total-price">
          {formatPrice(totalPrice)}
        </h5>
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
          : "Gửi booking"}
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
                  : "Xác nhận gửi booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {successDetails.length > 0 && (
        <div
          className="booking-confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-success-title"
        >
          <div className="booking-confirm-modal booking-success-modal">
            <div className="booking-success-icon">
              <i className="fa-regular fa-check"></i>
            </div>

            <h4 id="booking-success-title">
              Đặt dịch vụ thành công
            </h4>

            <p className="booking-success-message">
              Golfnity đã nhận thông tin của quý
              khách. Chúng tôi sẽ liên hệ lại trong
              thời gian sớm nhất.
            </p>

            <div className="booking-summary-list">
              {successDetails
                .filter(([label]) =>
                  [
                    "Dịch vụ",
                    "Ngày sử dụng",
                    "Giờ sử dụng",
                    "Số khách",
                    "Số golfer",
                    "Họ tên",
                    "Số điện thoại",
                    "Tổng tạm tính",
                  ].includes(label),
                )
                .map(([label, value]) => (
                  <div
                    className="booking-summary-row"
                    key={label}
                  >
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
            </div>

            <button
              type="button"
              className="tg-btn tg-btn-switch-animation w-100"
              onClick={() =>
                setSuccessDetails([])
              }
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