import HeaderThree from "@/layouts/headers/HeaderThree";
import Breadcrumb from "./Breadcrumb";
import FeatureDetailsArea from "./FeatureDetailsArea";
import FeatureAboutArea from "./FeatureAboutArea";
import FooterThree from "@/layouts/footers/FooterThree";
import type { Product } from "@/types/product";

type FeatureDetailsOneProps = {
  product?: Product | null;
  relatedProducts?: Product[];
};

const FeatureDetailsOne = ({ product = null }: FeatureDetailsOneProps) => {
  return (
    <>
      <HeaderThree variant="transparent" />

      <main>
        <Breadcrumb product={product} />
        <FeatureDetailsArea product={product} />
        <FeatureAboutArea product={product} />
      </main>

      <FooterThree />
    </>
  );
};

export default FeatureDetailsOne;
