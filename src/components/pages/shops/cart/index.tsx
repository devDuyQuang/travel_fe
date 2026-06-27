import BreadCrumb from "@/components/common/BreadCrumb";
import FooterSix from "@/layouts/footers/FooterSix";
import HeaderThree from "@/layouts/headers/HeaderThree";
import CartArea from "./CartArea";

const Cart = () => (
  <>
    <HeaderThree />
    <main>
      <BreadCrumb title="Giỏ hàng" sub_title="Giỏ hàng" />
      <CartArea />
    </main>
    <FooterSix />
  </>
);

export default Cart;
