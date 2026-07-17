"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type ExploreNavItem = {
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

type ExploreNavColumnItem = {
  title: string;
  href: string;
};

type ExploreNavColumn = {
  title: string;
  icon: string;
  items: ExploreNavColumnItem[];
};

type ExploreNavSection = {
  title: string;
  href?: string;
  triggerIcon?: string;
  items?: ExploreNavItem[];
  columns?: ExploreNavColumn[];
};

const exploreNavItems: ExploreNavSection[] = [
  {
    title: "Khu vực phổ biến",
    items: [
      { title: "Việt Nam", subtitle: "Golf & du lịch", href: "/diem-den/viet-nam", image: "/assets/img/location/location.jpg" },
      { title: "Nhật Bản", subtitle: "Golf & du lịch", href: "/diem-den/nhat-ban", image: "/assets/img/location/location-2.jpg" },
      { title: "Trung Quốc", subtitle: "Golf & du lịch", href: "/diem-den/trung-quoc", image: "/assets/img/location/location-3.jpg" },
      { title: "Singapore", subtitle: "Golf & du lịch", href: "/diem-den/singapore", image: "/assets/img/location/location-4.jpg" },
      { title: "Thái Lan", subtitle: "Golf & du lịch", href: "/diem-den/thai-lan", image: "/assets/img/destination/des.jpg" },
      { title: "Hàn Quốc", subtitle: "Golf & du lịch", href: "/diem-den/han-quoc", image: "/assets/img/destination/des-2.jpg" },
      { title: "Thụy Sĩ", subtitle: "Golf & du lịch", href: "/diem-den/thuy-si", image: "/assets/img/destination/des-3.jpg" },
      { title: "Úc", subtitle: "Golf & du lịch", href: "/diem-den/uc", image: "/assets/img/destination/des-4.jpg" },
      { title: "Mỹ", subtitle: "Golf & du lịch", href: "/diem-den/my", image: "/assets/img/ads/destination-1.jpg" },
      { title: "Indonesia", subtitle: "Golf & du lịch", href: "/diem-den/indonesia", image: "/assets/img/ads/destination-2.jpg" },
      { title: "Pháp", subtitle: "Golf & du lịch", href: "/diem-den/phap", image: "/assets/img/ads/destination-3.jpg" },
      { title: "Malaysia", subtitle: "Golf & du lịch", href: "/diem-den/malaysia", image: "/assets/img/location/su/destination.jpg" },
    ],
  },
  {
    title: "Điểm đến phổ biến",
    items: [
      { title: "Đà Nẵng", subtitle: "Golf & nghỉ dưỡng", href: "/diem-den/da-nang", image: "/assets/img/listing/listing-1.jpg" },
      { title: "Hội An", subtitle: "Di sản & trải nghiệm", href: "/diem-den/hoi-an", image: "/assets/img/listing/listing-5.jpg" },
      { title: "TP.HCM", subtitle: "Tee time gần trung tâm", href: "/diem-den/tp-hcm", image: "/assets/img/listing/listing-2.jpg" },
      { title: "Hà Nội", subtitle: "Golf & city break", href: "/diem-den/ha-noi", image: "/assets/img/location/su/destination-2.jpg" },
      { title: "Nha Trang", subtitle: "Biển & nghỉ dưỡng", href: "/diem-den/nha-trang", image: "/assets/img/destination/des.jpg" },
      { title: "Phú Quốc", subtitle: "Resort", href: "/diem-den/phu-quoc", image: "/assets/img/listing/listing-6.jpg" },
      { title: "Đà Lạt", subtitle: "Không khí cao nguyên", href: "/diem-den/da-lat", image: "/assets/img/location/location-2.jpg" },
      { title: "Hạ Long", subtitle: "Du thuyền & nghỉ dưỡng", href: "/diem-den/ha-long", image: "/assets/img/location/location-3.jpg" },
      { title: "Vũng Tàu", subtitle: "Golf cuối tuần", href: "/diem-den/vung-tau", image: "/assets/img/location/location-4.jpg" },
      { title: "Bangkok", subtitle: "Vui chơi & mua sắm", href: "/diem-den/bangkok", image: "/assets/img/destination/des-2.jpg" },
      { title: "Tokyo", subtitle: "Nhật Bản", href: "/diem-den/tokyo", image: "/assets/img/destination/des-3.jpg" },
      { title: "Osaka", subtitle: "Nhật Bản", href: "/diem-den/osaka", image: "/assets/img/ads/destination-1.jpg" },
      { title: "Kyoto", subtitle: "Di sản Nhật Bản", href: "/diem-den/kyoto", image: "/assets/img/destination/tu/des-1.jpg" },
      { title: "Seoul", subtitle: "Hàn Quốc", href: "/diem-den/seoul", image: "/assets/img/destination/des-4.jpg" },
      { title: "Busan", subtitle: "Hàn Quốc", href: "/diem-den/busan", image: "/assets/img/destination/tu/des-2.jpg" },
      { title: "Singapore", subtitle: "City break", href: "/diem-den/singapore", image: "/assets/img/location/location-4.jpg" },
      { title: "Bali", subtitle: "Indonesia", href: "/diem-den/bali", image: "/assets/img/location/su/destination-3.jpg" },
      { title: "Kuala Lumpur", subtitle: "Malaysia", href: "/diem-den/kuala-lumpur", image: "/assets/img/location/su/destination.jpg" },
      { title: "Sydney", subtitle: "Úc", href: "/diem-den/sydney", image: "/assets/img/location/su/destination-4.jpg" },
      { title: "Melbourne", subtitle: "Úc", href: "/diem-den/melbourne", image: "/assets/img/location/su/destination-5.jpg" },
      { title: "Paris", subtitle: "Pháp", href: "/diem-den/paris", image: "/assets/img/ads/destination-3.jpg" },
      { title: "Dubai", subtitle: "Nghỉ dưỡng cao cấp", href: "/diem-den/dubai", image: "/assets/img/ads/destination-2.jpg" },
      { title: "Thượng Hải", subtitle: "Trung Quốc", href: "/diem-den/thuong-hai", image: "/assets/img/destination/tu/des-3.jpg" },
      { title: "Bắc Kinh", subtitle: "Trung Quốc", href: "/diem-den/bac-kinh", image: "/assets/img/destination/tu/des-4.jpg" },
      { title: "Hong Kong", subtitle: "Vui chơi & mua sắm", href: "/diem-den/hong-kong", image: "/assets/img/location/location-5/location.jpg" },
      { title: "Sapporo", subtitle: "Nhật Bản", href: "/diem-den/sapporo", image: "/assets/img/location/location-5/location-2.jpg" },
      { title: "Phuket", subtitle: "Thái Lan", href: "/diem-den/phuket", image: "/assets/img/location/location-5/location-3.jpg" },
      { title: "Jeju", subtitle: "Hàn Quốc", href: "/diem-den/jeju", image: "/assets/img/location/location-5/location-4.jpg" },
    ],
  },
  {
    title: "Địa danh phổ biến",
    items: [
      { title: "Bà Nà Hills", subtitle: "Đà Nẵng", href: "/dia-danh/ba-na-hills", image: "/assets/img/ads/destination-1.jpg" },
      { title: "Ngũ Hành Sơn", subtitle: "Đà Nẵng", href: "/dia-danh/ngu-hanh-son", image: "/assets/img/ads/destination-2.jpg" },
      { title: "Phố cổ Hội An", subtitle: "Hội An", href: "/dia-danh/pho-co-hoi-an", image: "/assets/img/ads/destination-3.jpg" },
      { title: "VinWonders", subtitle: "Vé tham quan", href: "/dia-danh/vinwonders", image: "/assets/img/location/su/destination.jpg" },
      { title: "Laguna Golf Lăng Cô", subtitle: "Golf", href: "/laguna-golf-lang-co?layout=tee_time", image: "/assets/img/location/su/destination-2.jpg" },
      { title: "Hoiana Shores Golf Club", subtitle: "Golf", href: "/hoiana-shores-golf-club?layout=tee_time", image: "/assets/img/location/su/destination-3.jpg" },
      { title: "Bà Nà Golf Club", subtitle: "Golf", href: "/ba-na-hills-golf-club?layout=tee_time", image: "/assets/img/location/su/destination-4.jpg" },
      { title: "Long Thành Golf Club", subtitle: "Golf", href: "/long-thanh-golf-club?layout=tee_time", image: "/assets/img/location/su/destination-5.jpg" },
      { title: "Tân Sơn Nhất Golf Course", subtitle: "Golf", href: "/tan-son-nhat-golf-course?layout=tee_time", image: "/assets/img/location/su/destination-6.jpg" },
      { title: "Tokyo Disney Resort", subtitle: "Nhật Bản", href: "/dia-danh/tokyo-disney-resort", image: "/assets/img/destination/des-2.jpg" },
      { title: "Marina Bay Sands", subtitle: "Singapore", href: "/dia-danh/marina-bay-sands", image: "/assets/img/destination/des-3.jpg" },
      { title: "Tháp Eiffel", subtitle: "Paris", href: "/dia-danh/thap-eiffel", image: "/assets/img/destination/des-4.jpg" },
    ],
  },
  {
    title: "Khám phá GOLFNITY",
    columns: [
      {
        title: "Hoạt động golf & trải nghiệm",
        icon: "fa-regular fa-golf-club",
        items: [
          { title: "Tour golf", href: "/tour-golf" },
          { title: "Tour trong ngày", href: "/dich-vu/tham-quan-trai-nghiem" },
          { title: "Đặt tee time", href: "/dich-vu/dat-tee-time" },
          { title: "Tổ chức giải golf", href: "/dich-vu/dat-tee-time/danh-sach?tag=group" },
          { title: "Golf doanh nghiệp", href: "/dich-vu/dat-tee-time/danh-sach?tag=group" },
          { title: "Trải nghiệm địa phương", href: "/dich-vu/tham-quan-trai-nghiem" },
          { title: "Du thuyền", href: "/dich-vu/tham-quan-trai-nghiem" },
          { title: "Vé tham quan", href: "/tham-quan-trai-nghiem" },
          { title: "Sự kiện golf", href: "/dich-vu/dat-tee-time/danh-sach?tag=event" },
        ],
      },
      {
        title: "Lưu trú & nghỉ dưỡng",
        icon: "fa-regular fa-hotel",
        items: [
          { title: "Khách sạn", href: "/khach-san-nghi-duong" },
          { title: "Khách sạn & resort", href: "/dich-vu/khach-san-nghi-duong" },
          { title: "Resort gần sân golf", href: "/dich-vu/khach-san-nghi-duong?tag=golf-resort" },
          { title: "Combo khách sạn + golf", href: "/dich-vu/khach-san-nghi-duong?tag=golf-combo" },
          { title: "Spa & nghỉ dưỡng", href: "/dich-vu/khach-san-nghi-duong?tag=spa" },
          { title: "Nghỉ dưỡng cao cấp", href: "/dich-vu/khach-san-nghi-duong?tag=premium" },
        ],
      },
      {
        title: "Di chuyển",
        icon: "fa-regular fa-car-side",
        items: [
          { title: "Xe sân bay", href: "/thue-xe-dua-don" },
          { title: "Thuê xe có tài xế", href: "/dich-vu/thue-xe-dua-don" },
          { title: "Thuê xe tự lái", href: "/dich-vu/thue-xe-dua-don?tag=self-drive" },
          { title: "Xe 4 chỗ", href: "/dich-vu/thue-xe-dua-don?seat=4" },
          { title: "Xe 7 chỗ", href: "/dich-vu/thue-xe-dua-don?seat=7" },
          { title: "Xe 16 chỗ", href: "/dich-vu/thue-xe-dua-don?seat=16" },
          { title: "Đưa đón sân bay", href: "/dich-vu/thue-xe-dua-don?tag=airport" },
        ],
      },
      {
        title: "Tiện ích du lịch golf",
        icon: "fa-regular fa-suitcase-rolling",
        items: [
          { title: "WiFi & eSIM", href: "#" },
          { title: "Sim du lịch", href: "#" },
          { title: "Voucher & quà tặng", href: "/voucher-qua-tang" },
          { title: "Combo golf + xe", href: "/dich-vu/thue-xe-dua-don?tag=golf-combo" },
          { title: "Gói đoàn doanh nghiệp", href: "/dich-vu/dat-tee-time/danh-sach?tag=group" },
          { title: "Tư vấn lịch trình golf", href: "/contact" },
        ],
      },
    ],
  },
  {
    title: "Voucher & Quà tặng",
    href: "/voucher-qua-tang",
    triggerIcon: "fa-regular fa-gift",
  },
];

const OPEN_DELAY_MS = 80;
const CLOSE_DELAY_MS = 260;

const ExploreNav = () => {
  const [activeExploreKey, setActiveExploreKey] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const isDesktopHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const scheduleOpen = useCallback(
    (key: string) => {
      if (!isDesktopHover()) return;
      clearOpenTimer();
      clearCloseTimer();
      openTimerRef.current = setTimeout(() => {
        setActiveExploreKey(key);
      }, OPEN_DELAY_MS);
    },
    [clearCloseTimer, clearOpenTimer],
  );

  const scheduleClose = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveExploreKey(null);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer, clearOpenTimer]);

  const keepOpen = useCallback(
    (key: string) => {
      if (!isDesktopHover()) return;
      clearOpenTimer();
      clearCloseTimer();
      setActiveExploreKey(key);
    },
    [clearCloseTimer, clearOpenTimer],
  );

  const closeDropdown = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setActiveExploreKey(null);
  }, [clearCloseTimer, clearOpenTimer]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDropdown();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearCloseTimer, clearOpenTimer, closeDropdown]);

  return (
    <nav className="golfnity-explore-nav" aria-label="Khám phá nhanh" ref={navRef}>
      <div className="container-fluid container-1860">
        <ul className="golfnity-explore-nav__list">
          {exploreNavItems.map((section) => (
            <li
              className={`golfnity-explore-nav__item ${
                activeExploreKey === section.title ? "golfnity-explore-nav__item--active" : ""
              } ${section.items || section.columns ? "" : "golfnity-explore-nav__item--link-only"}`}
              key={section.title}
              onMouseEnter={() => {
                if (section.items || section.columns) scheduleOpen(section.title);
              }}
              onMouseLeave={() => {
                if (section.items || section.columns) scheduleClose();
              }}
            >
              {section.href ? (
                <Link
                  className="golfnity-explore-nav__trigger"
                  href={section.href}
                  onFocus={() => {
                    if (section.items || section.columns) keepOpen(section.title);
                  }}
                >
                  {section.triggerIcon && <i className={section.triggerIcon} aria-hidden="true" />}
                  {section.title}
                  {(section.items || section.columns) && (
                    <i className="fa-regular fa-chevron-down" aria-hidden="true" />
                  )}
                </Link>
              ) : (
                <button
                  type="button"
                  className="golfnity-explore-nav__trigger"
                  onClick={() => keepOpen(section.title)}
                  onFocus={() => keepOpen(section.title)}
                >
                  {section.triggerIcon && <i className={section.triggerIcon} aria-hidden="true" />}
                  {section.title}
                  <i className="fa-regular fa-chevron-down" aria-hidden="true" />
                </button>
              )}
              {(section.items || section.columns) && (
                <>
                  <div
                    aria-hidden="true"
                    className="golfnity-explore-nav__bridge"
                    onMouseEnter={() => keepOpen(section.title)}
                    onMouseLeave={scheduleClose}
                  />
                  <div
                    className={`golfnity-explore-nav__panel ${section.columns ? "golfnity-explore-nav__panel--columns" : ""}`}
                    onMouseEnter={() => keepOpen(section.title)}
                    onMouseLeave={scheduleClose}
                  >
                    {section.columns ? (
                      <div className="golfnity-explore-nav__columns">
                        {section.columns.map((column) => (
                          <section className="golfnity-explore-nav__column" key={column.title}>
                            <h3>
                              <i className={column.icon} aria-hidden="true" />
                              {column.title}
                            </h3>
                            <ul>
                              {column.items.map((item) => (
                                <li key={`${column.title}-${item.title}`}>
                                  <Link href={item.href}>{item.title}</Link>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))}
                      </div>
                    ) : (
                      <div className="golfnity-explore-nav__panel-grid">
                        {(section.items || []).map((item) => (
                          <Link className="golfnity-explore-nav__card" href={item.href} key={`${section.title}-${item.title}`}>
                            <span className="golfnity-explore-nav__thumb">
                              <img src={item.image} alt="" loading="lazy" />
                            </span>
                            <span className="golfnity-explore-nav__copy">
                              <span className="golfnity-explore-nav__meta">{item.subtitle}</span>
                              <span className="golfnity-explore-nav__label">{item.title}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default ExploreNav;
