import Image from "next/image";
import Link from "next/link";
import HeaderThree from "@/layouts/headers/HeaderThree";
import FooterThree from "@/layouts/footers/FooterThree";
import { resolveMediaUrl } from "@/services/post.service";
import type { CmsPost } from "@/types/cms-post";

const CmsPostDetail = ({ post }: { post: CmsPost }) => {
  const image = resolveMediaUrl(post.image_url || post.image);
  const category = post.categories?.[0];

  return (
    <>
      <HeaderThree variant="transparent" />
      <main>
        <div className="tg-breadcrumb-spacing-3 include-bg p-relative fix">
          <div className="tg-hero-top-shadow"></div>
        </div>
        <div className="tg-breadcrumb-list-2-wrap">
          <div className="container">
            <div className="tg-breadcrumb-list-2">
              <ul>
                <li><Link href="/">Trang chủ</Link></li>
                <li><i className="fa-sharp fa-solid fa-angle-right"></i></li>
                <li><Link href="/blog-grid">Tin tức</Link></li>
                <li><i className="fa-sharp fa-solid fa-angle-right"></i></li>
                <li><span>{post.name}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="tg-blog-details-area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-9 col-lg-10">
                {category?.name && <span className="tg-blog-tag d-inline-block mb-15">{category.name}</span>}
                <h1 className="tg-blog-standard-title mb-25">{post.name}</h1>
                {image && (
                  <div className="tg-blog-standard-thumb mb-30">
                    <Image
                      className="w-100"
                      src={image}
                      alt={post.name}
                      width={1200}
                      height={700}
                    />
                  </div>
                )}
                {post.description?.trim() && <p className="mb-25">{post.description}</p>}
                {post.content?.trim() && (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterThree />
    </>
  );
};

export default CmsPostDetail;
