import type { FrontendMenuItem } from "@/lib/menuApi";

const menu_data: FrontendMenuItem[] = [
  {
    id: 2,
    title: "Dịch vụ",
    link: "/dich-vu/dat-tee-time",
    has_dropdown: true,
    sub_menus: [
      { id: 21, title: "Đặt tee time", link: "/dich-vu/dat-tee-time" },
      { id: 22, title: "Tour golf Việt Nam", link: "/dich-vu/tour-golf-viet-nam" },
      { id: 23, title: "Khách sạn & nghỉ dưỡng", link: "/dich-vu/khach-san-nghi-duong" },
      { id: 24, title: "Thuê xe & đưa đón", link: "/dich-vu/thue-xe-dua-don" },
      { id: 25, title: "Tham quan & trải nghiệm", link: "/dich-vu/tham-quan-trai-nghiem" },
    ],
  },
  {
    id: 3,
    title: "Giải pháp golf",
    link: "/dich-vu/to-chuc-giai-golf",
    has_dropdown: true,
    sub_menus: [
      { id: 31, title: "Tổ chức giải golf", link: "/dich-vu/to-chuc-giai-golf" },
      { id: 32, title: "Tổ chức sự kiện golf", link: "/dich-vu/to-chuc-su-kien-golf" },
      { id: 33, title: "Thi công phòng golf 3D", link: "/dich-vu/thi-cong-phong-golf-3d" },
      { id: 34, title: "Thi công sân tập golf", link: "/dich-vu/thi-cong-san-tap-golf" },
      { id: 35, title: "Thi công sân putting", link: "/dich-vu/thi-cong-san-putting" },
      { id: 36, title: "Cho thuê mini golf", link: "/dich-vu/cho-thue-mini-golf" },
    ],
  },
  {
    id: 4,
    title: "Tin tức",
    link: "/blog-grid",
    has_dropdown: false,
  },
  {
    id: 5,
    title: "Về Golfnity",
    link: "/about",
    has_dropdown: false,
  },
  {
    id: 6,
    title: "Liên hệ",
    link: "/contact",
    has_dropdown: false,
  },
];

export default menu_data;
