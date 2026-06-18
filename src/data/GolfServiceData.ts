export type GolfService = {
  slug: string;
  title: string;
  description: string;
  highlights: string[];
};

export const golfServices: GolfService[] = [
  {
    slug: "to-chuc-giai-golf",
    title: "Tổ chức giải golf",
    description: "Giải pháp tổ chức giải golf trọn gói dành cho doanh nghiệp, hội golf và đối tác thương hiệu.",
    highlights: ["Tư vấn thể thức và ngân sách", "Điều phối sân golf và vận hành giải", "Truyền thông, tài trợ và tiệc trao giải"],
  },
  {
    slug: "to-chuc-su-kien-golf",
    title: "Tổ chức sự kiện golf",
    description: "Thiết kế và vận hành sự kiện golf theo mục tiêu kết nối khách hàng, đối tác hoặc nội bộ doanh nghiệp.",
    highlights: ["Xây dựng ý tưởng sự kiện", "Quản lý khách mời và vận hành", "Sản xuất hình ảnh và nhận diện"],
  },
  {
    slug: "thi-cong-phong-golf-3d",
    title: "Thi công phòng golf 3D",
    description: "Tư vấn, thiết kế và thi công phòng golf 3D cho gia đình, doanh nghiệp và cơ sở kinh doanh.",
    highlights: ["Khảo sát không gian", "Thiết kế kỹ thuật và nội thất", "Lắp đặt, cân chỉnh và bàn giao"],
  },
  {
    slug: "thi-cong-san-tap-golf",
    title: "Thi công sân tập golf",
    description: "Giải pháp quy hoạch và thi công sân tập golf phù hợp với quy mô, địa hình và mô hình vận hành.",
    highlights: ["Khảo sát và lập phương án", "Thi công hạ tầng sân tập", "Tư vấn thiết bị và vận hành"],
  },
  {
    slug: "thi-cong-san-putting",
    title: "Thi công sân putting",
    description: "Thiết kế sân putting và cảnh quan golf cho nhà ở, resort, văn phòng và khu dịch vụ.",
    highlights: ["Thiết kế theo diện tích thực tế", "Vật liệu phù hợp trong nhà hoặc ngoài trời", "Thi công và bảo hành"],
  },
  {
    slug: "cho-thue-mini-golf",
    title: "Cho thuê mini golf",
    description: "Cung cấp mô hình mini golf cho sự kiện, hoạt động doanh nghiệp và chương trình trải nghiệm.",
    highlights: ["Gói thiết bị linh hoạt", "Lắp đặt và thu hồi tận nơi", "Hướng dẫn vận hành tại sự kiện"],
  },
];

export function getGolfService(slug: string) {
  return golfServices.find((service) => service.slug === slug);
}
