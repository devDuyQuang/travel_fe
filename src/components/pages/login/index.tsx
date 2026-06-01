import LoginArea from "./LoginArea"
import FooterThree from "@/layouts/footers/FooterThree";
import InnerHeader from "@/layouts/headers/InnerHeader"

const Login = () => {
   return (
      <>
         <InnerHeader />
         <main>
            <LoginArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Login
