import Contact from "@/components/contact";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Liên hệ | WAYLUNE",
  description: "Gửi yêu cầu tư vấn dịch vụ golf, du lịch và hành trình cùng WAYLUNE.",
};
const page = () => {
  return (
    <Wrapper>
      <Contact />
    </Wrapper>
  )
}

export default page
