export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  type: string;
  layout_key?: string | null;
};

export type ProductGalleryImage = {
  id: number;
  image: string;
  original_name?: string;
};

export type ProductSeo = {
  title?: string | null;
  description?: string | null;
  canonical_url?: string | null;
};

export type ProductAttributes = Record<
  string,
  string | number | boolean | null | undefined
>;

export type Product = {
  id: number;
  name: string;
  slug: string;

  badge?: string | null;
  short_description?: string | null;
  content?: string | null;
  image_url?: string | null;
  gallery?: string[];
  video_url?: string | null;
  location?: string | null;
  duration?: string | null;
  price?: string | null;
  price_discount?: string | null;
  product_type?: string | null;
  sku?: string | null;
  regular_price?: string | null;
  sale_price?: string | null;
  display_price?: string | null;
  stock_quantity?: number | null;
  manage_stock?: boolean;
  stock_status?: string | null;
  rating?: string | number | null;
  review_count?: number | null;
  is_featured?: boolean;
  sort_order?: number;
  highlights?: string | null;
  facilities?: string | null;
  attributes?: ProductAttributes;
  seo?: ProductSeo;
  category?: ProductCategory | null;
  status?: number;
  created_at?: string;
  updated_at?: string;
};

export type ProductListResponse = {
  success: boolean;
  data?: Product[] | {
    data?: Product[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
};

export type ProductDetailResponse = {
  success: boolean;
  data?: Product | null;
};
