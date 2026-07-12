import HomeThree from "@/components/homes/home-three";
import Wrapper from "@/layouts/Wrapper";
import { getHomepageSettings } from "@/services/homepage.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Golfnity | Dịch vụ golf và trải nghiệm",
};

const page = async () => {
  const homepageSettings = await getHomepageSettings().catch(() => ({}));

  return (
    <Wrapper>
      <HomeThree initialSettings={homepageSettings} />
    </Wrapper>
  );
};

export default page;
