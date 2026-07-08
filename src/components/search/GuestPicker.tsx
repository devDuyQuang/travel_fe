"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./ServiceSearchBar.module.css";

type GuestPickerProps = {
  adults: number;
  children: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
};

const GuestPicker = ({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
}: GuestPickerProps) => {
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

  const rows = [
    {
      label: "Người lớn",
      value: adults,
      min: 1,
      onChange: onAdultsChange,
    },
    {
      label: "Trẻ em",
      value: children,
      min: 0,
      onChange: onChildrenChange,
    },
  ];

  return (
    <div className={styles.field} ref={ref}>
      <span className={styles.label}>Số khách</span>
      <button
        className={`${styles.inputWrap} ${styles.buttonInput}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        {adults} người lớn, {children} trẻ em
        <i className={`fa-regular fa-user ${styles.icon}`} />
      </button>

      {open && (
        <div className={styles.popover}>
          {rows.map((row) => (
            <div className={styles.pickerRow} key={row.label}>
              <span className={styles.pickerTitle}>{row.label}</span>
              <span className={styles.stepper}>
                <button
                  type="button"
                  onClick={() => row.onChange(Math.max(row.min, row.value - 1))}
                >
                  -
                </button>
                <span>{row.value}</span>
                <button
                  type="button"
                  onClick={() => row.onChange(row.value + 1)}
                >
                  +
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestPicker;
