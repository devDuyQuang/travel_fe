import Choose6 from "@/svg/home-one/Choose6";
import Choose7 from "@/svg/home-one/Choose7";
import Choose8 from "@/svg/home-one/Choose8";
import Image from "next/image";
import { ReactNode } from "react";
import type { AboutPageValuesSetting } from "@/types/about-page";

import shape from "@/assets/img/banner/banner-2/shape.png"

interface DataType {
   id: number;
   icon: ReactNode;
   title: string;
   desc: string;
}

const choose_data: DataType[] = [
   {
      id: 1,
      icon: (<><Choose6 /></>),
      title: "Ultimate flexibility",
      desc: "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
   },
   {
      id: 2,
      icon: (<><Choose7 /></>),
      title: "Memorable experiences",
      desc: "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
   },
   {
      id: 3,
      icon: (<><Choose8 /></>),
      title: "Award winning support",
      desc: "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
   },
];

const iconComponents = [<Choose6 key="one" />, <Choose7 key="two" />, <Choose8 key="three" />];

const Choose = ({ setting }: { setting?: AboutPageValuesSetting }) => {
   const subtitle = setting?.choose_subtitle?.trim() || "What we do";
   const title =
      setting?.choose_title?.trim() ||
      "We Arrange the Best Tour Ever Possible";
   const description =
      setting?.choose_description?.trim() ||
      "when an unknown printer took a galley of type and scrambled make type specimen bookhas survived not only five.";
   const configuredItems = (setting?.items || [])
      .filter((item) => item.title?.trim() || item.description?.trim())
      .slice(0, 3);
   const items = configuredItems.length
      ? configuredItems.map((item, index) => ({
           id: index + 1,
           icon: item.icon?.trim()
              ? <i className={item.icon.trim()} aria-hidden="true"></i>
              : iconComponents[index] || iconComponents[0],
           title: item.title?.trim() || choose_data[index]?.title || "",
           desc: item.description?.trim() || "",
        }))
      : choose_data;

   return (
      <div className="tg-chose-area tg-grey-bg pt-140 pb-70 p-relative z-index-1">
         <Image className="tg-chose-6-shape d-none d-md-block" src={shape} alt="" />
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-7 col-md-9">
                  <div className="tg-chose-section-title text-center mb-35">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".1s">{subtitle}</h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">{title}</h2>
                     <p className="text-capitalize wow fadeInUp mb-35" data-wow-delay=".5s" data-wow-duration=".9s">{description}</p>
                  </div>
               </div>
            </div>
            <div className="row">
               {items.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                     <div className="tg-chose-6-wrap mb-30">
                        <span className="icon mb-20">{item.icon}</span>
                        <h4 className="tg-chose-6-title mb-15">{item.title}</h4>
                        <p>{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Choose
