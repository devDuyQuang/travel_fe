import FeatureArea from "./FeatureArea"
import BookingForm from "./BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import FooterSix from "@/layouts/footers/FooterSix";
import BreadCrumb from "@/components/common/BreadCrumb";
import type { Product } from "@/types/product";
import type { ServiceSearchLabels } from "@/types/service-layout";

interface FeatureOneProps {
   title?: string;
   subTitle?: string;
   detailBasePath?: string;
   items?: Product[];
   searchLabels?: ServiceSearchLabels;
}

const FeatureOne = ({
   title = "Khách sạn & nghỉ dưỡng",
   subTitle = "Khách sạn & nghỉ dưỡng",
   detailBasePath = "/khach-san-nghi-duong",
   items,
   searchLabels,
}: FeatureOneProps) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title={title} sub_title={subTitle} />
            <BookingForm labels={searchLabels} />
            <FeatureArea detailBasePath={detailBasePath} items={items} />
         </main>
         <FooterSix />
      </>
   )
}

export default FeatureOne
