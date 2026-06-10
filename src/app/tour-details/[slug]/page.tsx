import GolfDetailsOne from "@/components/features/golf-details";
import Wrapper from "@/layouts/Wrapper";
import { getProductBySlug } from "@/services/product.service";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  return (
    <Wrapper>
      <GolfDetailsOne product={product} />
    </Wrapper>
  );
};

export default Page;