"use client";

import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";
import { getPosts, resolveMediaUrl } from "@/services/post.service";
import { homepageText, useHomepageSettings } from "@/hooks/useHomepageSettings";

import blog_1 from "@/assets/img/blog/blog-1.jpg"
import blog_2 from "@/assets/img/blog/blog-2.jpg"
import blog_3 from "@/assets/img/blog/blog-3.jpg"

import shape_1 from "@/assets/img/blog/shape.png"
import shape_2 from "@/assets/img/blog/shape-2.png"

interface DataType {
   id: number;
   thumb: StaticImageData;
   tag: string;
   title: string;
   date: string;
   time: string;
   slug?: string | null;
}

const blog_data: DataType[] = [
   {
      id: 0,
      thumb: blog_1,
      tag: "Golf",
      title: "Cẩm nang chuẩn bị cho một chuyến golf trọn vẹn",
      date: "26/09/2024",
      time: "5 phút đọc"
   },
   {
      id: 1,
      thumb: blog_2,
      tag: "Tour golf",
      title: "Gợi ý lịch trình golf kết hợp nghỉ dưỡng",
      date: "26/09/2024",
      time: "5 phút đọc"
   },
   {
      id: 2,
      thumb: blog_3,
      tag: "Cẩm nang",
      title: "Những lưu ý khi đặt tee time cho nhóm khách",
      date: "26/09/2024",
      time: "5 phút đọc"
   },
];

const Blog = () => {
   const setting = useHomepageSettings().blogs_home;
   const [items, setItems] = useState<DataType[]>(blog_data);

   useEffect(() => {
      getPosts(setting?.limit || 3).then((posts) => {
         if (posts.length === 0) return;

         setItems(posts.map((post, index) => {
            const fallback = blog_data[index % blog_data.length];
            const image = resolveMediaUrl(post.image_url || post.image);
            return {
               ...fallback,
               id: post.id,
               title: post.name?.trim() || fallback.title,
               thumb: image
                  ? { src: image, width: fallback.thumb.width, height: fallback.thumb.height }
                  : fallback.thumb,
               slug: post.slug?.trim() || null,
               tag: post.categories?.find((category) => category.type === "post")?.name || fallback.tag,
               date: post.created_at
                  ? new Intl.DateTimeFormat("vi-VN").format(new Date(post.created_at))
                  : fallback.date,
            };
         }));
      });
   }, [setting?.limit]);

   if (setting?.enabled === false) return null;

   const featured = items[0] || blog_data[0];
   const secondary = items.slice(1, 3);

   return (
      <div className="tg-blog-area tg-blog-space tg-grey-bg pt-135 p-relative z-index-1">
         <Image className="tg-blog-shape" src={shape_1} alt="shape" />
         <Image className="tg-blog-shape-2" src={shape_2} alt="shape" />
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tg-location-section-title text-center mb-30">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".9s">{homepageText(setting?.subtitle, "Tin tức và cẩm nang")}</h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">{homepageText(setting?.title, "Bài viết mới nhất")}</h2>
                     <p className="text-capitalize wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">
                        {setting?.description?.trim()
                           ? setting.description.trim()
                           : <>Cập nhật kinh nghiệm golf, du lịch và các gợi ý<br /> hữu ích cho hành trình của bạn.</>}
                     </p>
                  </div>
               </div>

               <div className="col-lg-5 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration=".9s">
                  <div className="tg-blog-item mb-25">
                     <div className="tg-blog-thumb fix">
                        <Link href={featured.slug ? `/tin-tuc/${featured.slug}` : "/tin-tuc"}><Image className="w-100" src={featured.thumb} alt={featured.title} /></Link>
                     </div>
                     <div className="tg-blog-content  p-relative">
                        <span className="tg-blog-tag p-absolute">{featured.tag}</span>
                        <h3 className="tg-blog-title"><Link href={featured.slug ? `/tin-tuc/${featured.slug}` : "/tin-tuc"}>{featured.title}</Link></h3>
                        <div className="tg-blog-date">
                           <span className="mr-20"><i className="fa-light fa-calendar"></i> {featured.date}</span>
                           <span><i className="fa-regular fa-clock"></i> {featured.time}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="col-lg-7">
                  <div className="row">
                     {secondary.map((item) => (
                        <div key={item.id} className="col-12 wow fadeInRight" data-wow-delay=".4s" data-wow-duration=".9s">
                           <div className="tg-blog-item mb-20">
                              <div className="row align-items-center">
                                 <div className="col-lg-5">
                                    <div className="tg-blog-thumb fix">
                                       <Link href={item.slug ? `/tin-tuc/${item.slug}` : "/tin-tuc"}><Image className="w-100" src={item.thumb} alt={item.title} /></Link>
                                    </div>
                                 </div>
                                 <div className="col-lg-7">
                                    <div className="tg-blog-contents">
                                       <span className="tg-blog-tag d-inline-block mb-10">{item.tag}</span>
                                       <h3 className="tg-blog-title title-2 mb-0"><Link href={item.slug ? `/tin-tuc/${item.slug}` : "/tin-tuc"}>{item.title}</Link></h3>
                                       <div className="tg-blog-date">
                                          <span className="mr-20"><i className="fa-light fa-calendar"></i>{item.date}</span>
                                          <span><i className="fa-regular fa-clock"></i> {item.time}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="col-12 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">
                  <div className="tg-blog-bottom text-center pt-25">
                     <p>{homepageText(setting?.view_all?.prefix, "Xem thêm các tin tức và cẩm nang mới nhất.")}{" "}<Link href={homepageText(setting?.view_all?.link, "/tin-tuc")}>{homepageText(setting?.view_all?.text, "Xem thêm")}</Link></p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Blog
