import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import BannerForm from "./BannerForm"
import FooterSix from "@/layouts/footers/FooterSix"

const FeatureTwo = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb />
            <BannerForm />
            <FeatureArea />
         </main>
         <FooterSix />
      </>
   )
}

export default FeatureTwo
