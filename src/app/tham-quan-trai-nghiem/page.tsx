import FeatureThree from "@/components/features/feature-three";
import Wrapper from "@/layouts/Wrapper";

export const metadata = { title: "Tham quan & trải nghiệm | Golfnity" };

export default function SightseeingPage() {
  return (
    <Wrapper>
      <FeatureThree
        title="Tham quan & trải nghiệm"
        subTitle="Tham quan & trải nghiệm"
        detailBasePath="/tham-quan-trai-nghiem"
      />
    </Wrapper>
  );
}
