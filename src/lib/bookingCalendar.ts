import type { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";

export type BookingCalendarVariant = "hero" | "sidebar";

export function applyBookingCalendarVariant(
  instance: FlatpickrInstance,
  variant: BookingCalendarVariant,
) {
  const calendar = instance.calendarContainer;

  calendar.classList.remove(
    "booking-compact-calendar",
    "booking-calendar--hero",
    "booking-calendar--sidebar",
  );

  calendar.classList.add(
    "booking-calendar",
    `booking-calendar--${variant}`,
  );
}