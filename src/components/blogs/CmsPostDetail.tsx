import Image from "next/image";
import Link from "next/link";
import HeaderThree from "@/layouts/headers/HeaderThree";
import FooterSix from "@/layouts/footers/FooterSix";
import BreadCrumb from "@/components/common/BreadCrumb";
import BlogSidebar from "@/components/blogs/blog-sidebar";
import {
  getPostCategories,
  getPosts,
  getPostTags as getPostTagList,
  resolveMediaUrl,
} from "@/services/post.service";
import type { CmsPost } from "@/types/cms-post";
import {
  BLOG_FALLBACK_IMAGE,
  formatVietnameseDate,
  getPostAuthorName,
  getPostExcerpt,
  getPostReadMinutes,
  getPostTags,
  sanitizePostHtml,
} from "@/lib/blog";

const CmsPostDetail = async ({ post }: { post: CmsPost }) => {
  const image = resolveMediaUrl(post.image_url || post.image);
  const category = post.categories?.[0];
  const [categories, recentPosts, sidebarTags] = await Promise.all([
    getPostCategories(),
    getPosts(5),
    getPostTagList(),
  ]);
  const tags = getPostTags(post);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const canonicalPath = `/tin-tuc/${post.slug}`;
  const shareUrl = siteUrl ? `${siteUrl}${canonicalPath}` : canonicalPath;
  const safeContent = sanitizePostHtml(post.content);

  return (
    <>
      <HeaderThree />
      <main>
        <BreadCrumb title="Chi tiết bài viết" sub_title="Tin tức" />
        <div className="tg-breadcrumb-list-2-wrap blog-detail-breadcrumb-line">
          <div className="container">
            <div className="tg-breadcrumb-list-2">
              <ul>
                <li><Link href="/">Trang chủ</Link></li>
                <li><i className="fa-sharp fa-solid fa-angle-right"></i></li>
                <li><Link href="/tin-tuc">Tin tức</Link></li>
                <li><i className="fa-sharp fa-solid fa-angle-right"></i></li>
                <li><span>{post.name}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="tg-blog-grid-area pt-130 pb-80">
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-8">
                <div className="tg-blog-details-wrap tg-blog-lg-spacing mr-50 mb-50">
                  <article className="tg-blog-standard-item mb-35">
                    <div className="tg-blog-standard-thumb mb-25">
                      <Image
                        className="w-100"
                        src={image || BLOG_FALLBACK_IMAGE}
                        alt={post.name}
                        width={1200}
                        height={700}
                        priority
                      />
                    </div>
                    <div className="tg-blog-standard-content">
                      <div className="tg-blog-standard-date mb-15">
                        <span><i className="fa-regular fa-user"></i> Bởi {getPostAuthorName(post)}</span>
                        <span><i className="fa-regular fa-calendar"></i> {formatVietnameseDate(post.published_at || post.created_at)}</span>
                        {category?.name && <span><i className="fa-regular fa-folder-open"></i> {category.name}</span>}
                        <span><i className="fa-regular fa-clock"></i> {getPostReadMinutes(post)} phút đọc</span>
                      </div>
                      {category?.name && <span className="tg-blog-tag d-inline-block mb-15">{category.name}</span>}
                      <h1 className="tg-blog-standard-title mb-25">{post.name}</h1>
                      {post.description?.trim() && (
                        <p className="blog-details-lead mb-25">{post.description}</p>
                      )}
                      {safeContent && (
                        <div
                          className="blog-details-content"
                          dangerouslySetInnerHTML={{ __html: safeContent }}
                        />
                      )}
                    </div>
                  </article>

                  <div className="tg-blog-details-tag mb-40 d-flex flex-wrap justify-content-between align-items-center">
                    {tags.length > 0 && (
                      <div className="tg-blog-sidebar-tag-list d-flex flex-wrap align-items-center">
                        <h5 className="tg-blog-sidebar-title mr-10">Thẻ:</h5>
                        <ul>
                          {tags.map((tag) => (
                            <li key={tag}><Link href={`/tin-tuc?tag=${encodeURIComponent(tag)}`}>{tag}</Link></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="tg-blog-details-social mb-10">
                      <span>Chia sẻ:</span>
                      <Link
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chia sẻ Facebook"
                      >
                        <i className="fa-brands fa-facebook-f"></i>
                      </Link>
                      <Link
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chia sẻ X"
                      >
                        <i className="fa-brands fa-twitter"></i>
                      </Link>
                      <Link
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chia sẻ LinkedIn"
                      >
                        <i className="fa-brands fa-linkedin-in"></i>
                      </Link>
                    </div>
                  </div>

                  <div className="blog-author-fallback mb-40">
                    <h4>Ban biên tập WAYLUNE</h4>
                    <p>Nội dung được biên soạn nhằm chia sẻ kinh nghiệm du lịch, golf và những thông tin hữu ích cho hành trình của bạn.</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4">
                <BlogSidebar
                  categories={categories}
                  recentPosts={recentPosts.filter((item) => item.slug !== post.slug)}
                  tags={sidebarTags}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSix />
    </>
  );
};

export default CmsPostDetail;
