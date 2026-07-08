"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./ServiceSearchBar.module.css";

type PassengerPickerProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const PassengerPicker = ({ label, value, onChange }: PassengerPickerProps) => {
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
        {value} {label.toLowerCase()}
        <i className={`fa-regular fa-user ${styles.icon}`} />
      </button>

      {open && (
        <div className={styles.popover}>
          <div className={styles.pickerRow}>
            <span className={styles.pickerTitle}>{label}</span>
            <span className={styles.stepper}>
              <button
                type="button"
                onClick={() => onChange(Math.max(1, value - 1))}
              >
                -
              </button>
              <span>{value}</span>
              <button type="button" onClick={() => onChange(value + 1)}>
                +
              </button>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerPicker;
