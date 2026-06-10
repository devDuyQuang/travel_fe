import Link from "next/link";

type BreadcrumbProps = {
  title?: string | null;
  categoryName?: string | null;
  categoryHref?: string;
};

const Breadcrumb = ({
  title,
  categoryName = "Golf Courses",
  categoryHref = "/tour-grid-1",
}: BreadcrumbProps) => {
  const currentTitle = title || "Tour Detail";

  return (
    <>
      <div
        className="tg-breadcrumb-spacing-3 include-bg p-relative fix"
        style={{
          backgroundImage: "url(/assets/img/breadcrumb/breadcrumb-2.jpg)",
        }}
      >
        <div className="tg-hero-top-shadow"></div>
      </div>

      <nav className="tg-breadcrumb-list-2-wrap" aria-label="Breadcrumb">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="tg-breadcrumb-list-2">
                <ul>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li aria-hidden="true">
                    <i className="fa-sharp fa-solid fa-angle-right"></i>
                  </li>
                  <li>
                    <Link href={categoryHref}>{categoryName}</Link>
                  </li>
                  <li aria-hidden="true">
                    <i className="fa-sharp fa-solid fa-angle-right"></i>
                  </li>
                  <li aria-current="page">
                    <span>{currentTitle}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Breadcrumb;
