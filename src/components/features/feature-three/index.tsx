import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import FooterThree from "@/layouts/footers/FooterThree";

const FeatureThree = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb />
            <FeatureArea />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureThree
