"use client";

import { useCallback, useEffect, useState } from "react";
import AboutText from "./about/AboutText"
import Faq from "./about/Faq"
import Included from "./about/Included"
import Review from "./about/Review"
import ReviewDetails from "./about/ReviewDetails"
import ReviewFormArea from "./about/ReviewFormArea"
import FeatureSidebar from "./FeatureSidebar"
import TeeTimeHighlights from "./TeeTimeHighlights";
import TeeTimeSectionNav, { type TeeTimeSectionNavItem } from "./TeeTimeSectionNav";
import TeeTimeSmartPriceCard from "./TeeTimeSmartPriceCard";
import TeeTimeVoucherSection from "./TeeTimeVoucherSection";
import type { Product } from "@/types/product";
import { resolveProductBookingType } from "@/lib/servicePrice";
import { resolveMediaUrl } from "@/services/post.service";

type TeeTimeOverlay = "highlights" | "vouchers" | null;

type ReviewItem = {
   avatar?: string | null;
   content: string;
   date?: string | null;
   displayName: string;
   helpfulCount?: number | null;
   images: string[];
   packageName?: string | null;
   rating?: number | null;
};

type RatingBreakdownItem = {
   label: string;
   score: number;
};

function recordValue(value: unknown): Record<string, unknown> {
   return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
}

function arrayValue(value: unknown): unknown[] {
   return Array.isArray(value) ? value : [];
}

function textValue(value: unknown): string | null {
   return typeof value === "string" && value.trim() ? value.trim() : null;
}

function positiveNumber(value: unknown): number | null {
   if (value === null || value === undefined || value === "" || typeof value === "boolean") {
      return null;
   }

   const number = Number(value);

   return Number.isFinite(number) && number > 0 ? number : null;
}

function resolveRatingLabel(product: Product | null) {
   const metadata = recordValue(product?.metadata);
   const attributes = recordValue(product?.attributes);

   return (
      textValue(metadata.rating_label) ||
      textValue(metadata.satisfaction_label) ||
      textValue(attributes.rating_label) ||
      textValue(attributes.satisfaction_label) ||
      null
   );
}

function resolveRatingBreakdown(product: Product | null): RatingBreakdownItem[] {
   const metadata = recordValue(product?.metadata);
   const attributes = recordValue(product?.attributes);
   const raw =
      metadata.rating_breakdown ||
      metadata.ratingBreakdown ||
      attributes.rating_breakdown ||
      attributes.ratingBreakdown;

   if (Array.isArray(raw)) {
      return raw
         .map((item) => {
            const row = recordValue(item);
            const label = textValue(row.label) || textValue(row.name);
            const score = positiveNumber(row.score || row.rating || row.value);

            return label && score ? { label, score: Math.min(5, score) } : null;
         })
         .filter((item): item is RatingBreakdownItem => Boolean(item));
   }

   return Object.entries(recordValue(raw))
      .map(([label, score]) => {
         const value = positiveNumber(score);

         return value ? { label, score: Math.min(5, value) } : null;
      })
      .filter((item): item is RatingBreakdownItem => Boolean(item));
}

function resolveReviewItems(product: Product | null): ReviewItem[] {
   const metadata = recordValue(product?.metadata);
   const attributes = recordValue(product?.attributes);
   const rawReviews = arrayValue(metadata.reviews || attributes.reviews);

   return rawReviews
      .map((item) => {
         const review = recordValue(item);
         const content =
            textValue(review.content) ||
            textValue(review.comment) ||
            textValue(review.review) ||
            "";

         if (!content) return null;

         const images = arrayValue(review.images || review.photos)
            .map((image) => resolveMediaUrl(textValue(image)))
            .filter((image): image is string => Boolean(image));

         const normalizedReview: ReviewItem = {
            avatar: resolveMediaUrl(textValue(review.avatar)),
            content,
            date: textValue(review.date) || textValue(review.reviewed_at) || textValue(review.created_at),
            displayName:
               textValue(review.display_name) ||
               textValue(review.name) ||
               textValue(review.customer_name) ||
               "Khách hàng GOLFNITY",
            helpfulCount: positiveNumber(review.helpful_count || review.helpfulCount),
            images,
            packageName: textValue(review.package_name) || textValue(review.service_option_name),
            rating: positiveNumber(review.rating),
         };

         return normalizedReview;
      })
      .filter((item): item is ReviewItem => item !== null);
}

function TeeTimeReviewSection({ product }: { product: Product | null }) {
   const rating = positiveNumber(product?.rating);
   const reviewCount = positiveNumber(product?.review_count);
   const label = resolveRatingLabel(product);
   const breakdown = resolveRatingBreakdown(product);
   const reviews = resolveReviewItems(product);
   const hasSummary = Boolean(rating || reviewCount || label || breakdown.length);

   return (
      <section
         id="danh-gia"
         className="tg-tour-about-inner mb-40 tee-time-detail-section tee-time-scroll-section tee-time-reviews-section"
         tabIndex={-1}
      >
         <h4 className="tg-tour-about-title mb-20">Đánh giá</h4>
         {hasSummary ? (
            <div className="tee-time-review-summary">
               <div className="tee-time-review-score">
                  {rating && <strong>{rating.toFixed(1)}</strong>}
                  <div>
                     {label && <span>{label}</span>}
                     {reviewCount && <p>{reviewCount} đánh giá</p>}
                  </div>
               </div>
               {breakdown.length > 0 && (
                  <div className="tee-time-review-breakdown">
                     {breakdown.map((item) => (
                        <div key={item.label}>
                           <span>{item.label}</span>
                           <meter min={0} max={5} value={item.score} />
                           <strong>{item.score.toFixed(1)}</strong>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         ) : (
            <p className="tee-time-review-empty mb-0">Chưa có đánh giá cho dịch vụ này.</p>
         )}

         {reviews.length > 0 ? (
            <>
               <div className="tee-time-review-controls" aria-label="Bộ lọc đánh giá">
                  <select defaultValue="latest" aria-label="Sắp xếp đánh giá">
                     <option value="latest">Mới nhất</option>
                     <option value="highest">Điểm cao nhất</option>
                     <option value="lowest">Điểm thấp nhất</option>
                  </select>
                  <select defaultValue="all" aria-label="Lọc theo điểm">
                     <option value="all">Tất cả điểm</option>
                     <option value="5">5 sao</option>
                     <option value="4">4 sao</option>
                     <option value="3">3 sao</option>
                  </select>
               </div>
               <div className="tee-time-review-list">
                  {reviews.map((review, index) => (
                     <article key={`${review.displayName}-${index}`} className="tee-time-review-card">
                        <div className="tee-time-review-card__avatar">
                           {review.avatar ? <img src={review.avatar} alt="" /> : review.displayName.charAt(0)}
                        </div>
                        <div className="tee-time-review-card__body">
                           <div className="tee-time-review-card__meta">
                              <strong>{review.displayName}</strong>
                              {review.date && <span>{review.date}</span>}
                           </div>
                           {review.packageName && <p className="tee-time-review-card__package">{review.packageName}</p>}
                           {review.rating && (
                              <div className="tee-time-review-card__rating" aria-label={`${review.rating} sao`}>
                                 {Array.from({ length: 5 }).map((_, starIndex) => (
                                    <i
                                       key={starIndex}
                                       className={
                                          starIndex < Math.round(review.rating || 0)
                                             ? "fa-solid fa-star"
                                             : "fa-regular fa-star"
                                       }
                                    />
                                 ))}
                              </div>
                           )}
                           <p>{review.content}</p>
                           {review.images.length > 0 && (
                              <div className="tee-time-review-card__images">
                                 {review.images.map((image) => (
                                    <img key={image} src={image} alt="" />
                                 ))}
                              </div>
                           )}
                           {review.helpfulCount && (
                              <button type="button" className="tee-time-review-helpful">
                                 Hữu ích ({review.helpfulCount})
                              </button>
                           )}
                        </div>
                     </article>
                  ))}
               </div>
            </>
         ) : (
            hasSummary && (
               <p className="tee-time-review-empty mb-0">
                  Chưa có đánh giá chi tiết cho dịch vụ này.
               </p>
            )
         )}
      </section>
   );
}

const fallbackTeeTimePolicies = [
   "Giá cuối cùng được xác nhận sau khi GOLFNITY kiểm tra lịch sân và điều kiện nhà cung cấp.",
   "Yêu cầu đặt sân chưa phải là thanh toán ngay.",
   "Đội ngũ tư vấn sẽ liên hệ lại nếu cần điều chỉnh giờ chơi hoặc gói tee time.",
];

const FeatureAboutArea = ({ product }: { product: Product | null }) => {
   const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(product?.location || "")}&output=embed`;
   const isTeeTime = resolveProductBookingType(product) === "tee_time";
   const teeTimeBookingTargetId = "cac-goi-dich-vu";
   const [activeOverlay, setActiveOverlay] = useState<TeeTimeOverlay>(null);
   const [selectedVoucherCode, setSelectedVoucherCode] = useState<string | undefined>();
   const closeTeeTimeOverlay = useCallback(() => setActiveOverlay(null), []);
   const openHighlightsOverlay = useCallback(() => setActiveOverlay("highlights"), []);
   const openVoucherOverlay = useCallback((code?: string) => {
      setSelectedVoucherCode(code);
      setActiveOverlay("vouchers");
   }, []);

   useEffect(() => {
      if (!activeOverlay) return;

      const scrollY = window.scrollY;
      const previousOverflow = document.body.style.overflow;
      const previousHtmlOverflow = document.documentElement.style.overflow;
      const previousPosition = document.body.style.position;
      const previousTop = document.body.style.top;
      const previousWidth = document.body.style.width;
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
         document.documentElement.style.overflow = previousHtmlOverflow;
         document.body.style.overflow = previousOverflow;
         document.body.style.position = previousPosition;
         document.body.style.top = previousTop;
         document.body.style.width = previousWidth;
         document.documentElement.style.scrollBehavior = "auto";
         window.scrollTo(0, scrollY);
         window.requestAnimationFrame(() => {
            document.documentElement.style.scrollBehavior = previousScrollBehavior;
         });
      };
   }, [activeOverlay]);

   if (isTeeTime) {
      const teeTimeNavItems: TeeTimeSectionNavItem[] = [
         { id: "tong-quan", label: "Tổng quan" },
         { id: "cac-goi-dich-vu", label: "Các gói dịch vụ" },
         { id: "ve-dich-vu-nay", label: "Về dịch vụ này" },
         { id: "nhung-dieu-can-luu-y", label: "Những điều cần lưu ý" },
         { id: "danh-gia", label: "Đánh giá" },
      ];

      return (
         <div className={`tg-tour-about-area tg-tour-about-border pt-40 pb-70 tee-time-detail-about${activeOverlay ? " is-tee-time-overlay-open" : ""}`}>
            <div className="container">
               <div className="tee-time-detail-layout tee-time-detail-layout--single">
                  <main className="tee-time-detail-layout__main">
                     <section id="tong-quan" className="teeTimeOverview tee-time-overview overview-layout">
                        <div className="teeTimeOverviewMain tee-time-overview__main overview-main">
                           <div className="tee-time-overview-highlights">
                              <TeeTimeHighlights
                                 product={product}
                                 isOpen={activeOverlay === "highlights"}
                                 onClose={closeTeeTimeOverlay}
                                 onOpen={openHighlightsOverlay}
                              />
                           </div>
                           <div
                              id="tee-time-section-nav-sentinel"
                              className="tee-time-section-nav-sentinel"
                              aria-hidden="true"
                           />
                           <div className="tee-time-overview-voucher">
                              <TeeTimeVoucherSection
                                 isOpen={activeOverlay === "vouchers"}
                                 onClose={closeTeeTimeOverlay}
                                 onOpen={openVoucherOverlay}
                                 selectedCode={selectedVoucherCode}
                              />
                           </div>
                        </div>
                        <aside className="teeTimeOverviewPriceColumn tee-time-overview__price-column overview-price">
                           <TeeTimeSmartPriceCard
                              product={product}
                              startAfterId="ve-dich-vu-nay"
                              targetId={teeTimeBookingTargetId}
                           />
                        </aside>
                     </section>
                     <section
                        id={teeTimeBookingTargetId}
                        className="teeTimePackagesSection tee-time-packages-section package-selection-section"
                        tabIndex={-1}
                     >
                        <h2 className="tg-tour-about-title tee-time-packages-title">Các gói dịch vụ</h2>
                        <FeatureSidebar
                           product={product}
                           formId="tee-time-booking-form"
                        />
                     </section>
                     <div className="service-content-layout">
                        <main className="tg-tour-about-content service-content-column">
                           <AboutText product={product} />
                           <section
                              id="danh-gia"
                              className="tee-time-review-anchor tee-time-scroll-section"
                              tabIndex={-1}
                              aria-label="Đánh giá"
                           />
                        </main>
                        <aside className="service-price-column" aria-hidden="true" />
                     </div>
                     <div
                        id="tee-time-price-card-end"
                        data-tee-time-price-end
                        aria-hidden="true"
                     />
                  </main>
               </div>
            </div>
            <TeeTimeSectionNav items={teeTimeNavItems} />
         </div>
      );
   }

   return (
      <div className="tg-tour-about-area tg-tour-about-border pt-40 pb-70">
         <div className="container">
            <div className="row">
               <div className="col-xl-9 col-lg-8">
                  <div className="tg-tour-about-wrap mr-55">
                     <div className="tg-tour-about-content">
                        <AboutText product={product} />
                        <div className="tg-tour-about-border mb-40"></div>
                        <Included />
                        <div className="tg-tour-about-border mb-40"></div>
                        <Faq />
                        <div className="tg-tour-about-border mb-45"></div>
                        <div className="tg-tour-about-map mb-40">
                           <h4 className="tg-tour-about-title mb-15">Địa điểm</h4>
                           <p className="lh-28">{product?.location || "Thông tin địa điểm đang được cập nhật."}</p>
                           <div className="tg-tour-about-map h-100">
                              <iframe src={mapUrl} width="600" height="450" style={{ border: "0" }} loading="lazy"></iframe>
                           </div>
                        </div>
                        <div className="tg-tour-about-border mb-45"></div>
                        <Review />
                        <div className="tg-tour-about-border mb-35"></div>
                        <ReviewDetails />
                        <div className="tg-tour-about-border mb-45"></div>
                        <ReviewFormArea />
                     </div>
                  </div>
               </div>
               <div className="col-xl-3 col-lg-4">
                  <div className="tg-tour-about-sidebar mb-50">
                     <FeatureSidebar product={product} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default FeatureAboutArea
