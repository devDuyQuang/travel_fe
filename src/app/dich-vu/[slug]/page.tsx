import GolfServiceLanding from "@/components/services/GolfServiceLanding";
import { getGolfService, golfServices } from "@/data/GolfServiceData";
import Wrapper from "@/layouts/Wrapper";
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
  const service = getGolfService(slug);

  return { title: service ? `${service.title} | Golfnity` : "Dịch vụ | Golfnity" };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = getGolfService(slug);

  if (!service) notFound();

  return <Wrapper><GolfServiceLanding service={service} /></Wrapper>;
}
