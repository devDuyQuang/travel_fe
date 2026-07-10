"use client";

import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/common/Button'

import about_thumb1 from "@/assets/img/about/about.jpg"
import about_thumb2 from "@/assets/img/about/about-2.jpg"
import about_thumb3 from "@/assets/img/about/about-3.jpg"
import about_thumb4 from "@/assets/img/about/about-4.jpg"
import { homepageMediaUrl, homepageText, useHomepageSettings } from "@/hooks/useHomepageSettings"

const About = () => {
   const setting = useHomepageSettings().about_home;
   const defaults = [about_thumb1, about_thumb2, about_thumb3, about_thumb4];
   const images = defaults.map((fallback, index) => ({
      src: homepageMediaUrl(setting?.images?.[index]) || fallback,
      width: fallback.width,
      height: fallback.height,
   }));
   const logo = homepageMediaUrl(setting?.logo);

   return (
      <div className="tg-about-area pb-100">
         <div className="container">
            <div className="row">
               <div className="col-lg-3">
                  <div className="tg-about-thumb-wrap mb-30">
                     <Image className="w-100 tg-round-15 mb-85 wow fadeInLeft" data-wow-delay=".3s" data-wow-duration=".7s" src={images[0].src} width={images[0].width} height={images[0].height} alt="about" />
                     <Image className="tg-about-thumb-2 tg-round-15 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration=".9s" src={images[1].src} width={images[1].width} height={images[1].height} alt="about" />
                  </div>
               </div>
               <div className="col-lg-6 mb-30">
                  <div className="tg-about-content text-center">
                     {logo && (
                        <div className="tg-about-logo mb-30 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".5s">
                           <Image src={logo} width={220} height={92} alt="Logo giới thiệu" />
                        </div>
                     )}
                     <div className="tg-about-section-title mb-25">
                        <h5 className="tg-section-subtitle wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".6s">{homepageText(setting?.subtitle, "Most Popular Tour")}</h5>
                        <h2 className="mb-15 wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".7s">{homepageText(setting?.title, "Let’s Discover The World With Our Excellent Eyes")}</h2>
                        <p className="text-capitalize wow fadeInUp" data-wow-delay=".6s" data-wow-duration=".8s">
                           {setting?.description?.trim()
                              ? homepageText(setting.description.trim(), "")
                              : "GOLFNITY kết nối tee time, tour golf, khách sạn, xe đưa đón và trải nghiệm chọn lọc để mỗi chuyến đi được chuẩn bị rõ ràng, thuận tiện và đúng nhu cầu."}
                        </p>
                     </div>
                     <div className="tp-about-btn-wrap wow fadeInUp" data-wow-delay=".7s" data-wow-duration=".9s">
                        <Link href={homepageText(setting?.button_link, "/dich-vu/tour-golf-viet-nam")} className="tg-btn tg-btn-transparent tg-btn-switch-animation">
                           <Button text={homepageText(setting?.button_text, "Khám phá hành trình")} />
                        </Link>
                     </div>
                  </div>
               </div>
               <div className="col-lg-3">
                  <div className="tg-about-thumb-wrap  mb-30">
                     <Image className="w-100 tg-round-15 mb-85 wow fadeInRight" data-wow-delay=".3s" data-wow-duration=".7s" src={images[2].src} width={images[2].width} height={images[2].height} alt="about" />
                     <Image className="tg-about-thumb-4 tg-round-15 wow fadeInRight" data-wow-delay=".4s" data-wow-duration=".9s" src={images[3].src} width={images[3].width} height={images[3].height} alt="about" />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default About
