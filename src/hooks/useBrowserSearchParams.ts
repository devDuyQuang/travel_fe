"use client";

import { useEffect, useMemo, useState } from "react";

export function useBrowserSearchParams() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const syncSearch = () => {
      setSearch(window.location.search);
    };

    syncSearch();
    window.addEventListener("popstate", syncSearch);
    window.addEventListener("booking-search-change", syncSearch);

    return () => {
      window.removeEventListener("popstate", syncSearch);
      window.removeEventListener("booking-search-change", syncSearch);
    };
  }, []);

  return useMemo(() => new URLSearchParams(search), [search]);
}

export function notifyBookingSearchChanged() {
  window.setTimeout(() => {
    window.dispatchEvent(new Event("booking-search-change"));
  }, 50);
}
