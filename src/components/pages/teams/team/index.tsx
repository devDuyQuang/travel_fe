import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import TeamArea from "./TeamArea"
import FooterThree from "@/layouts/footers/FooterThree";

const Team = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Our Local Guyeds" sub_title="Guyeds" />
            <TeamArea />
         </main>
         <FooterThree />
      </>
   )
}

export default Team
