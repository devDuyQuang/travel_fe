import BreadCrumb from "@/components/common/BreadCrumb"
import FooterThree from "@/layouts/footers/FooterThree";
import HeaderThree from "@/layouts/headers/HeaderThree"
import CheckoutArea from "./CheckoutArea"

const Checkout = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Checkout Page" sub_title="Checkout Page" />
            <CheckoutArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Checkout
