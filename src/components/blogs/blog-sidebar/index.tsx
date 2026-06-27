"use client";

import Category from "./Category"
import RecentPost from "./RecentPost"
import Tags from "./Tags"
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CmsCategorySummary, CmsPost, CmsTag } from "@/types/cms-post";

const BlogSidebar = ({
   categories = [],
   recentPosts = [],
   tags = [],
   currentSearch = "",
   currentCategory,
}: {
   categories?: CmsCategorySummary[];
   recentPosts?: CmsPost[];
   tags?: CmsTag[];
   currentSearch?: string;
   currentCategory?: string;
}) => {
   const router = useRouter();
   const [search, setSearch] = useState(currentSearch);

   const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (currentCategory) params.set("category", currentCategory);
      router.push(params.toString() ? `/tin-tuc?${params.toString()}` : "/tin-tuc");
   };

   return (
      <div className="tg-blog-sidebar top-sticky mb-30">
         <div className="tg-blog-sidebar-search tg-blog-sidebar-box mb-40">
            <h5 className="tg-blog-sidebar-title mb-15">Tìm kiếm</h5>
            <div className="tg-blog-sidebar-form">
               <form onSubmit={handleSearch}>
                  <input
                     type="text"
                     value={search}
                     onChange={(event) => setSearch(event.target.value)}
                     placeholder="Nhập từ khóa..."
                  />
                  <button type="submit" aria-label="Tìm kiếm bài viết">
                     <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_497_1336)">
                           <path d="M17 17L13.5247 13.5247M15.681 8.3405C15.681 12.3945 12.3945 15.681 8.3405 15.681C4.28645 15.681 1 12.3945 1 8.3405C1 4.28645 4.28645 1 8.3405 1C12.3945 1 15.681 4.28645 15.681 8.3405Z" stroke="#e6c770" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                           <clipPath id="clip0_497_1336">
                              <rect width="18" height="18" fill="white" />
                           </clipPath>
                        </defs>
                     </svg>
                  </button>
               </form>
            </div>
         </div>
         <Category categories={categories} currentCategory={currentCategory} search={search} />
         <RecentPost posts={recentPosts} />
         <Tags tags={tags} search={search} category={currentCategory} />
      </div>
   )
}

export default BlogSidebar
