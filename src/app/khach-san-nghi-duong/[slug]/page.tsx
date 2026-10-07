import FeatureDetailsTwo from "@/components/features/feature-details-two";
import Wrapper from "@/layouts/Wrapper";
import { getProductBySlug } from "@/services/product.service";
import { notFound } from "next/navigation";

export const metadata = { title: "Chi tiết khách sạn & nghỉ dưỡng | GOLFNITY" };

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.category?.layout_key !== "accommodation") {
    notFound();
  }

  return <Wrapper><FeatureDetailsTwo product={product} /></Wrapper>;
}
