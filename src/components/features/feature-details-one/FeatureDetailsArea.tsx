"use client";
import { useMemo, useState } from "react";
import VideoPopup from "@/modals/VideoPopup";
import Image from "next/image";
import Link from "next/link";
import FeatureList from "./FeatureList";
import Lightbox from "yet-another-react-lightbox";

import type { Product } from "@/types/product";
import {
  formatCurrencyVnd,
  getProductStartingPrice,
  resolveProductBookingType,
} from "@/lib/servicePrice";

import thumb_1 from "@/assets/img/tour-details/thumb-4.jpg";
import thumb_2 from "@/assets/img/tour-details/thumb-1.jpg";
import thumb_3 from "@/assets/img/tour-details/thumb-2.jpg";
import thumb_4 from "@/assets/img/tour-details/thumb-3.jpg";
import "yet-another-react-lightbox/styles.css";

function textAttribute(
  product: Product | null,
  keys: string[],
): string | null {
  const attributes = product?.attributes || {};

  for (const key of keys) {
    const value = attributes[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return null;
}

function positiveNumber(
  value?: string | number | boolean | null,
): number | null {
  if (
    value === null ||
    value === undefined ||
    typeof value === "boolean" ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : null;
}

function uniqueText(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim())));
}

const FeatureDetailsArea = ({ product }: { product: Product | null }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const startingPrice = getProductStartingPrice(product);
  const isTeeTime = resolveProductBookingType(product) === "tee_time";
  const gallery = product?.gallery?.filter((image) => image.trim()) || [];
  const primaryImage = product?.image_url
    ? {
        src: product.image_url,
        width: thumb_1.width,
        height: thumb_1.height,
      }
    : thumb_1;
  const secondaryImages = [thumb_2, thumb_3, thumb_4].map((fallback, index) => {
    const image = gallery[index];
    return image
      ? { src: image, width: fallback.width, height: fallback.height }
      : fallback;
  });
  const language = textAttribute(product, ["languages", "language"]);
  const experienceType = textAttribute(product, [
    "experience_type",
    "tee_time_type",
    "service_type",
  ]);
  const pickupEnabled =
    product?.attributes?.hotel_pickup === true ||
    product?.attributes?.pickup_included === true ||
    product?.attributes?.transfer_included === true;
  const pickupText = textAttribute(product, [
    "pickup_text",
    "pickup_service",
    "transfer_service",
  ]);
  const durationText =
    product?.duration?.trim() ||
    textAttribute(product, ["duration", "duration_text"]);
  const isScheduleOnRequest =
    durationText?.toLowerCase().includes("kiểm tra") ||
    durationText?.toLowerCase().includes("theo yêu cầu");
  const courseType = textAttribute(product, ["course_type"]);
  const distance = positiveNumber(product?.attributes?.distance_to_center);
  const travelTime = positiveNumber(product?.attributes?.travel_time_to_center);
  const rating = positiveNumber(product?.rating);
  const reviewCount = positiveNumber(product?.review_count);
  const bookedCount = positiveNumber(
    product?.booking_count ??
      product?.attributes?.booking_count ??
      product?.attributes?.sold_count,
  );
  const metaChips = [
    product?.badge ? { label: product.badge, className: "is-badge" } : null,
    language ? { label: language } : null,
    experienceType ? { label: experienceType } : null,
    pickupEnabled ? { label: pickupText || "Đón tại khách sạn" } : null,
    durationText
      ? {
          label: `${isScheduleOnRequest ? "Lịch chơi" : "Thời lượng"}: ${
            isScheduleOnRequest ? "Kiểm tra theo yêu cầu" : durationText
          }`,
        }
      : null,
    courseType ? { label: courseType } : null,
    distance || travelTime
      ? {
          label: [
            distance ? `Cách trung tâm ${distance} km` : null,
            travelTime ? `Khoảng ${travelTime} phút` : null,
          ].filter(Boolean).join(" · "),
          className: "is-distance-time",
        }
      : null,
  ].filter((item): item is { label: string; className?: string } => Boolean(item));
  const galleryMedia = useMemo(
    () => uniqueText([product?.image_url || "", ...gallery]),
    [gallery, product?.image_url],
  );
  const lightboxSlides = useMemo(
    () => galleryMedia.map((src) => ({ src })),
    [galleryMedia],
  );

  return (
    <>
      <div className={`tg-tour-details-area pt-35 pb-25 ${isTeeTime ? "tee-time-detail-hero" : ""}`}>
        <div className="container">
          <div className={`row align-items-end mb-35 ${isTeeTime ? "tee-time-product-head" : ""}`}>
            <div className={isTeeTime ? "col-12" : "col-xl-9 col-lg-8"}>
              <div className="tg-tour-details-video-title-wrap">
                {isTeeTime ? (
                  <div className="tee-time-title-row">
                    <h2 className="tg-tour-details-video-title mb-0">
                      {product?.name || "Sân golf GOLFNITY"}
                    </h2>
                    <Link href="#" className="tee-time-favorite-link">
                      <svg
                        width="16"
                        height="14"
                        viewBox="0 0 16 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.2606 10.7831L10.2878 10.8183L10.2606 10.7831L10.2482 10.7928C10.0554 10.9422 9.86349 11.0909 9.67488 11.2404C9.32643 11.5165 9.01846 11.7565 8.72239 11.9304C8.42614 12.1044 8.19324 12.1804 7.99978 12.1804C7.80633 12.1804 7.57342 12.1044 7.27718 11.9304C6.9811 11.7565 6.67312 11.5165 6.32472 11.2404C6.13618 11.091 5.94436 10.9423 5.75159 10.7929L5.73897 10.7831C4.90868 10.1397 4.06133 9.48294 3.36178 8.6911C2.51401 7.73157 1.92536 6.61544 1.92536 5.16811C1.92536 3.75448 2.71997 2.57143 3.80086 2.07481C4.84765 1.59384 6.26028 1.71692 7.61021 3.12673L7.64151 3.09675L7.61021 3.12673C7.7121 3.23312 7.85274 3.2933 7.99978 3.2933C8.14682 3.2933 8.28746 3.23312 8.38936 3.12673L8.35868 3.09736L8.38936 3.12673C9.73926 1.71692 11.1519 1.59384 12.1987 2.07481C13.2796 2.57143 14.0742 3.75448 14.0742 5.16811C14.0742 6.61544 13.4856 7.73157 12.6378 8.69109L12.668 8.71776L12.6378 8.6911C11.9382 9.48294 11.0909 10.1397 10.2606 10.7831ZM5.10884 11.6673L5.13604 11.6321L5.10884 11.6673L5.10901 11.6674C5.29802 11.8137 5.48112 11.9554 5.65523 12.0933C5.99368 12.3616 6.35981 12.6498 6.73154 12.8682L6.75405 12.8298L6.73154 12.8682C7.10315 13.0864 7.53174 13.2667 7.99978 13.2667C8.46782 13.2667 8.89641 13.0864 9.26802 12.8682L9.24552 12.8298L9.26803 12.8682C9.63979 12.6498 10.0059 12.3615 10.3443 12.0933C10.5185 11.9553 10.7016 11.8136 10.8907 11.6673L10.8907 11.6673L10.8926 11.6659C11.7255 11.0212 12.6722 10.2884 13.4463 9.41228L13.413 9.38285L13.4463 9.41227C14.4145 8.31636 15.1553 6.95427 15.1553 5.16811C15.1553 3.34832 14.1308 1.76808 12.6483 1.08693C11.2517 0.445248 9.53362 0.635775 7.99979 1.99784C6.46598 0.635775 4.74782 0.445248 3.35124 1.08693C1.86877 1.76808 0.844227 3.34832 0.844227 5.16811C0.844227 6.95427 1.58502 8.31636 2.55325 9.41227C3.32727 10.2883 4.27395 11.0211 5.10682 11.6657L5.10884 11.6673Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="0.0888889"
                        />
                      </svg>
                      Yêu thích
                    </Link>
                  </div>
                ) : (
                  <h2 className="tg-tour-details-video-title mb-15">
                    {product?.name || "Dịch vụ GOLFNITY"}
                  </h2>
                )}
                {isTeeTime ? (
                  <>
                    {metaChips.length > 0 && (
                      <div className="tee-time-hero-meta">
                        {metaChips.map((chip, index) => (
                          <span key={`${chip.label}-${index}`} className={chip.className}>
                            {chip.label}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="tee-time-social-proof">
                      {rating && (
                        <span>
                          <i className="fa-solid fa-star"></i>
                          {rating.toFixed(1)}/5
                        </span>
                      )}
                      {reviewCount && <span>{reviewCount} đánh giá</span>}
                      {bookedCount && <span>{bookedCount}+ đã đặt</span>}
                      {product?.location && (
                        <span className="tee-time-social-proof__location">
                          <i className="fa-regular fa-location-dot"></i>
                          {product.location}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="tg-tour-details-video-location d-flex flex-wrap">
                    <span className="mr-25">
                      {product?.location || "Thông tin địa điểm đang được cập nhật."}
                    </span>
                    <div className="tg-tour-details-video-ratings">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index} className={index < Math.round(Number(product?.rating || 5)) ? "" : "opacity-25"}>
                          <i className="fa-sharp fa-solid fa-star"></i>
                        </span>
                      ))}
                      <span className="review">({product?.review_count || "5"} đánh giá)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!isTeeTime && <div className="col-xl-3 col-lg-4">
              <div className="tg-tour-details-video-share text-end">
                <Link href="#">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.87746 9.03227L10.7343 11.8625M10.7272 4.05449L5.87746 6.88471M14.7023 2.98071C14.7023 4.15892 13.7472 5.11405 12.569 5.11405C11.3908 5.11405 10.4357 4.15892 10.4357 2.98071C10.4357 1.80251 11.3908 0.847382 12.569 0.847382C13.7472 0.847382 14.7023 1.80251 14.7023 2.98071ZM6.16901 7.95849C6.16901 9.1367 5.21388 10.0918 4.03568 10.0918C2.85747 10.0918 1.90234 9.1367 1.90234 7.95849C1.90234 6.78029 2.85747 5.82516 4.03568 5.82516C5.21388 5.82516 6.16901 6.78029 6.16901 7.95849ZM14.7023 12.9363C14.7023 14.1145 13.7472 15.0696 12.569 15.0696C11.3908 15.0696 10.4357 14.1145 10.4357 12.9363C10.4357 11.7581 11.3908 10.8029 12.569 10.8029C13.7472 10.8029 14.7023 11.7581 14.7023 12.9363Z"
                      stroke="currentColor"
                      strokeWidth="0.977778"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Chia sẻ
                </Link>
                <Link href="#" className="ml-25">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.2606 10.7831L10.2878 10.8183L10.2606 10.7831L10.2482 10.7928C10.0554 10.9422 9.86349 11.0909 9.67488 11.2404C9.32643 11.5165 9.01846 11.7565 8.72239 11.9304C8.42614 12.1044 8.19324 12.1804 7.99978 12.1804C7.80633 12.1804 7.57342 12.1044 7.27718 11.9304C6.9811 11.7565 6.67312 11.5165 6.32472 11.2404C6.13618 11.091 5.94436 10.9423 5.75159 10.7929L5.73897 10.7831C4.90868 10.1397 4.06133 9.48294 3.36178 8.6911C2.51401 7.73157 1.92536 6.61544 1.92536 5.16811C1.92536 3.75448 2.71997 2.57143 3.80086 2.07481C4.84765 1.59384 6.26028 1.71692 7.61021 3.12673L7.64151 3.09675L7.61021 3.12673C7.7121 3.23312 7.85274 3.2933 7.99978 3.2933C8.14682 3.2933 8.28746 3.23312 8.38936 3.12673L8.35868 3.09736L8.38936 3.12673C9.73926 1.71692 11.1519 1.59384 12.1987 2.07481C13.2796 2.57143 14.0742 3.75448 14.0742 5.16811C14.0742 6.61544 13.4856 7.73157 12.6378 8.69109L12.668 8.71776L12.6378 8.6911C11.9382 9.48294 11.0909 10.1397 10.2606 10.7831ZM5.10884 11.6673L5.13604 11.6321L5.10884 11.6673L5.10901 11.6674C5.29802 11.8137 5.48112 11.9554 5.65523 12.0933C5.99368 12.3616 6.35981 12.6498 6.73154 12.8682L6.75405 12.8298L6.73154 12.8682C7.10315 13.0864 7.53174 13.2667 7.99978 13.2667C8.46782 13.2667 8.89641 13.0864 9.26802 12.8682L9.24552 12.8298L9.26803 12.8682C9.63979 12.6498 10.0059 12.3615 10.3443 12.0933C10.5185 11.9553 10.7016 11.8136 10.8907 11.6673L10.8907 11.6673L10.8926 11.6659C11.7255 11.0212 12.6722 10.2884 13.4463 9.41228L13.413 9.38285L13.4463 9.41227C14.4145 8.31636 15.1553 6.95427 15.1553 5.16811C15.1553 3.34832 14.1308 1.76808 12.6483 1.08693C11.2517 0.445248 9.53362 0.635775 7.99979 1.99784C6.46598 0.635775 4.74782 0.445248 3.35124 1.08693C1.86877 1.76808 0.844227 3.34832 0.844227 5.16811C0.844227 6.95427 1.58502 8.31636 2.55325 9.41227C3.32727 10.2883 4.27395 11.0211 5.10682 11.6657L5.10884 11.6673Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="0.0888889"
                    />
                  </svg>
                  Yêu thích
                </Link>
              </div>
            </div>}
          </div>
          <div className={`row gx-15 ${isTeeTime ? "mb-0" : "mb-25"}`}>
            <div className="col-lg-7">
              <div className="tg-tour-details-video-thumb mb-15">
                <Image className="w-100" src={primaryImage} alt="" />
              </div>
            </div>
            <div className="col-lg-5">
              <div className="row  gx-15">
                <div className="col-12">
                  <div className="tg-tour-details-video-thumb p-relative mb-15">
                    <Image className="w-100" src={secondaryImages[0]} alt="" />
                    <div className="tg-tour-details-video-inner text-center">
                      <a
                        onClick={() => setIsVideoOpen(true)}
                        style={{ cursor: "pointer" }}
                        className="tg-video-play popup-video tg-pulse-border"
                      >
                        <span className="p-relative z-index-11">
                          <svg
                            width="19"
                            height="21"
                            viewBox="0 0 19 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.3616 8.34455C19.0412 9.31425 19.0412 11.7385 17.3616 12.7082L4.13504 20.3445C2.45548 21.3142 0.356021 20.1021 0.356021 18.1627L0.356022 2.89C0.356022 0.950609 2.45548 -0.261512 4.13504 0.708185L17.3616 8.34455Z"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="tg-tour-details-video-thumb mb-15">
                    <Image className="w-100" src={secondaryImages[1]} alt="" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                  <div className="tg-tour-details-video-thumb p-relative mb-15">
                    <Image className="w-100" src={secondaryImages[2]} alt="" />
                    {isTeeTime && galleryMedia.length > 0 && (
                      <button
                        type="button"
                        className="tee-time-gallery-library-btn"
                        onClick={() => setLightboxOpen(true)}
                      >
                        <i className="fa-regular fa-images"></i>
                        Thư viện ảnh
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!isTeeTime && (
            <div className="tg-tour-details-feature-list-wrap">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <div className="tg-tour-details-video-feature-list">
                    <FeatureList product={product} />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="tg-tour-details-video-feature-price mb-15">
                    {startingPrice.amount ? (
                      <p>
                        Từ <span>{formatCurrencyVnd(startingPrice.amount)}</span> /{" "}
                        <span className="tg-tour-details-price-unit">{startingPrice.unit}</span>
                      </p>
                    ) : (
                      <p><span>Liên hệ</span></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId="eEzD-Y97ges"
      />
      {isTeeTime && galleryMedia.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={lightboxSlides}
          controller={{ closeOnBackdropClick: true }}
        />
      )}
    </>
  );
};

export default FeatureDetailsArea;
