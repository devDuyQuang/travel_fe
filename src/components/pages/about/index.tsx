"use client";

import BreadCrumb from "@/components/common/BreadCrumb"
import FooterSix from "@/layouts/footers/FooterSix";
import HeaderThree from "@/layouts/headers/HeaderThree"
import useAboutPageSettings, { aboutPageMediaUrl } from "@/hooks/useAboutPageSettings";
import AboutArea from "./AboutArea"
import Choose from "./Choose"
import Cta from "./Cta"

const About = () => {
   const settings = useAboutPageSettings();
   const breadcrumbImage =
      aboutPageMediaUrl(settings.hero?.banner_hero) ||
      "/assets/img/breadcrumb/breadcrumb.jpg";

   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb
               title={settings.hero?.title?.trim() || "About Us"}
               sub_title={settings.hero?.sub_title?.trim() || "About Us"}
               backgroundImage={breadcrumbImage}
            />
            <AboutArea
               gallery={settings.gallery}
               intro={settings.intro}
            />
            <Choose setting={settings.values} />
            <Cta setting={settings.consultation} />
         </main>
         <FooterSix />
      </>
   )
}

export default About
