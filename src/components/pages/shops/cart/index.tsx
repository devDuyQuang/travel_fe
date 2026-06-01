import BreadCrumb from "@/components/common/BreadCrumb"
import FooterThree from "@/layouts/footers/FooterThree";
import HeaderThree from "@/layouts/headers/HeaderThree"
import CartArea from "./CartArea"

const Cart = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Cart Page" sub_title="Cart" />
            <CartArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Cart
