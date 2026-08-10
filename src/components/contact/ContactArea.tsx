"use client";

import Image from "next/image"
import Link from "next/link"
import ContactForm from "../forms/ContactForm"
import useSiteSettings from "@/hooks/useSiteSettings"
import type {
   ContactPageInfoSetting,
   ContactPageLocationsSetting,
} from "@/types/contact-page"

import shape_1 from "@/assets/img/banner/banner-2/shape.png"

function mapSource(value?: string) {
   if (!value?.trim()) return null;
   const sourceMatch = value.match(/src=["']([^"']+)["']/i);
   return sourceMatch?.[1] || value || null;
}

function phoneHref(phone: string) {
   return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function websiteHref(website: string) {
   return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

const ContactArea = ({
   setting,
   locations,
}: {
   setting?: ContactPageInfoSetting;
   locations?: ContactPageLocationsSetting;
}) => {
   const siteSettings = useSiteSettings();
   const primaryLocation = locations?.items?.find(
      (item) => item?.map_iframe?.trim() || item?.google_link?.trim() || item?.address?.trim(),
   );
   const infoTitle = setting?.info_title?.trim() || "Thông tin liên hệ";
   const infoDescription =
      setting?.info_description?.trim() ||
      "GOLFNITY luôn sẵn sàng lắng nghe nhu cầu và tư vấn hành trình phù hợp cho bạn.";
   const formTitle =
      setting?.form_title?.trim() ||
      setting?.title?.trim() ||
      "Gửi yêu cầu tư vấn";
   const formDescription =
      setting?.form_subtitle?.trim() ||
      setting?.description?.trim() ||
      "Hãy để lại thông tin, đội ngũ GOLFNITY sẽ liên hệ lại trong thời gian sớm nhất.";
   const address = primaryLocation?.address?.trim() || siteSettings.address;
   const mapValue =
      primaryLocation?.map_iframe?.trim() ||
      siteSettings.map ||
      primaryLocation?.google_link?.trim();
   const mapUrl = mapSource(mapValue);
   const addressLink =
      primaryLocation?.google_link?.trim() ||
      (address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}` : "");

   return (
      <div className="tg-contact-area pt-130 p-relative z-index-1 pb-100">
         <Image className="tg-team-shape-2 d-none d-md-block" src={shape_1} alt="" />
         <div className="container">
            <div className="row align-items-center">
               <div className="col-lg-5">
                  <div className="tg-team-details-contant tg-contact-info-wrap mb-30">
                     <h6 className="mb-15">{infoTitle}</h6>
                     <p className="mb-25">{infoDescription}</p>
                     <div className="tg-team-details-contact-info mb-35">
                        <div className="tg-team-details-contact">
                           {siteSettings.phone && (
                              <div className="item">
                                 <span>Điện thoại:</span>
                                 <Link href={phoneHref(siteSettings.phone)}>{siteSettings.phone}</Link>
                              </div>
                           )}
                           {siteSettings.website && (
                              <div className="item">
                                 <span>Website:</span>
                                 <Link href={websiteHref(siteSettings.website)} target="_blank" rel="noopener noreferrer">
                                    {siteSettings.website}
                                 </Link>
                              </div>
                           )}
                           {siteSettings.email && (
                              <div className="item">
                                 <span>Email:</span>
                                 <Link href={`mailto:${siteSettings.email}`}>{siteSettings.email}</Link>
                              </div>
                           )}
                           {address && (
                              <div className="item">
                                 <span>Địa chỉ:</span>
                                 <Link href={addressLink} target="_blank" rel="noopener noreferrer">{address}</Link>
                              </div>
                           )}
                           {primaryLocation?.service_time?.trim() && (
                              <div className="item">
                                 <span>Thời gian làm việc:</span>
                                 <span>{primaryLocation.service_time.trim()}</span>
                              </div>
                           )}
                        </div>
                     </div>
                     {mapUrl && (
                        <div className="tg-contact-map h-100">
                           <iframe
                              title={primaryLocation?.name?.trim() || "Vị trí GOLFNITY"}
                              src={mapUrl}
                              width="600"
                              height="450"
                              style={{ border: "0" }}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              allowFullScreen
                           ></iframe>
                        </div>
                     )}
                     {addressLink && (
                        <Link className="contact-map-link" href={addressLink} target="_blank" rel="noopener noreferrer">
                           Mở trong Maps
                        </Link>
                     )}
                  </div>
               </div>
               <div className="col-lg-7">
                  <div className="tg-contact-content-wrap ml-40 mb-30">
                     <h3 className="tg-contact-title mb-15">{formTitle}</h3>
                     <p className="mb-30">{formDescription}</p>
                     <div className="tg-contact-form tg-tour-about-review-form">
                        <ContactForm />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ContactArea
