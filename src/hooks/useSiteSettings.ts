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
  website: string;
  workingTime: string;
  map: string;
  logo: string | null;
  socials: Array<{ name: string; link: string; icon: string }>;
};

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";
const API_URL = `${API_ORIGIN.replace(/\/$/, "")}/api`;

const fallbackSettings: SiteSettings = {
  company: "GOLFNITY",
  description: "Nền tảng dịch vụ golf và trải nghiệm dành cho golfer.",
  copyright: `© ${new Date().getFullYear()} GOLFNITY`,
  email: "",
  phone: "",
  address: "",
  website: "",
  workingTime: "",
  map: "",
  logo: null,
  socials: [],
};

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function brandText(value: unknown) {
  return text(value).replace(/WAYLUNE/gi, "GOLFNITY");
}

function mediaUrl(value: unknown) {
  const path = text(value);
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/assets/") || path.startsWith("/_next/")) return path;

  const baseUrl = API_ORIGIN.replace(/\/$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return `${baseUrl}/storage/${normalizedPath.replace(/^storage\//, "")}`;
}

export default function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);

  useEffect(() => {
    let mounted = true;
    const keys = [
      "site",
      "site_assets_travel",
      "topbar_info_travel",
      "floating_info_travel",
      "floating_info",
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
        const assets = payload.data?.site_assets_travel || {};
        const floating =
          payload.data?.floating_info || payload.data?.floating_info_travel || {};
        const socials = Array.isArray(floating.socials)
          ? floating.socials
              .map((social) => {
                const item = social as Record<string, unknown>;
                return {
                  name: text(item.name),
                  link: text(item.link),
                  icon: text(item.icon),
                };
              })
              .filter((social) => social.link)
          : [];

        setSettings({
          company: brandText(site.company) || fallbackSettings.company,
          description: brandText(site.description) || fallbackSettings.description,
          copyright: brandText(site.copyright) || fallbackSettings.copyright,
          email: text(site.email_description),
          phone: text(site.phone_description),
          address: brandText(site.address_description),
          website: text(site.website),
          workingTime: brandText(site.time_description),
          map: text(site.map),
          logo: mediaUrl(assets.logo),
          socials,
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
