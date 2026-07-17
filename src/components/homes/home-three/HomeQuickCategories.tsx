"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const quickCategories = [
  {
    title: "Đặt Tee Time",
    href: "/dich-vu/dat-tee-time",
    icon: "fa-regular fa-golf-club",
    tone: "green",
  },
  {
    title: "Tour golf & trải nghiệm",
    href: "/dich-vu/tour-golf-viet-nam",
    icon: "fa-regular fa-compass",
    tone: "orange",
  },
  {
    title: "Khách sạn & nghỉ dưỡng",
    href: "/dich-vu/khach-san-nghi-duong",
    icon: "fa-regular fa-hotel",
    tone: "purple",
  },
  {
    title: "Di chuyển",
    href: "/dich-vu/thue-xe-dua-don",
    icon: "fa-regular fa-bus",
    tone: "blue",
  },
  {
    title: "Thuê xe tự lái",
    href: "/dich-vu/thue-xe-dua-don",
    icon: "fa-regular fa-key",
    tone: "teal",
  },
  {
    title: "Tất cả dịch vụ",
    icon: "fa-regular fa-grid-2",
    tone: "gold",
    opensModal: true,
  },
];

const serviceGroups = [
  {
    title: "Hoạt động golf & trải nghiệm",
    icon: "fa-regular fa-golf-club",
    items: [
      ["Đặt tee time", "/dich-vu/dat-tee-time", "fa-regular fa-flag"],
      ["Tour golf", "/dich-vu/tour-golf-viet-nam", "fa-regular fa-golf-club"],
      ["Tour trong ngày", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-sun"],
      ["Tổ chức giải golf", "/dich-vu/dat-tee-time/danh-sach?tag=group", "fa-regular fa-trophy"],
      ["Golf doanh nghiệp", "/dich-vu/dat-tee-time/danh-sach?tag=group", "fa-regular fa-briefcase"],
      ["Trải nghiệm địa phương", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-map-location-dot"],
      ["Du thuyền", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-ship"],
      ["Vé tham quan", "/tham-quan-trai-nghiem", "fa-regular fa-ticket"],
    ],
  },
  {
    title: "Vé tham quan",
    icon: "fa-regular fa-ticket",
    items: [
      ["Công viên giải trí", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-ferris-wheel"],
      ["Công viên nước", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-water"],
      ["Bảo tàng", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-building-columns"],
      ["Công viên & vườn bách thảo", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-seedling"],
      ["Sở thú & thủy cung", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-fish"],
      ["Cáp treo", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-cable-car"],
      ["Di tích lịch sử", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-landmark"],
      ["Khu vui chơi", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-gamepad"],
      ["Vui chơi trong nhà", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-house"],
      ["Vé tham quan", "/tham-quan-trai-nghiem", "fa-regular fa-ticket"],
    ],
  },
  {
    title: "Lưu trú",
    icon: "fa-regular fa-hotel",
    items: [
      ["Khách sạn", "/khach-san-nghi-duong", "fa-regular fa-bed"],
      ["Khách sạn & resort", "/dich-vu/khach-san-nghi-duong", "fa-regular fa-hotel"],
      ["Resort gần sân golf", "/dich-vu/khach-san-nghi-duong?tag=golf-resort", "fa-regular fa-location-dot"],
      ["Combo khách sạn + golf", "/dich-vu/khach-san-nghi-duong?tag=golf-combo", "fa-regular fa-layer-group"],
      ["Spa & nghỉ dưỡng", "/dich-vu/khach-san-nghi-duong?tag=spa", "fa-regular fa-spa"],
      ["Nghỉ dưỡng cao cấp", "/dich-vu/khach-san-nghi-duong?tag=premium", "fa-regular fa-gem"],
    ],
  },
  {
    title: "Di chuyển",
    icon: "fa-regular fa-car-side",
    items: [
      ["Xe sân bay", "/thue-xe-dua-don", "fa-regular fa-plane-arrival"],
      ["Thuê xe có tài xế", "/dich-vu/thue-xe-dua-don", "fa-regular fa-user-tie"],
      ["Thuê xe tự lái", "/dich-vu/thue-xe-dua-don", "fa-regular fa-key"],
      ["Xe 4 chỗ", "/dich-vu/thue-xe-dua-don?seat=4", "fa-regular fa-car"],
      ["Xe 7 chỗ", "/dich-vu/thue-xe-dua-don?seat=7", "fa-regular fa-van-shuttle"],
      ["Xe 16 chỗ", "/dich-vu/thue-xe-dua-don?seat=16", "fa-regular fa-bus"],
      ["Đưa đón sân bay", "/dich-vu/thue-xe-dua-don?tag=airport", "fa-regular fa-plane-arrival"],
    ],
  },
  {
    title: "Thêm nhiều khám phá",
    icon: "fa-regular fa-compass",
    items: [
      ["Ẩm thực", "/dich-vu/tham-quan-trai-nghiem?tag=am-thuc", "fa-regular fa-utensils"],
      ["Mua sắm", "/dich-vu/tham-quan-trai-nghiem?tag=mua-sam", "fa-regular fa-bag-shopping"],
      ["WiFi & eSIM", "#", "fa-regular fa-wifi"],
      ["Dịch vụ du lịch", "/dich-vu/tham-quan-trai-nghiem", "fa-regular fa-suitcase-rolling"],
    ],
  },
  {
    title: "Tiện ích & ưu đãi",
    icon: "fa-regular fa-gift",
    items: [
      ["Voucher tee time", "/voucher-qua-tang#tee-time", "fa-regular fa-ticket"],
      ["Voucher tour golf", "/voucher-qua-tang#tour-golf", "fa-regular fa-compass"],
      ["Thẻ quà tặng GOLFNITY", "/voucher-qua-tang#gift-card", "fa-regular fa-gift"],
      ["Ưu đãi nhóm & doanh nghiệp", "/voucher-qua-tang#corporate", "fa-regular fa-handshake"],
      ["Combo golf + xe", "/dich-vu/thue-xe-dua-don?tag=golf-combo", "fa-regular fa-car-side"],
      ["Tư vấn lịch trình golf", "/contact", "fa-regular fa-headset"],
    ],
  },
];

const HomeQuickCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsModalOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <>
      <section className="golfnity-home-quick-categories" aria-label="Danh mục dịch vụ nhanh">
        <div className="container">
          <div className="golfnity-home-quick-categories__grid">
            {quickCategories.map((category) => {
              const className = `golfnity-home-quick-categories__card golfnity-home-quick-categories__card--${category.tone}`;
              const content = (
                <>
                  <span className="golfnity-home-quick-categories__icon">
                    <i className={category.icon} aria-hidden="true" />
                  </span>
                  <span>{category.title}</span>
                </>
              );

              if (category.opensModal) {
                return (
                  <button className={className} key={category.title} onClick={() => setIsModalOpen(true)} type="button">
                    {content}
                  </button>
                );
              }

              return (
                <Link className={className} href={category.href || "#"} key={category.title}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="golfnity-all-services-modal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsModalOpen(false);
          }}
          role="presentation"
        >
          <section
            aria-labelledby="golfnity-all-services-title"
            aria-modal="true"
            className={`golfnity-all-services-modal__panel golfnity-all-services-modal__panel--${viewMode}`}
            data-view={viewMode}
            role="dialog"
          >
            <div className="golfnity-all-services-modal__header">
              <button
                aria-label="Đóng tất cả dịch vụ"
                className="golfnity-all-services-modal__close"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                <i className="fa-regular fa-xmark" aria-hidden="true" />
              </button>
              <h2 id="golfnity-all-services-title">Tất cả các mục</h2>
              <div className="golfnity-all-services-modal__view-toggle" aria-label="Chọn kiểu xem">
                <button
                  aria-label="Xem dạng lưới"
                  aria-pressed={viewMode === "grid"}
                  className={viewMode === "grid" ? "is-active" : ""}
                  onClick={() => setViewMode("grid")}
                  type="button"
                >
                  <i className="fa-regular fa-grid-2" aria-hidden="true" />
                </button>
                <button
                  aria-label="Xem dạng danh sách"
                  aria-pressed={viewMode === "list"}
                  className={viewMode === "list" ? "is-active" : ""}
                  onClick={() => setViewMode("list")}
                  type="button"
                >
                  <i className="fa-regular fa-list" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="golfnity-all-services-modal__body">
              {serviceGroups.map((group) => (
                <article className="golfnity-all-services-modal__group" key={group.title}>
                  <h3>
                    <i className={group.icon} aria-hidden="true" />
                    {group.title}
                  </h3>
                  <ul>
                    {group.items.map(([label, href, icon]) => (
                      <li key={`${group.title}-${label}`}>
                        <Link href={href} onClick={() => setIsModalOpen(false)}>
                          <span>
                            <i className={icon} aria-hidden="true" />
                          </span>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default HomeQuickCategories;
