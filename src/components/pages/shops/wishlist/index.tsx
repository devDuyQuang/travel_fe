import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import WishlistArea from "./WishlistArea"
import FooterThree from "@/layouts/footers/FooterThree";

const Wishlist = () => {
  return (
    <>
      <HeaderThree />
      <main>
        <BreadCrumb title="Wishlist Page" sub_title="Wishlist" />
        <WishlistArea />
      </main>
      <FooterThree />
    </>
  )
}

export default Wishlist
