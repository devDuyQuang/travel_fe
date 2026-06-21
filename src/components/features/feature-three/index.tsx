import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import FooterThree from "@/layouts/footers/FooterThree";
import BreadCrumb from "@/components/common/BreadCrumb";
import type { Product } from "@/types/product";
import type { ServiceSearchLabels } from "@/types/service-layout";
import BannerForm from "@/components/features/feature-two/BannerForm";

interface FeatureThreeProps {
   title?: string;
   subTitle?: string;
   detailBasePath?: string;
   items?: Product[];
   searchLabels?: ServiceSearchLabels;
}

const FeatureThree = ({
   title = "Tour golf Việt Nam",
   subTitle = "Tour golf Việt Nam",
   detailBasePath = "/tour-golf",
   items,
   searchLabels,
}: FeatureThreeProps) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title={title} sub_title={subTitle} />
            <BannerForm labels={searchLabels} />
            <FeatureArea detailBasePath={detailBasePath} items={items} />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureThree
