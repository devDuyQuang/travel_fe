"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useRouter } from "next/navigation";

import {
  buildServiceSearchHref,
  normalizeBookingSearchValues,
  readBookingSearchValues,
  searchBookingTypeFromLayout,
  type BookingSearchValues,
  type SearchBookingType,
} from "@/lib/bookingSearchParams";
import type { ServiceLayoutKey } from "@/lib/serviceLayoutRegistry";
import {
  notifyBookingSearchChanged,
  useBrowserSearchParams,
} from "@/hooks/useBrowserSearchParams";

import DateRangePicker from "./DateRangePicker";
import GuestPicker from "./GuestPicker";
import GuestRoomPicker from "./GuestRoomPicker";
import PassengerPicker from "./PassengerPicker";
import SingleDatePicker from "./SingleDatePicker";
import TimePicker from "./TimePicker";
import styles from "./ServiceSearchBar.module.css";

type ServiceSearchBarProps = {
  categorySlug: string;
  layoutKey?: ServiceLayoutKey | string | null;
  buttonLabel?: string;
};

const defaultLocations: Record<SearchBookingType, string> = {
  hotel: "Đà Nẵng",
  tour: "Nha Trang",
  transport: "Sân bay Đà Nẵng",
  attraction: "Hội An",
  tee_time: "Tân Sơn Nhất",
};

const serviceSuggestions: Record<SearchBookingType, string[]> = {
  tee_time: [
    "Tân Sơn Nhất",
    "Long Thành",
    "Thủ Đức",
    "Đà Nẵng Golf Club",
  ],
  tour: ["Nha Trang", "Đà Nẵng", "Đà Lạt", "Phú Quốc"],
  hotel: ["Đà Nẵng", "Nha Trang", "Hội An", "Phú Quốc"],
  transport: ["Sân bay Đà Nẵng", "Hội An", "Nha Trang", "TP.HCM"],
  attraction: ["Hội An", "Bà Nà Hills", "VinWonders", "Phố cổ Hội An"],
};

const gridColumns: Record<SearchBookingType, string> = {
  hotel:
    "minmax(170px,1fr) minmax(230px,1.25fr) minmax(250px,1.25fr) 150px",
  tour: "minmax(210px,1fr) minmax(180px,1fr) minmax(240px,1fr) 150px",
  attraction:
    "minmax(210px,1fr) minmax(180px,1fr) minmax(240px,1fr) 150px",
  tee_time:
    "minmax(190px,1fr) minmax(165px,.9fr) minmax(130px,.7fr) minmax(170px,.9fr) 150px",
  transport:
    "minmax(150px,1fr) minmax(140px,1fr) minmax(145px,.85fr) minmax(115px,.7fr) minmax(145px,.85fr) 150px",
};

const ServiceSearchBar = ({
  categorySlug,
  layoutKey,
  buttonLabel = "Tìm kiếm",
}: ServiceSearchBarProps) => {
  const router = useRouter();
  const searchParams = useBrowserSearchParams();
  const type = searchBookingTypeFromLayout(layoutKey);
  const locationRef = useRef<HTMLLabelElement>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const initialValues = useMemo(
    () =>
      normalizeBookingSearchValues(
        type,
        readBookingSearchValues(searchParams),
      ),
    [searchParams, type],
  );

  const [location, setLocation] = useState(
    initialValues.course_location ||
      initialValues.location ||
      initialValues.destination ||
      "",
  );
  const [pickupLocation, setPickupLocation] = useState(
    initialValues.pickup_location || "",
  );
  const [dropoffLocation, setDropoffLocation] = useState(
    initialValues.dropoff_location || "",
  );
  const [checkIn, setCheckIn] = useState(initialValues.check_in || "");
  const [checkOut, setCheckOut] = useState(initialValues.check_out || "");
  const [startDate, setStartDate] = useState(initialValues.start_date || "");
  const [pickupDate, setPickupDate] = useState(
    initialValues.pickup_date || "",
  );
  const [pickupTime, setPickupTime] = useState(
    initialValues.pickup_time || "",
  );
  const [visitDate, setVisitDate] = useState(initialValues.visit_date || "");
  const [playDate, setPlayDate] = useState(initialValues.play_date || "");
  const [playTime, setPlayTime] = useState(initialValues.play_time || "");
  const [rooms, setRooms] = useState(initialValues.rooms || 1);
  const [adults, setAdults] = useState(initialValues.adults || 1);
  const [children, setChildren] = useState(initialValues.children || 0);
  const [passengers, setPassengers] = useState(
    initialValues.passengers || 1,
  );
  const [golfers, setGolfers] = useState(initialValues.golfers || 1);

  useEffect(() => {
    setLocation(
      initialValues.course_location ||
        initialValues.location ||
        initialValues.destination ||
        "",
    );
    setPickupLocation(initialValues.pickup_location || "");
    setDropoffLocation(initialValues.dropoff_location || "");
    setCheckIn(initialValues.check_in || "");
    setCheckOut(initialValues.check_out || "");
    setStartDate(initialValues.start_date || "");
    setPickupDate(initialValues.pickup_date || "");
    setPickupTime(initialValues.pickup_time || "");
    setVisitDate(initialValues.visit_date || "");
    setPlayDate(initialValues.play_date || "");
    setPlayTime(initialValues.play_time || "");
    setRooms(initialValues.rooms || 1);
    setAdults(initialValues.adults || 1);
    setChildren(initialValues.children ?? 0);
    setPassengers(initialValues.passengers || 1);
    setGolfers(initialValues.golfers || 1);
  }, [initialValues]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setSuggestionsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentValues: BookingSearchValues = {
    location,
    course_location: location,
    destination: location,
    pickup_location: pickupLocation,
    dropoff_location: dropoffLocation,
    check_in: checkIn,
    check_out: checkOut,
    start_date: startDate,
    pickup_date: pickupDate,
    pickup_time: pickupTime,
    visit_date: visitDate,
    play_date: playDate,
    play_time: playTime,
    rooms,
    adults,
    children,
    passengers,
    golfers,
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    router.push(buildServiceSearchHref(categorySlug, type, currentValues));
    notifyBookingSearchChanged();
  };

  const keywordLabel =
    type === "hotel"
      ? "Địa điểm"
      : type === "transport"
        ? "Điểm đón"
        : type === "tee_time"
          ? "Sân golf / khu vực"
          : "Điểm đến";

  return (
    <div>
      <form className={styles.searchForm} onSubmit={submit}>
        <div
          className={styles.grid}
          style={
            {
              "--service-search-columns": gridColumns[type],
            } as CSSProperties
          }
        >
          {type === "transport" ? (
            <>
              <label className={styles.field} ref={locationRef}>
                <span className={styles.label}>Điểm đón</span>
                <span className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={pickupLocation}
                    onChange={(event) => setPickupLocation(event.target.value)}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Nhập điểm đón"
                  />
                  <i className={`fa-regular fa-location-dot ${styles.icon}`} />
                </span>
                {suggestionsOpen && (
                  <div className={styles.suggestionMenu}>
                    {serviceSuggestions.transport.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setPickupLocation(item);
                          setSuggestionsOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Điểm trả</span>
                <span className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={dropoffLocation}
                    onChange={(event) => setDropoffLocation(event.target.value)}
                    placeholder="Nhập điểm trả"
                  />
                  <i className={`fa-regular fa-location-dot ${styles.icon}`} />
                </span>
              </label>

              <SingleDatePicker
                label="Ngày đón"
                value={pickupDate}
                onChange={setPickupDate}
              />

              <TimePicker
                label="Giờ đón"
                value={pickupTime}
                onChange={setPickupTime}
              />

              <PassengerPicker
                label="Số hành khách"
                value={passengers}
                onChange={setPassengers}
              />
            </>
          ) : (
            <>
              <label className={styles.field} ref={locationRef}>
                <span className={styles.label}>{keywordLabel}</span>
                <span className={styles.inputWrap}>
                  <input
                    className={styles.input}
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder={defaultLocations[type]}
                  />
                  <i className={`fa-regular fa-location-dot ${styles.icon}`} />
                </span>
                {suggestionsOpen && (
                  <div className={styles.suggestionMenu}>
                    {serviceSuggestions[type].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setLocation(item);
                          setSuggestionsOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </label>

              {type === "hotel" && (
                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={setCheckIn}
                  onCheckOutChange={setCheckOut}
                />
              )}

              {type === "tour" && (
                <SingleDatePicker
                  label="Ngày khởi hành"
                  value={startDate}
                  onChange={setStartDate}
                />
              )}

              {type === "attraction" && (
                <SingleDatePicker
                  label="Ngày tham quan"
                  value={visitDate}
                  onChange={setVisitDate}
                />
              )}

              {type === "tee_time" && (
                <>
                  <SingleDatePicker
                    label="Ngày chơi"
                    value={playDate}
                    onChange={setPlayDate}
                  />

                  <TimePicker
                    label="Giờ chơi"
                    value={playTime}
                    onChange={setPlayTime}
                  />
                </>
              )}

              {type === "hotel" ? (
                <GuestRoomPicker
                  rooms={rooms}
                  adults={adults}
                  children={children}
                  onRoomsChange={setRooms}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                />
              ) : type === "tee_time" ? (
                <PassengerPicker
                  label="Số golfer"
                  value={golfers}
                  onChange={setGolfers}
                />
              ) : (
                <GuestPicker
                  adults={adults}
                  children={children}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                />
              )}
            </>
          )}

          <button className={styles.submit} type="submit">
            {buttonLabel}
            <i className="fa-regular fa-magnifying-glass" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceSearchBar;
