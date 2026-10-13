import type { Product } from "@/types/product";

// Temporary editorial hold: figures for Ba Na Hills have no verified provenance.
// Remove its ID from this set once business verification is complete.
// Presentation only; CMS/API values and booking data must remain untouched.
const unverifiedReviewProductIds = new Set<number>([17]);

export function canDisplayProductReviews(product?: Product | null): boolean {
  return !product || !unverifiedReviewProductIds.has(product.id);
}
