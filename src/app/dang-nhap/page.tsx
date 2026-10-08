import Login from "@/components/pages/login";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Đăng nhập | GOLFNITY",
};

const CustomerLoginPage = () => (
  <Wrapper>
    <Login />
  </Wrapper>
);

export default CustomerLoginPage;
