import { metadataDescription, safeMetadataImage, pageMetadata } from "@/lib/seoMetadata";
import CmsPostDetail from "@/components/blogs/CmsPostDetail";
import Wrapper from "@/layouts/Wrapper";
import { getPostBySlug, resolveMediaUrl } from "@/services/post.service";
import { serializePostStructuredData } from "@/lib/postStructuredData";
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
  if (!post) notFound();

  const title = post.title_seo?.trim() || post.name;
  const description = metadataDescription(post.description_seo) || getPostExcerpt(post, 155);
  return pageMetadata(title, `/tin-tuc/${encodeURIComponent(post.slug)}`, description, safeMetadataImage(resolveMediaUrl(post.image_url || post.image)), true);
}

const TinTucDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <Wrapper>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializePostStructuredData(post) }} />
      <CmsPostDetail post={post} />
    </Wrapper>
  );
};

export default TinTucDetailPage;
