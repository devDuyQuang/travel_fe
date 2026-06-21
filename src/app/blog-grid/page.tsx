import BlogOne from "@/components/blogs/blog-one";
import Wrapper from "@/layouts/Wrapper";
import { getPosts } from "@/services/post.service";

export const metadata = {
  title: "Tin tức | Golfnity",
};
const page = async () => {
  const posts = await getPosts();

  return (
    <Wrapper>
      <BlogOne posts={posts} />
    </Wrapper>
  )
}

export default page
