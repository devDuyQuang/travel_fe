"use client"
import BannerFormThree from "@/components/common/banner-form/BannerFormThree"
import About from "./About"
import Banner from "./Banner"
import Blog from "./Blog"
import Choose from "./Choose"
import CtaThree from "./Cta"
import CtaTwo from "./CtaTwo"
import ExploreNav from "./ExploreNav"
import HomeQuickCategories from "./HomeQuickCategories"
import Location from "./Location"
import Testimonial from "./Testimonial"
import HeaderThree from "@/layouts/headers/HeaderThree"
import FooterThree from "@/layouts/footers/FooterThree"
import { HomepageSettingsProvider } from "@/hooks/useHomepageSettings"
import type { HomepageSettings } from "@/types/homepage"
import type { Product } from "@/types/product"
import type { CmsPost, CmsServiceCategory } from "@/types/cms-post"
import Listing from "./Listing"

const HomeThree = ({
   initialSettings,
   initialServiceCategories = [],
   initialProducts = [],
   initialPosts = [],
}: {
   initialSettings?: HomepageSettings;
   initialServiceCategories?: CmsServiceCategory[];
   initialProducts?: Product[];
   initialPosts?: CmsPost[];
}) => {
   return (
      <HomepageSettingsProvider initialSettings={initialSettings}>
         <HeaderThree showGlobalUtility />
         <ExploreNav />
         <main>
            <Banner />
            <BannerFormThree initialCategories={initialServiceCategories} />
            <HomeQuickCategories />
            <About />
            <Listing
               initialCategories={initialServiceCategories}
               initialProducts={initialProducts}
            />
            <Choose />
            <CtaThree />
            <Location />
            <CtaTwo />
            <Testimonial />
            <Blog initialPosts={initialPosts} />
         </main>
         <FooterThree />
      </HomepageSettingsProvider>
   )
}

export default HomeThree
