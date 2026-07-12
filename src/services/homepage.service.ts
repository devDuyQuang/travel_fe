import type { HomepageSettings } from "@/types/homepage";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";
const API_URL = `${API_ORIGIN.replace(/\/$/, "")}/api`;

export const homepageSettingKeys = [
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

export async function getHomepageSettings(): Promise<HomepageSettings> {
  const params = new URLSearchParams({
    keys: homepageSettingKeys.join(","),
  });
  const response = await fetch(`${API_URL}/setting?${params}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Homepage setting API error: ${response.status}`);
  }

  const payload = await response.json();

  return payload?.data && typeof payload.data === "object"
    ? (payload.data as HomepageSettings)
    : {};
}
