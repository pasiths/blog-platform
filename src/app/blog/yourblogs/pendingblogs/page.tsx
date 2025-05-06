import BlogPagination from "@/components/blog/blog-pagination";
import { getCurrentUser } from "@/server/auth/session";
import { PostStatus } from "@prisma/client";

const PendingBlogs = async () => {
  const user = await getCurrentUser();
  const userId = user?.id.toString() || "0";

  const queryParamsPending = new URLSearchParams({
    postStatus: PostStatus.PENDING,
    userId: userId,
  }).toString();
  const notFoundMessage = "No my posts yet. Be the first to create one!";

  return (
    <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Blogs</h1>
      </div>

      <BlogPagination
        queryParams={queryParamsPending}
        notFoundMessage={notFoundMessage}
      />
    </main>
  );
};

export default PendingBlogs;
