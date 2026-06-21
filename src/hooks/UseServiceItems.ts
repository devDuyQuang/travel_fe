import { useMemo, useState } from "react";
import UseProducts from "@/hooks/UseProducts";
import {
  mergeCmsProductsWithTemplate,
} from "@/lib/serviceCmsAdapter";
import type { ServiceTemplatePage } from "@/lib/serviceLayoutRegistry";
import type { Product } from "@/types/product";

const UseServiceItems = (
  items: Product[] | undefined,
  templatePage: ServiceTemplatePage,
) => {
  const { products: allProducts } = UseProducts();
  const templateItems = useMemo(
    () => allProducts.filter((item) => item.page === templatePage),
    [allProducts, templatePage],
  );
  const sourceProducts = useMemo(
    () => mergeCmsProductsWithTemplate({
      cmsItems: items,
      templateItems,
    }),
    [items, templateItems],
  );
  const [products, setProducts] = useState(sourceProducts);

  return {
    products,
    setProducts,
    sourceProducts,
    hasCmsItems: Array.isArray(items) && items.length > 0,
  };
};

export default UseServiceItems;
