import TeeTimeMarketplacePage, {
  type TeeTimeMarketplaceMode,
} from "@/components/services/TeeTimeMarketplacePage";
import Wrapper from "@/layouts/Wrapper";
import { fallbackServiceCategories } from "@/lib/serviceLayoutRegistry";
import { getProductsByCategorySlug } from "@/services/product.service";
import { getServiceCategoryBySlug } from "@/services/service.service";
import type { CmsServiceCategory } from "@/types/cms-post";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Danh sách tee time | Golfnity",
};

function firstQueryValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getTeeTimeMarketplaceMode(
  searchParams?: Record<string, string | string[] | undefined>,
): TeeTimeMarketplaceMode {
  const view = firstQueryValue(searchParams?.view);
  const tag = firstQueryValue(searchParams?.tag);

  if (view === "all") return "all";
  if (tag === "featured" || tag === "weekend" || tag === "near-center") {
    return tag;
  }

  return "all";
}

export default async function TeeTimeListingPage({ searchParams }: PageProps) {
  const query = searchParams ? await searchParams : undefined;
  const [apiCategory, products] = await Promise.all([
    getServiceCategoryBySlug("dat-tee-time"),
    getProductsByCategorySlug("dat-tee-time"),
  ]);
  const fallbackCategory = (
    fallbackServiceCategories as unknown as readonly CmsServiceCategory[]
  ).find((item) => item.slug === "dat-tee-time" || item.slug === "golf");
  const category = (apiCategory || fallbackCategory) as CmsServiceCategory | undefined;

  if (!category || category.type !== "service" || category.layout_key !== "tee_time") {
    notFound();
  }

  return (
    <Wrapper>
      <TeeTimeMarketplacePage
        mode={getTeeTimeMarketplaceMode(query)}
        products={products}
      />
    </Wrapper>
  );
}
