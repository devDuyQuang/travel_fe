import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import BlogDetailsArea from "./BlogDetailsArea"
import FooterThree from "@/layouts/footers/FooterThree";

const BlogDetails = () => {
  return (
    <>
      <HeaderThree />
      <main>
        <BreadCrumb title="Blog Details" sub_title="Exploring The Green Spac Realar Residence Area Harmony" />
        <BlogDetailsArea />
      </main>
      <FooterThree />
    </>
  )
}

export default BlogDetails
