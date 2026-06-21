import BreadCrumb from "./BreadCrumb";
import TourDetailsArea from "./TourDetailsArea";
import TourAboutDetails from "./TourAboutDetails";
import HeaderThree from "@/layouts/headers/HeaderThree";
import Listing from "./Listing";
import FooterThree from "@/layouts/footers/FooterThree";
import type { Product } from "@/types/product";

type FeatureDetailsTwoProps = {
  product?: Product | null;
  relatedProducts?: Product[];
};

const FeatureDetailsTwo = ({ product = null, relatedProducts = [] }: FeatureDetailsTwoProps) => {
  return (
    <>
      <HeaderThree variant="transparent" />

      <main>
        <BreadCrumb product={product} />
        <TourDetailsArea product={product} />
        <TourAboutDetails product={product} />
        <Listing products={relatedProducts} />
      </main>

      <FooterThree />
    </>
  );
};

export default FeatureDetailsTwo;
