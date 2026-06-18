import BreadCrumb from "./BreadCrumb";
import TourDetailsArea from "./TourDetailsArea";
import TourAboutDetails from "./TourAboutDetails";
import HeaderThree from "@/layouts/headers/HeaderThree";
import Listing from "./Listing";
import FooterThree from "@/layouts/footers/FooterThree";

const FeatureDetailsTwo = () => {
  return (
    <>
      <HeaderThree variant="transparent" />

      <main>
        <BreadCrumb />
        <TourDetailsArea />
        <TourAboutDetails />
        <Listing />
      </main>

      <FooterThree />
    </>
  );
};

export default FeatureDetailsTwo;