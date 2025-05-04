import BlogPagination from "@/components/blog/blog-pagination";
import { getCurrentUser } from "@/server/auth/session";
import { PostStatus } from "@prisma/client";

const SavedBlogsPage = async () => {
  const user = await getCurrentUser();
  const userId = user?.id.toString() || "0";
  const queryParams = new URLSearchParams({
    postStatus: PostStatus.APPROVE,
    savePostUserId: userId,
  }).toString();
  const notFoundMessage = "No saved blogs found. Be the first to save one!";

  return (
    <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Saved Blog Posts</h1>
      </div>

      <BlogPagination
        queryParams={queryParams}
        notFoundMessage={notFoundMessage}
      />
    </main>
  );
};

export default SavedBlogsPage;
