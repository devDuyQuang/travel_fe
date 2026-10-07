import FeatureDetailsOne from "@/components/features/feature-details-one";
import Wrapper from "@/layouts/Wrapper";
import { getProductBySlug } from "@/services/product.service";
import { notFound } from "next/navigation";

export const metadata = { title: "Chi tiết tham quan & trải nghiệm | GOLFNITY" };

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.category?.layout_key !== "attraction") {
    notFound();
  }

  return <Wrapper><FeatureDetailsOne product={product} /></Wrapper>;
}
