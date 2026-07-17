"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import HeaderThree from "@/layouts/headers/HeaderThree";
import FooterFive from "@/layouts/footers/FooterFive";
import { buildProductDetailHref } from "@/lib/productLinks";
import { resolveMediaUrl } from "@/services/post.service";
import type { Product } from "@/types/product";

import styles from "./TeeTimeHubPage.module.css";

type TeeTimeHubPageProps = {
  products: Product[];
};

type ProductSection = {
  tone: "green" | "cream" | "gold";
  title: string;
  href: string;
  products: Product[];
};

type SectionIconName = ProductSection["tone"];

// CMS needs at least 5 real tee-time products per shelf for a full Klook-like row.
const SHELF_PRODUCT_LIMIT = 5;
const TEE_TIME_LISTING_PATH = "/dich-vu/dat-tee-time/danh-sach";

const areaChips = [
  {
    label: "TP. Hồ Chí Minh",
    query: "tp-ho-chi-minh",
    match: ["ho chi minh", "hcm", "sai gon", "tan son nhat"],
    image: "/assets/img/location/location.jpg",
  },
  {
    label: "Đà Nẵng",
    query: "da-nang",
    match: ["da nang", "danang", "ba na"],
    image: "/assets/img/location/location-2.jpg",
  },
  {
    label: "Hà Nội",
    query: "ha-noi",
    match: ["ha noi", "hanoi"],
    image: "/assets/img/location/location-3.jpg",
  },
  {
    label: "Nha Trang",
    query: "nha-trang",
    match: ["nha trang"],
    image: "/assets/img/location/location-4.jpg",
  },
  {
    label: "Phú Quốc",
    query: "phu-quoc",
    match: ["phu quoc"],
    image: "/assets/img/destination/des-2.jpg",
  },
  {
    label: "Hội An",
    query: "hoi-an",
    match: ["hoi an"],
    image: "/assets/img/destination/des-3.jpg",
  },
];

const couponHighlights = [
  "Giảm 10%",
  "Ưu đãi nhóm golfer",
  "Báo giá trước khi thanh toán",
];

const seoExploreGroups = [
  {
    heading: "Trải nghiệm tuyệt vời tại VIỆT NAM",
    items: [
      ["Tour Phú Quốc", "tour-phu-quoc"],
      ["Tour Sapa", "tour-sapa"],
      ["Tour Đà Lạt", "tour-da-lat"],
      ["Tour Đà Nẵng", "tour-da-nang"],
      ["Tour Nha Trang", "tour-nha-trang"],
      ["Chụp ảnh Hội An", "chup-anh-hoi-an"],
      ["Du thuyền Hạ Long", "du-thuyen-ha-long"],
      ["Bà Nà Hills", "ba-na-hills"],
      ["Ngũ Hành Sơn", "ngu-hanh-son"],
      ["Vé tham quan Đà Nẵng", "ve-tham-quan-da-nang"],
      ["Suối nước nóng Nha Trang", "suoi-nuoc-nong-nha-trang"],
      ["Suối nước nóng Đà Nẵng", "suoi-nuoc-nong-da-nang"],
      ["Khách sạn Phú Quốc", "khach-san-phu-quoc"],
      ["Resort Hội An", "resort-hoi-an"],
      ["Thuê xe sân bay", "thue-xe-san-bay"],
      ["Xe đi sân golf", "xe-di-san-golf"],
      ["Golf Đà Nẵng", "golf-da-nang"],
      ["Golf Hội An", "golf-hoi-an"],
      ["Tee time TP.HCM", "tee-time-tp-hcm"],
      ["Combo golf + khách sạn", "combo-golf-khach-san"],
    ],
  },
  {
    heading: "Xu hướng trên GOLFNITY",
    items: [
      ["Tour golf Đà Nẵng", "tour-golf-da-nang"],
      ["Tour golf Phú Quốc", "tour-golf-phu-quoc"],
      ["Golf Nha Trang", "golf-nha-trang"],
      ["Golf Hội An", "golf-hoi-an"],
      ["Sân golf gần trung tâm", "san-golf-gan-trung-tam"],
      ["Resort gần sân golf", "resort-gan-san-golf"],
      ["Khách sạn gần sân golf", "khach-san-gan-san-golf"],
      ["Thuê xe đi sân golf", "thue-xe-di-san-golf"],
      ["Combo golf + xe", "combo-golf-xe"],
      ["Combo golf + khách sạn", "combo-golf-khach-san"],
      ["Du lịch golf Việt Nam", "du-lich-golf-viet-nam"],
      ["Golf cuối tuần", "golf-cuoi-tuan"],
      ["Golf team building", "golf-team-building"],
      ["Golf cho doanh nghiệp", "golf-cho-doanh-nghiep"],
      ["Tour golf cao cấp", "tour-golf-cao-cap"],
      ["Voucher tee time", "voucher-tee-time"],
    ],
  },
];

const couponGroups = [
  {
    id: "tee-time",
    title: "Mã tee time",
    tag: "TEE TIME",
    coupons: [
      {
        title: "Giảm 10% cho nhóm golfer",
        code: "GOLFTEAM10",
        description: "Áp dụng cho nhóm từ 4 golfer.",
        discount: "10%",
        tag: "GOLFNITY DEAL",
      },
      {
        title: "Ưu đãi đặt sân cuối tuần",
        code: "WEEKENDTEE",
        description: "Dành cho lịch chơi thứ 7, chủ nhật.",
        discount: "Cuối tuần",
        tag: "TEE TIME",
      },
    ],
  },
  {
    id: "payment",
    title: "Mã thanh toán",
    tag: "THANH TOÁN",
    coupons: [
      {
        title: "Giảm 5% khi đặt combo golf + xe",
        code: "GOLFCAR5",
        description: "Áp dụng khi đặt kèm xe đưa đón.",
        discount: "5%",
        tag: "THANH TOÁN",
      },
      {
        title: "Ưu đãi nhóm doanh nghiệp",
        code: "CORPGOLF",
        description: "Dành cho booking công ty hoặc sự kiện golf.",
        discount: "Doanh nghiệp",
        tag: "NHÓM GOLFER",
      },
    ],
  },
  {
    id: "group",
    title: "Mã nhóm golfer",
    tag: "NHÓM GOLFER",
    coupons: [
      {
        title: "Giữ lịch rõ ràng",
        code: "HOLDTEE",
        description: "Ưu tiên kiểm tra lịch và báo lại sớm.",
        discount: "Giữ lịch",
        tag: "GOLFNITY DEAL",
      },
      {
        title: "Tư vấn trước khi đặt",
        code: "GOLFCARE",
        description: "Hỗ trợ chọn sân, giờ chơi và phương án di chuyển.",
        discount: "Tư vấn",
        tag: "NHÓM GOLFER",
      },
    ],
  },
];

function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function numericPrice(value?: string | number | null) {
  if (value === null || value === undefined || value === "") return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 100000 ? price : null;
}

function resolveStartingPrice(product: Product) {
  const optionPrices = (product.service_options || [])
    .map((option) => numericPrice(option.price))
    .filter((price): price is number => Boolean(price));
  const directPrices = [
    product.display_price,
    product.price_discount,
    product.price,
    product.sale_price,
    product.regular_price,
  ]
    .map((value) => numericPrice(value))
    .filter((price): price is number => Boolean(price));
  const prices = [...optionPrices, ...directPrices];

  if (!prices.length) return "Liên hệ";

  return `Từ ${formatVnd(Math.min(...prices))}đ`;
}

function productImage(product: Product, index: number) {
  const fallbackImages = [
    "/assets/img/location/location.jpg",
    "/assets/img/location/location-2.jpg",
    "/assets/img/location/location-3.jpg",
    "/assets/img/location/location-4.jpg",
  ];

  return (
    resolveMediaUrl(product.image_url) ||
    resolveMediaUrl(product.gallery?.[0]) ||
    fallbackImages[index % fallbackImages.length]
  );
}

function courseMeta(product: Product) {
  const holes =
    product.attributes?.holes ||
    product.attributes?.hole_count ||
    product.attributes?.golf_holes;
  const duration = product.duration || (holes ? `${holes} hố` : null);

  return duration || "Kiểm tra lịch theo yêu cầu";
}

function includesAny(product: Product, values: string[]) {
  const haystack = [
    product.name,
    product.location,
    product.duration,
    product.badge,
    product.short_description,
    product.highlights,
    ...(product.service_options || []).map((option) => option.name),
    ...(product.service_options || []).map((option) => option.label),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return values.some((value) => haystack.includes(value));
}

function normalizeText(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function countProductsByArea(products: Product[], matches: string[]) {
  return products.filter((product) => {
    const haystack = normalizeText(
      [product.name, product.location, product.short_description]
        .filter(Boolean)
        .join(" "),
    );

    return matches.some((match) => haystack.includes(match));
  }).length;
}

function fillProducts(source: Product[], preferred: Product[], limit = SHELF_PRODUCT_LIMIT) {
  const seen = new Set<number>();
  const merged = [...preferred, ...source].filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });

  return merged.slice(0, limit);
}

function SectionIcon({ name }: { name: SectionIconName }) {
  const iconClass =
    name === "cream"
      ? "fa-regular fa-calendar-clock"
      : name === "gold"
        ? "fa-regular fa-location-dot"
        : "fa-regular fa-star";

  return <i aria-hidden="true" className={iconClass} />;
}

function CourseCard({
  product,
  index,
  compact = false,
}: {
  product: Product;
  index: number;
  compact?: boolean;
}) {
  const href = buildProductDetailHref(product);
  const badgeLabel = product.badge === "New" ? "Mới" : product.badge || "Được quan tâm";

  return (
    <Link className={`${styles.courseCard} ${compact ? styles.compactCard : ""}`} href={href}>
      <article className={styles.courseCardInner}>
        <span className={styles.courseImage}>
          <Image
            alt={product.name}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 20vw"
            src={productImage(product, index)}
          />
          {(product.badge || product.is_featured) && (
            <span className={styles.badge}>{badgeLabel}</span>
          )}
        </span>
        <div className={styles.courseBody}>
          <h3>{product.name}</h3>
          <div className={styles.metaLine}>
            <span>{product.location || "Việt Nam"}</span>
            <span>{courseMeta(product)}</span>
          </div>
          <div className={styles.cardFooter}>
            <strong>{resolveStartingPrice(product)}</strong>
            <span>Xem sân</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function DiscoveryGroup({ section }: { section: ProductSection }) {
  const productsClassName = `${styles.groupProducts} ${
    section.products.length < SHELF_PRODUCT_LIMIT ? styles.groupProductsCompact : ""
  }`;

  return (
    <section className={`${styles.discoveryGroup} ${styles[section.tone]}`}>
      <div className={styles.groupHeading}>
        <div className={styles.groupTitle}>
          <span className={styles.groupIcon}>
            <SectionIcon name={section.tone} />
          </span>
          <div>
            <h2>{section.title}</h2>
          </div>
        </div>
        <Link className={styles.viewAllLink} href={section.href}>
          Xem tất cả
        </Link>
      </div>
      <div className={productsClassName}>
        {section.products.map((product, index) => (
          <CourseCard key={`${section.title}-${product.id}`} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

const TeeTimeHubPage = ({ products }: TeeTimeHubPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [activeCouponGroupId, setActiveCouponGroupId] = useState(couponGroups[0].id);
  const [savedCouponCode, setSavedCouponCode] = useState("");
  const selectedLocation = searchParams.get("location");
  const activeCouponGroup =
    couponGroups.find((group) => group.id === activeCouponGroupId) || couponGroups[0];
  const teeTimeProducts = products.filter(
    (product) => product.category?.layout_key === "tee_time",
  );
  const featuredProducts = fillProducts(
    teeTimeProducts,
    teeTimeProducts.filter((product) => product.is_featured || product.badge),
  );
  const weekendProducts = fillProducts(
    teeTimeProducts,
    teeTimeProducts.filter((product) =>
      includesAny(product, ["cuối tuần", "weekend", "thứ bảy", "chủ nhật"]),
    ),
  );
  const nearCenterProducts = fillProducts(
    teeTimeProducts,
    teeTimeProducts.filter((product) =>
      includesAny(product, ["center", "trung tâm", "phút", "km"]),
    ),
  );
  const productSections: ProductSection[] = [
    {
      tone: "green",
      title: "Sân golf được quan tâm",
      href: `${TEE_TIME_LISTING_PATH}?tag=featured`,
      products: featuredProducts,
    },
    {
      tone: "cream",
      title: "Tee time cuối tuần",
      href: `${TEE_TIME_LISTING_PATH}?tag=weekend`,
      products: weekendProducts,
    },
    {
      tone: "gold",
      title: "Sân gần trung tâm",
      href: `${TEE_TIME_LISTING_PATH}?tag=near-center`,
      products: nearCenterProducts,
    },
  ];
  const areaCards = areaChips.map((area) => ({
    ...area,
    count: countProductsByArea(teeTimeProducts, area.match),
  }));
  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keyword = searchKeyword.trim();
    const path = TEE_TIME_LISTING_PATH;

    router.push(
      keyword ? `${path}?keyword=${encodeURIComponent(keyword)}` : path,
    );
  };
  const handleSaveCoupon = (code: string) => {
    setSavedCouponCode(code);

    if (navigator.clipboard) {
      void navigator.clipboard.writeText(code).catch(() => undefined);
    }

    window.setTimeout(() => {
      setSavedCouponCode((currentCode) => (currentCode === code ? "" : currentCode));
    }, 2400);
  };

  return (
    <>
      <HeaderThree />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <h1>Tee time & trải nghiệm golf</h1>
              <p>
                Tìm sân golf, lịch chơi, gói tee time và hỗ trợ đặt trước khi
                thanh toán.
              </p>
            </div>

            <div className={styles.searchPanel}>
              <form
                className={`${styles.searchForm} golfnity-search-bar`}
                onSubmit={handleSearchSubmit}
              >
                <i
                  aria-hidden="true"
                  className={`fa-regular fa-location-dot ${styles.searchIcon}`}
                />
                <input
                  aria-label="Tìm khu vực hoặc sân golf"
                  autoComplete="off"
                  className="golfnity-form-control"
                  name="tee_time_course_query"
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="Địa điểm"
                  type="search"
                  value={searchKeyword}
                />
                <button
                  aria-label="Tìm kiếm"
                  className="golfnity-form-button"
                  type="submit"
                >
                  <i className="fa-regular fa-magnifying-glass" />
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className={styles.areaSection}>
          <div className={styles.areaGrid}>
            {areaCards.map((chip) => (
              <Link
                className={`${styles.areaCard} ${
                  selectedLocation === chip.query ? styles.areaCardActive : ""
                }`}
                href={`${TEE_TIME_LISTING_PATH}?location=${chip.query}`}
                key={chip.query}
              >
                <span className={styles.areaImage}>
                  <Image
                    alt={chip.label}
                    fill
                    sizes="(max-width: 767px) 44vw, (max-width: 1199px) 25vw, 180px"
                    src={chip.image}
                  />
                </span>
                <span className={styles.areaBody}>
                  <strong>{chip.label}</strong>
                  <span>{chip.count > 0 ? `${chip.count} sân golf` : "Sắp có"}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className={styles.discoveryWrap}>
          <div className={styles.discoveryIntro}>
            <h2>Trải nghiệm golf không thể bỏ lỡ</h2>
            {/* <p>
              Gợi ý sân golf, khung giờ và trải nghiệm phù hợp để bạn bắt đầu dễ hơn.
            </p> */}
          </div>
          {productSections.map((section) => (
            <DiscoveryGroup key={section.title} section={section} />
          ))}
          <div className={styles.allExperiences}>
            <Link className={styles.allExperiencesLink} href={TEE_TIME_LISTING_PATH}>
              <span className={styles.allExperiencesIcon}>
                <i aria-hidden="true" className="fa-regular fa-grid-2" />
              </span>
              <span>Xem mọi trải nghiệm</span>
              <i aria-hidden="true" className="fa-regular fa-arrow-right" />
            </Link>
          </div>
        </div>

        <section className={styles.couponSection}>
          <div className={styles.couponHeading}>
            <div>
              <span>Golfnity deals</span>
              <h2>Ưu đãi tee time</h2>
            </div>
            <button
              className={styles.couponViewAll}
              onClick={() => setIsCouponModalOpen(true)}
              type="button"
            >
              Xem tất cả
            </button>
          </div>
          <div className={styles.couponList}>
            {couponHighlights.map((coupon) => (
              <span key={coupon}>{coupon}</span>
            ))}
          </div>
        </section>

        <section className={styles.exploreMoreSection}>
          <div className={styles.compactHeading}>
            <span>Gợi ý tìm kiếm</span>
            <h2>Khám phá thêm trên GOLFNITY</h2>
          </div>
          <div className={styles.exploreGroups}>
            {seoExploreGroups.map((group) => (
              <section className={styles.exploreGroup} key={group.heading}>
                <h3>{group.heading}</h3>
                <div className={styles.exploreChips}>
                  {group.items.map(([label, keyword], index) => (
                    <Link href={`${TEE_TIME_LISTING_PATH}?keyword=${keyword}`} key={keyword}>
                      <span>{index + 1}</span>
                      <strong>{label}</strong>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>

      {isCouponModalOpen && (
        <div
          aria-labelledby="tee-time-coupon-title"
          aria-modal="true"
          className={styles.modalOverlay}
          onClick={() => setIsCouponModalOpen(false)}
          role="dialog"
        >
          <div className={styles.couponModal} onClick={(event) => event.stopPropagation()}>
            <button
              aria-label="Đóng mã ưu đãi"
              className={styles.modalClose}
              onClick={() => setIsCouponModalOpen(false)}
              type="button"
            >
              <i aria-hidden="true" className="fa-regular fa-xmark" />
            </button>
            <div className={styles.modalHeader}>
              <span>Golfnity coupon</span>
              <h2 id="tee-time-coupon-title">Mã ưu đãi</h2>
              <p>Lưu mã để dùng khi GOLFNITY xác nhận lịch và báo giá.</p>
            </div>
            <div className={styles.couponTabs} role="tablist" aria-label="Nhóm mã ưu đãi">
              {couponGroups.map((group) => (
                <button
                  aria-selected={activeCouponGroup.id === group.id}
                  className={`${styles.couponTab} ${
                    activeCouponGroup.id === group.id ? styles.couponTabActive : ""
                  }`}
                  key={group.id}
                  onClick={() => setActiveCouponGroupId(group.id)}
                  role="tab"
                  type="button"
                >
                  {group.title}
                </button>
              ))}
            </div>
            <section className={styles.couponGroup}>
              <div className={styles.couponGroupHeader}>
                <h3>{activeCouponGroup.title}</h3>
                <span>{activeCouponGroup.tag}</span>
              </div>
              <div className={styles.modalCouponGrid}>
                {activeCouponGroup.coupons.map((coupon) => (
                  <article className={styles.modalCouponCard} key={coupon.code}>
                    <div className={styles.modalCouponMain}>
                      <span className={styles.couponTag}>
                        <i aria-hidden="true" className="fa-regular fa-ticket" />
                        {coupon.tag}
                      </span>
                      <strong>{coupon.title}</strong>
                      <p>{coupon.description}</p>
                      <span className={styles.couponCode}>Mã: {coupon.code}</span>
                    </div>
                    <aside>
                      <span className={styles.couponIcon}>
                        <i aria-hidden="true" className="fa-regular fa-badge-percent" />
                      </span>
                      <strong>{coupon.discount}</strong>
                      <button onClick={() => handleSaveCoupon(coupon.code)} type="button">
                        {savedCouponCode === coupon.code ? "Đã lưu" : "Lưu mã"}
                      </button>
                    </aside>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
      <FooterFive />
    </>
  );
};

export default TeeTimeHubPage;
