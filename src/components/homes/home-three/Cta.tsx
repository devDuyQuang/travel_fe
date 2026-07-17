"use client";
import { useState } from "react";
import VideoPopup from "@/modals/VideoPopup";
import Button from "@/components/common/Button";
import Image from "next/image";
import Link from "next/link";

import shape from "@/assets/img/banner/shape.png";
import { homepageMediaUrl, homepageText, useHomepageSettings } from "@/hooks/useHomepageSettings";

function youtubeVideoId(value?: string) {
  if (!value?.trim()) return "eEzD-Y97ges";
  const raw = value.trim();
  const match = raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&/]+)/i);
  return match?.[1] || raw;
}

const Cta = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const setting = useHomepageSettings().promo_home;
  if (setting?.enabled === false) return null;
  const cover = homepageMediaUrl(setting?.cover_image) || "/assets/img/banner/thumb.jpg";
  const videoId = youtubeVideoId(setting?.video_url);
  const subtitle =
    homepageText(setting?.subtitle, "Ưu đãi mùa hè")
      .replace(/^Enjoy Summer Deals$/i, "Ưu đãi mùa hè");
  const title =
    homepageText(setting?.title, "Giảm đến 40%")
      .replace(/^Up to 40% Discount!?$/i, "Giảm đến 40%");
  const buttonText =
    homepageText(setting?.button_text, "Xem chi tiết")
      .replace(/^See Details$/i, "Xem chi tiết");

  return (
    <>
      <div className="tg-banner-area tg-banner-space">
        <div className="container">
          <div className="row gx-0">
            <div className="col-lg-7">
              <div
                className="tg-banner-video-wrap include-bg"
                style={{ backgroundImage: `url(${cover})` }}
              >
                <div className="tg-banner-video-inner text-center">
                  {/* <a
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
                  </a> */}
                  <a
                    onClick={() => setIsVideoOpen(true)}
                    style={{ cursor: "pointer" }}
                    className="tg-video-play popup-video tg-pulse-border tg-cta-video-play"
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

                    <span className="tg-cta-wave tg-cta-wave-one" />
                    <span className="tg-cta-wave tg-cta-wave-two" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="tg-banner-content p-relative z-index-1 text-center">
                <Image className="tg-banner-shape" src={shape} alt="shape" />
                <h4 className="tg-banner-subtitle mb-10">{subtitle}</h4>
                <h2 className="tg-banner-title mb-25">{title}</h2>
                {setting?.description?.trim() && (
                  <p className="mb-20">{setting.description.trim()}</p>
                )}
                <div className="tg-banner-btn">
                  {/* <Link href="/tour-details" className="tg-btn tg-btn-switch-animation">
                              <Button text="See Details" />
                           </Link> */}
                  <Link
                    href={homepageText(setting?.button_link, "/dich-vu/dat-tee-time/danh-sach")}
                    className="tg-btn tg-btn-switch-animation tg-banner-cta"
                  >
                    <span className="d-flex align-items-center justify-content-center">
                      <span className="btn-text">{buttonText}</span>

                      <span className="btn-icon">
                        <i className="fa-regular fa-arrow-right"></i>
                      </span>

                      <span className="btn-icon">
                        <i className="fa-regular fa-arrow-right"></i>
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="tg-banner-transparent-bg"></span>
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={videoId}
      />
    </>
  );
};

export default Cta;
