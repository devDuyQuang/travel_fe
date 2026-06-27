"use client";

import location_data from "@/data/LocationData";
import Image from "next/image";
import Link from "next/link";

import shape from "@/assets/img/location/shape-2.png";
import { homepageText, useHomepageSettings } from "@/hooks/useHomepageSettings";

const Location = () => {
  const setting = useHomepageSettings().destinations_home;
  if (setting?.enabled === false) return null;
  const limit = Math.max(1, Math.min(12, setting?.limit || 4));

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
                {homepageText(setting?.subtitle, "Next Adventure Destination")}
              </h5>
              <h2
                className="mb-15 text-capitalize wow fadeInUp"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                {setting?.title?.trim()
                  ? setting.title.trim()
                  : <>Popular Travel Destinations <br />Available Worldwide</>}
              </h2>
              <p
                className="text-capitalize wow fadeInUp"
                data-wow-delay=".6s"
                data-wow-duration=".9s"
              >
                {setting?.description?.trim()
                  ? setting.description.trim()
                  : <>Are you tired of the typical tourist destinations and looking
                    <br />to step out of your comfort zonetravel</>}
              </p>
            </div>
          </div>
          {location_data
            .filter((items) => items.page === "home_3")
            .slice(0, limit)
            .map((item) => (
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
                        {item.total} Tours
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
