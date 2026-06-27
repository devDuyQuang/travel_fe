"use client";

import { useEffect, useState } from "react";
import type {
  AboutPageIntroSetting,
  AboutPageSettings,
  AboutPageValuesSetting,
} from "@/types/about-page";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

const settingKeys = [
  "about_page_hero",
  "about_page_gallery",
  "about_page_intro",
  "about_page_values",
  "about_page_vision_mission",
  "about_page_consultation",
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

function hasContent(value?: object) {
  return Boolean(value && Object.keys(value).length);
}

export function aboutPageMediaUrl(value?: string | null) {
  if (!value?.trim()) return null;

  const path = value.trim();
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/assets/") || path.startsWith("/_next/")) return path;

  const baseUrl = API_URL.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\/+/, "");

  if (normalizedPath.startsWith("uploads/")) {
    return `${baseUrl}/${normalizedPath}`;
  }

  return `${baseUrl}/storage/${normalizedPath.replace(/^storage\//, "")}`;
}

export default function useAboutPageSettings() {
  const [settings, setSettings] = useState<AboutPageSettings>({});

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
          throw new Error(`About setting API error: ${response.status}`);
        }
        return response.json() as Promise<SettingResponse>;
      })
      .then((payload) => {
        if (!mounted || !payload.data) return;

        const legacy = settingValue<
          AboutPageIntroSetting & AboutPageValuesSetting
        >(payload.data, "about_page_vision_mission");
        const intro = settingValue<AboutPageIntroSetting>(
          payload.data,
          "about_page_intro",
        );
        const values = settingValue<AboutPageValuesSetting>(
          payload.data,
          "about_page_values",
        );

        setSettings({
          hero: settingValue(payload.data, "about_page_hero"),
          gallery: settingValue(payload.data, "about_page_gallery"),
          intro: hasContent(intro) ? intro : legacy,
          values: hasContent(values) ? values : legacy,
          consultation: settingValue(
            payload.data,
            "about_page_consultation",
          ),
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
