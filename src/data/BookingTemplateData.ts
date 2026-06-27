import type { StaticImageData } from "next/image";

import accommodationOne from "@/assets/img/listing/listing-4/thumb-2.jpg";
import accommodationTwo from "@/assets/img/listing/listing-4/thumb.jpg";
import accommodationThree from "@/assets/img/listing/listing-4/thumb-3.jpg";
import teeTimeOne from "@/assets/img/listing/listing-3.jpg";
import teeTimeTwo from "@/assets/img/listing/listing-2.jpg";
import teeTimeThree from "@/assets/img/listing/listing-1.jpg";
import tourOne from "@/assets/img/listing/listing-2/listing.jpg";
import tourTwo from "@/assets/img/listing/listing-2/listing-2.jpg";
import tourThree from "@/assets/img/listing/listing-2/listing-3.jpg";

export type BookingTemplateItem = {
  id: number;
  page: "shop_1" | "shop_2" | "shop_3";
  thumb: StaticImageData;
  title: string;
  location: string;
  price: number;
  review: number;
  total_review: number;
  category: string;
  amenities: string;
  language: string;
  destination: string;
  duration: string;
  guest: string;
  desc: string;
  quantity: number;
  tag?: string;
  featured?: string;
  offer?: string;
  delete_price?: number;
};

const bookingTemplateData: BookingTemplateItem[] = [
  {
    id: 1,
    page: "shop_1",
    thumb: accommodationOne,
    title: "Luxury Resort Experience",
    location: "Đà Nẵng, Việt Nam",
    price: 230,
    review: 5,
    total_review: 8,
    category: "Resort",
    amenities: "Hồ bơi, nhà hàng, đưa đón",
    language: "Tiếng Việt, English",
    destination: "Đà Nẵng",
    duration: "3 ngày 2 đêm",
    guest: "2 khách",
    desc: "Không gian nghỉ dưỡng tiện nghi gần các điểm golf nổi bật.",
    quantity: 1,
    tag: "Mới",
  },
  {
    id: 2,
    page: "shop_1",
    thumb: accommodationTwo,
    title: "Golf View Hotel",
    location: "Hạ Long, Việt Nam",
    price: 180,
    review: 5,
    total_review: 10,
    category: "Hotel",
    amenities: "Ăn sáng, bãi đỗ xe",
    language: "Tiếng Việt, English",
    destination: "Hạ Long",
    duration: "2 ngày 1 đêm",
    guest: "2 khách",
    desc: "Khách sạn thuận tiện cho lịch trình golf và tham quan.",
    quantity: 1,
    featured: "Nổi bật",
  },
  {
    id: 3,
    page: "shop_1",
    thumb: accommodationThree,
    title: "Private Villa Retreat",
    location: "Phú Quốc, Việt Nam",
    price: 320,
    review: 4,
    total_review: 12,
    category: "Villa",
    amenities: "Biển riêng, xe đưa đón",
    language: "Tiếng Việt, English",
    destination: "Phú Quốc",
    duration: "4 ngày 3 đêm",
    guest: "4 khách",
    desc: "Villa riêng tư dành cho nhóm golfer và gia đình.",
    quantity: 1,
  },
  {
    id: 101,
    page: "shop_2",
    thumb: teeTimeOne,
    title: "Tee Time Buổi Sáng",
    location: "Hà Nội, Việt Nam",
    price: 120,
    review: 5,
    total_review: 18,
    category: "Golf Course",
    amenities: "Caddie, xe điện",
    language: "Tiếng Việt, English",
    destination: "Hà Nội",
    duration: "18 hố",
    guest: "1 golfer",
    desc: "Khung giờ chơi golf buổi sáng với dịch vụ hỗ trợ đầy đủ.",
    quantity: 1,
    tag: "Tee time",
  },
  {
    id: 102,
    page: "shop_2",
    thumb: teeTimeTwo,
    title: "Tee Time Cuối Tuần",
    location: "Đà Nẵng, Việt Nam",
    price: 165,
    review: 5,
    total_review: 15,
    category: "Golf Course",
    amenities: "Caddie, xe điện",
    language: "Tiếng Việt, English",
    destination: "Đà Nẵng",
    duration: "18 hố",
    guest: "1 golfer",
    desc: "Lịch chơi cuối tuần tại sân golf tiêu chuẩn quốc tế.",
    quantity: 1,
    featured: "Nổi bật",
  },
  {
    id: 103,
    page: "shop_2",
    thumb: teeTimeThree,
    title: "Tee Time Hoàng Hôn",
    location: "Nha Trang, Việt Nam",
    price: 140,
    review: 4,
    total_review: 9,
    category: "Golf Course",
    amenities: "Caddie, locker",
    language: "Tiếng Việt, English",
    destination: "Nha Trang",
    duration: "18 hố",
    guest: "1 golfer",
    desc: "Trải nghiệm vòng golf chiều với cảnh quan ven biển.",
    quantity: 1,
  },
  {
    id: 201,
    page: "shop_3",
    thumb: tourOne,
    title: "Golf Tour Việt Nam",
    location: "Đà Nẵng, Việt Nam",
    price: 690,
    review: 5,
    total_review: 20,
    category: "Golf Tour",
    amenities: "Khách sạn, xe đưa đón, tee time",
    language: "Tiếng Việt, English",
    destination: "Đà Nẵng",
    duration: "4 ngày 3 đêm",
    guest: "8 khách",
    desc: "Hành trình golf kết hợp nghỉ dưỡng và khám phá địa phương.",
    quantity: 1,
    featured: "Nổi bật",
  },
  {
    id: 202,
    page: "shop_3",
    thumb: tourTwo,
    title: "Golf & Heritage Journey",
    location: "Huế, Việt Nam",
    price: 560,
    review: 5,
    total_review: 14,
    category: "Golf Tour",
    amenities: "Khách sạn, hướng dẫn viên",
    language: "Tiếng Việt, English",
    destination: "Huế",
    duration: "3 ngày 2 đêm",
    guest: "10 khách",
    desc: "Kết hợp lịch chơi golf và trải nghiệm di sản miền Trung.",
    quantity: 1,
  },
  {
    id: 203,
    page: "shop_3",
    thumb: tourThree,
    title: "Coastal Golf Escape",
    location: "Nha Trang, Việt Nam",
    price: 620,
    review: 4,
    total_review: 11,
    category: "Golf Tour",
    amenities: "Resort, tee time, xe riêng",
    language: "Tiếng Việt, English",
    destination: "Nha Trang",
    duration: "4 ngày 3 đêm",
    guest: "8 khách",
    desc: "Chuyến golf ven biển dành cho nhóm bạn và doanh nghiệp.",
    quantity: 1,
    tag: "Mới",
  },
];

export default bookingTemplateData;
