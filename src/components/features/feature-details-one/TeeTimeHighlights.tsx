"use client";

import { useEffect, useId, useRef } from "react";
import type { Product } from "@/types/product";

const DEMO_TEE_TIME_HIGHLIGHTS = [
  "Trải nghiệm các tiện nghi và dịch vụ đẳng cấp thế giới của Ba Na Hills Golf Club, chẳng hạn như câu lạc bộ hiện đại và hơn thế nữa!",
  "Tận hưởng chơi gôn bất cứ lúc nào vì cơ sở này tự hào có sân gôn có đèn pha cho những ai muốn chơi vào ban đêm",
  "Dẫn những người thân yêu của bạn vào trải nghiệm đầy thú vị này, nơi họ có thể đánh giá cao một môn thể thao mới",
  "Tận hưởng dịch vụ đưa đón dễ dàng giữa khách sạn của bạn ở Thành phố Đà Nẵng và Ba Na Hills Golf Club",
];

const TeeTimeHighlights = ({
  isOpen,
  onClose,
  onOpen,
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalItems = DEMO_TEE_TIME_HIGHLIGHTS;
  const collapsedHighlights = modalItems.slice(0, 2);
  const canOpenModal = modalItems.length > collapsedHighlights.length;

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      openerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  if (modalItems.length === 0) {
    return null;
  }

  return (
    <>
      <section className="tee-time-highlights-card tee-time-highlights-teaser" aria-label="Tóm tắt điểm nổi bật">
        {collapsedHighlights.length > 0 && (
          <ul>
            {collapsedHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {canOpenModal && (
          <button
            ref={openerRef}
            type="button"
            className="tee-time-text-button"
            onClick={onOpen}
          >
            Xem thêm &gt;
          </button>
        )}
        <span className="tee-time-highlights-teaser__mark" aria-hidden="true">
          <i className="fa-regular fa-lightbulb" />
        </span>
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
            ref={modalRef}
            className="tee-time-modal"
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
            <h3 id={`${titleId}-modal`}>Điểm nổi bật</h3>
            <ul>
              {modalItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default TeeTimeHighlights;
