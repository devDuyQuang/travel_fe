import ResetPassword from "@/components/pages/reset-password";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  robots: { index: false, follow: true },
  title: "Thiết lập mật khẩu | GOLFNITY",
};

const ResetPasswordPage = () => (
  <Wrapper>
    <ResetPassword />
  </Wrapper>
);

export default ResetPasswordPage;
