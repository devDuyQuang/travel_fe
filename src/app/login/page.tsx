import Login from "@/components/pages/login";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Login Tourex - Tour & Travel Booking React Next js Template",
};
const page = () => {
  return (
    <Wrapper>
      <Login />
    </Wrapper>
  )
}

export default page