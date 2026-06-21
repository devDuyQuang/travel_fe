"use client";

import { useMemo, useState } from "react";
import VideoPopup from "@/modals/VideoPopup";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import FeatureList from "./FeatureList";

import thumb_1 from "@/assets/img/tour-details/thumb-4.jpg";
import thumb_3 from "@/assets/img/tour-details/thumb-2.jpg";
import thumb_4 from "@/assets/img/tour-details/thumb-3.jpg";

const FeatureDetailsArea = ({ product }: { product: Product | null }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const getImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `${apiUrl}${path}`;
    return `${apiUrl}/storage/${path}`;
  };

  const getYoutubeVideoId = (url?: string | null) => {
    if (!url) return "eEzD-Y97ges";

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.replace("/", "") || "eEzD-Y97ges";
      }

      return parsedUrl.searchParams.get("v") || "eEzD-Y97ges";
    } catch {
      return "eEzD-Y97ges";
    }
  };

  const renderStarRating = (rating?: number | string | null) => {
    const value = Math.max(0, Math.min(5, Number(rating || 0)));
    const percent = `${(value / 5) * 100}%`;

    return (
      <span
        style={{ position: "relative", display: "inline-block", fontSize: 18 }}
      >
        <span style={{ color: "#d7dce2" }}>★★★★★</span>
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: percent,
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: "#ff9900",
          }}
        >
          ★★★★★
        </span>
      </span>
    );
  };
  const title = product?.name || "Vatican Museums Sistine Chapel Skip the Line";
  const location = product?.location || "Street Bintage,Veins City, italy";
  const reviewCount = product?.review_count || "5 Reviews";
  const videoId = getYoutubeVideoId(product?.video_url);

  const imageMain = getImageUrl(product?.image_url);
  const imageVideo = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const imageSmall1 = getImageUrl(product?.gallery?.[0]);
  const imageSmall2 = getImageUrl(product?.gallery?.[1]);

  const slides = useMemo(() => {
    const urls = [
      imageMain,
      imageSmall1,
      imageSmall2,
      ...(product?.gallery || []).map((item) => getImageUrl(item)),
    ].filter(Boolean) as string[];

    const uniqueUrls = Array.from(new Set(urls));

    return uniqueUrls.map((src) => ({ src }));
  }, [product?.gallery, imageMain, imageSmall1, imageSmall2]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="tg-tour-details-area pt-35 pb-25">
        <div className="container">
          <div className="row align-items-end mb-35">
            <div className="col-xl-9 col-lg-8">
              <div className="tg-tour-details-video-title-wrap">
                <h2 className="tg-tour-details-video-title mb-15">{title}</h2>

                <div className="tg-tour-details-video-location d-flex flex-wrap">
                  <span className="mr-25">
                    <i className="fa-regular fa-location-dot"></i> {location}
                  </span>

                  <div className="tg-tour-details-video-ratings">
                    {renderStarRating(product?.rating)}
                    <span className="review">({reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-lg-4">
              <div className="tg-tour-details-video-share text-end">
                <Link href="#">Share</Link>
                <Link href="#" className="ml-25">
                  Add to Wishlist
                </Link>
              </div>
            </div>
          </div>

          <div className="row gx-15 mb-25">
            <div className="col-lg-7">
              <div className="tg-tour-details-video-thumb mb-15">
                {imageMain ? (
                  <img
                    className="w-100 golf-main-img"
                    src={imageMain}
                    alt={title}
                    onClick={() => openLightbox(0)}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <Image
                    className="w-100 golf-main-img"
                    src={thumb_1}
                    alt={title}
                  />
                )}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="row gx-15">
                <div className="col-12">
                  <div className="tg-tour-details-video-thumb p-relative mb-15">
                    <img
                      className="w-100 golf-video-img"
                      src={imageVideo}
                      alt={title}
                    />

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
                    {imageSmall1 ? (
                      <img
                        className="w-100 golf-small-img"
                        src={imageSmall1}
                        alt={title}
                        onClick={() => openLightbox(1)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <Image
                        className="w-100 golf-small-img"
                        src={thumb_3}
                        alt={title}
                      />
                    )}
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="tg-tour-details-video-thumb mb-15">
                    {imageSmall2 ? (
                      <img
                        className="w-100 golf-small-img"
                        src={imageSmall2}
                        alt={title}
                        onClick={() => openLightbox(2)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <Image
                        className="w-100 golf-small-img"
                        src={thumb_4}
                        alt={title}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tg-tour-details-feature-list-wrap">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="tg-tour-details-video-established mb-15">
                  <span>
                    {String(product?.attributes?.established_text || "")}
                  </span>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="tg-tour-details-video-feature-price mb-15">
                  <p>
                    From <span>$59.00</span> /{" "}
                    <span className="tg-tour-details-price-unit">Pax</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={videoId}
      />

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Thumbnails]}
        controller={{
          closeOnBackdropClick: true,
        }}
        styles={{
          container: {
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(2px)",
          },
          slide: {
            padding: "80px 120px 120px",
          },
        }}
      />
    </>
  );
};

export default FeatureDetailsArea;
