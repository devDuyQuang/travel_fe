import GolfServiceLanding from "@/components/services/GolfServiceLanding";
import ServiceCategoryLayout from "@/components/services/ServiceCategoryLayout";
import { getGolfService, golfServices } from "@/data/GolfServiceData";
import Wrapper from "@/layouts/Wrapper";
import { getProductsByCategorySlug } from "@/services/product.service";
import { getServiceCategoryBySlug } from "@/services/service.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return golfServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getServiceCategoryBySlug(slug);

  if (category?.type === "service") {
    return {
      title: `${category.name} | Golfnity`,
    };
  }

  const service = getGolfService(slug);

  return { title: service ? `${service.title} | Golfnity` : "Dịch vụ | Golfnity" };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    getServiceCategoryBySlug(slug),
    getProductsByCategorySlug(slug),
  ]);

  if (category?.type === "service") {
    return (
      <Wrapper>
        <ServiceCategoryLayout
          category={category}
          products={products}
          layoutKey={category.layout_key}
        />
      </Wrapper>
    );
  }

  const service = getGolfService(slug);

  if (!service) notFound();

  return <Wrapper><GolfServiceLanding service={service} /></Wrapper>;
}
