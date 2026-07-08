import { getServiceLayoutConfig } from "@/lib/serviceLayoutRegistry";
import type { CmsServiceCategory } from "@/types/cms-post";
import type { Product } from "@/types/product";

type ServiceCategoryLayoutProps = {
  category: CmsServiceCategory;
  products: Product[];
  layoutKey?: string | null;
};

const ServiceCategoryLayout = ({
  category,
  products,
  layoutKey,
}: ServiceCategoryLayoutProps) => {
  const { listing: Listing, searchLabels } = getServiceLayoutConfig(layoutKey);

  return (
    <Listing
      title={category.name}
      subTitle={category.name}
      detailBasePath=""
      items={products}
      searchLabels={searchLabels}
      layoutKey={layoutKey}
      categorySlug={category.slug}
    />
  );
};

export default ServiceCategoryLayout;
