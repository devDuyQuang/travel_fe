export type ContactPageHeroSetting = {
  title?: string;
  sub_title?: string;
  banner_hero?: string;
};

export type ContactPageInfoSetting = {
  info_title?: string;
  info_description?: string;
  title?: string;
  description?: string;
  form_title?: string;
  form_subtitle?: string;
  contact_btn?: {
    text?: string;
    link?: string;
  };
};

export type ContactPageLocation = {
  name?: string;
  address?: string;
  service_time?: string;
  google_link?: string;
  map_iframe?: string;
};

export type ContactPageLocationsSetting = {
  section_title?: string;
  items?: ContactPageLocation[];
};

export type ContactPageSettings = {
  hero?: ContactPageHeroSetting;
  info?: ContactPageInfoSetting;
  locations?: ContactPageLocationsSetting;
};
