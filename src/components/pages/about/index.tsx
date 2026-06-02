import BreadCrumb from "@/components/common/BreadCrumb"
import FooterThree from "@/layouts/footers/FooterThree";
import HeaderThree from "@/layouts/headers/HeaderThree"
import AboutArea from "./AboutArea"
import Choose from "./Choose"
import Cta from "./Cta"

const About = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="About Us" sub_title="About Us" />
            <AboutArea />
            <Choose />
            <Cta />
         </main>
         <FooterThree />
      </>
   )
}

export default About
