"use client";

import { useEffect, useRef, useState } from "react";

import { formatSearchDate } from "@/lib/bookingSearchParams";

import styles from "./ServiceSearchBar.module.css";

type SingleDatePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const SingleDatePicker = ({
  label,
  value,
  onChange,
}: SingleDatePickerProps) => {
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
      <span className={styles.label}>{label}</span>
      <button
        className={`${styles.inputWrap} ${styles.buttonInput}`}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={!value ? styles.placeholder : ""}>
          {value ? formatSearchDate(value) : "Chọn ngày"}
        </span>
        <i className={`fa-regular fa-calendar ${styles.icon}`} />
      </button>

      {open && (
        <div className={styles.popover}>
          <label className={styles.popoverField}>
            <span className={styles.pickerTitle}>{label}</span>
            <input
              className={styles.popoverInput}
              type="date"
              value={value}
              onChange={(event) => onChange(event.target.value)}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default SingleDatePicker;
