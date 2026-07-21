"use client";

import { useEffect } from "react";
import type { Product } from "@/types/product";

export const RECENTLY_VIEWED_KEY = "golfnity_recently_viewed";

type RecentProductRef = {
  id: number;
  slug: string;
  viewedAt: string;
};

const RecentlyViewedTracker = ({ product }: { product?: Product | null }) => {
  useEffect(() => {
    if (!product?.id || !product.slug) return;

    try {
      const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
      const current = raw ? (JSON.parse(raw) as RecentProductRef[]) : [];
      const next = [
        {
          id: product.id,
          slug: product.slug,
          viewedAt: new Date().toISOString(),
        },
        ...current.filter(
          (item) => item.id !== product.id && item.slug !== product.slug,
        ),
      ].slice(0, 8);

      window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
    } catch {
      // localStorage can be unavailable in private browsing; silently skip.
    }
  }, [product?.id, product?.slug]);

  return null;
};

export default RecentlyViewedTracker;
