import BreadCrumb from "@/components/common/BreadCrumb"
import HeaderThree from "@/layouts/headers/HeaderThree"
import TeamArea from "./TeamArea"
import FooterSix from "@/layouts/footers/FooterSix";
import { getTeamMembers } from "@/services/team.service";

const Team = async () => {
   const members = await getTeamMembers({ team: true, limit: 24 });
   return (
      <>
         <HeaderThree />
         <main>
            <BreadCrumb title="Đội ngũ WAYLUNE" sub_title="Đội ngũ" />
            <TeamArea members={members} />
         </main>
         <FooterSix />
      </>
   )
}

export default Team
