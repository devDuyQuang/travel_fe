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

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const title = product.seo?.title?.trim() || `${product.name} | GOLFNITY`;
  const description = product.seo?.description?.trim() || product.short_description || "Sản phẩm golf tại GOLFNITY.";
  const canonical = product.seo?.canonical_url?.trim() || (siteUrl ? `${siteUrl}/cua-hang/${product.slug}` : `/cua-hang/${product.slug}`);
  const image = product.image_url || undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
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
