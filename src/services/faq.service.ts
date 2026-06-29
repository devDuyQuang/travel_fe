import type { FaqItem } from "@/types/faq";

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";
const API_URL = `${API_ORIGIN.replace(/\/$/, "")}/api`;

type FaqResponse = {
  success?: boolean;
  data?: FaqItem[];
};

export async function getFaqs(): Promise<FaqItem[]> {
  try {
    const response = await fetch(`${API_URL}/faqs`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const json = (await response.json()) as FaqResponse;
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}
