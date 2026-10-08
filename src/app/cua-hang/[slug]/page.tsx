import { metadataDescription, safeMetadataImage, pageMetadata } from "@/lib/seoMetadata";
import BreadCrumb from "@/components/common/BreadCrumb";
import ShopProductDetailsArea from "@/components/pages/shops/shop-product-details/ShopProductDetailsArea";
import Wrapper from "@/layouts/Wrapper";
import { getProductBySlug } from "@/services/product.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || (product.product_type && product.product_type !== "physical")) {
    return { title: "Không tìm thấy sản phẩm | GOLFNITY" };
  }

  const title = product.seo?.title?.trim() || `${product.name} | GOLFNITY`;
  const description = metadataDescription(product.seo?.description) || metadataDescription(product.short_description);
  return pageMetadata(title, `/cua-hang/${encodeURIComponent(product.slug)}`, description, safeMetadataImage(product.image_url));
}

const CuaHangDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || (product.product_type && product.product_type !== "physical")) {
    notFound();
  }

  return (
    <Wrapper>
      <BreadCrumb title={product.name} sub_title="Cửa hàng" />
      <ShopProductDetailsArea product={product} />
    </Wrapper>
  );
};

export default CuaHangDetailPage;
