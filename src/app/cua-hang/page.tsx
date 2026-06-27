import Shop from "@/components/pages/shops/shop";
import Wrapper from "@/layouts/Wrapper";
import { getProductCategories, getShopProducts } from "@/services/product.service";

export const metadata = {
  title: "Cửa hàng golf | WAYLUNE",
  alternates: { canonical: "/cua-hang" },
};

type ShopPageProps = {
  searchParams: Promise<{ page?: string; search?: string; category?: string; sort?: string }>;
};

const CuaHangPage = async ({ searchParams }: ShopPageProps) => {
  const query = await searchParams;
  const [result, categories] = await Promise.all([
    getShopProducts({
      page: Math.max(1, Number(query.page || 1) || 1),
      search: query.search || "",
      categorySlug: query.category || "",
      sort: query.sort || "",
      limit: 9,
    }),
    getProductCategories(),
  ]);

  return (
    <Wrapper>
      <Shop products={result.data} categories={categories} meta={result.meta} />
    </Wrapper>
  );
};

export default CuaHangPage;
