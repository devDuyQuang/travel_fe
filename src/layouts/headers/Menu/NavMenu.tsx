// "use client";
// import menu_data from "@/data/MenuData";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// const NavMenu = () => {
//     const currentRoute = usePathname();

//     const isMenuItemActive = (menuLink: string) => {
//         return currentRoute === menuLink;
//     };

//     const isSubMenuItemActive = (subMenuLink: string) => {
//         return currentRoute === subMenuLink;
//     };

//     return (
//         <ul className="navigation">
//             {menu_data.map((menu) => (
//                 <li key={menu.id} className={menu.has_dropdown ? "menu-item-has-children" : ""}>
//                     <Link href={menu.link} className={`${(isMenuItemActive(menu.link) || (menu.sub_menus && menu.sub_menus.some((sub_m) => sub_m.link && isSubMenuItemActive(sub_m.link)))) ? "active" : ""}`}>
//                         {menu.title}
//                     </Link>

//                     {menu.has_dropdown && (
//                         <>
//                             {menu.sub_menus && (
//                                 <ul className="sub-menu">
//                                     {menu.sub_menus.map((sub_m, i) => (
//                                         <li key={i}>
//                                             <Link href={sub_m.link} className={`${sub_m.link && isSubMenuItemActive(sub_m.link) ? "active" : ""}`}>
//                                                 {sub_m.title}
//                                             </Link>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </>
//                     )}
//                 </li>
//             ))}
//         </ul>
//     );
// };

// export default NavMenu;

"use client";

import menu_data from "@/data/MenuData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FrontendMenuItem, getHeaderMenus } from "@/lib/menuApi";

const NavMenu = () => {
  const currentRoute = usePathname();
  const [menus, setMenus] = useState<FrontendMenuItem[]>(menu_data);

  useEffect(() => {
    let mounted = true;

    getHeaderMenus().then((items) => {
      if (!mounted) return;

      if (items.length > 0) {
        setMenus(items);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const isActive = (link: string) => {
    if (
      !link ||
      link.includes("?") ||
      link.startsWith("http://") ||
      link.startsWith("https://")
    ) {
      return false;
    }

    return currentRoute === link;
  };

  const hasActiveChild = (menu: FrontendMenuItem) => {
    return Boolean(
      menu.sub_menus?.some((sub) => sub.link && isActive(sub.link)) ||
      menu.mega_groups?.some((group) => group.items.some((item) => isActive(item.link))),
    );
  };
  const isTopMenuActive = (menu: FrontendMenuItem) => {
    if (menu.mega_groups && menu.link?.startsWith("/dich-vu")) {
      return currentRoute.startsWith("/dich-vu");
    }

    return isActive(menu.link) || hasActiveChild(menu);
  };
  const brandTitle = (title: string) => title.replace(/WAYLUNE/gi, "GOLFNITY");
  const megaThumbByTitle: Record<string, string> = {
    "Đặt sân golf": "/assets/img/listing/listing-1.jpg",
    "Tour golf": "/assets/img/destination/des.jpg",
    "Combo golf & khách sạn": "/assets/img/listing/listing-3.jpg",
    "Tổ chức giải golf": "/assets/img/location/su/destination-2.jpg",
    "Golf doanh nghiệp": "/assets/img/location/su/destination-3.jpg",
    "Khách sạn & resort": "/assets/img/listing/listing-4.jpg",
    "Resort gần sân golf": "/assets/img/location/su/destination.jpg",
    "Combo khách sạn + golf": "/assets/img/listing/listing-6.jpg",
    "Nghỉ dưỡng cao cấp": "/assets/img/chose/chose-5/chose-3.jpg",
    "Tour trong ngày": "/assets/img/ads/destination-1.jpg",
    "Trải nghiệm địa phương": "/assets/img/ads/destination-2.jpg",
    "Du thuyền": "/assets/img/listing/map-list/list.jpg",
    "Ẩm thực": "/assets/img/blog/blog-1.jpg",
    "Spa & nghỉ dưỡng": "/assets/img/chose/chose-5/chose-2.jpg",
    "Outdoor / khám phá": "/assets/img/location/location-2.jpg",
    "Vé cáp treo": "/assets/img/destination/des-2.jpg",
    "Công viên / khu vui chơi": "/assets/img/destination/des-3.jpg",
    "Bảo tàng / di tích": "/assets/img/destination/des-4.jpg",
    "Vé show / sự kiện": "/assets/img/ads/destination-3.jpg",
    "Thuê xe có tài xế": "/assets/img/listing/map-list/list-2.jpg",
    "Thuê xe tự lái": "/assets/img/listing/map-list/list-3.jpg",
    "Xe 4 chỗ": "/assets/img/listing/map-list/list-4.jpg",
    "Xe 7 chỗ": "/assets/img/listing/map-list/list-5.jpg",
    "Xe 16 chỗ": "/assets/img/listing/map-list/list-6.jpg",
    "Đưa đón sân bay": "/assets/img/location/location-3.jpg",
  };
  const getMegaThumb = (title: string) => megaThumbByTitle[title] || "/assets/img/location/location.jpg";
  const normalizeMenus = (items: FrontendMenuItem[]) => {
    void items;
    return menu_data;
  };
  const navigationMenus = normalizeMenus(menus);

  return (
    <ul className="navigation">
      {navigationMenus.map((menu) => (
        <li
          key={menu.id}
          className={[
            menu.has_dropdown ? "menu-item-has-children" : "",
            menu.mega_groups ? "golfnity-mega-menu-item" : "",
          ].filter(Boolean).join(" ")}
        >
          <Link
            href={menu.link || "#"}
            className={isTopMenuActive(menu) ? "active" : ""}
          >
            {brandTitle(menu.title)}
          </Link>

          {menu.mega_groups && menu.mega_groups.length > 0 ? (
            <div className="golfnity-mega-menu" role="menu">
              <div className="golfnity-mega-menu__grid">
                {menu.mega_groups.map((group) => (
                  <section className="golfnity-mega-menu__group" key={group.id || group.title}>
                    <h3>
                      <span>
                        {group.icon && <i className={group.icon} aria-hidden="true" />}
                      </span>
                      {brandTitle(group.title)}
                    </h3>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.id || item.title}>
                          <Link
                            className="golfnity-mega-menu__link"
                            href={item.link || "#"}
                          >
                            <span className="golfnity-mega-menu__thumb">
                              <img src={getMegaThumb(item.title)} alt="" loading="lazy" />
                            </span>
                            <span className="golfnity-mega-menu__copy">
                              <span className="golfnity-mega-menu__meta">{brandTitle(group.title)}</span>
                              <span className="golfnity-mega-menu__title">{brandTitle(item.title)}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          ) : menu.has_dropdown && menu.sub_menus && menu.sub_menus.length > 0 && (
            <ul className="sub-menu">
              {menu.sub_menus.map((subMenu, index) => (
                <li key={subMenu.id || index}>
                  <Link
                    href={subMenu.link || "#"}
                    className={subMenu.link && isActive(subMenu.link) ? "active" : ""}
                  >
                    {brandTitle(subMenu.title)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavMenu;
