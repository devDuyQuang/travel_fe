"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getHomepageSettings } from "@/services/homepage.service";
import type { HomepageSettings } from "@/types/homepage";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

const HomepageSettingsContext = createContext<HomepageSettings>({});

export function HomepageSettingsProvider({
  children,
  initialSettings,
}: {
  children: ReactNode;
  initialSettings?: HomepageSettings;
}) {
  const [settings, setSettings] = useState<HomepageSettings>(initialSettings ?? {});

  useEffect(() => {
    if (initialSettings) return;

    let mounted = true;

    getHomepageSettings()
      .then((payload) => {
        if (mounted) setSettings(payload);
      })
      .catch(() => {
        if (mounted) setSettings({});
      });

    return () => {
      mounted = false;
    };
  }, [initialSettings]);

  const value = useMemo(() => settings, [settings]);

  return (
    <HomepageSettingsContext.Provider value={value}>
      {children}
    </HomepageSettingsContext.Provider>
  );
}

export function useHomepageSettings() {
  return useContext(HomepageSettingsContext);
}

export function homepageText(value: unknown, fallback: string) {
  const text = typeof value === "string" && value.trim() ? value.trim() : fallback;

  return text
    .replace(/WAYLUNE/gi, "GOLFNITY")
    .replace(/^Enjoy Summer Deals$/i, "Ưu đãi mùa hè")
    .replace(/^Up to 40% Discount!?$/i, "Giảm đến 40%")
    .replace(/^See Details$/i, "Xem chi tiết")
    .replace(/^Golf\s*&\s*Travel Booking$/i, "Golf và du lịch trong một nền tảng");
}

export function homepageMediaUrl(value?: string | null) {
  if (!value?.trim()) return null;
  const path = value.trim();
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = API_ORIGIN.replace(/\/$/, "");
  return path.startsWith("/")
    ? `${baseUrl}${path}`
    : `${baseUrl}/storage/${path.replace(/^storage\//, "")}`;
}
