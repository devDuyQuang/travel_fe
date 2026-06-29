"use client";

import { useEffect, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import { Vietnamese } from "flatpickr/dist/l10n/vn";
import { useRouter } from "next/navigation";

import {
  applyBookingCalendarVariant,
  toggleBookingCalendar,
} from "@/lib/bookingCalendar";
import type { ServiceSearchLabels } from "@/types/service-layout";
import type { CmsServiceCategory } from "@/types/cms-post";
import type { ServiceLayoutConfig } from "@/lib/serviceLayoutRegistry";
import {
  fallbackServiceCategories,
  getServiceLayoutConfig,
} from "@/lib/serviceLayoutRegistry";

import styles from "./BannerFormTwo.module.css";

type QueryConfig = ServiceLayoutConfig["searchQuery"];

type Props = {
  category?: CmsServiceCategory;
  labels?: ServiceSearchLabels;
  query?: QueryConfig;
  buttonLabel?: string;
};

const serviceLocations: Record<string, string[]> = {
  tee_time: [
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Quảng Ninh",
    "Hải Phòng",
    "Hải Dương",
    "Bắc Ninh",
    "Vĩnh Phúc",
    "Hòa Bình",
    "Ninh Bình",
    "Thanh Hóa",
    "Nghệ An",
    "Thừa Thiên Huế",
    "Quảng Nam",
    "Khánh Hòa",
    "Lâm Đồng",
    "Bình Thuận",
    "Bà Rịa - Vũng Tàu",
    "Đồng Nai",
    "Bình Dương",
    "Long An",
    "Cần Thơ",
    "Kiên Giang",
  ],

  tour: [
    "Hà Nội",
    "Hạ Long",
    "Sapa",
    "Ninh Bình",
    "Đà Nẵng",
    "Hội An",
    "Nha Trang",
    "Đà Lạt",
    "Phú Quốc",
    "TP. Hồ Chí Minh",
  ],

  accommodation: [
    "Hà Nội",
    "Hạ Long",
    "Đà Nẵng",
    "Hội An",
    "Nha Trang",
    "Đà Lạt",
    "Phan Thiết",
    "Vũng Tàu",
    "Phú Quốc",
    "TP. Hồ Chí Minh",
  ],

  transport: [
    "Sân bay Nội Bài",
    "Sân bay Tân Sơn Nhất",
    "Sân bay Đà Nẵng",
    "Hà Nội",
    "TP. Hồ Chí Minh",
    "Đà Nẵng",
    "Hội An",
    "Nha Trang",
    "Đà Lạt",
    "Phú Quốc",
  ],

  attraction: [
    "Hà Nội",
    "Hạ Long",
    "Ninh Bình",
    "Huế",
    "Đà Nẵng",
    "Hội An",
    "Nha Trang",
    "Đà Lạt",
    "TP. Hồ Chí Minh",
    "Phú Quốc",
  ],
};

function formatDate(value: Date | undefined, includeTime = false) {
  if (!value) {
    return "";
  }

  const pad = (number: number) => String(number).padStart(2, "0");

  const date = `${value.getFullYear()}-${pad(
    value.getMonth() + 1,
  )}-${pad(value.getDate())}`;

  return includeTime
    ? `${date}T${pad(value.getHours())}:${pad(value.getMinutes())}`
    : date;
}

const BannerFormTwo = (props: Props) => {
  const fallbackCategory: CmsServiceCategory = {
    ...fallbackServiceCategories[1],
  };

  const category = props.category || fallbackCategory;
  const fallbackConfig = getServiceLayoutConfig(category.layout_key);

  const labels = props.labels || fallbackConfig.searchLabels;
  const query = props.query || fallbackConfig.searchQuery;
  const buttonLabel = props.buttonLabel || "Tìm kiếm";

  const router = useRouter();

  const locationRef = useRef<HTMLDivElement>(null);
  const startPickerRef = useRef<InstanceType<typeof Flatpickr> | null>(null);

  const endPickerRef = useRef<InstanceType<typeof Flatpickr> | null>(null);

  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState(1);

  const locations =
    serviceLocations[String(category.layout_key || "tee_time")] ||
    serviceLocations.tee_time;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setLocationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStartDateChange = (dates: Date[]) => {
    const selectedDate = dates[0];

    setStartDate(selectedDate);

    if (selectedDate && endDate && endDate.getTime() < selectedDate.getTime()) {
      setEndDate(undefined);
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (location.trim()) {
      params.set(query.location, location.trim());
    }

    const formattedStart = formatDate(
      startDate,
      query.startDateMode === "datetime",
    );

    if (formattedStart) {
      params.set(query.startDate, formattedStart);
    }

    const formattedEnd = formatDate(endDate);

    if (query.endDate && formattedEnd) {
      params.set(query.endDate, formattedEnd);
    }

    if (guests > 0) {
      params.set(query.guests, String(guests));
    }

    const search = params.toString();

    router.push(`/dich-vu/${category.slug}${search ? `?${search}` : ""}`);
  };

  return (
    <form className={styles.homeBookingForm} onSubmit={submit}>
      <div className="tg-booking-form-input-group golfnity-home-search d-flex align-items-end justify-content-between">
        <div className="tg-booking-form-parent-inner tg-hero-quantity p-relative mb-10">
          <span className="tg-booking-form-title mb-5">{labels.location}:</span>

          <div
            ref={locationRef}
            className={`tg-booking-add-input-field home-location-select ${
              locationOpen ? "is-open" : ""
            }`}
            onClick={() => setLocationOpen((value) => !value)}
          >
            <span
              className={`home-location-value ${
                location ? "" : "is-placeholder"
              }`}
            >
              {location || labels.locationPlaceholder}
            </span>

            <span className="location" aria-hidden="true">
              <i className="fa-regular fa-location-dot" />
            </span>

            {locationOpen && (
              <div className="home-location-menu">
                {locations.map((item) => (
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

        <div className="tg-booking-form-parent-inner mb-10">
          <span className="tg-booking-form-title mb-5">
            {labels.startDate}:
          </span>

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
              value={startDate}
              onChange={handleStartDateChange}
              options={{
                clickOpens: false,
                allowInput: false,
                dateFormat:
                  query.startDateMode === "datetime" ? "d/m/Y H:i" : "d/m/Y",
                disableMobile: true,
                enableTime: query.startDateMode === "datetime",
                time_24hr: true,
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
              placeholder="Chọn ngày"
              aria-label={labels.startDate}
              readOnly
            />
          </div>
        </div>

        {labels.endDate && (
          <div className="tg-booking-form-parent-inner mb-10">
            <span className="tg-booking-form-title mb-5">
              {labels.endDate}:
            </span>

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
                value={endDate}
                onChange={(dates) => setEndDate(dates[0])}
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
                placeholder="Chọn ngày"
                aria-label={labels.endDate}
                readOnly
              />
            </div>
          </div>
        )}

        <div className="tg-booking-form-parent-inner tg-hero-quantity p-relative mb-10">
          <span className="tg-booking-form-title mb-5">{labels.guests}:</span>

          <div className="tg-booking-add-input-field">
            <input
              className="input home-guests-input border-0 bg-transparent w-100"
              type="number"
              min="1"
              value={guests}
              onChange={(event) => {
                setGuests(Math.max(1, Number(event.target.value) || 1));
              }}
              aria-label={labels.guests}
            />

            <span className="location" aria-hidden="true">
              <i className="fa-regular fa-user" />
            </span>
          </div>
        </div>

        <div className="tg-booking-form-search-btn mb-10">
          <button className="bk-search-button" type="submit">
            {buttonLabel}

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
