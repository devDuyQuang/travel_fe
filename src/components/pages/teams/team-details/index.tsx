import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import TeamDetailsArea from "./TeamDetailsArea"
import FooterThree from "@/layouts/footers/FooterThree";

const TeamDetails = () => {
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Esther Howard" sub_title="Esther Howard" />
            <TeamDetailsArea />
         </main>
         <FooterThree />
      </>
   )
}

export default TeamDetails
