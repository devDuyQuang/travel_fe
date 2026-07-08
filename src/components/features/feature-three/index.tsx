import HeaderThree from "@/layouts/headers/HeaderThree"
import FeatureArea from "./FeatureArea"
import FooterSix from "@/layouts/footers/FooterSix";
import BreadCrumb from "@/components/common/BreadCrumb";
import type { Product } from "@/types/product";
import type { ServiceSearchLabels } from "@/types/service-layout";
import BannerForm from "@/components/features/feature-two/BannerForm";
import type { ServiceLayoutKey } from "@/lib/serviceLayoutRegistry";

interface FeatureThreeProps {
   title?: string;
   subTitle?: string;
   detailBasePath?: string;
   items?: Product[];
   searchLabels?: ServiceSearchLabels;
   layoutKey?: ServiceLayoutKey | string | null;
   categorySlug?: string;
}

const FeatureThree = ({
   title = "Tour golf Việt Nam",
   subTitle = "Tour golf Việt Nam",
   detailBasePath = "/tour-golf",
   items,
   searchLabels,
   layoutKey,
   categorySlug,
}: FeatureThreeProps) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title={title} sub_title={subTitle} />
            <BannerForm labels={searchLabels} layoutKey={layoutKey} categorySlug={categorySlug} />
            <FeatureArea detailBasePath={detailBasePath} items={items} />
         </main>
         <FooterSix />
      </>
   )
}

export default FeatureThree
