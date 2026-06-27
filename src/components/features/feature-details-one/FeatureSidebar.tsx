"use client";

import NiceSelect from "@/ui/NiceSelect";
import type { Product } from "@/types/product";
import {
  ApiError,
  createBooking,
  createIdempotencyKey,
} from "@/services/transaction.service";
import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

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
  minHeight: "46px",
  border: "1px solid #e7e7e7",
  borderRadius: "6px",
  background: "#f7f7f7",
  padding: "10px 14px",
} as const;

const errorStyle = {
  color: "#d93025",
  fontSize: "13px",
  lineHeight: "1.35",
  marginTop: "5px",
} as const;

function numericValue(value?: string | number | boolean | null) {
  if (value === null || value === undefined || value === "" || typeof value === "boolean") {
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

function firstPrice(...values: Array<string | number | boolean | null | undefined>) {
  for (const value of values) {
    const number = numericValue(value);
    if (number !== null) return number;
  }

  return null;
}

function normalizePhone(value: string) {
  const phone = value.replace(/[\s().-]+/g, "");
  return phone.startsWith("84") ? `+${phone}` : phone;
}

const formatPrice = (value: number | null) =>
  value && value > 0 ? `${value.toLocaleString("vi-VN")} ₫` : "Cần báo giá";

const quantityOptions = Array.from({ length: 9 }, (_, index) => ({
  value: String(index),
  text: index === 0 ? "0" : String(index).padStart(2, "0"),
}));

const positiveQuantityOptions = quantityOptions.slice(1);

const FeatureSidebar = ({ product }: { product?: Product | null }) => {
  const bookingType = resolveBookingType(product);
  const idempotencyKeyRef = useRef<string | null>(null);
  const isSubmittingRef = useRef(false);
  const fieldRefs = useRef<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("12:00");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [roomType, setRoomType] = useState("");
  const [rooms, setRooms] = useState(1);
  const [golfers, setGolfers] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const adultPrice = firstPrice(
    product?.attributes?.adult_price,
    product?.display_price,
    product?.price,
    product?.price_discount,
    product?.sale_price,
    product?.regular_price,
  );
  const childPrice = firstPrice(product?.attributes?.child_price, adultPrice);
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
    if (bookingType === "transport") return vehiclePrice;
    if (bookingType === "tour" || bookingType === "attraction") {
      if (adultPrice === null && childPrice === null) return null;
      return (adultPrice || 0) * adults + (childPrice || 0) * children;
    }

    return null;
  }, [adultPrice, bookingType, childPrice, children, adults, vehiclePrice]);

  const resetSubmitKey = () => {
    idempotencyKeyRef.current = null;
  };

  const setFieldRef = (name: string) => (element: HTMLInputElement | HTMLTextAreaElement | null) => {
    fieldRefs.current[name] = element;
  };

  const updateText =
    (setter: (value: string) => void) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(event.target.value);
      resetSubmitKey();
    };

  const updateNumber = (setter: (value: number) => void, min: number) => (item: { value: string }) => {
    setter(Math.max(min, Number(item.value || min)));
    resetSubmitKey();
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};
    const normalizedPhone = normalizePhone(customerPhone);

    if (!product?.id) nextErrors.form = "Không tìm thấy dịch vụ để booking.";
    if (!startDate) nextErrors.start_date = "Vui lòng chọn ngày sử dụng.";
    if (bookingType === "hotel" && !endDate) nextErrors.end_date = "Vui lòng chọn ngày trả phòng.";
    if ((bookingType === "tour" || bookingType === "attraction") && adults + children < 1) {
      nextErrors.adults = "Vui lòng chọn ít nhất một khách.";
    }
    if (bookingType === "transport") {
      if (!pickupLocation.trim()) nextErrors.pickup_location = "Vui lòng nhập điểm đón.";
      if (!dropoffLocation.trim()) nextErrors.dropoff_location = "Vui lòng nhập điểm trả.";
      if (passengers < 1) nextErrors.passengers = "Vui lòng nhập số hành khách.";
    }
    if (!customerName.trim()) nextErrors.customer_name = "Vui lòng nhập họ tên.";
    if (!customerEmail.trim()) {
      nextErrors.customer_email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      nextErrors.customer_email = "Email không đúng định dạng.";
    }
    if (!normalizedPhone) {
      nextErrors.customer_phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^(0[0-9]{9,10}|\+84[0-9]{9,10})$/.test(normalizedPhone)) {
      nextErrors.customer_phone = "Số điện thoại Việt Nam không hợp lệ.";
    }

    setFieldErrors(nextErrors);

    const firstKey = Object.keys(nextErrors).find((key) => key !== "form");
    if (firstKey) {
      window.requestAnimationFrame(() => fieldRefs.current[firstKey]?.focus());
    }

    return Object.keys(nextErrors).length === 0;
  };

  const applyBackendErrors = (err: unknown) => {
    if (!(err instanceof ApiError) || !err.errors) return false;

    const mapped: FieldErrors = {};
    Object.entries(err.errors).forEach(([key, messages]) => {
      const localKey = key.replace("booking_details.", "");
      mapped[localKey] = messages[0] || "Dữ liệu chưa hợp lệ.";
    });
    setFieldErrors(mapped);

    const firstKey = Object.keys(mapped)[0];
    if (firstKey) {
      window.requestAnimationFrame(() => fieldRefs.current[firstKey]?.focus());
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    setError("");
    setMessage("");
    if (!validate() || !product?.id) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    idempotencyKeyRef.current ||= createIdempotencyKey("booking");

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

    const typedPayload =
      bookingType === "transport"
        ? {
            ...basePayload,
            quantity: passengers,
            booking_details: {
              pickup_location: pickupLocation.trim(),
              dropoff_location: dropoffLocation.trim(),
              vehicle_type: vehicleType.trim(),
              passengers,
            },
          }
        : bookingType === "hotel"
          ? {
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
            }
          : bookingType === "tee_time"
            ? {
                ...basePayload,
                quantity: golfers,
                booking_details: { golfers },
              }
            : {
                ...basePayload,
                adults,
                children,
                quantity: Math.max(1, adults + children),
              };

    try {
      const response = await createBooking(typedPayload);
      idempotencyKeyRef.current = null;
      setMessage(`Đã gửi booking thành công. Mã booking: ${response.data?.booking_code || ""}`);
    } catch (err) {
      if (!applyBackendErrors(err)) {
        setError(err instanceof Error ? err.message : "Không gửi được booking, vui lòng thử lại.");
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const renderError = (name: string) =>
    fieldErrors[name] ? <p style={errorStyle}>{fieldErrors[name]}</p> : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h4 className="tg-tour-about-title title-2 mb-15">Đặt dịch vụ</h4>

      <div className="tg-booking-form-parent-inner mb-10">
        <div className="tg-tour-about-date p-relative">
          <input
            ref={setFieldRef("start_date")}
            className="input"
            name="start_date"
            type="date"
            value={startDate}
            onChange={updateText(setStartDate)}
            style={fieldStyle}
            aria-invalid={Boolean(fieldErrors.start_date)}
          />
          <span className="calender">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1111 1V3.80003M4.88888 1V3.80003M1 6.59992H15M2.55556 2.39988H13.4444C14.3036 2.39988 15 3.02668 15 3.79989V13.6C15 14.3732 14.3036 15 13.4444 15H2.55556C1.69645 15 1 14.3732 1 13.6V3.79989C1 3.02668 1.69645 2.39988 2.55556 2.39988Z" stroke="#e6c770" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="angle"><i className="fa-sharp fa-solid fa-angle-down"></i></span>
        </div>
        {renderError("start_date")}
      </div>

      {bookingType === "hotel" && (
        <div className="tg-booking-form-parent-inner mb-10">
          <input
            ref={setFieldRef("end_date")}
            className="input"
            name="end_date"
            type="date"
            value={endDate}
            onChange={updateText(setEndDate)}
            style={fieldStyle}
            aria-invalid={Boolean(fieldErrors.end_date)}
          />
          {renderError("end_date")}
        </div>
      )}

      {bookingType !== "consultation" && (
        <div className="tg-tour-about-time d-flex align-items-center mb-10">
          <span className="time">{bookingType === "tee_time" ? "Tee time:" : "Time:"}</span>

          <div className="form-check mr-15">
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
            <label className="form-check-label" htmlFor="time1">12:00</label>
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
            <label className="form-check-label" htmlFor="time2">19:00</label>
          </div>
        </div>
      )}

      <div className="tg-tour-about-border-doted mb-15"></div>

      {(bookingType === "tour" || bookingType === "attraction") && (
        <div className="tg-tour-about-tickets-wrap mb-15">
          <span className="tg-tour-about-sidebar-title">Tickets:</span>
          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Người lớn</span>
              <p className="mb-0"><span>{formatPrice(adultPrice)}</span></p>
            </div>
            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect className="select item-first" options={positiveQuantityOptions} defaultCurrent={0} onChange={updateNumber(setAdults, 1)} name="adults" placeholder="" />
            </div>
          </div>
          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Trẻ em</span>
              <p className="mb-0"><span>{formatPrice(childPrice)}</span></p>
            </div>
            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect className="select item-first" options={quantityOptions} defaultCurrent={0} onChange={updateNumber(setChildren, 0)} name="children" placeholder="" />
            </div>
          </div>
          {renderError("adults")}
        </div>
      )}

      {bookingType === "transport" && (
        <div className="tg-tour-about-extra mb-15">
          <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">Thông tin đưa đón:</span>
          <div className="tg-filter-list">
            <ul>
              <li>
                <input ref={setFieldRef("pickup_location")} style={fieldStyle} value={pickupLocation} onChange={updateText(setPickupLocation)} placeholder="Điểm đón *" />
                {renderError("pickup_location")}
              </li>
              <li>
                <input ref={setFieldRef("dropoff_location")} style={fieldStyle} value={dropoffLocation} onChange={updateText(setDropoffLocation)} placeholder="Điểm trả *" />
                {renderError("dropoff_location")}
              </li>
              <li>
                <input style={fieldStyle} value={vehicleType} onChange={updateText(setVehicleType)} placeholder="Loại xe" />
              </li>
            </ul>
          </div>
          <div className="tg-tour-about-tickets mt-10">
            <div className="tg-tour-about-tickets-adult">
              <span>Số hành khách</span>
              <p className="mb-0"><span>{formatPrice(vehiclePrice)}</span></p>
            </div>
            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect className="select item-first" options={positiveQuantityOptions} defaultCurrent={0} onChange={updateNumber(setPassengers, 1)} name="passengers" placeholder="" />
            </div>
          </div>
          {renderError("passengers")}
        </div>
      )}

      {bookingType === "hotel" && (
        <div className="tg-tour-about-extra mb-15">
          <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">Thông tin phòng:</span>
          <div className="tg-filter-list">
            <ul>
              <li><input style={fieldStyle} value={roomType} onChange={updateText(setRoomType)} placeholder="Loại phòng" /></li>
            </ul>
          </div>
          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult"><span>Số phòng</span></div>
            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect className="select item-first" options={positiveQuantityOptions} defaultCurrent={0} onChange={updateNumber(setRooms, 1)} name="rooms" placeholder="" />
            </div>
          </div>
        </div>
      )}

      {bookingType === "tee_time" && (
        <div className="tg-tour-about-tickets-wrap mb-15">
          <span className="tg-tour-about-sidebar-title">Golfer:</span>
          <div className="tg-tour-about-tickets mb-10">
            <div className="tg-tour-about-tickets-adult"><span>Số golfer</span></div>
            <div className="tg-tour-about-tickets-quantity">
              <NiceSelect className="select item-first" options={positiveQuantityOptions} defaultCurrent={0} onChange={updateNumber(setGolfers, 1)} name="golfers" placeholder="" />
            </div>
          </div>
        </div>
      )}

      <div className="tg-tour-about-border-doted mb-15"></div>
      <div className="tg-tour-about-extra mb-10">
        <span className="tg-tour-about-sidebar-title mb-10 d-inline-block">Thông tin khách hàng:</span>
        <div className="tg-filter-list">
          <ul>
            <li>
              <input ref={setFieldRef("customer_name")} style={fieldStyle} value={customerName} onChange={updateText(setCustomerName)} placeholder="Họ tên *" />
              {renderError("customer_name")}
            </li>
            <li>
              <input ref={setFieldRef("customer_email")} style={fieldStyle} type="email" value={customerEmail} onChange={updateText(setCustomerEmail)} placeholder="Email *" />
              {renderError("customer_email")}
            </li>
            <li>
              <input ref={setFieldRef("customer_phone")} style={fieldStyle} value={customerPhone} onChange={updateText(setCustomerPhone)} placeholder="Số điện thoại *" />
              {renderError("customer_phone")}
            </li>
            <li>
              <textarea style={{ ...fieldStyle, minHeight: "78px" }} value={customerNote} onChange={updateText(setCustomerNote)} placeholder={bookingType === "consultation" ? "Nội dung yêu cầu" : "Ghi chú"} rows={3}></textarea>
            </li>
          </ul>
        </div>
      </div>

      <div className="tg-tour-about-border-doted mb-15"></div>
      <div className="tg-tour-about-time d-flex align-items-center mb-10">
        <span className="time">Thanh toán:</span>
        <div className="form-check mr-15">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="pay-cash"
            checked={paymentMethod === "cash"}
            onChange={() => {
              setPaymentMethod("cash");
              resetSubmitKey();
            }}
          />
          <label className="form-check-label" htmlFor="pay-cash">Tiền mặt</label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="pay-bank"
            checked={paymentMethod === "bank_transfer"}
            onChange={() => {
              setPaymentMethod("bank_transfer");
              resetSubmitKey();
            }}
          />
          <label className="form-check-label" htmlFor="pay-bank">Chuyển khoản</label>
        </div>
      </div>

      <div className="tg-tour-about-border-doted mb-15"></div>
      <div className="tg-tour-about-coast d-flex align-items-center flex-wrap justify-content-between mb-20">
        <span className="tg-tour-about-sidebar-title d-inline-block">Tổng tạm tính:</span>
        <h5 className="total-price">{formatPrice(totalPrice)}</h5>
      </div>
      {fieldErrors.form && <p className="form_error">{fieldErrors.form}</p>}
      {message && <p className="text-success">{message}</p>}
      {error && <p className="form_error">{error}</p>}
      <button type="submit" disabled={isSubmitting || !product?.id} className="tg-btn tg-btn-switch-animation w-100">
        {isSubmitting ? "Đang gửi..." : "Gửi booking"}
      </button>
    </form>
  );
};

export default FeatureSidebar;
