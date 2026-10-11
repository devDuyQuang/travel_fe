import Link from "next/link";
import type { Product } from "@/types/product";

function serviceHref(slug?: string | null) {
  return `/dich-vu/${slug || "khach-san-nghi-duong"}`;
}

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
              <nav className="tg-breadcrumb-list-2" aria-label="Breadcrumb">
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <i aria-hidden="true" className="fa-sharp fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link href={serviceHref(product?.category?.slug)}>
                      {product?.category?.name || "Khách sạn & resort"}
                    </Link>
                  </li>
                  <li>
                    <i aria-hidden="true" className="fa-sharp fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <span aria-current="page">{product?.name || "Vatican Museums Sistine Chapel Skip the Line"}</span>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BreadCrumb;
