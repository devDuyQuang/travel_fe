import HeaderThree from "@/layouts/headers/HeaderThree"
import Breadcrumb from "./Breadcrumb"
import FeatureDetailsArea from "./FeatureDetailsArea"
import FeatureAboutArea from "./FeatureAboutArea"
import FooterThree from "@/layouts/footers/FooterThree";

const FeatureDetailsOne = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <Breadcrumb />
            <FeatureDetailsArea />
            <FeatureAboutArea />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureDetailsOne
