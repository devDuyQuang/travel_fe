import Image from "next/image"
import Link from "next/link"
import type { TeamMember } from "@/types/team-member"

import shape_1 from "@/assets/img/about/details/shape.png"
import shape_2 from "@/assets/img/banner/banner-2/shape.png"
import shape_3 from "@/assets/img/listing/listing-2/shape.png"

const TeamArea = ({ members = [] }: { members?: TeamMember[] }) => {
   return (
      <div className="tg-team-area pt-130 pb-100 p-relative z-index-1">
         <Image className="tg-team-shape d-none d-md-block" src={shape_1} alt="" />
         <Image className="tg-team-shape-2 d-none d-md-block" src={shape_2} alt="" />
         <div className="container">
            <div className="row">
               {members.length === 0 && (
                  <div className="col-12">
                     <p className="text-center mb-30">Thông tin đội ngũ đang được cập nhật.</p>
                  </div>
               )}
               {members.map((item) => (
                  <div key={item.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                     <div className="tg-team-wrap text-center mb-30">
                        <div className="tg-team-thumb p-relative">
                           {item.avatar && <Image className="hover-img" src={item.avatar} alt={item.name} width={330} height={360} />}
                           <div className="tg-listing-2-mask">
                              <Image className="w-100" src={shape_3} alt="" />
                           </div>
                        </div>
                        <div className="tg-team-content">
                           <h5>{item.name}</h5>
                           <span>{item.job_title || item.department || "Tư vấn viên"}</span>
                           <div className="tg-team-social">
                              {item.phone && <Link href={`tel:${item.phone.replace(/[^\d+]/g, "")}`}><i className="fa-solid fa-phone"></i></Link>}
                              {item.email && <Link href={`mailto:${item.email}`}><i className="fa-regular fa-envelope"></i></Link>}
                              {item.zalo_url && <Link href={item.zalo_url} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-comment"></i></Link>}
                              {item.facebook_url && <Link href={item.facebook_url} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></Link>}
                              {item.linkedin_url && <Link href={item.linkedin_url} target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></Link>}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default TeamArea
