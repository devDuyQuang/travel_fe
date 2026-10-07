import { isCanonicalServiceProduct, legacyProductTarget, type LegacySearchParams } from "@/lib/legacyProductRedirect";
import { getProductBySlug } from "@/services/product.service";
import { notFound, permanentRedirect } from "next/navigation";

export const metadata = { title: "Chi tiết tour golf | GOLFNITY" };

export default async function GolfTourDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<LegacySearchParams>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !isCanonicalServiceProduct(product) || product.category?.layout_key !== "tour") {
    notFound();
  }

  permanentRedirect(legacyProductTarget(product, await searchParams));
}
