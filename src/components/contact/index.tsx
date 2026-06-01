import HeaderThree from "@/layouts/headers/HeaderThree"
import BreadCrumb from "../common/BreadCrumb"
import ContactArea from "./ContactArea"
import FooterThree from "@/layouts/footers/FooterThree";

const Contact = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Contact With Us" sub_title="Contact" />
            <ContactArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Contact
