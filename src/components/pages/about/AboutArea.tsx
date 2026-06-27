import Image from "next/image"
import Button from "@/components/common/Button"
import Link from "next/link"
import { aboutPageMediaUrl } from "@/hooks/useAboutPageSettings"
import type {
   AboutPageGallerySetting,
   AboutPageIntroSetting,
} from "@/types/about-page"

import shape_1 from "@/assets/img/about/details/shape.png"
import shape_2 from "@/assets/img/about/details/shape-2.png"
import shape_3 from "@/assets/img/chose/chose-3/circle-text.png"
import shape_4 from "@/assets/img/chose/chose-3/star.png"
import thumb_1 from "@/assets/img/about/details/thumb-1.jpg"
import thumb_2 from "@/assets/img/about/details/thumb-3.jpg"
import thumb_3 from "@/assets/img/about/details/thumb-2.jpg"

type AboutAreaProps = {
   gallery?: AboutPageGallerySetting;
   intro?: AboutPageIntroSetting;
};

const AboutArea = ({ gallery, intro }: AboutAreaProps) => {
   const galleryImages = gallery?.images || [];
   const imageSources = [
      aboutPageMediaUrl(galleryImages[0]) || thumb_1,
      aboutPageMediaUrl(galleryImages[1]) || thumb_2,
      aboutPageMediaUrl(galleryImages[2]) || thumb_3,
   ];
   const subtitle =
      intro?.subtitle?.trim() || "Explore the world with us";
   const title =
      intro?.title?.trim() ||
      "The perfect vacation come true with our Travel Agency";
   const description =
      intro?.description?.trim() ||
      "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries but also the leap into electronic typesetting remaining essentially unchanged.";
   const buttonText =
      intro?.button_text?.trim() || "Book Your Room";
   const buttonLink =
      intro?.button_link?.trim() || "/tour-details";

   return (
      <div className="tg-about-area p-relative z-index-1 pt-140 pb-105">
         <Image className="tg-about-details-shape p-absolute d-none d-lg-block" src={shape_1} alt="shape" />
         <div className="container">
            <div className="row align-items-center">
               <div className="col-lg-6">
                  <div className="tg-about-details-left p-relative mb-15">
                     <Image className="tg-about-details-map p-absolute" src={shape_2} alt="map" />
                     <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                           <div className="tg-about-details-thumb p-relative z-index-9">
                              <Image className="main-thumb tg-round-15 w-100 mb-20" src={imageSources[0]} width={thumb_1.width} height={thumb_1.height} alt="thumb" />
                              <Image className="main-thumb tg-round-15 w-100 mb-20" src={imageSources[1]} width={thumb_2.width} height={thumb_2.height} alt="thumb" />
                           </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                           <div className="tg-about-details-thumb-2 p-relative">
                              <div className="tg-chose-3-rounded p-relative mb-30">
                                 <Image className="rotate-infinite-2" src={shape_3} alt="" />
                                 <Image className="tg-chose-3-star" src={shape_4} alt="" />
                              </div>
                              <Image className="w-100 tg-round-15" src={imageSources[2]} width={thumb_3.width} height={thumb_3.height} alt="chose" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="col-lg-6">
                  <div className="tg-chose-content mb-35 ml-60">
                     <div className="tg-chose-section-title mb-30">
                        <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".1s">{subtitle}</h5>
                        <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">{title}</h2>
                        <p className="text-capitalize wow fadeInUp mb-35" data-wow-delay=".5s" data-wow-duration=".9s">{description}</p>
                        <div className="tg-chose-btn wow fadeInUp" data-wow-delay=".8s" data-wow-duration=".9s">
                           <Link href={buttonLink} className="tg-btn tg-btn-switch-animation">
                              <Button text={buttonText} />
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default AboutArea
