import { isCanonicalServiceProduct, legacyProductTarget, type LegacySearchParams } from "@/lib/legacyProductRedirect";
import { getProductBySlug } from "@/services/product.service";
import { notFound, permanentRedirect } from "next/navigation";

export const metadata = { title: "Chi tiết tham quan & trải nghiệm | GOLFNITY" };

export default async function ExperienceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<LegacySearchParams>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !isCanonicalServiceProduct(product) || product.category?.layout_key !== "attraction") {
    notFound();
  }

  permanentRedirect(legacyProductTarget(product, await searchParams));
}
