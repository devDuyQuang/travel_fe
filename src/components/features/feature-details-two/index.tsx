import BreadCrumb from "./BreadCrumb"
import TourDetailsArea from "./TourDetailsArea"
import TourAboutDetails from "./TourAboutDetails"
import HeaderSix from "@/layouts/headers/HeaderSix"
import Listing from "./Listing"
import FooterThree from "@/layouts/footers/FooterThree";

const FeatureDetailsTwo = () => {
   return (
      <>
         <HeaderSix />
         <main>
            <BreadCrumb />
            <TourDetailsArea />
            <TourAboutDetails />
            <Listing />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureDetailsTwo
