export type AboutPageHeroSetting = {
  banner_hero?: string;
  title?: string;
  sub_title?: string;
};

export type AboutPageGallerySetting = {
  images?: string[];
};

export type AboutPageIntroSetting = {
  subtitle?: string;
  title?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
};

export type AboutPageValuesSetting = {
  choose_subtitle?: string;
  choose_title?: string;
  choose_description?: string;
  items?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
};

export type AboutPageConsultationSetting = {
  subtitle?: string;
  title?: string;
  btn_text?: string;
  btn_link?: string;
  decorative_text?: string;
  image?: string;
};

export type AboutPageSettings = {
  hero?: AboutPageHeroSetting;
  gallery?: AboutPageGallerySetting;
  intro?: AboutPageIntroSetting;
  values?: AboutPageValuesSetting;
  consultation?: AboutPageConsultationSetting;
};
