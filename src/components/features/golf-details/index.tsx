import HeaderThree from "@/layouts/headers/HeaderThree";
import Breadcrumb from "./Breadcrumb";
import FeatureDetailsArea from "./FeatureDetailsArea";
import FeatureAboutArea from "./FeatureAboutArea";
import FooterThree from "@/layouts/footers/FooterThree";
import type { Product } from "@/types/product";

type FeatureDetailsOneProps = {
  product?: Product | null;
};

const GolfDetailsOne = ({ product = null }: FeatureDetailsOneProps) => {
  return (
    <>
      <HeaderThree />

      <main>
        <Breadcrumb
          title={product?.name}
          categoryName={product?.category?.name ?? "Golf Courses"}
          categoryHref={
            product?.category?.slug
              ? `/category/${product.category.slug}`
              : "/tour-grid-1"
          }
        />

        <FeatureDetailsArea product={product} />
        <FeatureAboutArea product={product} />
      </main>

      <FooterThree />
    </>
  );
};

export default GolfDetailsOne;
