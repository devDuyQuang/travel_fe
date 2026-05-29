import About from "@/components/pages/about";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "About Tourex - Tour & Travel Booking React Next js Template",
};
const page = () => {
  return (
    <Wrapper>
      <About />
    </Wrapper>
  )
}

export default page