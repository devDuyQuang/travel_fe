export type CmsPost = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  description?: string | null;
  content?: string | null;
  created_at?: string | null;
  categories?: CmsCategorySummary[];
};

export type CmsPostListResponse = {
  success: boolean;
  data?: CmsPost[] | {
    data?: CmsPost[];
  };
};

export type CmsPostDetailResponse = {
  success: boolean;
  data?: CmsPost | null;
};

export type CmsCategorySummary = {
  id: number;
  name: string;
  slug: string;
  type: string;
  layout_key?: string | null;
};

export type CmsServiceCategory = CmsCategorySummary & {
  description?: string | null;
  content?: string | null;
  image?: string | null;
};

export type CmsCategoryDetailResponse = {
  success: boolean;
  data?: (CmsCategorySummary & {
    description?: string | null;
    content?: string | null;
    image?: string | null;
    posts?: CmsPost[] | {
      data?: CmsPost[];
    };
  }) | null;
};
