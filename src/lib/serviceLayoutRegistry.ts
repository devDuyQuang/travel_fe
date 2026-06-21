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
};

export const defaultServiceLayoutKey: ServiceLayoutKey = "tour";

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
  },
  transport: {
    listing: FeatureThree,
    detail: FeatureDetailsOne,
    templatePage: "shop_3",
    searchLabels: {
      location: "Điểm đón",
      locationPlaceholder: "Chọn điểm đón",
      startDate: "Ngày giờ đón",
      guests: "Số khách",
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
  },
} satisfies Record<ServiceLayoutKey, ServiceLayoutConfig>;

export function isServiceLayoutKey(value?: string | null): value is ServiceLayoutKey {
  return Boolean(value && value in serviceLayoutRegistry);
}

export function getServiceLayoutConfig(value?: string | null): ServiceLayoutConfig {
  const key = isServiceLayoutKey(value) ? value : defaultServiceLayoutKey;
  return serviceLayoutRegistry[key];
}
