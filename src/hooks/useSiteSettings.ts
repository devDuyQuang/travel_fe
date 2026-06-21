"use client";

import { useEffect, useState } from "react";

type SettingValue = Record<string, unknown>;

type SiteSettingsResponse = {
  data?: Record<string, SettingValue>;
};

export type SiteSettings = {
  company: string;
  description: string;
  copyright: string;
  email: string;
  phone: string;
  address: string;
  workingTime: string;
  logo: string | null;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

const fallbackSettings: SiteSettings = {
  company: "Golfnity",
  description: "Nền tảng dịch vụ golf và trải nghiệm dành cho golfer.",
  copyright: `© ${new Date().getFullYear()} Golfnity`,
  email: "",
  phone: "",
  address: "",
  workingTime: "",
  logo: null,
};

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function mediaUrl(value: unknown) {
  const path = text(value);
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const baseUrl = API_URL.replace(/\/$/, "");
  return path.startsWith("/")
    ? `${baseUrl}${path}`
    : `${baseUrl}/storage/${path.replace(/^storage\//, "")}`;
}

export default function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);

  useEffect(() => {
    let mounted = true;
    const keys = [
      "site",
      "site_assets_clinic",
      "topbar_info_clinic",
      "floating_info_clinic",
    ].join(",");

    fetch(`${API_URL}/setting?keys=${encodeURIComponent(keys)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Setting API error: ${response.status}`);
        return response.json() as Promise<SiteSettingsResponse>;
      })
      .then((payload) => {
        if (!mounted) return;

        const site = payload.data?.site || {};
        const assets = payload.data?.site_assets_clinic || {};

        setSettings({
          company: text(site.company) || fallbackSettings.company,
          description: text(site.description) || fallbackSettings.description,
          copyright: text(site.copyright) || fallbackSettings.copyright,
          email: text(site.email_description),
          phone: text(site.phone_description),
          address: text(site.address_description),
          workingTime: text(site.time_description),
          logo: mediaUrl(assets.logo),
        });
      })
      .catch(() => {
        if (mounted) setSettings(fallbackSettings);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}
