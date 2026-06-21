import Link from "next/link";
import type { Product } from "@/types/product";

const BreadCrumb = ({ product }: { product: Product | null }) => {
  return (
    <>
      <div
        className="tg-breadcrumb-spacing-3 include-bg p-relative fix"
        style={{
          backgroundImage: `url(/assets/img/breadcrumb/breadcrumb-2.jpg)`,
        }}
      >
        <div className="tg-hero-top-shadow"></div>
      </div>

      <div className="tg-breadcrumb-list-2-wrap">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tg-breadcrumb-list-2">
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <i className="fa-sharp fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link href={product?.category?.slug ? `/dich-vu/${product.category.slug}` : "/khach-san-nghi-duong"}>
                      {product?.category?.name || "Khách sạn & nghỉ dưỡng"}
                    </Link>
                  </li>
                  <li>
                    <i className="fa-sharp fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <span>{product?.name || "Vatican Museums Sistine Chapel Skip the Line"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreadCrumb;
