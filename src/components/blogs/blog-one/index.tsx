import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import BlogArea from "./BlogArea"
import FooterThree from "@/layouts/footers/FooterThree";
import type { CmsPost } from "@/types/cms-post";

const BlogOne = ({ posts = [] }: { posts?: CmsPost[] }) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Blogs" sub_title="Blog" />
            <BlogArea posts={posts} />
         </main>
         <FooterThree />
      </>
   )
}

export default BlogOne
