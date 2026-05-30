import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import BreadCrumb from "./BreadCrumb"
import BannerForm from "./BannerForm"
import FooterFive from "@/layouts/footers/FooterFive"

const FeatureTwo = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb />
            <BannerForm />
            <FeatureArea />
         </main>
         <FooterFive />
      </>
   )
}

export default FeatureTwo
