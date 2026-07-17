"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import FooterFive from "@/layouts/footers/FooterFive";
import HeaderThree from "@/layouts/headers/HeaderThree";
import { buildProductDetailHref } from "@/lib/productLinks";
import { resolveMediaUrl } from "@/services/post.service";
import type { Product } from "@/types/product";

import styles from "./TeeTimeMarketplacePage.module.css";

export type TeeTimeMarketplaceMode = "all" | "featured" | "weekend" | "near-center";

type TeeTimeMarketplacePageProps = {
  mode: TeeTimeMarketplaceMode;
  products: Product[];
};

const TEE_TIME_LISTING_PATH = "/dich-vu/dat-tee-time/danh-sach";

const modeCopy: Record<TeeTimeMarketplaceMode, { title: string; label: string }> = {
  all: {
    title: "Top tee time & trải nghiệm golf tại các điểm đến nổi bật",
    label: "Tất cả trải nghiệm",
  },
  featured: {
    title: "Sân golf được quan tâm",
    label: "Golfnity gợi ý",
  },
  weekend: {
    title: "Tee time cuối tuần",
    label: "Lịch chơi cuối tuần",
  },
  "near-center": {
    title: "Sân gần trung tâm",
    label: "Di chuyển thuận tiện",
  },
};

const areaOptions = [
  ["", "Khu vực"],
  ["da-nang", "Đà Nẵng"],
  ["tp-ho-chi-minh", "TP. Hồ Chí Minh"],
  ["ha-noi", "Hà Nội"],
  ["nha-trang", "Nha Trang"],
  ["phu-quoc", "Phú Quốc"],
  ["hoi-an", "Hội An"],
];

const serviceOptions = [
  ["", "Loại sân / dịch vụ"],
  ["tee-time", "Tee time"],
  ["premium", "Sân cao cấp"],
  ["group", "Nhóm golfer"],
];

const seoChips = [
  ["Golf Đà Nẵng", "location=da-nang"],
  ["Tee time TP.HCM", "location=tp-ho-chi-minh"],
  ["Sân golf Nha Trang", "location=nha-trang"],
  ["Golf Phú Quốc", "location=phu-quoc"],
  ["Golf Hội An", "location=hoi-an"],
  ["Sân golf gần trung tâm", "tag=near-center"],
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
    product.sale_price,
    product.price,
    product.regular_price,
  ]
    .map((value) => numericPrice(value))
    .filter((price): price is number => Boolean(price));
  const prices = [...optionPrices, ...directPrices];

  return prices.length ? `Từ ${formatVnd(Math.min(...prices))}đ` : "Liên hệ";
}

function productImage(product: Product, index: number) {
  const fallbacks = [
    "/assets/img/listing/listing-1.jpg",
    "/assets/img/listing/listing-2.jpg",
    "/assets/img/listing/listing-3.jpg",
    "/assets/img/listing/listing-4.jpg",
  ];

  return (
    resolveMediaUrl(product.image_url) ||
    resolveMediaUrl(product.gallery?.[0]) ||
    fallbacks[index % fallbacks.length]
  );
}

function courseMeta(product: Product) {
  const holes =
    product.attributes?.holes ||
    product.attributes?.hole_count ||
    product.attributes?.golf_holes;

  return product.duration || (holes ? `${holes} hố` : "Kiểm tra lịch theo yêu cầu");
}

function normalize(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[-_]+/g, " ")
    .toLowerCase();
}

function includesAny(product: Product, values: string[]) {
  const haystack = normalize(
    [
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
      .join(" "),
  );

  return values.some((value) => haystack.includes(value));
}

function marketplaceProducts(products: Product[], mode: TeeTimeMarketplaceMode) {
  const teeTimeProducts = products.filter(
    (product) => product.category?.layout_key === "tee_time",
  );
  const source = teeTimeProducts.length ? teeTimeProducts : products;
  let preferred = source;

  if (mode === "featured") {
    preferred = source.filter((product) => product.is_featured || product.badge);
  }

  if (mode === "weekend") {
    preferred = source.filter((product) =>
      includesAny(product, ["cuoi tuan", "weekend", "thu bay", "chu nhat"]),
    );
  }

  if (mode === "near-center") {
    preferred = source.filter((product) =>
      includesAny(product, ["trung tam", "center", "phut", "km"]),
    );
  }

  return preferred.length ? preferred : source;
}

function productBadge(product: Product) {
  if (product.badge) return product.badge;
  if (product.is_featured) return "Được quan tâm";
  return null;
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const href = buildProductDetailHref(product);
  const rating = Number(product.rating);
  const hasRating =
    Number.isFinite(rating) && rating > 0 && Boolean(product.review_count && product.review_count > 0);

  return (
    <Link className={styles.card} href={href}>
      <span className={styles.cardImage}>
        <Image
          alt={product.name}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 25vw"
          src={productImage(product, index)}
        />
        {productBadge(product) && <span className={styles.badge}>{productBadge(product)}</span>}
      </span>
      <span className={styles.cardBody}>
        <strong className={styles.cardTitle}>{product.name}</strong>
        <span className={styles.metaLine}>
          <span>{product.location || "Việt Nam"}</span>
          <span>{courseMeta(product)}</span>
        </span>
        {hasRating && (
          <span className={styles.ratingLine}>
            <i className="fa-solid fa-star" aria-hidden="true" />
            {rating.toFixed(1)} ({product.review_count})
          </span>
        )}
        <span className={styles.serviceChips}>
          <span>Báo giá trước</span>
          <span>Giữ lịch rõ ràng</span>
          <span>Tư vấn trước khi đặt</span>
        </span>
        <span className={styles.cardFooter}>
          <strong>{resolveStartingPrice(product)}</strong>
          <span>Xem sân</span>
        </span>
      </span>
    </Link>
  );
}

const TeeTimeMarketplacePage = ({
  mode,
  products,
}: TeeTimeMarketplacePageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [playDate, setPlayDate] = useState(searchParams.get("play_date") || "");
  const [serviceType, setServiceType] = useState(searchParams.get("service_type") || "");
  const [sort, setSort] = useState("recommended");
  const queryKeyword = searchParams.get("keyword") || "";
  const queryLocation = searchParams.get("location") || "";
  const queryServiceType = searchParams.get("service_type") || "";
  const queryTag = searchParams.get("tag") || "";
  const copy = modeCopy[mode];
  const resultProducts = useMemo(() => {
    const baseProducts = marketplaceProducts(products, mode);
    const normalizedKeyword = normalize(queryKeyword);
    const normalizedLocation = normalize(queryLocation);
    const normalizedServiceType = normalize(queryServiceType);
    const normalizedTag =
      queryTag && !["featured", "weekend", "near-center"].includes(queryTag)
        ? normalize(queryTag)
        : "";
    const filtered = baseProducts.filter((product) => {
      const productText = normalize(
        [
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
          .join(" "),
      );

      return (
        (!normalizedKeyword || productText.includes(normalizedKeyword)) &&
        (!normalizedLocation || productText.includes(normalizedLocation)) &&
        (!normalizedServiceType || productText.includes(normalizedServiceType)) &&
        (!normalizedTag || productText.includes(normalizedTag))
      );
    });

    if (sort === "price-asc") {
      return [...filtered].sort((a, b) => {
        const aPrice = numericPrice(resolveStartingPrice(a).replace(/\D/g, ""));
        const bPrice = numericPrice(resolveStartingPrice(b).replace(/\D/g, ""));
        return (aPrice || Number.MAX_SAFE_INTEGER) - (bPrice || Number.MAX_SAFE_INTEGER);
      });
    }

    if (sort === "newest") {
      return [...filtered].sort((a, b) =>
        String(b.created_at || "").localeCompare(String(a.created_at || "")),
      );
    }

    return filtered;
  }, [mode, products, queryKeyword, queryLocation, queryServiceType, queryTag, sort]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location) params.set("location", location);
    if (playDate) params.set("play_date", playDate);
    if (serviceType) params.set("service_type", serviceType);

    router.push(
      params.toString()
        ? `${TEE_TIME_LISTING_PATH}?${params.toString()}`
        : TEE_TIME_LISTING_PATH,
    );
  };

  return (
    <>
      <HeaderThree />
      <main className={styles.page}>
        <section className={styles.banner}>
          <div className={styles.bannerInner}>
            <span>{copy.label}</span>
            <h1>{copy.title}</h1>
            <p>
              Lọc sân golf, điểm đến và gói tee time với thông tin rõ ràng trước
              khi gửi yêu cầu đặt lịch.
            </p>
          </div>
        </section>

        <section className={styles.shell}>
          <form
            className={`${styles.filterPanel} golfnity-search-bar`}
            onSubmit={handleSubmit}
          >
            <label className={styles.searchField}>
              <i className="fa-regular fa-magnifying-glass" aria-hidden="true" />
              <input
                autoComplete="off"
                className="golfnity-form-control"
                name="tee_time_marketplace_query"
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm sân golf, điểm đến hoặc gói tee time"
                type="search"
                value={keyword}
              />
            </label>
            <div className={styles.filterRow}>
              <select
                aria-label="Khu vực"
                className="golfnity-form-select"
                onChange={(event) => setLocation(event.target.value)}
                value={location}
              >
                {areaOptions.map(([value, label]) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                aria-label="Ngày chơi"
                className="golfnity-form-control"
                onChange={(event) => setPlayDate(event.target.value)}
                type="date"
                value={playDate}
              />
              <select
                aria-label="Loại sân hoặc dịch vụ"
                className="golfnity-form-select"
                onChange={(event) => setServiceType(event.target.value)}
                value={serviceType}
              >
                {serviceOptions.map(([value, label]) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button className="golfnity-form-button" type="submit">
                Lọc
              </button>
            </div>
          </form>

          <div className={styles.toolbar}>
            <div>
              <strong>{resultProducts.length} dịch vụ</strong>
              <span>Kiểm tra lịch và giá trước khi thanh toán.</span>
            </div>
            <label>
              <span>Sắp xếp</span>
              <select
                aria-label="Sắp xếp"
                className="golfnity-form-select"
                onChange={(event) => setSort(event.target.value)}
                value={sort}
              >
                <option value="recommended">Golfnity gợi ý</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="newest">Mới nhất</option>
              </select>
            </label>
          </div>

          <div className={styles.grid}>
            {resultProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <section className={styles.promoStrip}>
            <div>
              <strong>Ưu đãi tee time</strong>
              <span>Nhận báo giá trước khi thanh toán</span>
            </div>
            <div>
              <strong>Giữ lịch rõ ràng</strong>
              <span>GOLFNITY kiểm tra lịch sân theo yêu cầu</span>
            </div>
            <div>
              <strong>Hỗ trợ nhóm golfer và doanh nghiệp</strong>
              <span>Tư vấn lựa chọn sân, giờ chơi và phương án di chuyển</span>
            </div>
          </section>

          <nav className={styles.seoChips} aria-label="Gợi ý tìm kiếm tee time">
            {seoChips.map(([label, query]) => (
              <Link href={`${TEE_TIME_LISTING_PATH}?${query}`} key={label}>
                {label}
              </Link>
            ))}
          </nav>
        </section>
      </main>
      <FooterFive />
    </>
  );
};

export default TeeTimeMarketplacePage;
