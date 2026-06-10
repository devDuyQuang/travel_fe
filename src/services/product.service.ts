import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!API_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_URL");
  }

  const res = await fetch(`${API_URL}/product/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = await res.json();

  if (Array.isArray(json.data)) {
    return json.data[0] ?? null;
  }

  return json.data ?? null;
}