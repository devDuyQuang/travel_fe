"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product";
import TeeTimePriceCard from "./TeeTimePriceCard";

type PriceCardMode = "inline" | "fixed" | "hidden";

const readCssNumber = (name: string, fallback: number) => {
  if (typeof window === "undefined") return fallback;

  const value = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(name),
  );

  return Number.isFinite(value) ? value : fallback;
};

const TeeTimeSmartPriceCard = ({
  product,
  targetId,
  endId = "tee-time-price-card-end",
  startAfterId = null,
  stopId = null,
}: {
  product: Product | null;
  targetId: string;
  endId?: string;
  startAfterId?: string | null;
  stopId?: string | null;
}) => {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<PriceCardMode>("inline");
  const [fixedStyle, setFixedStyle] = useState<CSSProperties>({});
  const [shellStyle, setShellStyle] = useState<CSSProperties>({});

  useEffect(() => {
    const shell = shellRef.current;

    if (!shell) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      if (window.innerWidth < 992) {
        setMode("inline");
        setFixedStyle({});
        setShellStyle({});
        return;
      }

      const packageSection = document.getElementById(targetId);
      const endSentinel =
        document.getElementById(endId) ||
        document.querySelector<HTMLElement>("[data-tee-time-price-end]");
      const stopSection = stopId ? document.getElementById(stopId) : null;
      const startSection = startAfterId ? document.getElementById(startAfterId) : null;
      const card = shell.querySelector<HTMLElement>(".tee-time-price-card");

      if (!card) return;

      const shellRect = shell.getBoundingClientRect();
      const cardHeight = card.offsetHeight;
      const headerHeight = readCssNumber("--main-header-height", 76);
      const sectionNav = document.querySelector<HTMLElement>(".teeTimeSectionNav");
      const navHeight = sectionNav?.offsetHeight || 0;
      const fixedTop = headerHeight + navHeight + 28;
      const fixedBottom = fixedTop + cardHeight;
      const packageRect = packageSection?.getBoundingClientRect();
      const endRect = endSentinel?.getBoundingClientRect();
      const stopRect = stopSection?.getBoundingClientRect();
      const startRect = startSection?.getBoundingClientRect();
      const packageIsOccupyingRightColumn =
        Boolean(packageRect) &&
        packageRect!.top < fixedBottom + 16 &&
        packageRect!.bottom > fixedTop + 16;
      const isBeforeFixedStart =
        Boolean(startRect) && startRect!.top > fixedBottom + 32;
      const hasReachedContentEnd =
        Boolean(endRect) && endRect!.top < fixedBottom + 32;
      const reachedStopSection =
        Boolean(stopRect) && stopRect!.top < fixedBottom + 24;

      let nextMode: PriceCardMode = "fixed";

      if (shellRect.top > fixedTop) {
        nextMode = "inline";
      } else if (
        packageIsOccupyingRightColumn ||
        isBeforeFixedStart ||
        hasReachedContentEnd ||
        reachedStopSection
      ) {
        nextMode = "hidden";
      }

      setMode(nextMode);

      setFixedStyle({
        "--tee-time-price-card-left": `${shellRect.left}px`,
        "--tee-time-price-card-width": `${shellRect.width}px`,
        "--tee-time-price-card-top": `${fixedTop}px`,
      } as CSSProperties);
      setShellStyle({
        minHeight: nextMode === "inline" ? undefined : `${cardHeight}px`,
      });
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(shell);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [endId, startAfterId, stopId, targetId]);

  return (
    <div
      ref={shellRef}
      className="tee-time-smart-price-card-shell"
      style={shellStyle}
    >
      <div
        className={`tee-time-smart-price-card is-${mode}`}
        style={fixedStyle}
      >
        <TeeTimePriceCard
          product={product}
          targetId={targetId}
          className="tee-time-smart-price-card__card"
        />
      </div>
    </div>
  );
};

export default TeeTimeSmartPriceCard;
