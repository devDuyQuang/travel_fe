"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import UseSticky from "@/hooks/UseSticky";
import useSiteSettings from "@/hooks/useSiteSettings";
import PhoneIcon from "@/svg/PhoneIcon";
import CartIcon from "@/svg/CartIcon";
import UserIcon from "@/svg/UserIcon";
import golfnityLogo from "@/assets/img/logo/golfnity-logo2x.png";
import NavMenu from "./Menu/NavMenu";
import Offcanvas from "./Menu/Offcanvas";
import Sidebar from "./Menu/Sidebar";
import HeaderCart from "./Menu/HeaderCart";
import TotalCart from "./Menu/TotalCart";

type HeaderThreeProps = {
  variant?: "transparent" | "solid";
  showGlobalUtility?: boolean;
};

const HeaderThree = ({
  variant = "transparent",
  showGlobalUtility = false,
}: HeaderThreeProps) => {
  const { sticky } = UseSticky();
  const [offCanvas, setOffCanvas] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const siteSettings = useSiteSettings();
  const { customer, status } = useCustomerAuth();
  const logo = siteSettings.logo || golfnityLogo;

  return (
    <>
      <header className="tg-header-height">
        <div
          className={[
            "tg-header__area",
            "tg-header-lg-space",
            "z-index-999",
            "golfnity-header",
            variant === "transparent"
              ? "tg-transparent golfnity-header--transparent"
              : "golfnity-header--solid",
            sticky ? "header-sticky" : "",
          ].filter(Boolean).join(" ")}
          id="header-sticky"
        >
          <div className="container-fluid container-1860">
            <div className="row align-items-center">
              <div className={`${showGlobalUtility ? "col-xl-7" : "col-xl-8"} col-5`}>
                <div className="tgmenu__wrap golfnity-header-main d-flex align-items-center">
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

                  <nav className="tgmenu__nav golfnity-header-nav">
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                      <NavMenu />
                    </div>
                  </nav>
                </div>
              </div>

              <div className={`${showGlobalUtility ? "col-xl-5" : "col-xl-4"} col-7`}>
                <div className="tg-menu-right-action d-flex align-items-center justify-content-end">
                  {showGlobalUtility && (
                    <nav
                      className="golfnity-global-utility d-none d-xxl-flex align-items-center"
                      aria-label="Tiện ích toàn cầu"
                    >
                      <button type="button" title="Ngôn ngữ và tiền tệ">
                        VI / VND
                        <i className="fa-regular fa-chevron-down" aria-hidden="true" />
                      </button>
                      <Link href="/cau-hoi-thuong-gap">Trợ giúp</Link>
                      <Link href="/user/wishlist">Xem gần đây</Link>
                      {status !== "authenticated" && (
                        <Link href="/dang-nhap?mode=register">Đăng ký</Link>
                      )}
                    </nav>
                  )}

                  {!showGlobalUtility && (
                    <div className="tg-header-contact-info d-flex align-items-center">
                    <span className="tg-header-contact-icon mr-5 d-none d-xl-block">
                      <PhoneIcon />
                    </span>
                    <div className="tg-header-contact-number d-none d-xl-block">
                      <span>Hotline:</span>
                      <Link href={siteSettings.phone ? `tel:${siteSettings.phone}` : "/contact"}>
                        {siteSettings.phone || "Liên hệ tư vấn"}
                      </Link>
                    </div>
                  </div>
                  )}

                  {!showGlobalUtility && (
                    <div className="tg-header-cart p-relative ml-20 pl-20 d-none d-xl-block">
                    <Link className="cart-button" aria-label="Mở giỏ hàng" href="/gio-hang">
                      <CartIcon />
                      <span className="tg-header-cart-count">
                        <TotalCart />
                      </span>
                    </Link>
                    <HeaderCart />
                  </div>
                  )}

                  <div className="tg-header-btn ml-20 d-none d-sm-block">
                    <Link className="tg-btn-header" href="/dang-nhap">
                      <span>
                        <UserIcon />
                      </span>
                      {status === "authenticated" ? customer?.name || "Tài khoản" : "Đăng nhập"}
                    </Link>
                  </div>

                  <div className="tg-header-menu-bar lh-1 p-relative ml-20 pl-20">
                    <button
                      onClick={() => setSidebar(true)}
                      className="tgmenu-offcanvas-open-btn menu-tigger d-none d-xl-block"
                      aria-label="Mở menu"
                    >
                      <span></span>
                      <span></span>
                      <span></span>
                    </button>
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
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
    </>
  );
};

export default HeaderThree;
