import { cache } from "react";
import type { Metadata } from "next";
import { metadataDescription, pageMetadata, safeMetadataImage } from "@/lib/seoMetadata";
import Wrapper from "@/layouts/Wrapper";
import { isCanonicalServiceProduct } from "@/lib/legacyProductRedirect";
import { getServiceLayoutConfig } from "@/lib/serviceLayoutRegistry";
import { getServiceTemplateItems, mergeCmsProductWithDetailTemplate } from "@/lib/serviceCmsAdapter";
import { getProductBySlug, getProductsByCategorySlug } from "@/services/product.service";
import { notFound } from "next/navigation";
import { serializeServiceBreadcrumb } from "@/lib/serviceBreadcrumbSchema";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string; productSlug: string }> };

const getValidatedProduct = cache(async (categorySlug: string, productSlug: string) => {
  const product = await getProductBySlug(productSlug);
  if (!product || !isCanonicalServiceProduct(product) || product.category?.slug !== categorySlug) notFound();
  return product;
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productSlug } = await params;
  const product = await getValidatedProduct(slug, productSlug);
  const title = product.seo?.title?.trim() || product.name;
  const description = metadataDescription(product.seo?.description) || metadataDescription(product.short_description);
  return pageMetadata(title, `/dich-vu/${encodeURIComponent(product.category!.slug)}/${encodeURIComponent(product.slug)}`, description, safeMetadataImage(product.image_url));
}

export default async function ServiceProductPage({ params }: PageProps) {
  const { slug: categorySlug, productSlug } = await params;
  const cmsProduct = await getValidatedProduct(categorySlug, productSlug);
  const config = getServiceLayoutConfig(cmsProduct.category?.layout_key);
  const categoryProducts = await getProductsByCategorySlug(categorySlug);
  const product = mergeCmsProductWithDetailTemplate({
    cmsItem: cmsProduct,
    templateItems: getServiceTemplateItems(config.templatePage),
    cmsItems: categoryProducts,
  });
  const Detail = config.detail;
  return <Wrapper><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeServiceBreadcrumb(cmsProduct) }} /><Detail product={product} relatedProducts={categoryProducts.filter((item) => item.slug !== productSlug)} /></Wrapper>;
}
