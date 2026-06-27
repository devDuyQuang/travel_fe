"use client";

import logo from "@/assets/img/logo/golfnity-logo2x.png"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";
import useSiteSettings from "@/hooks/useSiteSettings";
import { getTeamMembers } from "@/services/team.service";
import type { TeamMember } from "@/types/team-member";

interface SidebarProps {
   sidebar: boolean;
   setSidebar: (offCanvas: boolean) => void;
}

const Sidebar = ({ sidebar, setSidebar }: SidebarProps) => {
   const siteSettings = useSiteSettings();
   const [members, setMembers] = useState<TeamMember[]>([]);

   useEffect(() => {
      getTeamMembers({ quickPanel: true, limit: 5 }).then(setMembers);
   }, []);

   return (
      <>
         <div className={`offCanvas__info ${sidebar ? "active" : ""}`}>
            <div className="offCanvas__close-icon menu-close">
               <button onClick={() => setSidebar(false)}><i className="fa-sharp fa-regular fa-xmark"></i></button>
            </div>
            <div className="offCanvas__logo mb-30">
               <Link href="/">
                  <Image
                     src={logo}
                     alt={siteSettings.company || "WAYLUNE"}
                     width={200}
                     height={61}
                     priority
                     className="golfnity-logo-img" /></Link>
            </div>
            <div className="offCanvas__side-info mb-30">
               {members.length > 0 ? (
                  <div className="contact-list mb-30">
                     <h4>Đội ngũ tư vấn</h4>
                     {members.map((member) => (
                        <div className="waylune-panel-member" key={member.id}>
                           {member.avatar && <Image src={member.avatar} alt={member.name} width={48} height={58} />}
                           <div>
                              <strong>{member.name}</strong>
                              <span>{member.job_title || member.department || "Tư vấn viên"}</span>
                              <div className="waylune-panel-actions">
                                 {member.phone && <Link href={`tel:${member.phone.replace(/[^\d+]/g, "")}`}>Gọi</Link>}
                                 {member.email && <Link href={`mailto:${member.email}`}>Email</Link>}
                                 {member.zalo_url && <Link href={member.zalo_url} target="_blank" rel="noopener noreferrer">Zalo</Link>}
                              </div>
                           </div>
                        </div>
                     ))}
                     <Link className="waylune-panel-all" href="/doi-ngu">Xem toàn bộ đội ngũ</Link>
                  </div>
               ) : (
                  <>
                     {siteSettings.address && <div className="contact-list mb-30"><h4>Địa chỉ</h4><p>{siteSettings.address}</p></div>}
                     {siteSettings.phone && <div className="contact-list mb-30"><h4>Số điện thoại</h4><p><Link href={`tel:${siteSettings.phone.replace(/[^\d+]/g, "")}`}>{siteSettings.phone}</Link></p></div>}
                     {siteSettings.email && <div className="contact-list mb-30"><h4>Email</h4><p><Link href={`mailto:${siteSettings.email}`}>{siteSettings.email}</Link></p></div>}
                  </>
               )}
            </div>
            <div className="offCanvas__social-icon mt-30">
               {siteSettings.socials.map((social) => (
                  <Link key={social.link} href={social.link} target="_blank" rel="noopener noreferrer"><i className={social.icon || "fab fa-facebook-f"}></i></Link>
               ))}
            </div>
         </div>
         <div onClick={() => setSidebar(false)} className={`offCanvas__overly ${sidebar ? "active" : ""}`}></div>
      </>
   )
}

export default Sidebar
