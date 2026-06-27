import BlogOne from "@/components/blogs/blog-one";
import Wrapper from "@/layouts/Wrapper";
import {
  getPostCategories,
  getPostList,
  getPosts,
  getPostTags,
} from "@/services/post.service";

export const metadata = {
  title: "Tin tức | WAYLUNE",
  alternates: {
    canonical: "/tin-tuc",
  },
};

type NewsPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    category_slug?: string;
    tag?: string;
  }>;
};

const TinTucPage = async ({ searchParams }: NewsPageProps) => {
  const query = await searchParams;
  const pageNumber = Math.max(1, Number(query.page || 1) || 1);
  const search = typeof query.search === "string" ? query.search : "";
  const categorySlug =
    typeof query.category === "string"
      ? query.category
      : typeof query.category_slug === "string"
        ? query.category_slug
        : "";
  const tag = typeof query.tag === "string" ? query.tag : "";

  const [postResult, categories, recentPosts, tags] = await Promise.all([
    getPostList({ page: pageNumber, perPage: 8, search, categorySlug, tag }),
    getPostCategories(),
    getPosts(5),
    getPostTags(),
  ]);

  return (
    <Wrapper>
      <BlogOne
        posts={postResult.data}
        meta={postResult.meta}
        categories={categories}
        recentPosts={recentPosts}
        tags={tags}
        search={search}
        categorySlug={categorySlug}
        tag={tag}
      />
    </Wrapper>
  );
};

export default TinTucPage;
