"use client";

import HeaderThree from "@/layouts/headers/HeaderThree"
import BreadCrumb from "../common/BreadCrumb"
import ContactArea from "./ContactArea"
import FooterFive from "@/layouts/footers/FooterFive";
import useContactPageSettings, { contactPageMediaUrl } from "@/hooks/useContactPageSettings";

const Contact = () => {
   const settings = useContactPageSettings();
   const backgroundImage = contactPageMediaUrl(settings.hero?.banner_hero);

   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb
               title={settings.hero?.title?.trim() || "Liên hệ"}
               sub_title={settings.hero?.sub_title?.trim() || "Liên hệ"}
               backgroundImage={backgroundImage || undefined}
            />
            <ContactArea setting={settings.info} locations={settings.locations} />
         </main>
         <FooterFive />
      </>
   )
}

export default Contact
