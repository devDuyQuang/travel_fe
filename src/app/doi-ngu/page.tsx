import { pageMetadata } from "@/lib/seoMetadata";
import Team from "@/components/pages/teams/team";
import Wrapper from "@/layouts/Wrapper";

export const metadata = pageMetadata("Đội ngũ GOLFNITY | GOLFNITY", "/doi-ngu");

const DoiNguPage = () => (
  <Wrapper>
    <Team />
  </Wrapper>
);

export default DoiNguPage;
