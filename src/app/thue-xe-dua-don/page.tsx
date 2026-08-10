import FeatureThree from "@/components/features/feature-three";
import Wrapper from "@/layouts/Wrapper";

export const metadata = { title: "Thuê xe & đưa đón | GOLFNITY" };

export default function CarRentalPage() {
  return (
    <Wrapper>
      <FeatureThree
        title="Thuê xe & đưa đón"
        subTitle="Thuê xe & đưa đón"
        detailBasePath="/thue-xe-dua-don"
      />
    </Wrapper>
  );
}
