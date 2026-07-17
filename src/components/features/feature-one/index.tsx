import FeatureArea from "./FeatureArea"
import BookingForm from "./BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import FooterSix from "@/layouts/footers/FooterSix";
import BreadCrumb from "@/components/common/BreadCrumb";
import type { Product } from "@/types/product";
import type { ServiceSearchLabels } from "@/types/service-layout";
import type { ServiceLayoutKey } from "@/lib/serviceLayoutRegistry";

interface FeatureOneProps {
   title?: string;
   subTitle?: string;
   detailBasePath?: string;
   items?: Product[];
   searchLabels?: ServiceSearchLabels;
   layoutKey?: ServiceLayoutKey | string | null;
   categorySlug?: string;
}

const FeatureOne = ({
   title = "Khách sạn",
   subTitle = "Khách sạn & resort",
   detailBasePath = "/khach-san-nghi-duong",
   items,
   searchLabels,
   layoutKey,
   categorySlug,
}: FeatureOneProps) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title={title} sub_title={subTitle} />
            <BookingForm labels={searchLabels} layoutKey={layoutKey} categorySlug={categorySlug} />
            <FeatureArea detailBasePath={detailBasePath} items={items} />
         </main>
         <FooterSix />
      </>
   )
}

export default FeatureOne
