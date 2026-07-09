"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { HomepageSettings } from "@/types/homepage";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";
const API_URL = `${API_ORIGIN.replace(/\/$/, "")}/api`;

const settingKeys = [
  "hero_home",
  "search_home",
  "about_home",
  "featured_products_home",
  "why_choose_us_home",
  "promo_home",
  "destinations_home",
  "cta_home",
  "testimonials_home",
  "blogs_home",
  "app_cta_home",
];

const HomepageSettingsContext = createContext<HomepageSettings>({});

export function HomepageSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<HomepageSettings>({});

  useEffect(() => {
    let mounted = true;
    const params = new URLSearchParams({ keys: settingKeys.join(",") });

    fetch(`${API_URL}/setting?${params}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Homepage setting API error: ${response.status}`);
        return response.json();
      })
      .then((payload) => {
        if (mounted && payload?.data && typeof payload.data === "object") {
          setSettings(payload.data as HomepageSettings);
        }
      })
      .catch(() => {
        if (mounted) setSettings({});
      });

    return () => {
      mounted = false;
    };
  }, []);

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
    .replace(/^See Details$/i, "Xem chi tiết");
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
