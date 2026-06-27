import Button from "@/components/common/Button"
import Link from "next/link"
import { aboutPageMediaUrl } from "@/hooks/useAboutPageSettings"
import type { AboutPageConsultationSetting } from "@/types/about-page"

const Cta = ({ setting }: { setting?: AboutPageConsultationSetting }) => {
   const background =
      aboutPageMediaUrl(setting?.image) ||
      "/assets/img/banner/banner-4/banner-4.png";
   const subtitle =
      setting?.subtitle?.trim() || "Next Adventure Destination";
   const title =
      setting?.title?.trim() ||
      "Popular Travel Destinations Available Worldwide";
   const buttonText = setting?.btn_text?.trim() || "Book Your Trip Now";
   const buttonLink = setting?.btn_link?.trim() || "/tour-details";
   const decorativeText =
      setting?.decorative_text?.trim() || "Explore The World";

   return (
      <div className="tg-banner-area tg-grey-bg tg-banner-4-spacing about-cta-banner" style={{ backgroundImage: `url(${background})` }}>
         <div className="container">
            <div className="col-lg-12">
               <div className="tg-banner-2-content tg-banner-4-content tg-banner-6-content text-center">
                  <div className="tg-about-section-title mb-25">
                     <h5 className="tg-section-subtitle mb-20 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">{subtitle}</h5>
                     <h2 className="tg-section-title-white mb-30 wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">{title}</h2>
                  </div>
                  <div className="tp-banner-btn-wrap">
                     <Link href={buttonLink} className="tg-btn tg-btn-transparent tg-btn-switch-animation about-cta-button">
                        <Button text={buttonText} />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
         <div className="tg-banner-bottom pb-190">
            <div className="container-fluid">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tg-banner-2-big-title text-center wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">
                        <h2>{decorativeText}</h2>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Cta
