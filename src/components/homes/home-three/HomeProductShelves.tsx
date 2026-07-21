"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RECENTLY_VIEWED_KEY } from "@/components/common/RecentlyViewedTracker";
import { buildProductDetailHref } from "@/lib/productLinks";
import {
  formatCurrencyVnd,
  getProductStartingPrice,
  numberValue,
} from "@/lib/servicePrice";
import { resolveMediaUrl } from "@/services/post.service";
import type { Product } from "@/types/product";

type ShelfProps = {
  products: Product[];
};

type RecentProductRef = {
  id?: number;
  slug?: string;
};

function productText(product: Product) {
  return [
    product.name,
    product.slug,
    product.badge,
    product.category?.name,
    product.category?.slug,
    product.short_description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("vi");
}

function hasRealDeal(product: Product) {
  const text = productText(product);
  const regular = numberValue(product.regular_price);
  const sale = numberValue(product.sale_price || product.price_discount);

  return (
    /sale|deal|offer|ưu đãi|khuyến mãi|giảm/.test(text) ||
    Boolean(regular && sale && sale < regular)
  );
}

function isComboGolf(product: Product) {
  const text = productText(product);

  return text.includes("combo") && text.includes("golf");
}

function productImage(product: Product) {
  return (
    resolveMediaUrl(product.image_url) ||
    product.image_url ||
    "/assets/img/breadcrumb/breadcrumb.jpg"
  );
}

function ProductMiniCard({ product }: { product: Product }) {
  const href = buildProductDetailHref(product);
  const startingPrice = getProductStartingPrice(product);

  return (
    <Link className="golfnity-product-shelf__card" href={href}>
      <span className="golfnity-product-shelf__image">
        <Image
          src={productImage(product)}
          alt={product.name}
          width={360}
          height={240}
        />
      </span>
      <span className="golfnity-product-shelf__body">
        <span className="golfnity-product-shelf__name">{product.name}</span>
        <span className="golfnity-product-shelf__meta">
          {product.location || product.category?.name || "GOLFNITY"}
        </span>
        <span className="golfnity-product-shelf__footer">
          <span>
            {startingPrice.amount
              ? `Từ ${formatCurrencyVnd(startingPrice.amount)}`
              : "Liên hệ"}
          </span>
          <span className="golfnity-product-shelf__cta">Xem chi tiết</span>
        </span>
      </span>
    </Link>
  );
}

function ProductShelf({
  title,
  subtitle,
  products,
  minItems = 1,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  minItems?: number;
}) {
  if (products.length < minItems) return null;

  return (
    <section className="golfnity-product-shelf tg-grey-bg">
      <div className="container">
        <div className="golfnity-product-shelf__heading">
          <span>{subtitle}</span>
          <h2>{title}</h2>
        </div>
        <div className="golfnity-product-shelf__grid">
          {products.slice(0, 4).map((product) => (
            <ProductMiniCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecentlyViewedShelf({ products }: ShelfProps) {
  const [recentRefs, setRecentRefs] = useState<RecentProductRef[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENTLY_VIEWED_KEY);
      const parsed = raw ? (JSON.parse(raw) as RecentProductRef[]) : [];
      setRecentRefs(Array.isArray(parsed) ? parsed : []);
    } catch {
      setRecentRefs([]);
    }
  }, []);

  const recentProducts = useMemo(() => {
    return recentRefs
      .map((ref) =>
        products.find(
          (product) => product.id === ref.id || product.slug === ref.slug,
        ),
      )
      .filter((product): product is Product => Boolean(product));
  }, [products, recentRefs]);

  return (
    <ProductShelf
      title="Xem gần đây"
      subtitle="Tiếp tục từ những dịch vụ bạn đã mở trước đó."
      products={recentProducts}
    />
  );
}

export function ComboGolfShelf({ products }: ShelfProps) {
  return (
    <ProductShelf
      title="Combo golf nổi bật"
      subtitle="Kết hợp sân golf, khách sạn và xe đưa đón cho chuyến đi trọn gói."
      products={products.filter(isComboGolf)}
    />
  );
}

export function FeaturedDealsShelf({ products }: ShelfProps) {
  return (
    <ProductShelf
      title="Ưu đãi nổi bật"
      subtitle="Những chương trình dành cho tee time, tour golf và dịch vụ đi kèm."
      products={products.filter(hasRealDeal)}
      minItems={3}
    />
  );
}
