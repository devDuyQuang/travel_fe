import { pageMetadata } from "@/lib/seoMetadata";
import Contact from "@/components/contact";
import Wrapper from "@/layouts/Wrapper";

export const metadata = pageMetadata("Liên hệ | GOLFNITY", "/contact", "Gửi yêu cầu tư vấn dịch vụ golf, du lịch và hành trình cùng GOLFNITY.");
const page = () => {
  return (
    <Wrapper>
      <Contact />
    </Wrapper>
  )
}

export default page
