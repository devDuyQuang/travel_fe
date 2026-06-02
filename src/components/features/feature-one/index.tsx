import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import HeaderSix from "@/layouts/headers/HeaderSix"
import FooterThree from "@/layouts/footers/FooterThree";

const FeatureOne = () => {
   return (
      <>
         <HeaderSix />
         <main>
            <BreadCrumb />
            <FeatureArea />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureOne
