import RelatedServiceContent from "@/components/services/content/RelatedServiceContent";
import HeaderThree from "@/layouts/headers/HeaderThree";
import Breadcrumb from "./Breadcrumb";
import FeatureDetailsArea from "./FeatureDetailsArea";
import FeatureAboutArea from "./FeatureAboutArea";
import FooterSix from "@/layouts/footers/FooterSix";
import type { Product } from "@/types/product";
import RecentlyViewedTracker from "@/components/common/RecentlyViewedTracker";

type FeatureDetailsOneProps = {
  product?: Product | null;
  relatedProducts?: Product[];
};

const FeatureDetailsOne = ({ product = null, relatedProducts = [] }: FeatureDetailsOneProps) => {
  return (
    <>
      <HeaderThree variant="transparent" />
      <RecentlyViewedTracker product={product} />

      <main>
        <Breadcrumb product={product} />
        <FeatureDetailsArea product={product} />
        <FeatureAboutArea product={product} />
        {product && <RelatedServiceContent product={product} products={relatedProducts} />}
      </main>

      <FooterSix />
    </>
  );
};

export default FeatureDetailsOne;
