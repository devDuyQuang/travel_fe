import { Suspense } from "react";
import FooterSix from "@/layouts/footers/FooterSix";
import HeaderThree from "@/layouts/headers/HeaderThree";
import ResetPasswordArea from "./ResetPasswordArea";

const ResetPassword = () => (
  <>
    <HeaderThree variant="solid" />
    <main>
      <Suspense fallback={null}>
        <ResetPasswordArea />
      </Suspense>
    </main>
    <FooterSix />
  </>
);

export default ResetPassword;
