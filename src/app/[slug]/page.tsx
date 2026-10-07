import { isCanonicalServiceProduct, legacyProductTarget, withLegacyDetailQuery, type LegacySearchParams } from "@/lib/legacyProductRedirect";
import { getPostBySlug } from "@/services/post.service";
import { getProductBySlug } from "@/services/product.service";
import { getPostExcerpt } from "@/lib/blog";
import { resolveMediaUrl } from "@/services/post.service";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<LegacySearchParams>;
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
    if (isCanonicalServiceProduct(cmsProduct) || cmsProduct.product_type === "physical") {
      permanentRedirect(legacyProductTarget(cmsProduct, query));
    }
    notFound();
  }

  const cmsPost = await getPostBySlug(slug);
  if (cmsPost) {
    permanentRedirect(withLegacyDetailQuery(`/tin-tuc/${cmsPost.slug}`, query));
  }

  notFound();
}
