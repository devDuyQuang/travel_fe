"use client";

import { useEffect, useId, useRef, useState } from "react";

type TeeTimeVoucher = {
  code: string;
  title: string;
  discountLabel: string;
  minimumOrder?: number;
  maximumDiscount?: number;
  paymentMethod?: string;
  category: "platform" | "payment";
};

// Local voucher data; replace with voucher API data when available.
const TEE_TIME_VOUCHERS: TeeTimeVoucher[] = [
  {
    code: "GOLF100",
    title: "Ưu đãi đặt tee time",
    discountLabel: "Giảm 100.000đ",
    minimumOrder: 2000000,
    category: "platform",
  },
  {
    code: "GOLF200",
    title: "Ưu đãi cho đơn từ 5.000.000đ",
    discountLabel: "Giảm đến 200.000đ",
    minimumOrder: 5000000,
    category: "platform",
  },
  {
    code: "GOLF5",
    title: "Ưu đãi giảm 5%",
    discountLabel: "Giảm 5%",
    maximumDiscount: 300000,
    category: "platform",
  },
];

const platformVouchers = TEE_TIME_VOUCHERS.filter(
  (voucher) => voucher.category === "platform",
);

const formatVnd = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

const getVoucherCondition = (voucher: TeeTimeVoucher) => {
  if (voucher.minimumOrder) {
    return `Đơn tối thiểu ${formatVnd(voucher.minimumOrder)}`;
  }

  if (voucher.maximumDiscount) {
    return `Giảm tối đa ${formatVnd(voucher.maximumDiscount)}`;
  }

  return "Áp dụng cho tee time đủ điều kiện";
};

const TeeTimeVoucherSection = ({
  isOpen,
  onClose,
  onOpen,
  selectedCode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: (code?: string) => void;
  selectedCode?: string;
}) => {
  const [copiedCode, setCopiedCode] = useState("");
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const selectedVoucherRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    selectedVoucherRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!copiedCode) return;

    const timeout = window.setTimeout(() => setCopiedCode(""), 1800);

    return () => window.clearTimeout(timeout);
  }, [copiedCode]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
    } catch {
      setCopiedCode(code);
    }
  };

  return (
    <>
      <section
        className="tee-time-voucher-bar"
        aria-label="Mã ưu đãi"
        onClick={() => onOpen()}
      >
        <span className="tee-time-voucher-bar__label">Mã ưu đãi</span>
        <div className="tee-time-voucher-bar__list">
          {platformVouchers.map((voucher) => (
            <button
              type="button"
              className="tee-time-voucher-chip"
              key={voucher.code}
              onClick={(event) => {
                event.stopPropagation();
                onOpen(voucher.code);
              }}
            >
              <i className="fa-regular fa-ticket" aria-hidden="true" />
              <span>{voucher.discountLabel}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="tee-time-voucher-view-all"
          aria-label="Xem tất cả mã ưu đãi"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          <i className="fa-regular fa-chevron-right" aria-hidden="true" />
        </button>
      </section>

      {isOpen && (
        <div
          className="tee-time-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <div
            className="tee-time-modal tee-time-voucher-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${titleId}-modal`}
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="tee-time-modal-close"
              aria-label="Đóng"
              onClick={onClose}
            >
              <i className="fa-regular fa-xmark" />
            </button>
            <h3 id={`${titleId}-modal`}>Ưu đãi hiện có</h3>
            <div className="tee-time-voucher-modal__section">
              {/* <h4>Mã ưu đãi nền tảng</h4> */}
              <div className="tee-time-voucher-modal__grid">
                {platformVouchers.map((voucher) => (
                  <article
                    ref={selectedCode === voucher.code ? selectedVoucherRef : undefined}
                    className={`tee-time-voucher-card${selectedCode === voucher.code ? " is-selected" : ""}`}
                    key={voucher.code}
                  >
                    <div className="tee-time-voucher-card__content">
                      <span>Ưu đãi tee time</span>
                      <h5>{voucher.title}</h5>
                      <p>{getVoucherCondition(voucher)}</p>
                      <code>Mã: {voucher.code}</code>
                    </div>
                    <div className="tee-time-voucher-card__action">
                      <span>Ưu đãi</span>
                      <strong>{voucher.discountLabel.replace("Giảm ", "")}</strong>
                      <button type="button" onClick={() => copyCode(voucher.code)}>
                        Lưu mã
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="tee-time-voucher-modal__section">
              <h4>Mã ưu đãi thanh toán</h4>
              <div className="tee-time-voucher-tabs" role="tablist" aria-label="Loại ưu đãi thanh toán">
                <button type="button" aria-selected="true">Mastercard</button>
                <button type="button" aria-selected="false">Khác</button>
              </div>
              <p className="tee-time-voucher-empty">Hiện chưa có ưu đãi thanh toán.</p>
            </div>
            {copiedCode && (
              <p className="tee-time-voucher-toast" role="status">
                Đã sao chép mã
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TeeTimeVoucherSection;
