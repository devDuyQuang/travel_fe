"use client";

import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";
import { getPosts, resolveMediaUrl } from "@/services/post.service";

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
      tag: "Travel River",
      title: "Spiritual Sojourn: Pilgrimagee Tours for Soul Seekers",
      date: "26th Sep, 2024",
      time: "5 mins Read"
   },
   {
      id: 1,
      thumb: blog_2,
      tag: "Hiking",
      title: "Wine Country Escapes: Vineyard Tours for Connoisseurs",
      date: "26th Sep, 2024",
      time: "5 mins Read"
   },
   {
      id: 2,
      thumb: blog_3,
      tag: "Adventure",
      title: "Thrills & Chills: Extreme Sports Tours for Adrenaline",
      date: "26th Sep, 2024",
      time: "5 mins Read"
   },
];

const Blog = () => {
   const [items, setItems] = useState<DataType[]>(blog_data);

   useEffect(() => {
      getPosts(3).then((posts) => {
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
            };
         }));
      });
   }, []);

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
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".9s">Blog And Article</h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Latest News & Articles</h2>
                     <p className="text-capitalize wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">Are you tired of the typical tourist destinations and<br /> looking
                        to step out of your comfort zonetravel</p>
                  </div>
               </div>

               <div className="col-lg-5 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration=".9s">
                  <div className="tg-blog-item mb-25">
                     <div className="tg-blog-thumb fix">
                        <Link href={featured.slug ? `/${featured.slug}` : "/blog-details"}><Image className="w-100" src={featured.thumb} alt="blog" /></Link>
                     </div>
                     <div className="tg-blog-content  p-relative">
                        <span className="tg-blog-tag p-absolute">{featured.tag}</span>
                        <h3 className="tg-blog-title"><Link href={featured.slug ? `/${featured.slug}` : "/blog-details"}>{featured.title}</Link></h3>
                        <div className="tg-blog-date">
                           <span className="mr-20"><i className="fa-light fa-calendar"></i> 26th Sep, 2024</span>
                           <span><i className="fa-regular fa-clock"></i> 5 mins Read</span>
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
                                       <Link href={item.slug ? `/${item.slug}` : "/blog-details"}><Image className="w-100" src={item.thumb} alt="blog" /></Link>
                                    </div>
                                 </div>
                                 <div className="col-lg-7">
                                    <div className="tg-blog-contents">
                                       <span className="tg-blog-tag d-inline-block mb-10">{item.tag}</span>
                                       <h3 className="tg-blog-title title-2 mb-0"><Link href={item.slug ? `/${item.slug}` : "/blog-details"}>{item.title}</Link></h3>
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
                     <p>Want to see our Recent News & Updates. <Link href="/blog-grid">Click here to View More</Link></p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Blog
