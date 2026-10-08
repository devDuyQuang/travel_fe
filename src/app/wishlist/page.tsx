import Wishlist from "@/components/pages/shops/wishlist";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Danh sách yêu thích | GOLFNITY",
};
const page = () => {
  return (
    <Wrapper>
      <Wishlist />
    </Wrapper>
  )
}

export default page