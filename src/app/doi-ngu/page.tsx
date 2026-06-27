import Team from "@/components/pages/teams/team";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Đội ngũ WAYLUNE | WAYLUNE",
  alternates: { canonical: "/doi-ngu" },
};

const DoiNguPage = () => (
  <Wrapper>
    <Team />
  </Wrapper>
);

export default DoiNguPage;
