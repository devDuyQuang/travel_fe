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
import {
   ComboGolfShelf,
   FeaturedDealsShelf,
   RecentlyViewedShelf,
} from "./HomeProductShelves"
import WhyChooseGolfnity from "./WhyChooseGolfnity"

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
            <Location />
            <Listing
               initialCategories={initialServiceCategories}
               initialProducts={initialProducts}
            />
            <RecentlyViewedShelf products={initialProducts} />
            <ComboGolfShelf products={initialProducts} />
            <FeaturedDealsShelf products={initialProducts} />
            <WhyChooseGolfnity />
            <Blog initialPosts={initialPosts} />
            {/*
               Conversion-lower sections are kept in the template but hidden for the
               booking-first homepage pass.
               <About />
               <Choose />
               <CtaThree />
               <CtaTwo />
               <Testimonial />
            */}
         </main>
         <FooterThree />
      </HomepageSettingsProvider>
   )
}

export default HomeThree
