import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import BlogArea from "./BlogArea"
import FooterSix from "@/layouts/footers/FooterSix";
import type { CmsCategorySummary, CmsPaginationMeta, CmsPost, CmsTag } from "@/types/cms-post";

const BlogOne = ({
   posts = [],
   meta,
   categories = [],
   recentPosts = [],
   tags = [],
   search = "",
   categorySlug = "",
   tag = "",
}: {
   posts?: CmsPost[];
   meta?: CmsPaginationMeta;
   categories?: CmsCategorySummary[];
   recentPosts?: CmsPost[];
   tags?: CmsTag[];
   search?: string;
   categorySlug?: string;
   tag?: string;
}) => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Tin tức" sub_title="Tin tức" />
            <BlogArea
               posts={posts}
               meta={meta}
               categories={categories}
               recentPosts={recentPosts}
               tags={tags}
               search={search}
               categorySlug={categorySlug}
               tag={tag}
            />
         </main>
         <FooterSix />
      </>
   )
}

export default BlogOne
