import CmsPostDetail from "@/components/blogs/CmsPostDetail";
import {
  getServiceTemplateItems,
  mergeCmsProductWithDetailTemplate,
} from "@/lib/serviceCmsAdapter";
import {
  getServiceLayoutConfig,
  isServiceLayoutKey,
} from "@/lib/serviceLayoutRegistry";
import Wrapper from "@/layouts/Wrapper";
import { getPostBySlug } from "@/services/post.service";
import {
  getProductBySlug,
  getProductsByCategorySlug,
} from "@/services/product.service";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ layout?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export default async function DynamicDetailPage({
  params,
  searchParams,
}: PageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const cmsProduct = await getProductBySlug(slug);

  if (cmsProduct) {
    const categorySlug = cmsProduct.category?.slug ?? "";
    const categoryLayout = cmsProduct.category?.layout_key;
    const queryLayout =
      typeof query.layout === "string" ? query.layout : undefined;
    const resolvedLayout =
      isServiceLayoutKey(queryLayout) && queryLayout === categoryLayout
        ? queryLayout
        : categoryLayout;
    const layoutConfig = getServiceLayoutConfig(resolvedLayout);
    const templateItems = getServiceTemplateItems(
      layoutConfig?.templatePage ?? "shop_3",
    );
    const categoryProducts = categorySlug
      ? await getProductsByCategorySlug(categorySlug)
      : [];
    const product = mergeCmsProductWithDetailTemplate({
      cmsItem: cmsProduct,
      templateItems,
      cmsItems: categoryProducts,
    });
    const Detail = layoutConfig.detail;

    return (
      <Wrapper>
        <Detail
          product={product}
          relatedProducts={categoryProducts.filter((item) => item.slug !== slug)}
        />
      </Wrapper>
    );
  }

  const cmsPost = await getPostBySlug(slug);
  if (!cmsPost) notFound();

  return (
    <Wrapper>
      <CmsPostDetail post={cmsPost} />
    </Wrapper>
  );
}
