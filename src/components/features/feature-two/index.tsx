import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import BannerForm from "./BannerForm"
import FooterFive from "@/layouts/footers/FooterFive";
import BreadCrumb from "@/components/common/BreadCrumb";
import type { Product } from "@/types/product";
import type { ServiceSearchLabels } from "@/types/service-layout";

interface FeatureTwoProps {
   title?: string;
   subTitle?: string;
   detailBasePath?: string;
   items?: Product[];
   searchLabels?: ServiceSearchLabels;
}

const FeatureTwo = ({
   title = "Đặt tee time",
   subTitle = "Đặt tee time",
   detailBasePath = "/dat-tee-time",
   items,
   searchLabels,
}: FeatureTwoProps) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title={title} sub_title={subTitle} />
            <BannerForm labels={searchLabels} />
            <FeatureArea detailBasePath={detailBasePath} items={items} />
         </main>
         <FooterFive />
      </>
   )
}

export default FeatureTwo
