"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./ServiceSearchBar.module.css";

type GuestRoomPickerProps = {
  rooms: number;
  adults: number;
  children: number;
  onRoomsChange: (value: number) => void;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
};

function clamp(value: number, min: number) {
  return Math.max(min, value);
}

const GuestRoomPicker = ({
  rooms,
  adults,
  children,
  onRoomsChange,
  onAdultsChange,
  onChildrenChange,
}: GuestRoomPickerProps) => {
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
    {
      label: "Số phòng",
      value: rooms,
      min: 1,
      onChange: onRoomsChange,
    },
  ];

  return (
    <div className={styles.field} ref={ref}>
      <span className={styles.label}>Khách & phòng</span>
      <button
        className={`${styles.inputWrap} ${styles.buttonInput}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        {adults} người lớn, {children} trẻ em, {rooms} phòng
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
                  onClick={() => row.onChange(clamp(row.value - 1, row.min))}
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

export default GuestRoomPicker;
