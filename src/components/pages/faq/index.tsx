import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import FaqArea from "./FaqArea"
import FooterThree from "@/layouts/footers/FooterThree"
import { getFaqs } from "@/services/faq.service";

const Faq = async () => {
   const faqs = await getFaqs();
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Câu hỏi thường gặp" sub_title="Câu hỏi thường gặp" />
            <FaqArea faqs={faqs} />
         </main>
         <FooterThree />
      </>
   )
}

export default Faq
