import Team from "@/components/pages/teams/team";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Đội ngũ GOLFNITY | GOLFNITY",
  alternates: { canonical: "/doi-ngu" },
};

const DoiNguPage = () => (
  <Wrapper>
    <Team />
  </Wrapper>
);

export default DoiNguPage;
