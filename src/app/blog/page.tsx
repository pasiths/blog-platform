import BlogPagination from "@/components/blog/blog-pagination";
import { PostStatus } from "@prisma/client";

const BlogsPage = () => {
  const queryParams = new URLSearchParams({
    postStatus: PostStatus.APPROVE,
  }).toString();

  const notFoundMessage = "No posts yet. Be the first to create one!";

  return (
    <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
      </div>

      <BlogPagination
        queryParams={queryParams}
        notFoundMessage={notFoundMessage}
      />
    </main>
  );
};

export default BlogsPage;
