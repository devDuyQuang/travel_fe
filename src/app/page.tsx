import HomeThree from "@/components/homes/home-three";
import Wrapper from "@/layouts/Wrapper";
import { getHomepageSettings } from "@/services/homepage.service";
import { getProducts } from "@/services/product.service";
import { getServiceCategories } from "@/services/service.service";
import { getPosts } from "@/services/post.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "GOLFNITY | Dịch vụ golf và trải nghiệm",
};

const page = async () => {
  const [homepageSettings, serviceCategories, products, posts] =
    await Promise.all([
      getHomepageSettings().catch(() => ({})),
      getServiceCategories().catch(() => []),
      getProducts(100, true).catch(() => []),
      getPosts(3).catch(() => []),
    ]);

  return (
    <Wrapper>
      <HomeThree
        initialSettings={homepageSettings}
        initialServiceCategories={serviceCategories}
        initialProducts={products}
        initialPosts={posts}
      />
    </Wrapper>
  );
};

export default page;
