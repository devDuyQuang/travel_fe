"use client";

import { useEffect, useRef, useState } from "react";

import { formatSearchDateRange } from "@/lib/bookingSearchParams";

import styles from "./ServiceSearchBar.module.css";

type DateRangePickerProps = {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
};

const DateRangePicker = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={styles.field} ref={ref}>
      <span className={styles.label}>Ngày lưu trú</span>
      <button
        className={`${styles.inputWrap} ${styles.buttonInput}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={!checkIn && !checkOut ? styles.placeholder : ""}>
          {formatSearchDateRange(checkIn, checkOut)}
        </span>
        <i className={`fa-regular fa-calendar ${styles.icon}`} />
      </button>

      {open && (
        <div className={styles.popover}>
          <label className={styles.popoverField}>
            <span className={styles.pickerTitle}>Nhận phòng</span>
            <input
              className={styles.popoverInput}
              type="date"
              value={checkIn}
              onChange={(event) => onCheckInChange(event.target.value)}
            />
          </label>

          <label className={styles.popoverField}>
            <span className={styles.pickerTitle}>Trả phòng</span>
            <input
              className={styles.popoverInput}
              type="date"
              min={checkIn || undefined}
              value={checkOut}
              onChange={(event) => onCheckOutChange(event.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
