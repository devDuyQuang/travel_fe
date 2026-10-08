import { pageMetadata } from "@/lib/seoMetadata";
import Faq from "@/components/pages/faq";
import Wrapper from "@/layouts/Wrapper";

export const metadata = pageMetadata("Câu hỏi thường gặp | GOLFNITY", "/cau-hoi-thuong-gap");

const CauHoiThuongGapPage = () => (
  <Wrapper>
    <Faq />
  </Wrapper>
);

export default CauHoiThuongGapPage;
