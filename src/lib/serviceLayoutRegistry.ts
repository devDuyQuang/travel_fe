import FeatureDetailsOne from "@/components/features/feature-details-one";
import FeatureDetailsTwo from "@/components/features/feature-details-two";
import FeatureOne from "@/components/features/feature-one";
import FeatureThree from "@/components/features/feature-three";
import FeatureTwo from "@/components/features/feature-two";
import type { ComponentType } from "react";
import type { Product } from "@/types/product";
import type { ServiceSearchLabels } from "@/types/service-layout";

export type ServiceLayoutKey =
  | "tee_time"
  | "tour"
  | "accommodation"
  | "transport"
  | "attraction";

export type ServiceTemplatePage = "shop_1" | "shop_2" | "shop_3";

type ListingProps = {
  title?: string;
  subTitle?: string;
  detailBasePath?: string;
  items?: Product[];
  searchLabels?: ServiceSearchLabels;
  layoutKey?: ServiceLayoutKey | string | null;
  categorySlug?: string;
};

type DetailProps = {
  product?: Product | null;
  relatedProducts?: Product[];
};

export type ServiceLayoutConfig = {
  listing: ComponentType<ListingProps>;
  detail: ComponentType<DetailProps>;
  templatePage: ServiceTemplatePage;
  searchLabels: ServiceSearchLabels;
  searchQuery: {
    location: string;
    startDate: string;
    endDate?: string;
    guests: string;
    startDateMode?: "date" | "datetime";
  };
};

export const defaultServiceLayoutKey: ServiceLayoutKey = "tour";
export const serviceLayoutOrder: ServiceLayoutKey[] = [
  "tee_time",
  "tour",
  "accommodation",
  "transport",
  "attraction",
];

export function getServiceLayoutOrder(value?: string | null) {
  const index = serviceLayoutOrder.findIndex((key) => key === value);
  return index >= 0 ? index : serviceLayoutOrder.length;
}

export const serviceLayoutRegistry = {
  tee_time: {
    listing: FeatureTwo,
    detail: FeatureDetailsOne,
    templatePage: "shop_2",
    searchLabels: {
      location: "Sân golf",
      locationPlaceholder: "Chọn sân golf",
      startDate: "Ngày chơi",
      guests: "Số golfer",
    },
    searchQuery: {
      location: "location",
      startDate: "play_date",
      guests: "golfers",
    },
  },
  tour: {
    listing: FeatureThree,
    detail: FeatureDetailsOne,
    templatePage: "shop_3",
    searchLabels: {
      location: "Điểm đến",
      locationPlaceholder: "Chọn điểm đến",
      startDate: "Ngày khởi hành",
      guests: "Số khách",
    },
    searchQuery: {
      location: "destination",
      startDate: "departure_date",
      guests: "guests",
    },
  },
  accommodation: {
    listing: FeatureOne,
    detail: FeatureDetailsTwo,
    templatePage: "shop_1",
    searchLabels: {
      location: "Địa điểm",
      locationPlaceholder: "Chọn địa điểm",
      startDate: "Ngày nhận phòng",
      endDate: "Ngày trả phòng",
      guests: "Số khách",
    },
    searchQuery: {
      location: "destination",
      startDate: "check_in",
      endDate: "check_out",
      guests: "guests",
    },
  },
  transport: {
    listing: FeatureThree,
    detail: FeatureDetailsOne,
    templatePage: "shop_3",
    searchLabels: {
      location: "Điểm đón",
      locationPlaceholder: "Chọn điểm đón",
      startDate: "Ngày giờ đón",
      guests: "Số hành khách",
    },
    searchQuery: {
      location: "pickup",
      startDate: "pickup_at",
      guests: "passengers",
      startDateMode: "datetime",
    },
  },
  attraction: {
    listing: FeatureThree,
    detail: FeatureDetailsOne,
    templatePage: "shop_3",
    searchLabels: {
      location: "Địa điểm",
      locationPlaceholder: "Chọn địa điểm",
      startDate: "Ngày tham quan",
      guests: "Số vé",
    },
    searchQuery: {
      location: "destination",
      startDate: "visit_date",
      guests: "tickets",
    },
  },
} satisfies Record<ServiceLayoutKey, ServiceLayoutConfig>;

export function isServiceLayoutKey(value?: string | null): value is ServiceLayoutKey {
  return Boolean(value && value in serviceLayoutRegistry);
}

export function getServiceLayoutConfig(value?: string | null): ServiceLayoutConfig {
  const key = isServiceLayoutKey(value) ? value : defaultServiceLayoutKey;
  return serviceLayoutRegistry[key];
}

export const fallbackServiceCategories = [
  { id: -1, name: "Đặt tee time", slug: "dat-tee-time", type: "service", layout_key: "tee_time" },
  { id: -2, name: "Tour golf", slug: "tour-golf-viet-nam", type: "service", layout_key: "tour" },
  { id: -3, name: "Lưu trú", slug: "khach-san-nghi-duong", type: "service", layout_key: "accommodation" },
  { id: -4, name: "Thuê xe", slug: "thue-xe-dua-don", type: "service", layout_key: "transport" },
  { id: -5, name: "Tham quan", slug: "tham-quan-trai-nghiem", type: "service", layout_key: "attraction" },
] as const;
