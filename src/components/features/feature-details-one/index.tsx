import HeaderThree from "@/layouts/headers/HeaderThree";
import Breadcrumb from "./Breadcrumb";
import FeatureDetailsArea from "./FeatureDetailsArea";
import FeatureAboutArea from "./FeatureAboutArea";
import FooterSix from "@/layouts/footers/FooterSix";
import type { Product } from "@/types/product";

type FeatureDetailsOneProps = {
  product?: Product | null;
};

const FeatureDetailsOne = ({ product = null }: FeatureDetailsOneProps) => {
  return (
    <>
      <HeaderThree />

      <main>
        <Breadcrumb />
       <FeatureDetailsArea product={null} />
        <FeatureAboutArea />
      </main>

      <FooterSix />
    </>
  );
};

export default FeatureDetailsOne;