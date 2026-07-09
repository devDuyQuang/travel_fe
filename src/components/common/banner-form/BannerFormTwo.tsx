"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { useRouter } from "next/navigation";

import {
  applyBookingCalendarVariant,
  toggleBookingCalendar,
} from "@/lib/bookingCalendar";
import {
  buildServiceSearchHref,
  formatSearchDate,
  formatSearchDateRange,
  normalizeBookingSearchValues,
  readBookingSearchValues,
  searchBookingTypeFromLayout,
  type BookingSearchValues,
  type SearchBookingType,
} from "@/lib/bookingSearchParams";
import type { ServiceSearchLabels } from "@/types/service-layout";
import type { CmsServiceCategory } from "@/types/cms-post";
import {
  defaultServiceLayoutKey,
  fallbackServiceCategories,
  getServiceLayoutConfig,
  isServiceLayoutKey,
  type ServiceLayoutConfig,
  type ServiceLayoutKey,
} from "@/lib/serviceLayoutRegistry";
import {
  notifyBookingSearchChanged,
  useBrowserSearchParams,
} from "@/hooks/useBrowserSearchParams";

import styles from "./BannerFormTwo.module.css";

type QueryConfig = ServiceLayoutConfig["searchQuery"];

type Props = {
  category?: CmsServiceCategory;
  labels?: ServiceSearchLabels;
  layoutKey?: ServiceLayoutKey | string | null;
  categorySlug?: string;
  query?: QueryConfig;
  buttonLabel?: string;
};

const layoutDefaultSlugs: Record<ServiceLayoutKey, string> = {
  tee_time: "dat-tee-time",
  tour: "tour-golf-viet-nam",
  accommodation: "khach-san-nghi-duong",
  transport: "thue-xe-dua-don",
  attraction: "tham-quan-trai-nghiem",
};

const serviceSuggestions: Record<SearchBookingType, string[]> = {
  tee_time: [
    "Tân Sơn Nhất",
    "Long Thành",
    "Đà Nẵng Golf",
    "BRG Đà Nẵng",
  ],
  tour: [
    "Nha Trang Golf Tour",
    "Đà Nẵng Golf Tour",
    "Phú Quốc Golf Tour",
  ],
  hotel: ["Đà Nẵng", "Nha Trang", "Hội An", "Phú Quốc"],
  transport: ["Sân bay Đà Nẵng", "Hội An", "Nha Trang", "Tân Sơn Nhất"],
  attraction: ["Phố cổ Hội An", "Bà Nà Hills", "Ngũ Hành Sơn"],
};

function formatIsoDate(date?: Date): string {
  if (!date) {
    return "";
  }

  const pad = (number: number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

function parseIsoDate(value?: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

const BannerFormTwo = ({
  category,
  labels,
  layoutKey,
  categorySlug,
  buttonLabel,
}: Props) => {
  const fallbackCategory: CmsServiceCategory = {
    ...fallbackServiceCategories[1],
  };
  const resolvedLayout = isServiceLayoutKey(layoutKey)
    ? layoutKey
    : isServiceLayoutKey(category?.layout_key)
      ? category.layout_key
      : defaultServiceLayoutKey;
  const activeCategory = category || {
    ...fallbackCategory,
    layout_key: resolvedLayout,
    slug: layoutDefaultSlugs[resolvedLayout],
  };
  const layoutConfig = getServiceLayoutConfig(resolvedLayout);
  const searchLabels = labels || layoutConfig.searchLabels;
  const type = searchBookingTypeFromLayout(resolvedLayout);
  const router = useRouter();
  const searchParams = useBrowserSearchParams();

  const locationRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLDivElement>(null);
  const startPickerRef = useRef<InstanceType<typeof Flatpickr> | null>(null);
  const endPickerRef = useRef<InstanceType<typeof Flatpickr> | null>(null);
  const timePickerRef = useRef<InstanceType<typeof Flatpickr> | null>(null);

  const initialValues = useMemo(
    () =>
      normalizeBookingSearchValues(
        type,
        readBookingSearchValues(searchParams),
      ),
    [searchParams, type],
  );

  const [location, setLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [quantityOpen, setQuantityOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const [golfers, setGolfers] = useState(1);

  useEffect(() => {
    setLocation(
      initialValues.course_location ||
        initialValues.location ||
        initialValues.destination ||
        initialValues.pickup_location ||
        "",
    );
    setDropoffLocation(initialValues.dropoff_location || "");
    setStartDate(
      initialValues.check_in ||
        initialValues.start_date ||
        initialValues.pickup_date ||
        initialValues.visit_date ||
        initialValues.play_date ||
        "",
    );
    setEndDate(initialValues.check_out || "");
    setStartTime(initialValues.pickup_time || initialValues.play_time || "");
    setRooms(initialValues.rooms || 1);
    setAdults(initialValues.adults || 1);
    setChildren(initialValues.children ?? 0);
    setPassengers(initialValues.passengers || 1);
    setGolfers(initialValues.golfers || 1);
  }, [initialValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setLocationOpen(false);
      }

      if (
        quantityRef.current &&
        !quantityRef.current.contains(event.target as Node)
      ) {
        setQuantityOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const quantityText = (() => {
    if (type === "hotel") {
      return `${adults} người lớn, ${children} trẻ em, ${rooms} phòng`;
    }

    if (type === "transport") {
      return `${passengers} hành khách`;
    }

    if (type === "tee_time") {
      return `${golfers} golfer`;
    }

    return `${adults} người lớn, ${children} trẻ em`;
  })();

  const adjust = (
    setter: (value: number) => void,
    value: number,
    delta: number,
    min = 1,
  ) => {
    setter(Math.max(min, value + delta));
  };

  const renderQuantityRow = (
    label: string,
    value: number,
    setter: (value: number) => void,
    min = 1,
  ) => (
    <div className="home-quantity-row" key={label}>
      <span>{label}</span>
      <div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            adjust(setter, value, -1, min);
          }}
        >
          -
        </button>
        <strong>{value}</strong>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            adjust(setter, value, 1, min);
          }}
        >
          +
        </button>
      </div>
    </div>
  );

  const startDateLabel = (() => {
    if (type === "hotel") {
      return formatSearchDateRange(startDate, endDate);
    }

    return startDate ? formatSearchDate(startDate) : "Chọn ngày";
  })();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values: BookingSearchValues = {
      location,
      course_location: location,
      destination: location,
      pickup_location: location,
      dropoff_location: dropoffLocation,
      check_in: startDate,
      check_out: endDate,
      start_date: startDate,
      pickup_date: startDate,
      pickup_time: startTime,
      visit_date: startDate,
      play_date: startDate,
      play_time: startTime,
      rooms,
      adults,
      children,
      passengers,
      golfers,
    };

    router.push(
      buildServiceSearchHref(
        categorySlug || activeCategory.slug || layoutDefaultSlugs[resolvedLayout],
        type,
        values,
      ),
    );
    notifyBookingSearchChanged();
  };

  const locationLabel =
    type === "hotel"
      ? "Địa điểm"
      : type === "transport"
        ? "Điểm đón"
        : type === "tee_time"
          ? "Sân golf / khu vực"
          : "Điểm đến";
  const dateLabel =
    type === "hotel"
      ? "Ngày lưu trú"
      : type === "transport"
        ? "Ngày đón"
        : type === "tee_time"
          ? "Ngày chơi"
          : searchLabels.startDate;
  const timeLabel = type === "tee_time" ? "Giờ chơi" : "Giờ đón";
  const quantityLabel =
    type === "hotel"
      ? "Khách & phòng"
      : type === "transport"
        ? "Số hành khách"
        : type === "tee_time"
          ? "Số golfer"
          : searchLabels.guests;

  const renderLocationField = () => (
    <div className="tg-booking-form-parent-inner tg-hero-quantity p-relative mr-15 mb-10">
      <span className="tg-booking-form-title mb-5">{locationLabel}</span>

      <div
        ref={locationRef}
        className={`tg-booking-add-input-field home-location-select ${
          locationOpen ? "is-open" : ""
        }`}
        onClick={() => setLocationOpen((value) => !value)}
      >
        <span className={`home-location-value ${location ? "" : "is-placeholder"}`}>
          {location || searchLabels.locationPlaceholder}
        </span>

        <span className="location" aria-hidden="true">
          <i className="fa-regular fa-location-dot" />
        </span>

        {locationOpen && (
          <div className="home-location-menu">
            {serviceSuggestions[type].map((item) => (
              <button
                key={item}
                type="button"
                className={item === location ? "is-active" : ""}
                onClick={(event) => {
                  event.stopPropagation();
                  setLocation(item);
                  setLocationOpen(false);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <form className={styles.homeBookingForm} onSubmit={submit}>
      <div className="tg-booking-form-input-group golfnity-home-search d-flex align-items-end justify-content-between">
        {renderLocationField()}

        {type === "transport" && (
          <div className="tg-booking-form-parent-inner tg-hero-quantity p-relative mr-15 mb-10">
            <span className="tg-booking-form-title mb-5">Điểm trả</span>

            <div className="tg-booking-add-input-field">
              <input
                className="input home-guests-input border-0 bg-transparent w-100"
                value={dropoffLocation}
                onChange={(event) => setDropoffLocation(event.target.value)}
                placeholder="Nhập điểm trả"
                aria-label="Điểm trả"
              />
              <span className="location" aria-hidden="true">
                <i className="fa-regular fa-location-dot" />
              </span>
            </div>
          </div>
        )}

        <div className="tg-booking-form-parent-inner mr-15 mb-10">
          <span className="tg-booking-form-title mb-5">{dateLabel}</span>

          <div
            className="tg-booking-add-input-date p-relative"
            onClick={() =>
              toggleBookingCalendar(
                startPickerRef.current,
                endPickerRef.current,
              )
            }
          >
            <span aria-hidden="true">
              <i className="fa-regular fa-calendar" />
            </span>

            <Flatpickr
              ref={startPickerRef}
              value={parseIsoDate(startDate)}
              onChange={(dates) => {
                const nextDate = formatIsoDate(dates[0]);

                setStartDate(nextDate);

                if (nextDate && endDate && endDate < nextDate) {
                  setEndDate("");
                }
              }}
              options={{
                clickOpens: false,
                allowInput: false,
                dateFormat: "d/m/Y",
                disableMobile: true,
                locale: Vietnamese,
                minDate: "today",
                monthSelectorType: "static",
                onOpen: (_selectedDates, _dateStr, instance) => {
                  applyBookingCalendarVariant(instance, "hero");
                },
                onReady: (_selectedDates, _dateStr, instance) => {
                  applyBookingCalendarVariant(instance, "hero");
                },
              }}
              className="input home-date-input"
              placeholder={startDateLabel}
              aria-label={dateLabel}
              readOnly
            />
          </div>
        </div>

        {type === "hotel" && (
          <div className="tg-booking-form-parent-inner mr-15 mb-10">
            <span className="tg-booking-form-title mb-5">Trả phòng</span>

            <div
              className="tg-booking-add-input-date p-relative"
              onClick={() =>
                toggleBookingCalendar(
                  endPickerRef.current,
                  startPickerRef.current,
                )
              }
            >
              <span aria-hidden="true">
                <i className="fa-regular fa-calendar" />
              </span>

              <Flatpickr
                ref={endPickerRef}
                value={parseIsoDate(endDate)}
                onChange={(dates) => setEndDate(formatIsoDate(dates[0]))}
                options={{
                  clickOpens: false,
                  allowInput: false,
                  dateFormat: "d/m/Y",
                  disableMobile: true,
                  locale: Vietnamese,
                  minDate: startDate || "today",
                  monthSelectorType: "static",
                  onOpen: (_selectedDates, _dateStr, instance) => {
                    applyBookingCalendarVariant(instance, "hero");
                  },
                  onReady: (_selectedDates, _dateStr, instance) => {
                    applyBookingCalendarVariant(instance, "hero");
                  },
                }}
                className="input home-date-input"
                placeholder={endDate ? formatSearchDate(endDate) : "Chọn ngày"}
                aria-label="Trả phòng"
                readOnly
              />
            </div>
          </div>
        )}

        {(type === "transport" || type === "tee_time") && (
          <div className="tg-booking-form-parent-inner mr-15 mb-10">
            <span className="tg-booking-form-title mb-5">{timeLabel}</span>

            <div
              className="tg-booking-add-input-date p-relative"
              onClick={() => timePickerRef.current?.flatpickr.open()}
            >
              <span aria-hidden="true">
                <i className="fa-regular fa-clock" />
              </span>

              <Flatpickr
                ref={timePickerRef}
                value={startTime}
                onChange={(_dates, dateStr) => setStartTime(dateStr)}
                options={{
                  clickOpens: false,
                  allowInput: false,
                  dateFormat: "H:i",
                  disableMobile: true,
                  enableTime: true,
                  noCalendar: true,
                  time_24hr: true,
                  onOpen: (_selectedDates, _dateStr, instance) => {
                    applyBookingCalendarVariant(instance, "hero");
                  },
                  onReady: (_selectedDates, _dateStr, instance) => {
                    applyBookingCalendarVariant(instance, "hero");
                  },
                }}
                className="input home-date-input"
                placeholder={startTime || "Chọn giờ"}
                aria-label={timeLabel}
                readOnly
              />
            </div>
          </div>
        )}

        <div
          className="tg-booking-form-parent-inner tg-hero-quantity p-relative mr-15 mb-10"
          ref={quantityRef}
        >
          <span className="tg-booking-form-title mb-5">{quantityLabel}</span>

          <div
            className="tg-booking-add-input-field home-location-select"
            onClick={() => setQuantityOpen((value) => !value)}
          >
            <span className="home-location-value">{quantityText}</span>

            <span className="location" aria-hidden="true">
              <i className="fa-regular fa-user" />
            </span>

            {quantityOpen && (
              <div className="home-location-menu home-quantity-menu">
                {type === "hotel" && (
                  <>
                    {renderQuantityRow("Người lớn", adults, setAdults)}
                    {renderQuantityRow("Trẻ em", children, setChildren, 0)}
                    {renderQuantityRow("Số phòng", rooms, setRooms)}
                  </>
                )}

                {(type === "tour" || type === "attraction") && (
                  <>
                    {renderQuantityRow("Người lớn", adults, setAdults)}
                    {renderQuantityRow("Trẻ em", children, setChildren, 0)}
                  </>
                )}

                {type === "transport" &&
                  renderQuantityRow("Số hành khách", passengers, setPassengers)}

                {type === "tee_time" &&
                  renderQuantityRow("Số golfer", golfers, setGolfers)}
              </div>
            )}
          </div>
        </div>

        <div className="tg-booking-form-search-btn mb-10">
          <button className="bk-search-button" type="submit">
            {buttonLabel || "Tìm kiếm"}

            <span className="home-search-icon" aria-hidden="true">
              <i className="fa-regular fa-magnifying-glass" />
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default BannerFormTwo;
