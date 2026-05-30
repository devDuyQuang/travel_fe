
interface MenuItem {
    id: number;
    title: string;
    link: string;
    has_dropdown: boolean;
    sub_menus?: {
        link: string;
        title: string;
    }[];
}

const menu_data: MenuItem[] = [
    {
        id: 1,
        title: "Home",
        link: "/home-three",
        has_dropdown: false,

        // has_dropdown: true,
        // sub_menus: [
        //   { link: "/home-three", title: "Home Three" },
        // ],
    },

    {
        id: 2,
        title: "About",
        link: "/about",
        has_dropdown: false,

        // title: "Features",
        // link: "#",
        // has_dropdown: true,
        // sub_menus: [
        //   { link: "/hotel-grid", title: "Hotel Grid" },
        //   { link: "/tour-grid-1", title: "Tour Grid One" },
        //   { link: "/tour-details", title: "Tour Details One" },
        // ],
    },

    {
        id: 3,
        title: "Service",
        link: "/tour-grid-1",
        has_dropdown: false,

        // ===== TEMPLATE VERSION =====
        // link: "#",
        // has_dropdown: true,
        // sub_menus: [
        //     {
        //         link: "/tour-grid-1",
        //         title: "Tour Grid",
        //     },
        //     {
        //         link: "/tour-details",
        //         title: "Tour Detail One",
        //     },
        // ],
    },
    {
        id: 4,
        title: "Blogs",
        link: "/blog-grid",
        has_dropdown: false,

        // ===== TEMPLATE VERSION =====
        // link: "#",
        // has_dropdown: true,
        // sub_menus: [
        //     {
        //         link: "/blog-grid",
        //         title: "Blog Grid",
        //     },
        //     {
        //         link: "/blog-details",
        //         title: "Blog Detail",
        //     },
        //     {
        //         link: "/blog-standard",
        //         title: "Blog Standard",
        //     },
        // ],
    },

    {
        id: 5,
        has_dropdown: false,
        title: "Contact",
        link: "/contact",
    },
];

export default menu_data;