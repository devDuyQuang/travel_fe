import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";

export type BookingCalendarVariant = "hero" | "sidebar";

type FlatpickrController = {
  flatpickr?: FlatpickrInstance;
};

export function applyBookingCalendarVariant(
  instance: FlatpickrInstance,
  variant: BookingCalendarVariant,
) {
  const calendar = instance.calendarContainer;

  calendar.classList.remove(
    "booking-compact-calendar",
    "booking-calendar",
    "booking-calendar--hero",
    "booking-calendar--sidebar",
  );

  calendar.classList.add(
    "booking-calendar",
    `booking-calendar--${variant}`,
  );
}

export function toggleBookingCalendar(
  target: FlatpickrController | null,
  other?: FlatpickrController | null,
) {
  const targetInstance = target?.flatpickr;
  const otherInstance = other?.flatpickr;

  if (!targetInstance) {
    return;
  }

  if (otherInstance?.isOpen) {
    otherInstance.close();
  }

  if (targetInstance.isOpen) {
    targetInstance.close();
    return;
  }

  targetInstance.open();
}