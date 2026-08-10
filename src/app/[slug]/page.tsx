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
import { getPostExcerpt } from "@/lib/blog";
import { resolveMediaUrl } from "@/services/post.service";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ layout?: string | string[] }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");

  if (!post) {
    return {
      title: "GOLFNITY",
    };
  }

  const title = post.title_seo?.trim() || post.name;
  const description = post.description_seo?.trim() || getPostExcerpt(post, 155);
  const canonical = post.canonical_seo?.trim() || (siteUrl ? `${siteUrl}/tin-tuc/${post.slug}` : `/tin-tuc/${post.slug}`);
  const image = resolveMediaUrl(post.image_url || post.image) || undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
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
  if (cmsPost) {
    permanentRedirect(`/tin-tuc/${cmsPost.slug}`);
  }

  notFound();
}
