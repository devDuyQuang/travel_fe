"use client";

import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";

import shape from "@/assets/img/location/shape-2.png";
import hcmImage from "@/assets/img/location/location.jpg";
import daNangImage from "@/assets/img/listing/listing-2/listing.jpg";
import hoiAnImage from "@/assets/img/listing/listing-2/listing-1.jpg";
import nhaTrangImage from "@/assets/img/listing/listing-2/listing-2.jpg";
import phuQuocImage from "@/assets/img/listing/listing-2/listing-6.jpg";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";

type DestinationCard = {
  id: number;
  title: string;
  description: string;
  href: string;
  thumb: StaticImageData;
};

const Location = () => {
  const setting = useHomepageSettings().destinations_home;
  if (setting?.enabled === false) return null;
  const destinations: DestinationCard[] = [
    {
      id: 1,
      title: "TP.HCM",
      description: "Golf · công tác · nghỉ dưỡng",
      href: "/dich-vu/dat-tee-time/danh-sach?location=tp-ho-chi-minh",
      thumb: hcmImage,
    },
    {
      id: 2,
      title: "Đà Nẵng",
      description: "Golf ven biển · resort · tour",
      href: "/dich-vu/dat-tee-time/danh-sach?location=da-nang",
      thumb: daNangImage,
    },
    {
      id: 3,
      title: "Hội An",
      description: "Văn hóa · nghỉ dưỡng · golf",
      href: "/dich-vu/dat-tee-time/danh-sach?location=hoi-an",
      // TODO: thay bằng ảnh phố cổ Hội An thật khi asset nội bộ có sẵn.
      thumb: hoiAnImage,
    },
    {
      id: 4,
      title: "Nha Trang",
      description: "Biển · đảo · golf tour",
      href: "/dich-vu/dat-tee-time/danh-sach?location=nha-trang",
      thumb: nhaTrangImage,
    },
    {
      id: 5,
      title: "Phú Quốc",
      description: "Resort · biển · trải nghiệm",
      href: "/dich-vu/dat-tee-time/danh-sach?location=phu-quoc",
      thumb: phuQuocImage,
    },
  ];

  return (
    <div className="tg-location-area p-relative pb-70 tg-grey-bg pt-70 golfnity-home-location">
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
                Điểm đến GOLFNITY
              </h5>
              <h2
                className="mb-15 wow fadeInUp"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Bạn muốn đi đâu?
              </h2>
              <p
                className="wow fadeInUp"
                data-wow-delay=".6s"
                data-wow-duration=".9s"
              >
                Khám phá những điểm đến golf và nghỉ dưỡng phù hợp cho hành
                trình tiếp theo.
              </p>
            </div>
          </div>
          <div className="col-12">
            <div className="golfnity-home-location__grid">
              {destinations.map((item) => (
                <div
                  key={item.id}
                  className="wow fadeInUp"
                  data-wow-delay=".3s"
                  data-wow-duration=".9s"
                >
                  <Link className="golfnity-home-location__card" href={item.href}>
                    <span className="golfnity-home-location__thumb">
                      <Image
                        className="w-100"
                        src={item.thumb}
                        alt={item.title}
                      />
                    </span>
                    <span className="golfnity-home-location__title">
                      {item.title}
                    </span>
                    <span className="golfnity-home-location__eyebrow">
                      {item.description}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
