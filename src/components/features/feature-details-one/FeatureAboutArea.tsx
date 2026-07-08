import AboutText from "./about/AboutText"
import Faq from "./about/Faq"
import Included from "./about/Included"
import Review from "./about/Review"
import ReviewDetails from "./about/ReviewDetails"
import ReviewFormArea from "./about/ReviewFormArea"
import FeatureSidebar from "./FeatureSidebar"
import type { Product } from "@/types/product";

const FeatureAboutArea = ({ product }: { product: Product | null }) => {
   const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(product?.location || "")}&output=embed`;
   return (
      <div className="tg-tour-about-area tg-tour-about-border pt-40 pb-70">
         <div className="container">
            <div className="row">
               <div className="col-xl-9 col-lg-8">
                  <div className="tg-tour-about-wrap mr-55">
                     <div className="tg-tour-about-content">
                        <AboutText product={product} />
                        <div className="tg-tour-about-border mb-40"></div>
                        <Included />
                        <div className="tg-tour-about-border mb-40"></div>
                        <Faq />
                        <div className="tg-tour-about-border mb-45"></div>
                        <div className="tg-tour-about-map mb-40">
                           <h4 className="tg-tour-about-title mb-15">Địa điểm</h4>
                           <p className="text-capitalize lh-28">{product?.location || "Thông tin địa điểm đang được cập nhật."}</p>
                           <div className="tg-tour-about-map h-100">
                              <iframe src={mapUrl} width="600" height="450" style={{ border: "0" }} loading="lazy"></iframe>
                           </div>
                        </div>
                        <div className="tg-tour-about-border mb-45"></div>
                        <Review />
                        <div className="tg-tour-about-border mb-35"></div>
                        <ReviewDetails />
                        <div className="tg-tour-about-border mb-45"></div>
                        <ReviewFormArea />
                     </div>
                  </div>
               </div>
               <div className="col-xl-3 col-lg-4">
                  <div className="tg-tour-about-sidebar mb-50">
                     <FeatureSidebar product={product} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default FeatureAboutArea
