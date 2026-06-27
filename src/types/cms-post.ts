export type CmsPost = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  description?: string | null;
  content?: string | null;
  title_seo?: string | null;
  description_seo?: string | null;
  canonical_seo?: string | null;
  created_at?: string | null;
  published_at?: string | null;
  created_by?: number | null;
  author?: CmsPostAuthor | null;
  creator?: CmsPostAuthor | null;
  user?: CmsPostAuthor | null;
  tags?: Array<string | { name?: string; slug?: string }> | string | null;
  categories?: CmsCategorySummary[];
};

export type CmsPostAuthor = {
  id?: number;
  name?: string | null;
  full_name?: string | null;
  avatar?: string | null;
  image?: string | null;
  description?: string | null;
  bio?: string | null;
};

export type CmsPaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type CmsPostListResponse = {
  success: boolean;
  data?: CmsPost[] | {
    data?: CmsPost[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  meta?: Partial<CmsPaginationMeta>;
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
  posts_count?: number | null;
  count?: number | null;
  children?: CmsCategorySummary[];
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

export type CmsTag = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  posts_count?: number | null;
};
