import Contact from "@/components/contact";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Liên hệ | GOLFNITY",
  description: "Gửi yêu cầu tư vấn dịch vụ golf, du lịch và hành trình cùng GOLFNITY.",
};
const page = () => {
  return (
    <Wrapper>
      <Contact />
    </Wrapper>
  )
}

export default page
