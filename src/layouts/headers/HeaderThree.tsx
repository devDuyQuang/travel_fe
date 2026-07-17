"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSiteSettings from "@/hooks/useSiteSettings";
import golfnityLogo from "@/assets/img/logo/golfnity-logo2x.png";
import NavMenu from "./Menu/NavMenu";
import Offcanvas from "./Menu/Offcanvas";

type HeaderThreeProps = {
  variant?: "transparent" | "solid";
  showGlobalUtility?: boolean;
};

const HeaderThree = ({
  showGlobalUtility = true,
}: HeaderThreeProps) => {
  const [offCanvas, setOffCanvas] = useState(false);
  const siteSettings = useSiteSettings();
  const logo = siteSettings.logo || golfnityLogo;

  return (
    <>
      <header className="tg-header-height golfnity-header-shell">
        <div
          className={[
            "tg-header__area",
            "tg-header-lg-space",
            "z-index-999",
            "golfnity-header",
            "golfnity-header--solid",
          ].filter(Boolean).join(" ")}
          id="header-sticky"
        >
          <div className="container-fluid container-1860 golfnity-header-inner">
            <div className="golfnity-header-row">
              <div className="golfnity-header-left">
                <div className="tgmenu__wrap golfnity-header-main">
                  <div className="logo">
                    <Link className="logo-1" href="/">
                      <Image
                        src={logo}
                        alt={siteSettings.company || "GOLFNITY"}
                        width={200}
                        height={61}
                        priority
                        className="golfnity-logo-img"
                      />
                    </Link>
                    <Link className="logo-2 d-none" href="/">
                      <Image
                        src={logo}
                        alt={siteSettings.company || "GOLFNITY"}
                        width={200}
                        height={61}
                        priority
                        className="golfnity-logo-img"
                      />
                    </Link>
                  </div>
                  <nav className="tgmenu__nav golfnity-header-nav d-none d-xl-flex" aria-label="Điều hướng chính">
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu">
                      <NavMenu />
                    </div>
                  </nav>
                </div>
              </div>

              <div className="golfnity-header-right">
                <div className="tg-menu-right-action">
                  <nav
                    className={[
                      "golfnity-global-utility",
                      showGlobalUtility ? "d-none d-xl-flex" : "d-none",
                      "align-items-center",
                    ].join(" ")}
                    aria-label="Tiện ích toàn cầu"
                  >
                    <button type="button" title="Ngôn ngữ và tiền tệ">
                      VI / VND
                      <i className="fa-regular fa-chevron-down" aria-hidden="true" />
                    </button>
                    <Link href="/cau-hoi-thuong-gap">Trợ giúp</Link>
                    <Link href="/user/wishlist">Xem gần đây</Link>
                    <Link href="/dang-nhap?mode=register">Đăng ký</Link>
                  </nav>

                  <div className="tg-header-btn d-none d-xl-block">
                    <Link className="tg-btn-header" href="/dang-nhap">
                      Đăng nhập
                    </Link>
                  </div>

                  <div className="tg-header-menu-bar lh-1 p-relative d-xl-none">
                    <button
                      onClick={() => setOffCanvas(true)}
                      className="tgmenu-offcanvas-open-btn mobile-nav-toggler d-block d-xl-none"
                      aria-label="Mở menu di động"
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
    </>
  );
};

export default HeaderThree;
