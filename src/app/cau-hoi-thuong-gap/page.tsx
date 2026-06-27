import Faq from "@/components/pages/faq";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Câu hỏi thường gặp | WAYLUNE",
  alternates: { canonical: "/cau-hoi-thuong-gap" },
};

const CauHoiThuongGapPage = () => (
  <Wrapper>
    <Faq />
  </Wrapper>
);

export default CauHoiThuongGapPage;
