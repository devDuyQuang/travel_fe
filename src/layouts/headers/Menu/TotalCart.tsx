"use client";

import { useEffect, useState } from "react";
import UseCartInfo from "@/hooks/UseCartInfo";

const TotalCart = () => {
  const [mounted, setMounted] = useState(false);
  const { quantity } = UseCartInfo();

  useEffect(() => setMounted(true), []);

  return <>{mounted ? quantity : 0}</>;
};

export default TotalCart;
