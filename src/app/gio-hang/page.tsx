import Cart from "@/components/pages/shops/cart";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Giỏ hàng | WAYLUNE",
  robots: { index: false, follow: false },
};

const GioHangPage = () => (
  <Wrapper>
    <Cart />
  </Wrapper>
);

export default GioHangPage;
