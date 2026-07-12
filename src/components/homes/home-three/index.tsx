"use client"
import BannerFormThree from "@/components/common/banner-form/BannerFormThree"
import About from "./About"
import Banner from "./Banner"
import Blog from "./Blog"
import Choose from "./Choose"
import CtaThree from "./Cta"
import CtaTwo from "./CtaTwo"
import Location from "./Location"
import Testimonial from "./Testimonial"
import dynamic from "next/dynamic"
import HeaderThree from "@/layouts/headers/HeaderThree"
import FooterThree from "@/layouts/footers/FooterThree"
import { HomepageSettingsProvider } from "@/hooks/useHomepageSettings"
import type { HomepageSettings } from "@/types/homepage"
const Listing = dynamic(() => import("./Listing"), { ssr: false });

const HomeThree = ({ initialSettings }: { initialSettings?: HomepageSettings }) => {
   return (
      <HomepageSettingsProvider initialSettings={initialSettings}>
         <HeaderThree showGlobalUtility />
         <main>
            <Banner />
            <BannerFormThree />
            <About />
            <Listing />
            <Choose />
            <CtaThree />
            <Location />
            <CtaTwo />
            <Testimonial />
            <Blog />
         </main>
         <FooterThree />
      </HomepageSettingsProvider>
   )
}

export default HomeThree
