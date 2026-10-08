import Cart from "@/components/pages/shops/cart";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Giỏ hàng | GOLFNITY",
};

const CartViewPage = () => (
  <Wrapper>
    <Cart />
  </Wrapper>
);

export default CartViewPage;
