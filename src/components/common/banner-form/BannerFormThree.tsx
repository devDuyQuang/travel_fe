"use client";

import { useEffect, useMemo, useState } from "react";
import BannerFormTwo from "./BannerFormTwo";
import { getServiceCategories } from "@/services/service.service";
import {
  fallbackServiceCategories,
  getServiceLayoutConfig,
  isServiceLayoutKey,
  getServiceLayoutOrder,
} from "@/lib/serviceLayoutRegistry";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";
import type { CmsServiceCategory } from "@/types/cms-post";

const iconClasses: Record<string, string> = {
  tee_time: "fa-regular fa-golf-flag-hole",
  tour: "fa-regular fa-map",
  accommodation: "fa-regular fa-hotel",
  transport: "fa-regular fa-car",
  attraction: "fa-regular fa-ticket",
};

const tabTitles: Record<string, string> = {
  tee_time: "Đặt Tee Time",
  tour: "Tour Golf Việt Nam",
  accommodation: "Khách Sạn & Nghỉ Dưỡng",
  transport: "Thuê Xe & Đưa Đón",
  attraction: "Tham Quan & Trải Nghiệm",
};

const BannerFormThree = ({
  initialCategories = [],
}: {
  initialCategories?: CmsServiceCategory[];
}) => {
  const setting = useHomepageSettings().search_home;
  const [categories, setCategories] = useState<CmsServiceCategory[]>(
    initialCategories.length
      ? initialCategories
      : fallbackServiceCategories.map((category) => ({ ...category })),
  );
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (initialCategories.length) return;

    getServiceCategories()
      .then((items) => {
        if (items.length) setCategories(items);
      })
      .catch(() => {
        setCategories(fallbackServiceCategories.map((category) => ({ ...category })));
      });
  }, [initialCategories.length]);

  const tabs = useMemo(() => {
    const configured = new Map(
      (setting?.tabs || []).map((tab) => [Number(tab.category_id), tab]),
    );
    const hasConfiguration = (setting?.tabs?.length || 0) > 0;
    const canApplyConfiguration =
      hasConfiguration &&
      categories.every((category) => Number.isFinite(Number(category.id)));

    const mappedTabs = categories
      .filter((category) => isServiceLayoutKey(category.layout_key))
      .map((category) => {
        const tab = configured.get(category.id);
        return {
          category,
          enabled: canApplyConfiguration ? tab?.enabled !== false && Boolean(tab) : true,
          sort: tab?.sort ?? getServiceLayoutOrder(category.layout_key),
          title:
            tabTitles[category.layout_key || ""] ||
            tab?.display_name?.trim() ||
            category.name,
          placeholder: tab?.placeholder?.trim() || "",
        };
      })
      .sort((a, b) => a.sort - b.sort);

    const enabledTabs = mappedTabs.filter((tab) => tab.enabled);

    return enabledTabs.length
      ? enabledTabs
      : mappedTabs.map((tab) => ({ ...tab, enabled: true }));
  }, [categories, setting]);

  useEffect(() => {
    if (activeTab >= tabs.length) setActiveTab(0);
  }, [activeTab, tabs.length]);

  if (tabs.length === 0) return null;

  const active = tabs[activeTab] || tabs[0];
  const config = getServiceLayoutConfig(active.category.layout_key);
  const labels = {
    ...config.searchLabels,
    locationPlaceholder: config.searchLabels.locationPlaceholder,
  };

  return (
    <div className="tg-booking-form-area tg-booking-form-space golfnity-home-booking pb-105">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-12">
            <div className="tg-booking-form-wrap">
              <div className="tg-booking-form-tabs">
                <div className="nav nav-tab justify-content-center" role="tablist">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.category.slug}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === index}
                      className={`nav-link ${activeTab === index ? "active" : ""}`}
                      onClick={() => setActiveTab(index)}
                    >
                      <span className="borders"></span>
                      <span className="icon">
                        <i className={iconClasses[tab.category.layout_key || "tour"]}></i>
                      </span>
                      <span>{tab.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="tab-content">
                <div className="tab-pane fade show active">
                  <div className="tg-booking-form-item">
                    <BannerFormTwo
                      key={active.category.slug}
                      category={active.category}
                      labels={labels}
                      query={config.searchQuery}
                      buttonLabel={setting?.button_label?.trim() || "Tìm kiếm"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerFormThree;
