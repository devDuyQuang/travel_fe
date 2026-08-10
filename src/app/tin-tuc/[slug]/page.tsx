import CmsPostDetail from "@/components/blogs/CmsPostDetail";
import Wrapper from "@/layouts/Wrapper";
import { getPostBySlug, resolveMediaUrl } from "@/services/post.service";
import { getPostExcerpt } from "@/lib/blog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Không tìm thấy bài viết | GOLFNITY" };

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const title = post.title_seo?.trim() || post.name;
  const description = post.description_seo?.trim() || getPostExcerpt(post, 155);
  const canonical = post.canonical_seo?.trim() || (siteUrl ? `${siteUrl}/tin-tuc/${post.slug}` : `/tin-tuc/${post.slug}`);
  const image = resolveMediaUrl(post.image_url || post.image) || undefined;

  return {
    title,
    description,
    alternates: { canonical },
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

const TinTucDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <Wrapper>
      <CmsPostDetail post={post} />
    </Wrapper>
  );
};

export default TinTucDetailPage;
