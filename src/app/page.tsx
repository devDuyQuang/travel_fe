import HomeOne from "@/components/homes/home-one";
import HomeThree from "@/components/homes/home-three";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Tourex - Tour & Travel Booking React Next js Template",
};
const page = () => {
  return (
    <Wrapper>
      {/* <HomeOne /> */}
      <HomeThree />
    </Wrapper>
  );
};

export default page;
