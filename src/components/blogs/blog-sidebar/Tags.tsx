import Link from "next/link"
import type { CmsTag } from "@/types/cms-post";

const Tags = ({ tags = [], search, category }: { tags?: CmsTag[]; search?: string; category?: string }) => {
   if (!tags.length) return null;

   return (
      <div className="tg-blog-sidebar-tag tg-blog-sidebar-box">
         <h5 className="tg-blog-sidebar-title mb-25">Thẻ</h5>
         <div className="tg-blog-sidebar-tag-list">
            <ul>
               {tags.map((tag) => {
                  const params = new URLSearchParams();
                  params.set("tag", tag.slug);
                  if (search?.trim()) params.set("search", search.trim());
                  if (category?.trim()) params.set("category", category.trim());
                  return <li key={tag.id}><Link href={`/tin-tuc?${params.toString()}`}>{tag.name}</Link></li>;
               })}
            </ul>
         </div>
      </div>
   )
}

export default Tags
