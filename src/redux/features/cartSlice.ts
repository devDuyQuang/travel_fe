import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StaticImageData } from "next/image";
import { toast } from "react-toastify";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import type { Product as CmsProduct } from "@/types/product";

export type CartItem = {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
  thumb?: string | StaticImageData | null;
  slug?: string;
  delete_price?: number;
  cmsProduct?: CmsProduct;
};

type CartState = {
  cart: CartItem[];
};

const initialState: CartState = {
  cart: [],
};

const persist = (items: CartItem[]) => setLocalStorage("cart", items);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, { payload }: PayloadAction<CartItem>) => {
      const existing = state.cart.find((item) => item.id === payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...payload, quantity: Math.max(payload.quantity || 1, 1) });
      }
      persist(state.cart);
      toast.success(`${payload.title} đã được thêm vào giỏ`);
    },
    decreaseQuantity: (state, { payload }: PayloadAction<CartItem>) => {
      const existing = state.cart.find((item) => item.id === payload.id);
      if (existing && existing.quantity > 1) existing.quantity -= 1;
      persist(state.cart);
    },
    removeCartItem: (state, { payload }: PayloadAction<CartItem>) => {
      state.cart = state.cart.filter((item) => item.id !== payload.id);
      persist(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      persist([]);
    },
    hydrateCart: (state) => {
      state.cart = getLocalStorage<CartItem>("cart");
    },
  },
});

export const {
  addToCart,
  decreaseQuantity,
  removeCartItem,
  clearCart,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
