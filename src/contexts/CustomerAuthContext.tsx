"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Customer,
  CustomerLoginPayload,
  getCurrentCustomer,
  loginCustomer,
  logoutCustomer,
} from "@/services/customer-auth.service";

type CustomerAuthStatus = "loading" | "authenticated" | "guest";

type CustomerAuthContextValue = {
  status: CustomerAuthStatus;
  customer: Customer | null;
  login: (payload: CustomerLoginPayload) => Promise<Customer>;
  logout: () => Promise<void>;
  refresh: () => Promise<Customer | null>;
};

export const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export const CustomerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<CustomerAuthStatus>("loading");
  const [customer, setCustomer] = useState<Customer | null>(null);

  const refresh = useCallback(async () => {
    try {
      const currentCustomer = await getCurrentCustomer();
      setCustomer(currentCustomer);
      setStatus(currentCustomer ? "authenticated" : "guest");
      return currentCustomer;
    } catch {
      setCustomer(null);
      setStatus("guest");
      return null;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (payload: CustomerLoginPayload) => {
    const authenticatedCustomer = await loginCustomer(payload);
    setCustomer(authenticatedCustomer);
    setStatus("authenticated");
    return authenticatedCustomer;
  }, []);

  const logout = useCallback(async () => {
    await logoutCustomer();
    setCustomer(null);
    setStatus("guest");
  }, []);

  const value = useMemo(
    () => ({
      status,
      customer,
      login,
      logout,
      refresh,
    }),
    [customer, login, logout, refresh, status],
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
};
