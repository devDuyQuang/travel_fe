import type { ServiceSearchLabels } from "@/types/service-layout";

export type ServiceLayoutKey =
  | "tee_time"
  | "tour"
  | "accommodation"
  | "transport"
  | "attraction";

export type ServiceTemplatePage = "shop_1" | "shop_2" | "shop_3";

export type ServiceLayoutDefinition = {
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

export const serviceLayoutDefinitions = {
  tee_time: {
    templatePage: "shop_2",
    searchLabels: {
      location: "Sân golf",
      locationPlaceholder: "Chọn sân",
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
    templatePage: "shop_3",
    searchLabels: {
      location: "Điểm đến",
      locationPlaceholder: "Bạn muốn đi đâu?",
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
    templatePage: "shop_1",
    searchLabels: {
      location: "Địa điểm",
      locationPlaceholder: "Chọn điểm đến hoặc khách sạn",
      startDate: "Nhận / trả phòng",
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
    templatePage: "shop_3",
    searchLabels: {
      location: "Điểm đón",
      locationPlaceholder: "Bạn muốn đón ở đâu?",
      startDate: "Ngày đón",
      guests: "Số khách",
    },
    searchQuery: {
      location: "pickup",
      startDate: "pickup_at",
      guests: "passengers",
      startDateMode: "datetime",
    },
  },
  attraction: {
    templatePage: "shop_3",
    searchLabels: {
      location: "Địa điểm",
      locationPlaceholder: "Chọn điểm tham quan",
      startDate: "Ngày tham quan",
      guests: "Số vé",
    },
    searchQuery: {
      location: "destination",
      startDate: "visit_date",
      guests: "tickets",
    },
  },
} satisfies Record<ServiceLayoutKey, ServiceLayoutDefinition>;

export function isServiceLayoutKey(value?: string | null): value is ServiceLayoutKey {
  return Boolean(value && value in serviceLayoutDefinitions);
}

export function getServiceLayoutDefinition(value?: string | null): ServiceLayoutDefinition {
  const key = isServiceLayoutKey(value) ? value : defaultServiceLayoutKey;
  return serviceLayoutDefinitions[key];
}

export const fallbackServiceCategories = [
  { id: -1, name: "Golf", slug: "golf", type: "service", layout_key: "tee_time" },
  { id: -2, name: "Tour & Trải nghiệm", slug: "tour-trai-nghiem", type: "service", layout_key: "tour" },
  { id: -3, name: "Khách sạn", slug: "khach-san", type: "service", layout_key: "accommodation" },
  { id: -4, name: "Thuê xe", slug: "thue-xe", type: "service", layout_key: "transport" },
  { id: -5, name: "Vé tham quan", slug: "ve-tham-quan", type: "service", layout_key: "attraction" },
] as const;
