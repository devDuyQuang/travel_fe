import Wrapper from "@/layouts/Wrapper";
import { isCanonicalServiceProduct } from "@/lib/legacyProductRedirect";
import { getServiceLayoutConfig } from "@/lib/serviceLayoutRegistry";
import { getServiceTemplateItems, mergeCmsProductWithDetailTemplate } from "@/lib/serviceCmsAdapter";
import { getProductBySlug, getProductsByCategorySlug } from "@/services/product.service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ServiceProductPage({ params }: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug: categorySlug, productSlug } = await params;
  const cmsProduct = await getProductBySlug(productSlug);
  if (!cmsProduct || !isCanonicalServiceProduct(cmsProduct) || cmsProduct.category?.slug !== categorySlug) {
    notFound();
  }
  const config = getServiceLayoutConfig(cmsProduct.category?.layout_key);
  const categoryProducts = await getProductsByCategorySlug(categorySlug);
  const product = mergeCmsProductWithDetailTemplate({
    cmsItem: cmsProduct,
    templateItems: getServiceTemplateItems(config.templatePage),
    cmsItems: categoryProducts,
  });
  const Detail = config.detail;
  return <Wrapper><Detail product={product} relatedProducts={categoryProducts.filter((item) => item.slug !== productSlug)} /></Wrapper>;
}
