"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TeeTimeSectionNavItem = {
  id: string;
  label: string;
};

const TeeTimeSectionNav = ({
  items,
}: {
  items: TeeTimeSectionNavItem[];
}) => {
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const visibleItems = useMemo(() => items, [items]);
  const [activeId, setActiveId] = useState(visibleItems[0]?.id || "");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("tee-time-section-nav-sentinel");

    if (!sentinel) return;

    let headerOffset = 76;
    let observer: IntersectionObserver | null = null;
    let frame = 0;

    const readHeaderOffset = () => {
      const value = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--main-header-height",
        ),
      );

      return Number.isFinite(value) ? value : 76;
    };

    const updateVisibility = (entry?: IntersectionObserverEntry) => {
      const top = entry?.boundingClientRect.top ?? sentinel.getBoundingClientRect().top;
      const isIntersecting = entry?.isIntersecting ?? top >= headerOffset;

      setIsVisible(!isIntersecting && top <= headerOffset);
    };

    const scheduleVisibilityUpdate = (entry?: IntersectionObserverEntry) => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateVisibility(entry);
      });
    };

    const observeSentinel = () => {
      observer?.disconnect();
      headerOffset = readHeaderOffset();
      observer = new IntersectionObserver(
        ([entry]) => scheduleVisibilityUpdate(entry),
        {
          root: null,
          rootMargin: `-${headerOffset}px 0px 0px 0px`,
          threshold: 0,
        },
      );
      observer.observe(sentinel);
      updateVisibility();
    };

    observeSentinel();
    window.addEventListener("resize", observeSentinel);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      observer?.disconnect();
      window.removeEventListener("resize", observeSentinel);
    };
  }, []);

  useEffect(() => {
    if (visibleItems.length === 0) return;

    setActiveId((current) =>
      visibleItems.some((item) => item.id === current)
        ? current
        : visibleItems[0].id,
    );

    const sections = visibleItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    const stickyOffset = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--tee-time-sticky-offset",
      ),
    );
    const topOffset = Number.isFinite(stickyOffset) ? stickyOffset : 152;
    const activationLine = topOffset + 24;
    let frame = 0;

    const updateActiveSection = () => {
      const currentSection = sections.reduce<HTMLElement | null>(
        (current, section) => {
          if (section.getBoundingClientRect().top <= activationLine) {
            return section;
          }

          return current;
        },
        sections[0],
      );

      if (currentSection?.id) {
        setActiveId(currentSection.id);
      }
    };

    const scheduleActiveUpdate = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActiveSection();
      });
    };

    const observer = new IntersectionObserver(
      () => {
        scheduleActiveUpdate();
      },
      {
        rootMargin: `-${topOffset}px 0px -60% 0px`,
        threshold: [0, 0.01, 0.12, 0.28],
      },
    );

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", scheduleActiveUpdate, {
      passive: true,
    });
    updateActiveSection();

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      observer.disconnect();
      window.removeEventListener("scroll", scheduleActiveUpdate);
    };
  }, [visibleItems]);

  useEffect(() => {
    itemRefs.current[activeId]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  if (visibleItems.length === 0) return null;
  if (!isVisible) return null;

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);

    if (!target) return;

    setActiveId(id);
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    itemRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <section className="teeTimeSectionNav">
      <div className="container">
        <nav className="teeTimeSectionNav__track" aria-label="Nội dung tee time">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              ref={(node) => {
                itemRefs.current[item.id] = node;
              }}
              type="button"
              className={activeId === item.id ? "is-active" : ""}
              aria-current={activeId === item.id ? "true" : undefined}
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default TeeTimeSectionNav;
