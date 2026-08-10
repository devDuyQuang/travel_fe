import BreadCrumb from "@/components/common/BreadCrumb";
import type { GolfService } from "@/data/GolfServiceData";
import FooterThree from "@/layouts/footers/FooterThree";
import HeaderThree from "@/layouts/headers/HeaderThree";
import Link from "next/link";

const GolfServiceLanding = ({ service }: { service: GolfService }) => {
  return (
    <>
      <HeaderThree />
      <main>
        <BreadCrumb title={service.title} sub_title={service.title} />
        <section className="golfnity-service-area pt-100 pb-100">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="golfnity-service-content mb-35">
                  <span className="tg-section-subtitle mb-10 d-inline-block">Giải pháp GOLFNITY</span>
                  <h1 className="mb-20">{service.title}</h1>
                  <p className="mb-30">{service.description}</p>
                  <ul className="golfnity-service-highlights">
                    {service.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="golfnity-service-cta">
                  <h3 className="mb-15">Nhận tư vấn dịch vụ</h3>
                  <p className="mb-25">GOLFNITY sẽ tư vấn giải pháp phù hợp với nhu cầu, quy mô và ngân sách của bạn.</p>
                  <Link className="tg-btn" href={`/contact?service=${service.slug}`}>
                    Liên hệ tư vấn
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterThree />
    </>
  );
};

export default GolfServiceLanding;
