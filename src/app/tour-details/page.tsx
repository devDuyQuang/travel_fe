import FeatureDetailsOne from "@/components/features/feature-details-one";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Chi tiết dịch vụ | GOLFNITY",
};

const Page = () => {
  return (
    <Wrapper>
      <FeatureDetailsOne product={null} />
    </Wrapper>
  );
};

export default Page;
