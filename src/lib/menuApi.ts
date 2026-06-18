export type FrontendMenuItem = {
  id: number;
  title: string;
  link: string;
  has_dropdown: boolean;
  sub_menus?: {
    id?: number;
    title: string;
    link: string;
  }[];
};

type ApiMenuItem = {
  id?: number;
  name?: string;
  title?: string;
  path?: string;
  url?: string;
  link?: string;
  public_url?: string;
  status?: number | boolean;
  location?: string;
  children?: ApiMenuItem[];
  sub_menus?: ApiMenuItem[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://api.localhost:8000";

function normalizePath(item: ApiMenuItem): string {
  const raw = item.public_url || item.path || item.url || item.link || "/";

  if (!raw) return "/";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  return raw.startsWith("/") ? raw : `/${raw}`;
}

function normalizeMenuItem(item: ApiMenuItem, index: number): FrontendMenuItem {
  const children = item.children || item.sub_menus || [];

  return {
    id: Number(item.id || index + 1),
    title: String(item.title || item.name || "Menu"),
    link: normalizePath(item),
    has_dropdown: children.length > 0,
    sub_menus: children.map((child, childIndex) => ({
      id: child.id,
      title: String(child.title || child.name || "Menu"),
      link: normalizePath(child),
    })),
  };
}

export async function getHeaderMenus(): Promise<FrontendMenuItem[]> {
  try {
    const res = await fetch(`${API_URL}/menu`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Menu API error: ${res.status}`);
    }

    const json = await res.json();

    const rawMenus =
      json?.data ||
      json?.menus ||
      json?.items ||
      json;

    if (!Array.isArray(rawMenus)) {
      return [];
    }

    return rawMenus
      .filter((item: ApiMenuItem) => {
        const status = item.status;
        const location = String(item.location || "").toLowerCase();

        const isActive = status === undefined || status === 1 || status === true;
        const isHeader = !location || location === "header";

        return isActive && isHeader;
      })
      .map(normalizeMenuItem);
  } catch (error) {
    console.error("Failed to load header menu:", error);
    return [];
  }
}
