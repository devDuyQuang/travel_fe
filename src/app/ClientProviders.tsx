"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { CustomerAuthProvider } from "@/contexts/CustomerAuthContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}><CustomerAuthProvider>{children}</CustomerAuthProvider></Provider>;
}
