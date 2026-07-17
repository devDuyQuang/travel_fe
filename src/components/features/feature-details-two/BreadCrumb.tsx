import Link from "next/link";
import type { Product } from "@/types/product";

const serviceSlugAliases: Record<string, string> = {
  "dat-tee-time": "golf",
  "khach-san-nghi-duong": "khach-san",
  "thue-xe-dua-don": "thue-xe",
  "tham-quan-trai-nghiem": "tour-trai-nghiem",
};

function serviceHref(slug?: string | null) {
  if (!slug) return "/dich-vu/khach-san";
  return `/dich-vu/${serviceSlugAliases[slug] || slug}`;
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
              <div className="tg-breadcrumb-list-2">
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <i className="fa-sharp fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link href={serviceHref(product?.category?.slug)}>
                      {product?.category?.name || "Khách sạn & resort"}
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
