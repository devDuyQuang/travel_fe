import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import BannerForm from "./BannerForm"
import FooterThree from "@/layouts/footers/FooterThree";

const FeatureTwo = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb />
            <BannerForm />
            <FeatureArea />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureTwo
