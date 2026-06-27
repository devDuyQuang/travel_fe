"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const UseCartInfo = () => {
  const cart = useSelector((state: RootState) => state.cart.cart);

  return {
    quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
};

export default UseCartInfo;
