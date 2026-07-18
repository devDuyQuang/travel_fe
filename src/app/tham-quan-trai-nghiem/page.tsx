import FeatureThree from "@/components/features/feature-three";
import Wrapper from "@/layouts/Wrapper";

export const metadata = { title: "Tour & Trải nghiệm | Golfnity" };

export default function SightseeingPage() {
  return (
    <Wrapper>
      <FeatureThree
        title="Tour & Trải nghiệm"
        subTitle="Tour & Trải nghiệm"
        detailBasePath="/tham-quan-trai-nghiem"
      />
    </Wrapper>
  );
}
