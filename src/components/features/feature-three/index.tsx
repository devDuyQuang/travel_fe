import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import FooterThree from "@/layouts/footers/FooterThree";
import BreadCrumb from "@/components/common/BreadCrumb";

interface FeatureThreeProps {
   title?: string;
   subTitle?: string;
   detailBasePath?: string;
}

const FeatureThree = ({
   title = "Tour golf Việt Nam",
   subTitle = "Tour golf Việt Nam",
   detailBasePath = "/tour-golf",
}: FeatureThreeProps) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title={title} sub_title={subTitle} />
            <FeatureArea detailBasePath={detailBasePath} />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureThree
