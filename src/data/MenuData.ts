import type { FrontendMenuItem } from "@/lib/menuApi";

export const marketplaceServiceMenu: FrontendMenuItem = {
  id: 2,
  title: "Dịch vụ",
  link: "/dich-vu/dat-tee-time",
  has_dropdown: true,
  sub_menus: [
    { id: 21, title: "Đặt sân golf", link: "/dich-vu/dat-tee-time" },
    { id: 22, title: "Tour golf", link: "/dich-vu/tour-golf-viet-nam" },
    { id: 23, title: "Khách sạn & resort", link: "/dich-vu/khach-san-nghi-duong" },
    { id: 24, title: "Tour & Trải nghiệm", link: "/dich-vu/tour-trai-nghiem" },
    { id: 25, title: "Vé tham quan", link: "/dich-vu/ve-tham-quan" },
    { id: 26, title: "Thuê xe", link: "/dich-vu/thue-xe-dua-don" },
  ],
  mega_groups: [
    {
      id: 201,
      title: "Golf",
      icon: "fa-regular fa-golf-club",
      items: [
        { id: 2011, title: "Đặt sân golf", link: "/dich-vu/dat-tee-time" },
        { id: 2012, title: "Tour golf", link: "/dich-vu/tour-golf-viet-nam" },
        { id: 2013, title: "Combo golf + khách sạn", link: "/dich-vu/khach-san-nghi-duong?tag=golf-combo" },
        { id: 2014, title: "Tổ chức giải golf", link: "/dich-vu/dat-tee-time/danh-sach?tag=group" },
      ],
    },
    {
      id: 202,
      title: "Khách sạn",
      icon: "fa-regular fa-hotel",
      items: [
        { id: 2021, title: "Khách sạn & resort", link: "/dich-vu/khach-san-nghi-duong" },
        { id: 2022, title: "Resort gần sân golf", link: "/dich-vu/khach-san-nghi-duong" },
        { id: 2023, title: "Combo khách sạn + golf", link: "/dich-vu/khach-san-nghi-duong" },
        { id: 2024, title: "Nghỉ dưỡng cao cấp", link: "/dich-vu/khach-san-nghi-duong" },
      ],
    },
    {
      id: 203,
      title: "Tour & Trải nghiệm",
      icon: "fa-regular fa-map-location-dot",
      items: [
        { id: 2031, title: "Tour trong ngày", link: "/dich-vu/tour-trai-nghiem?tag=day-tour" },
        { id: 2032, title: "Trải nghiệm địa phương", link: "/dich-vu/tour-trai-nghiem?tag=local-experience" },
        { id: 2033, title: "Du thuyền", link: "/dich-vu/tour-trai-nghiem?tag=cruise" },
        { id: 2034, title: "Ẩm thực", link: "/dich-vu/tour-trai-nghiem?tag=food" },
      ],
    },
    {
      id: 204,
      title: "Vé tham quan",
      icon: "fa-regular fa-ticket",
      items: [
        { id: 2041, title: "Vé cáp treo", link: "/dich-vu/ve-tham-quan?tag=cable-car" },
        { id: 2042, title: "Công viên / khu vui chơi", link: "/dich-vu/ve-tham-quan?tag=park" },
        { id: 2043, title: "Bảo tàng / di tích", link: "/dich-vu/ve-tham-quan?tag=museum" },
        { id: 2044, title: "Vé show / sự kiện", link: "/dich-vu/ve-tham-quan?tag=show-event" },
      ],
    },
    {
      id: 205,
      title: "Thuê xe",
      icon: "fa-regular fa-car-side",
      items: [
        { id: 2051, title: "Thuê xe có tài xế", link: "/dich-vu/thue-xe-dua-don" },
        { id: 2052, title: "Thuê xe tự lái", link: "/dich-vu/thue-xe-dua-don" },
        { id: 2053, title: "Xe 4 chỗ", link: "/dich-vu/thue-xe-dua-don" },
        { id: 2056, title: "Đưa đón sân bay", link: "/dich-vu/thue-xe-dua-don" },
      ],
    },
  ],
};

const menu_data: FrontendMenuItem[] = [
  marketplaceServiceMenu,
  {
    id: 3,
    title: "Điểm đến",
    link: "/dich-vu/tour-trai-nghiem",
    has_dropdown: false,
  },
  {
    id: 4,
    title: "Ưu đãi",
    link: "/dich-vu/dat-tee-time/danh-sach?tag=featured",
    has_dropdown: false,
  },
  {
    id: 5,
    title: "Tin tức & Cẩm nang",
    link: "/tin-tuc",
    has_dropdown: false,
  },
  {
    id: 6,
    title: "Về GOLFNITY",
    link: "/ve-golfnity",
    has_dropdown: false,
  },
  {
    id: 7,
    title: "Liên hệ",
    link: "/contact",
    has_dropdown: false,
  },
];

export default menu_data;
