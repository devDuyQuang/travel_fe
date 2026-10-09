import FeatureDetailsOne from "@/components/features/feature-details-one";
import FeatureDetailsTwo from "@/components/features/feature-details-two";
import FeatureOne from "@/components/features/feature-one";
import FeatureThree from "@/components/features/feature-three";
import FeatureTwo from "@/components/features/feature-two";
import type { ComponentType } from "react";
import type { Product } from "@/types/product";
import type { ServiceSearchLabels } from "@/types/service-layout";

import {
  defaultServiceLayoutKey,
  isServiceLayoutKey,
  serviceLayoutDefinitions,
  type ServiceLayoutDefinition,
  type ServiceLayoutKey,
} from "@/lib/serviceLayoutConfig";

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

export type ServiceLayoutConfig = ServiceLayoutDefinition & {
  listing: ComponentType<ListingProps>;
  detail: ComponentType<DetailProps>;
};

export const serviceLayoutRegistry = {
  tee_time: {
    ...serviceLayoutDefinitions.tee_time,
    listing: FeatureTwo,
    detail: FeatureDetailsOne,
  },
  tour: {
    ...serviceLayoutDefinitions.tour,
    listing: FeatureThree,
    detail: FeatureDetailsOne,
  },
  accommodation: {
    ...serviceLayoutDefinitions.accommodation,
    listing: FeatureOne,
    detail: FeatureDetailsTwo,
  },
  transport: {
    ...serviceLayoutDefinitions.transport,
    listing: FeatureThree,
    detail: FeatureDetailsOne,
  },
  attraction: {
    ...serviceLayoutDefinitions.attraction,
    listing: FeatureThree,
    detail: FeatureDetailsOne,
  },
} satisfies Record<ServiceLayoutKey, ServiceLayoutConfig>;

export function getServiceLayoutConfig(value?: string | null): ServiceLayoutConfig {
  const key = isServiceLayoutKey(value) ? value : defaultServiceLayoutKey;
  return serviceLayoutRegistry[key];
}
