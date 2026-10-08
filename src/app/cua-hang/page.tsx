import { pageMetadata, paginationPath } from "@/lib/seoMetadata";
import Shop from "@/components/pages/shops/shop";
import Wrapper from "@/layouts/Wrapper";
import { getProductCategories, getShopProducts } from "@/services/product.service";

type ShopPageProps = {
  searchParams: Promise<{ page?: string; search?: string; category?: string; sort?: string }>;
};

export async function generateMetadata({ searchParams }: ShopPageProps) {
  const query = await searchParams;
  return pageMetadata("Cửa hàng golf | GOLFNITY", paginationPath("/cua-hang", query.page));
}

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
