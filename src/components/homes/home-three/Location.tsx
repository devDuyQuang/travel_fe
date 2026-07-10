"use client";

import location_data from "@/data/LocationData";
import Image from "next/image";
import Link from "next/link";

import shape from "@/assets/img/location/shape-2.png";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";

const Location = () => {
  const setting = useHomepageSettings().destinations_home;
  if (setting?.enabled === false) return null;
  const templateImages = location_data
    .filter((item) => item.page === "home_3")
    .map((item) => item.thumb);
  const destinations = [
    "Đà Nẵng",
    "Nha Trang",
    "Phú Quốc",
    "Hội An",
    "Bangkok",
    "Singapore",
    "Tokyo",
    "Paris",
  ].map((title, index) => ({
    id: index + 1,
    title,
    thumb: templateImages[index % templateImages.length],
  }));

  return (
    <div className="tg-location-area p-relative pb-40 tg-grey-bg pt-140">
      <Image
        className="tg-location-shape d-none d-lg-block"
        src={shape}
        alt="shape"
      />
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tg-location-section-title text-center mb-30">
              <h5
                className="tg-section-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Điểm đến trong và ngoài nước
              </h5>
              <h2
                className="mb-15 text-capitalize wow fadeInUp"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Khám phá hành trình golf &amp; du lịch toàn cầu
              </h2>
              <p
                className="text-capitalize wow fadeInUp"
                data-wow-delay=".6s"
                data-wow-duration=".9s"
              >
                Từ các điểm đến nổi bật tại Việt Nam đến những hành trình quốc tế,
                GOLFNITY giúp bạn dễ dàng tìm kiếm dịch vụ phù hợp cho chuyến đi
                tiếp theo.
              </p>
            </div>
          </div>
          {destinations.map((item) => (
              <div
                key={item.id}
                className="col-lg-3 col-md-6 col-sm-6 wow fadeInUp"
                data-wow-delay=".3s"
                data-wow-duration=".9s"
              >
                <div className="bg-white tg-round-25 p-relative z-index-1">
                  <div className="tg-location-wrap p-relative mb-30">
                    <div className="tg-location-thumb">
                      <Image
                        className="w-100"
                        src={item.thumb}
                        alt="location"
                      />
                    </div>
                    <div className="tg-location-content text-center">
                      <span className="tg-location-time">
                        Khám phá dịch vụ
                      </span>
                      <h3 className="tg-location-title mb-0">
                        <Link href="/dich-vu/tham-quan-trai-nghiem">{item.title}</Link>
                      </h3>
                    </div>
                    <div className="tg-location-border one"></div>
                    <div className="tg-location-border two"></div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Location;
