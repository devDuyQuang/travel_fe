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
const MIN_OPTIONAL_SECTION_ITEMS = 3;
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

const bookingBenefits = [
  "Báo giá trước khi xác nhận",
  "Kiểm tra lịch theo yêu cầu",
  "Hỗ trợ nhóm golfer",
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

function attributeFlag(product: Product, key: string) {
  return product.attributes?.[key] === true;
}

function numericAttribute(product: Product, key: string) {
  const value = product.attributes?.[key];
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function centerDistanceMeta(product: Product) {
  const distance = numericAttribute(product, "distance_to_center");
  const travelTime = numericAttribute(product, "travel_time_to_center");
  const parts = [];

  if (distance !== null) {
    parts.push(`Cách trung tâm ${formatVnd(distance)} km`);
  }

  if (travelTime !== null) {
    parts.push(`Khoảng ${Math.round(travelTime)} phút từ trung tâm`);
  }

  return parts.join(" · ");
}

function courseMeta(product: Product) {
  const centerMeta = centerDistanceMeta(product);
  if (centerMeta) return centerMeta;

  const holes =
    product.attributes?.holes ||
    product.attributes?.hole_count ||
    product.attributes?.golf_holes;
  const duration = product.duration || (holes ? `${holes} hố` : null);

  return duration || "Kiểm tra lịch theo yêu cầu";
}

function localizeTeeTimeText(value?: string | null) {
  if (!value) return value;

  return value
    .replace(/\bDa Nang\b/g, "Đà Nẵng")
    .replace(/\b6\s*km\s*from\s*Center\b/gi, "Cách trung tâm 6 km")
    .replace(/\b25\s*minutes\s*from\s*center\b/gi, "Khoảng 25 phút từ trung tâm");
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

function sortByDisplayOrder(products: Product[]) {
  return [...products].sort((a, b) => {
    const orderA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.sort_order ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) return orderA - orderB;

    return a.id - b.id;
  });
}

function isWeekendRecommended(product: Product) {
  return attributeFlag(product, "is_weekend_recommended");
}

function isNearCenter(product: Product) {
  return attributeFlag(product, "is_near_center");
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
  const location = localizeTeeTimeText(product.location) || "Việt Nam";
  const meta = localizeTeeTimeText(courseMeta(product)) || "Kiểm tra lịch theo yêu cầu";

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
            <span>{location}</span>
            <span>{meta}</span>
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
  const selectedLocation = searchParams.get("location");
  const teeTimeProducts = products.filter(
    (product) => product.category?.layout_key === "tee_time",
  );
  const sortedTeeTimeProducts = sortByDisplayOrder(teeTimeProducts);
  const featuredProducts = sortedTeeTimeProducts
    .filter((product) => product.is_featured)
    .slice(0, SHELF_PRODUCT_LIMIT);
  const weekendProducts = sortedTeeTimeProducts
    .filter(isWeekendRecommended)
    .slice(0, SHELF_PRODUCT_LIMIT);
  const nearCenterProducts = sortedTeeTimeProducts
    .filter(isNearCenter)
    .slice(0, SHELF_PRODUCT_LIMIT);
  const productSections: ProductSection[] = [
    ...(featuredProducts.length > 0
      ? [
          {
            tone: "green" as const,
            title: "Sân golf được quan tâm",
            href: `${TEE_TIME_LISTING_PATH}?tag=featured`,
            products: featuredProducts,
          },
        ]
      : []),
    ...(weekendProducts.length >= MIN_OPTIONAL_SECTION_ITEMS
      ? [
          {
            tone: "cream" as const,
            title: "Tee time cuối tuần",
            href: `${TEE_TIME_LISTING_PATH}?tag=weekend`,
            products: weekendProducts,
          },
        ]
      : []),
    ...(nearCenterProducts.length >= MIN_OPTIONAL_SECTION_ITEMS
      ? [
          {
            tone: "gold" as const,
            title: "Sân gần trung tâm",
            href: `${TEE_TIME_LISTING_PATH}?tag=near-center`,
            products: nearCenterProducts,
          },
        ]
      : []),
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
            <h2>Khám phá tee time phù hợp</h2>
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
              <span>Quyền lợi GOLFNITY</span>
              <h2>Quyền lợi khi đặt tee time</h2>
            </div>
          </div>
          <div className={styles.couponList}>
            {bookingBenefits.map((benefit) => (
              <span key={benefit}>{benefit}</span>
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

      <FooterFive />
    </>
  );
};

export default TeeTimeHubPage;
