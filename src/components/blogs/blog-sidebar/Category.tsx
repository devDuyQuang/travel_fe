import Link from "next/link";
import type { CmsCategorySummary } from "@/types/cms-post";

const Category = ({
   categories = [],
   currentCategory,
   search,
}: {
   categories?: CmsCategorySummary[];
   currentCategory?: string;
   search?: string;
}) => {
   if (!categories.length) return null;

   return (
      <div className="tg-blog-categories tg-blog-sidebar-box mb-40">
         <h5 className="tg-blog-sidebar-title mb-5">Danh mục</h5>
         <div className="tg-blog-categories-list">
            <ul>
               {categories.map((item) => {
                  const params = new URLSearchParams();
                  params.set("category", item.slug);
                  if (search?.trim()) params.set("search", search.trim());
                  const count = item.posts_count ?? item.count;

                  return (
                  <li key={item.id} className={currentCategory === item.slug ? "active" : ""}>
                     <Link href={`/tin-tuc?${params.toString()}`}>
                        <span>{item.name}</span>
                        {typeof count === "number" && <span>({count})</span>}
                     </Link>
                  </li>
                  );
               })}
            </ul>
         </div>
      </div>
   )
}

export default Category
