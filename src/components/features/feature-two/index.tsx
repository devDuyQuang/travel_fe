import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import BannerForm from "./BannerForm"
import FooterThree from "@/layouts/footers/FooterThree";
import BreadCrumb from "@/components/common/BreadCrumb";

interface FeatureTwoProps {
   title?: string;
   subTitle?: string;
   detailBasePath?: string;
}

const FeatureTwo = ({
   title = "Đặt tee time",
   subTitle = "Đặt tee time",
   detailBasePath = "/dat-tee-time",
}: FeatureTwoProps) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title={title} sub_title={subTitle} />
            <BannerForm />
            <FeatureArea detailBasePath={detailBasePath} />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureTwo
