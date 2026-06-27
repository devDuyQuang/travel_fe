import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import products from '@/data/BookingTemplateData';
import shopProducts from '@/data/ShopData';
import type { StaticImageData } from "next/image";
import type { Product as CmsProduct } from "@/types/product";

export interface Product {
   id: number;
   slug?: string;
   isCmsItem?: boolean;
   cmsProduct?: CmsProduct;
   page: string;
   thumb: string | StaticImageData;
   tag?: string;
   featured?: string;
   offer?: string;
   title: string;
   location: string;
   delete_price?: number;
   price: number;
   review: number;
   total_review?: number;
   category: string;
   amenities: string;
   language: string;
   destination: string;
   duration: string;
   desc:string;
   description?: string | null;
   content?: string | null;
   guest:string;
   quantity: number;
}

interface ProductState {
   products: Product[];
   product: Product | null;
}

const initialState: ProductState = {
   products: [
      ...products,
      ...shopProducts.filter((product) => product.page === "shop_5"),
   ] as unknown as Product[],
   product: null,
};

export const productSlice = createSlice({
   name: 'products',
   initialState,
   reducers: {
      single_product: (state, action: PayloadAction<number>) => {
         state.product = state.products.find((p) => p.id === action.payload) || null;
      },
   },
});

export const { single_product } = productSlice.actions;

// Selectors
export const selectProducts = (state: { products: ProductState }) => state?.products?.products;
export const selectProduct = (state: { products: ProductState }) => state?.products?.product;

export default productSlice.reducer;
