"use client";

import type { Product } from "@/types/product";
import {
  formatCurrencyVnd,
  getProductStartingPrice,
} from "@/lib/servicePrice";

const TeeTimePriceCard = ({
  product,
  targetId,
  className = "",
}: {
  product: Product | null;
  targetId: string;
  className?: string;
}) => {
  const startingPrice = getProductStartingPrice(product);
  const hasPrice = Boolean(startingPrice.amount);

  const scrollToBooking = () => {
    const target = document.getElementById(targetId);

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    target.focus({ preventScroll: true });
  };

  const handleAction = () => {
    scrollToBooking();
  };

  return (
    <aside className={`teeTimeOverviewPriceCard teeTimePriceCard tee-time-price-card ${className}`.trim()}>
      <div className="teeTimeOverviewPrice tee-time-price-card__price">
        <span className="tee-time-price-card__label">
          Từ
        </span>
        {hasPrice ? (
          <>
            <strong>{formatCurrencyVnd(startingPrice.amount)}</strong>
            <span>/ {startingPrice.unit}</span>
          </>
        ) : (
          <strong>Liên hệ</strong>
        )}
      </div>
      <button type="button" onClick={handleAction}>
        Chọn gói tee time
      </button>
    </aside>
  );
};

export default TeeTimePriceCard;
