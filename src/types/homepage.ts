export type HomepageSlide = {
  id?: string;
  enabled?: boolean;
  sort?: number;
  subtitle?: string;
  title?: string;
  description?: string;
  price_prefix?: string;
  price_currency?: string;
  price?: string;
  price_suffix?: string;
  button_text?: string;
  button_link?: string;
  image?: string;
};

export type HomepageTabSetting = {
  category_id: number;
  enabled?: boolean;
  sort?: number;
  display_name?: string;
  placeholder?: string;
};

export type HomepageContentSetting = {
  enabled?: boolean;
  subtitle?: string;
  title?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
};

export type HomepageSettings = {
  hero_home?: { slides?: HomepageSlide[] };
  search_home?: {
    enabled?: boolean;
    button_label?: string;
    tabs?: HomepageTabSetting[];
  };
  about_home?: HomepageContentSetting & { logo?: string; images?: string[] };
  featured_products_home?: HomepageContentSetting & {
    limit?: number;
    featured_first?: boolean;
    tabs?: HomepageTabSetting[];
  };
  why_choose_us_home?: HomepageContentSetting & {
    image?: string;
    secondary_image?: string;
    items?: Array<{ icon?: string; title?: string; description?: string }>;
  };
  promo_home?: HomepageContentSetting & {
    cover_image?: string;
    video_url?: string;
  };
  destinations_home?: HomepageContentSetting & { limit?: number };
  cta_home?: HomepageContentSetting & {
    background?: string;
    decorative_text?: string;
  };
  testimonials_home?: HomepageContentSetting & {
    items?: Array<{
      enabled?: boolean;
      sort?: number;
      name?: string;
      role?: string;
      content?: string;
      rating?: number;
      image?: string;
    }>;
  };
  blogs_home?: HomepageContentSetting & {
    limit?: number;
    view_all?: { prefix?: string; text?: string; link?: string };
  };
  app_cta_home?: HomepageContentSetting & {
    background?: string;
    phone_image?: string;
    google_play_link?: string;
    app_store_link?: string;
  };
};
