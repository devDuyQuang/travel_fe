"use client";

import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";
import { getPosts, resolveMediaUrl } from "@/services/post.service";
import { useHomepageSettings } from "@/hooks/useHomepageSettings";
import type { CmsPost } from "@/types/cms-post";

import teeTimeFallback from "@/assets/img/listing/listing-1.jpg"
import daNangFallback from "@/assets/img/listing/listing-2/listing-5.jpg"
import beginnerFallback from "@/assets/img/blog/grid/grid-3.jpg"
import resortFallback from "@/assets/img/listing/listing-2/listing-6.jpg"

import shape_1 from "@/assets/img/blog/shape.png"
import shape_2 from "@/assets/img/blog/shape-2.png"

interface DataType {
   id: number;
   thumb: StaticImageData;
   tag: string;
   title: string;
   description?: string;
   date: string;
   time: string;
   slug?: string | null;
}

const blog_data: DataType[] = [
   {
      id: 0,
      thumb: teeTimeFallback,
      tag: "Kinh nghiệm golf",
      title: "Kinh nghiệm đặt tee time cho người mới bắt đầu",
      description: "Những điều cần chuẩn bị trước khi chọn sân, ngày chơi, giờ tee và số lượng golfer.",
      date: "25/06/2026",
      time: "5 phút đọc"
   },
   {
      id: 1,
      thumb: daNangFallback,
      tag: "Điểm đến",
      title: "Đà Nẵng – điểm đến lý tưởng cho chuyến golf kết hợp nghỉ dưỡng",
      date: "25/06/2026",
      time: "5 phút đọc"
   },
   {
      id: 2,
      thumb: beginnerFallback,
      tag: "Lập kế hoạch",
      title: "Checklist cho một chuyến golf nghỉ dưỡng trọn vẹn",
      date: "25/06/2026",
      time: "5 phút đọc"
   },
];

function postSearchText(post: CmsPost) {
   return [
      post.name,
      post.slug,
      post.description,
      ...(post.categories || []).map((category) => category.name),
      ...(Array.isArray(post.tags)
         ? post.tags.map((tag) => typeof tag === "string" ? tag : tag.name)
         : typeof post.tags === "string"
            ? [post.tags]
            : []),
   ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase("vi");
}

function fallbackThumbForPost(post: CmsPost, fallback: DataType) {
   const text = postSearchText(post);

   if (/đà nẵng|da nang|danang|resort|nghỉ dưỡng|bien|biển/.test(text)) {
      return daNangFallback;
   }

   if (/người mới|beginner|tập golf|hoc golf|học golf|swing|huấn luyện|driving/.test(text)) {
      return beginnerFallback;
   }

   if (/tee time|teetime|đặt sân|dat san|sân golf|san golf|golf/.test(text)) {
      return teeTimeFallback;
   }

   if (/khách sạn|hotel|villa|lưu trú/.test(text)) {
      return resortFallback;
   }

   return fallback.thumb;
}

function cleanPostDescription(description?: string | null) {
   return description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function mapPostToBlogItem(post: CmsPost, index: number): DataType {
   const fallback = blog_data[index % blog_data.length];
   const image = resolveMediaUrl(post.image_url || post.image);

   return {
      ...fallback,
      id: post.id,
      title: post.name?.trim() || fallback.title,
      description: cleanPostDescription(post.description) || fallback.description,
      thumb: image
         ? { src: image, width: fallback.thumb.width, height: fallback.thumb.height }
         : fallbackThumbForPost(post, fallback),
      slug: post.slug?.trim() || null,
      tag: post.categories?.find((category) => category.type === "post")?.name || fallback.tag,
      date: post.created_at
         ? new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
         }).format(new Date(post.created_at))
         : fallback.date,
   };
}

const Blog = ({ initialPosts = [] }: { initialPosts?: CmsPost[] }) => {
   const setting = useHomepageSettings().blogs_home;
   const [items, setItems] = useState<DataType[]>(
      initialPosts.length ? initialPosts.map(mapPostToBlogItem) : [],
   );
   const [isLoading, setIsLoading] = useState(!initialPosts.length);

   useEffect(() => {
      if (initialPosts.length) return;

      let mounted = true;
      setIsLoading(true);
      getPosts(setting?.limit || 3).then((posts) => {
         if (mounted) setItems(posts.map(mapPostToBlogItem));
      }).catch(() => {
         if (mounted) setItems([]);
      }).finally(() => {
         if (mounted) setIsLoading(false);
      });
      return () => {
         mounted = false;
      };
   }, [initialPosts.length, setting?.limit]);

   if (setting?.enabled === false || items.length < 3) return null;

   const featured = items[0];
   const secondary = items.slice(1, 3);

   return (
      <div className="tg-blog-area tg-blog-space tg-grey-bg pt-70 pb-70 p-relative z-index-1 golfnity-home-blog">
         <Image className="tg-blog-shape" src={shape_1} alt="shape" />
         <Image className="tg-blog-shape-2" src={shape_2} alt="shape" />
         <div className="container">
            <div className="row">
               <div className="col-lg-12">
                  <div className="tg-location-section-title text-center mb-30">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".9s">Kiến thức cho hành trình tiếp theo</h5>
                     <h2 className="mb-15 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Cẩm nang golf &amp; du lịch</h2>
                     <p className="wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">
                        Khám phá kinh nghiệm đặt sân, lựa chọn điểm đến và xây dựng hành trình golf phù hợp hơn.
                     </p>
                  </div>
               </div>

               {!isLoading && featured && <div className="col-lg-5 wow fadeInLeft golfnity-home-blog__featured-col" data-wow-delay=".4s" data-wow-duration=".9s">
                  <div className="tg-blog-item mb-25 golfnity-home-blog__featured-card">
                     <Link className="golfnity-home-blog__card-link" href={featured.slug ? `/tin-tuc/${featured.slug}` : "/tin-tuc"}>
                        <div className="tg-blog-thumb fix">
                           <Image className="w-100" src={featured.thumb} alt={featured.title} />
                        </div>
                        <div className="tg-blog-content p-relative">
                           <span className="tg-blog-tag p-absolute">{featured.tag}</span>
                           <h3 className="tg-blog-title">{featured.title}</h3>
                           {featured.description && <p className="golfnity-home-blog__excerpt">{featured.description}</p>}
                           <div className="tg-blog-date">
                              <span className="mr-20"><i className="fa-light fa-calendar"></i> {featured.date}</span>
                              <span><i className="fa-regular fa-clock"></i> {featured.time}</span>
                           </div>
                        </div>
                     </Link>
                  </div>
               </div>}

               {!isLoading && <div className="col-lg-7 golfnity-home-blog__secondary-col">
                  <div className="row golfnity-home-blog__secondary-grid">
                     {secondary.map((item) => (
                        <div key={item.id} className="col-12 col-md-6 col-lg-12 wow fadeInRight golfnity-home-blog__secondary-item" data-wow-delay=".4s" data-wow-duration=".9s">
                           <div className="tg-blog-item mb-20 golfnity-home-blog__secondary-card">
                              <Link className="golfnity-home-blog__card-link" href={item.slug ? `/tin-tuc/${item.slug}` : "/tin-tuc"}>
                                 <div className="row align-items-center">
                                    <div className="col-lg-5">
                                       <div className="tg-blog-thumb fix">
                                          <Image className="w-100" src={item.thumb} alt={item.title} />
                                       </div>
                                    </div>
                                    <div className="col-lg-7">
                                       <div className="tg-blog-contents">
                                          <span className="tg-blog-tag d-inline-block mb-10">{item.tag}</span>
                                          <h3 className="tg-blog-title title-2 mb-0">{item.title}</h3>
                                          <div className="tg-blog-date">
                                             <span className="mr-20"><i className="fa-light fa-calendar"></i>{item.date}</span>
                                             <span><i className="fa-regular fa-clock"></i> {item.time}</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </Link>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>}
               <div className="col-12 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">
                  <div className="tg-blog-bottom text-center pt-25">
                     <Link className="golfnity-home-blog__cta" href="/tin-tuc">Xem tất cả cẩm nang →</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Blog
