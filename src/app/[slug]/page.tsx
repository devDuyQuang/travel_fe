import { isCanonicalServiceProduct, legacyProductTarget, withLegacyDetailQuery, type LegacySearchParams } from "@/lib/legacyProductRedirect";
import { getPostBySlug } from "@/services/post.service";
import { getProductBySlug } from "@/services/product.service";
import { notFound, permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<LegacySearchParams>;
};

export const dynamic = "force-dynamic";

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
