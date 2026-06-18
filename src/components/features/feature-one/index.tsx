import FeatureArea from "./FeatureArea"
import BookingForm from "./BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import FooterThree from "@/layouts/footers/FooterThree";
import BreadCrumb from "@/components/common/BreadCrumb";

interface FeatureOneProps {
   title?: string;
   subTitle?: string;
   detailBasePath?: string;
}

const FeatureOne = ({
   title = "Khách sạn & nghỉ dưỡng",
   subTitle = "Khách sạn & nghỉ dưỡng",
   detailBasePath = "/khach-san-nghi-duong",
}: FeatureOneProps) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title={title} sub_title={subTitle} />
            <BookingForm />
            <FeatureArea detailBasePath={detailBasePath} />
         </main>
         <FooterThree />
      </>
   )
}

export default FeatureOne
