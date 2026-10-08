import Wishlist from "@/components/pages/shops/wishlist";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Wishlist | GOLFNITY",
};

const UserWishlistPage = () => (
  <Wrapper>
    <Wishlist />
  </Wrapper>
);

export default UserWishlistPage;
