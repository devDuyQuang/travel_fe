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
    return menu.sub_menus?.some((sub) => sub.link && isActive(sub.link));
  };
  const brandTitle = (title: string) => title.replace(/WAYLUNE/gi, "GOLFNITY");

  return (
    <ul className="navigation">
      {menus.map((menu) => (
        <li
          key={menu.id}
          className={menu.has_dropdown ? "menu-item-has-children" : ""}
        >
          <Link
            href={menu.link || "#"}
            className={isActive(menu.link) || hasActiveChild(menu) ? "active" : ""}
          >
            {brandTitle(menu.title)}
          </Link>

          {menu.has_dropdown && menu.sub_menus && menu.sub_menus.length > 0 && (
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
