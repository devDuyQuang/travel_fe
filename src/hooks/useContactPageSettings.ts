"use client";

import { useEffect, useState } from "react";
import type { ContactPageSettings } from "@/types/contact-page";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

const settingKeys = [
  "contact_page_hero",
  "contact_page_info",
  "contact_page_locations",
];

type SettingResponse = {
  data?: Record<string, unknown>;
};

function settingValue<T>(
  data: Record<string, unknown>,
  key: string,
): T | undefined {
  return (data[key] || data[`${key}_travel`]) as T | undefined;
}

export function contactPageMediaUrl(value?: string | null) {
  if (!value?.trim()) return null;

  const path = value.trim();
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/assets/") || path.startsWith("/_next/")) return path;

  const baseUrl = API_URL.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  return `${baseUrl}/storage/${normalizedPath.replace(/^storage\//, "")}`;
}

export default function useContactPageSettings() {
  const [settings, setSettings] = useState<ContactPageSettings>({});

  useEffect(() => {
    let mounted = true;
    const keys = [
      ...settingKeys,
      ...settingKeys.map((key) => `${key}_travel`),
    ].join(",");

    fetch(`${API_URL}/setting?keys=${encodeURIComponent(keys)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Contact setting API error: ${response.status}`);
        }
        return response.json() as Promise<SettingResponse>;
      })
      .then((payload) => {
        if (!mounted || !payload.data) return;

        setSettings({
          hero: settingValue(payload.data, "contact_page_hero"),
          info: settingValue(payload.data, "contact_page_info"),
          locations: settingValue(payload.data, "contact_page_locations"),
        });
      })
      .catch(() => {
        if (mounted) setSettings({});
      });

    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}
