"use client";

import { useState } from "react";
import Flatpickr from "react-flatpickr";
import { useRouter } from "next/navigation";
import type { ServiceSearchLabels } from "@/types/service-layout";
import type { CmsServiceCategory } from "@/types/cms-post";
import type { ServiceLayoutConfig } from "@/lib/serviceLayoutRegistry";
import {
  fallbackServiceCategories,
  getServiceLayoutConfig,
} from "@/lib/serviceLayoutRegistry";

type QueryConfig = ServiceLayoutConfig["searchQuery"];

type Props = {
  category?: CmsServiceCategory;
  labels?: ServiceSearchLabels;
  query?: QueryConfig;
  buttonLabel?: string;
};

function formatDate(value: Date | undefined, includeTime = false) {
  if (!value) return "";
  const pad = (number: number) => String(number).padStart(2, "0");
  const date = `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  return includeTime ? `${date}T${pad(value.getHours())}:${pad(value.getMinutes())}` : date;
}

const BannerFormTwo = (props: Props) => {
  const fallbackCategory: CmsServiceCategory = { ...fallbackServiceCategories[1] };
  const category = props.category || fallbackCategory;
  const fallbackConfig = getServiceLayoutConfig(category.layout_key);
  const labels = props.labels || fallbackConfig.searchLabels;
  const query = props.query || fallbackConfig.searchQuery;
  const buttonLabel = props.buttonLabel || "Tìm kiếm";
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState(1);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set(query.location, location.trim());
    const formattedStart = formatDate(startDate, query.startDateMode === "datetime");
    if (formattedStart) params.set(query.startDate, formattedStart);
    const formattedEnd = formatDate(endDate);
    if (query.endDate && formattedEnd) params.set(query.endDate, formattedEnd);
    if (guests > 0) params.set(query.guests, String(guests));

    const search = params.toString();
    router.push(`/dich-vu/${category.slug}${search ? `?${search}` : ""}`);
  };

  return (
    <form onSubmit={submit}>
      <div
        className="tg-booking-form-input-group golfnity-home-search d-flex align-items-end justify-content-between"
        style={{ gap: 15 }}
      >
        <div
          className="tg-booking-form-parent-inner tg-hero-quantity p-relative mb-10"
          style={{ flex: "1 1 0", minWidth: 0 }}
        >
          <span className="tg-booking-form-title mb-5">{labels.location}:</span>
          <div className="tg-booking-add-input-field" style={{ width: "100%" }}>
            <input
              className="input border-0 bg-transparent w-100"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder={labels.locationPlaceholder}
              aria-label={labels.location}
            />
            <span className="location"><i className="fa-regular fa-location-dot"></i></span>
          </div>
        </div>

        <div
          className="tg-booking-form-parent-inner mb-10"
          style={{ flex: "1 1 0", minWidth: 0 }}
        >
          <span className="tg-booking-form-title mb-5">{labels.startDate}:</span>
          <div className="tg-booking-add-input-date p-relative">
            <span><i className="fa-regular fa-calendar"></i></span>
            <Flatpickr
              value={startDate}
              onChange={(dates) => setStartDate(dates[0])}
              options={{
                dateFormat: query.startDateMode === "datetime" ? "d/m/Y H:i" : "d/m/Y",
                enableTime: query.startDateMode === "datetime",
                minDate: "today",
              }}
              className="input"
              style={{ width: "100%" }}
              placeholder={query.startDateMode === "datetime" ? "dd/mm/yyyy hh:mm" : "dd/mm/yyyy"}
            />
          </div>
        </div>

        {labels.endDate && (
          <div
            className="tg-booking-form-parent-inner mb-10"
            style={{ flex: "1 1 0", minWidth: 0 }}
          >
            <span className="tg-booking-form-title mb-5">{labels.endDate}:</span>
            <div className="tg-booking-add-input-date p-relative">
              <span><i className="fa-regular fa-calendar"></i></span>
              <Flatpickr
                value={endDate}
                onChange={(dates) => setEndDate(dates[0])}
                options={{ dateFormat: "d/m/Y", minDate: startDate || "today" }}
                className="input"
                style={{ width: "100%" }}
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>
        )}

        <div
          className="tg-booking-form-parent-inner tg-hero-quantity p-relative mb-10"
          style={{ flex: "1 1 0", minWidth: 0 }}
        >
          <span className="tg-booking-form-title mb-5">{labels.guests}:</span>
          <div className="tg-booking-add-input-field" style={{ width: "100%" }}>
            <input
              className="input border-0 bg-transparent w-100"
              type="number"
              min="1"
              value={guests}
              onChange={(event) => setGuests(Math.max(1, Number(event.target.value) || 1))}
              aria-label={labels.guests}
            />
            <span className="location"><i className="fa-regular fa-user"></i></span>
          </div>
        </div>

        <div
          className="tg-booking-form-search-btn mb-10"
          style={{ flex: "0 0 190px" }}
        >
          <button
            className="bk-search-button"
            type="submit"
            style={{ width: "100%", paddingLeft: 20, paddingRight: 20 }}
          >
            {buttonLabel}
            <span className="ml-5"><i className="fa-regular fa-magnifying-glass"></i></span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default BannerFormTwo;
