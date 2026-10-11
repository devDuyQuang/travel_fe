import Link from "next/link"
import type { Product } from "@/types/product";

const Breadcrumb = ({ product }: { product: Product | null }) => {
   const categoryName = product?.category?.name || "Tour Grid";
   const categoryPath = product?.category?.slug
      ? `/dich-vu/${product.category.slug}`
      : "/tour-grid-1";

   return (
      <>
         <div className="tg-breadcrumb-spacing-3 include-bg p-relative fix" style={{ backgroundImage: `url(/assets/img/breadcrumb/breadcrumb-2.jpg)` }}>
            <div className="tg-hero-top-shadow"></div>
         </div>
         <div className="tg-breadcrumb-list-2-wrap">
            <div className="container">
               <div className="row">
                  <div className="col-12">
                     <nav className="tg-breadcrumb-list-2" aria-label="Breadcrumb">
                        <ul>
                           <li><Link href="/">Home</Link></li>
                           <li><i aria-hidden="true" className="fa-sharp fa-solid fa-angle-right"></i></li>
                           <li><Link href={categoryPath}>{categoryName}</Link></li>
                           <li><i aria-hidden="true" className="fa-sharp fa-solid fa-angle-right"></i></li>
                           <li><span aria-current="page">{product?.name || "Vatican Museums Sistine Chapel Skip the Line"}</span></li>
                        </ul>
                     </nav>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
}

export default Breadcrumb
