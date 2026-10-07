import { notFound } from "next/navigation";

export const metadata = {
   title: "404 || Tourex - Tour & Travel Booking React Next js Template",
};
const page = () => {
   notFound();
};

export default page;
