export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
  type: string;
};

export type ProductGalleryImage = {
  id: number;
  image: string;
  original_name?: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;

  description?: string | null;
  location?: string | null;
  duration?: string | null;

  review_rating?: string | null;
  review_count?: string | null;
  star_rating?: number | null;

  established_year?: number | null;
  highlight?: string | null;
  facility?: string | null;
  content?: string | null;

  image?: string | null;
  image_original_name?: string | null;

  badge_text?: string | null;

  gallery_image_1?: string | null;
  gallery_image_1_original_name?: string | null;

  gallery_image_2?: string | null;
  gallery_image_2_original_name?: string | null;

  gallery_images?: ProductGalleryImage[];

  video_url?: string | null;

  price?: string | null;
  price_discount?: string | null;

  golf_information?: string | null;

  category?: ProductCategory | null;
  established_text?: string | null;

  
  created_at?: string;
};