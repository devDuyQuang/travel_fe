"use client";

import Image from "next/image";
import Link from "next/link";
import useSiteSettings from "@/hooks/useSiteSettings";
import logo from "@/assets/img/logo/golfnity-logo2x.png";

type BrandedFooterProps = {
  areaClassName: string;
  topClassName: string;
};

const BrandedFooter = ({
  areaClassName,
  topClassName,
}: BrandedFooterProps) => {
  const siteSettings = useSiteSettings();
  const footerLogo = siteSettings.logo || logo;

  return (
    <footer>
      <div className={`${areaClassName} golfnity-footer`}>
        <div className="container">
          <div className={`tg-footer-top ${topClassName}`}>
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="tg-footer-widget mb-40">
                  <div className="tg-footer-logo mb-20">
                    <Link href="/">
                      <Image
                        src={footerLogo}
                        alt={siteSettings.company}
                        width={200}
                        height={61}
                        priority
                        className="golfnity-logo-img"
                      />
                    </Link>
                  </div>
                  <p className="mb-20">{siteSettings.description}</p>
                  <div className="tg-footer-form mb-30">
                    <form onSubmit={(event) => event.preventDefault()}>
                      <input
                        type="email"
                        placeholder={siteSettings.email || "Nhập email của bạn"}
                      />
                      <button
                        className="tg-footer-form-btn"
                        type="submit"
                        aria-label="Đăng ký nhận tin"
                      >
                        <svg
                          width="22"
                          height="17"
                          viewBox="0 0 22 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.52514 8.47486H20.4749M20.4749 8.47486L13.5 1.5M20.4749 8.47486L13.5 15.4497"
                            stroke="currentColor"
                            strokeWidth="1.77778"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </form>
                  </div>
                  <div className="tg-footer-social">
                    <Link href="#" aria-label="Facebook">
                      <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                    <Link href="#" aria-label="Twitter">
                      <i className="fa-brands fa-twitter"></i>
                    </Link>
                    <Link href="#" aria-label="Instagram">
                      <i className="fa-brands fa-instagram"></i>
                    </Link>
                    <Link href="#" aria-label="Pinterest">
                      <i className="fa-brands fa-pinterest-p"></i>
                    </Link>
                    <Link href="#" aria-label="YouTube">
                      <i className="fa-brands fa-youtube"></i>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="tg-footer-widget tg-footer-link ml-80 mb-40">
                  <h3 className="tg-footer-widget-title mb-25">
                    Liên kết nhanh
                  </h3>
                  <ul>
                    <li><Link href="/">Trang chủ</Link></li>
                    <li><Link href="/about">Về Golfnity</Link></li>
                    <li><Link href="/dich-vu/dat-tee-time">Dịch vụ</Link></li>
                    <li><Link href="/blog-grid">Tin tức</Link></li>
                    <li><Link href="/contact">Liên hệ</Link></li>
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="tg-footer-widget tg-footer-info mb-40">
                  <h3 className="tg-footer-widget-title mb-25">
                    Thông tin liên hệ
                  </h3>
                  <ul>
                    <li>
                      <Link className="d-flex" href="/contact">
                        <span className="mr-15">
                          <i className="fa-sharp fa-solid fa-location-dot"></i>
                        </span>
                        {siteSettings.address || "Xem thông tin liên hệ Golfnity"}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="d-flex"
                        href={
                          siteSettings.phone
                            ? `tel:${siteSettings.phone}`
                            : "/contact"
                        }
                      >
                        <span className="mr-15">
                          <i className="fa-sharp fa-solid fa-phone"></i>
                        </span>
                        {siteSettings.phone || "Liên hệ tư vấn"}
                      </Link>
                    </li>
                    <li className="d-flex">
                      <span className="mr-15">
                        <i className="fa-sharp fa-regular fa-clock"></i>
                      </span>
                      <p className="mb-0">
                        {siteSettings.workingTime ||
                          "Thời gian hỗ trợ theo yêu cầu"}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="tg-footer-widget tg-footer-link mb-40">
                  <h3 className="tg-footer-widget-title mb-25">
                    {siteSettings.company}
                  </h3>
                  <ul>
                    <li><Link href="/about">Giới thiệu</Link></li>
                    <li><Link href="/dich-vu/tour-golf-viet-nam">Tour golf</Link></li>
                    <li><Link href="/dich-vu/khach-san-nghi-duong">Khách sạn & nghỉ dưỡng</Link></li>
                    <li><Link href="/dich-vu/thue-xe-dua-don">Thuê xe & đưa đón</Link></li>
                    <li><Link href="/dich-vu/tham-quan-trai-nghiem">Trải nghiệm</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tg-footer-copyright text-center">
          <span>{siteSettings.copyright}</span>
        </div>
      </div>
    </footer>
  );
};

export default BrandedFooter;
