import GolfServiceLanding from "@/components/services/GolfServiceLanding";
import ServiceCategoryLayout from "@/components/services/ServiceCategoryLayout";
import TeeTimeHubPage from "@/components/services/TeeTimeHubPage";
import { getGolfService, golfServices } from "@/data/GolfServiceData";
import Wrapper from "@/layouts/Wrapper";
import { fallbackServiceCategories } from "@/lib/serviceLayoutRegistry";
import { getProductsByCategorySlug } from "@/services/product.service";
import { getServiceCategoryBySlug } from "@/services/service.service";
import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const serviceSlugAliases: Record<string, string> = {
  golf: "dat-tee-time",
  "khach-san": "khach-san-nghi-duong",
  "tour-trai-nghiem": "tham-quan-trai-nghiem",
  "ve-tham-quan": "tham-quan-trai-nghiem",
  "thue-xe": "thue-xe-dua-don",
};

const serviceRouteOverrides: Record<
  string,
  { name: string; layout_key: "tour" | "attraction" }
> = {
  "tour-trai-nghiem": {
    name: "Tour & Trải nghiệm",
    layout_key: "tour",
  },
  "ve-tham-quan": {
    name: "Vé tham quan",
    layout_key: "attraction",
  },
};

function resolveServiceSlug(slug: string) {
  return serviceSlugAliases[slug] || slug;
}

export function generateStaticParams() {
  return [
    ...golfServices.map(({ slug }) => ({ slug })),
    ...Object.keys(serviceSlugAliases).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dataSlug = resolveServiceSlug(slug);
  const category = await getServiceCategoryBySlug(dataSlug);
  const routeOverride = serviceRouteOverrides[slug];

  if (routeOverride) {
    return {
      title: `${routeOverride.name} | Golfnity`,
    };
  }

  if (category?.type === "service") {
    return {
      title: `${category.name} | Golfnity`,
    };
  }

  const service = getGolfService(slug);

  return { title: service ? `${service.title} | Golfnity` : "Dịch vụ | Golfnity" };
}

function hasQueryParams(
  searchParams?: Record<string, string | string[] | undefined>,
) {
  return Object.values(searchParams || {}).some((value) => {
    if (Array.isArray(value)) return value.some(Boolean);
    return Boolean(value);
  });
}

function buildRedirectPath(
  pathname: string,
  searchParams?: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) params.append(key, item);
      });
      return;
    }

    if (value) params.set(key, value);
  });

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export default async function ServicePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const dataSlug = resolveServiceSlug(slug);
  const query = searchParams ? await searchParams : undefined;

  if (slug === "tham-quan-trai-nghiem") {
    redirect(buildRedirectPath("/dich-vu/tour-trai-nghiem", query));
  }

  if (slug === "golf") {
    permanentRedirect(buildRedirectPath("/dich-vu/dat-tee-time/danh-sach", query));
  }

  if (slug === "dat-tee-time" && hasQueryParams(query)) {
    redirect(buildRedirectPath("/dich-vu/dat-tee-time/danh-sach", query));
  }

  const [apiCategory, products] = await Promise.all([
    getServiceCategoryBySlug(dataSlug),
    getProductsByCategorySlug(dataSlug),
  ]);
  const fallbackCategory = fallbackServiceCategories.find(
    (item) => item.slug === slug || item.slug === dataSlug,
  );
  const category = apiCategory || fallbackCategory;

  if (category?.type === "service") {
    const routeCategory = {
      ...category,
      ...serviceRouteOverrides[slug],
      slug,
    };

    if (category.slug === "dat-tee-time" && category.layout_key === "tee_time") {
      return (
        <Wrapper>
          <TeeTimeHubPage products={products} />
        </Wrapper>
      );
    }

    return (
      <Wrapper>
        <ServiceCategoryLayout
          category={routeCategory}
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
