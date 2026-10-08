import { pageMetadata } from "@/lib/seoMetadata";
import About from "@/components/pages/about";
import Wrapper from "@/layouts/Wrapper";

export const metadata = pageMetadata("Về GOLFNITY | GOLFNITY", "/ve-golfnity", "Tìm hiểu về GOLFNITY và các dịch vụ golf, du lịch dành cho golfer.");

const page = () => {
  return (
    <Wrapper>
      <About />
    </Wrapper>
  );
};

export default page;
