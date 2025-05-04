import HomeBlogs from "@/components/home-blogs";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/server/auth/session";
import { PostStatus } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SavedBlogsPage = async () => {
  const user = await getCurrentUser();
  const userId = user?.id.toString() || "0";
  const queryParamsApprove = new URLSearchParams({
    postStatus: PostStatus.APPROVE,
    take: "4",
    userId: userId,
  }).toString();
  const queryParamsPending = new URLSearchParams({
    postStatus: PostStatus.PENDING,
    take: "4",
    userId: userId,
  }).toString();
  const notFoundMessage = "No my posts yet. Be the first to create one!";

  return (
    <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Blogs</h1>
      </div>

      {/* <BlogPagination
        queryParams={queryParams}
        notFoundMessage={notFoundMessage}
      /> */}

      <div className="flex flex-col gap-3">
        <div className="py-5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Approve Posts
              </h2>
              <Button asChild variant="outline">
                <Link href="/blog/myblogs/approveblogs">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <HomeBlogs
              queryParams={queryParamsApprove}
              notFoundMessage={notFoundMessage}
            />
          </div>
        </div>

        <div className="py-5">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Pending Posts
              </h2>
              <Button asChild variant="outline">
                <Link href="/blog/myblogs/pendingblogs">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <HomeBlogs
              queryParams={queryParamsPending}
              notFoundMessage={notFoundMessage}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default SavedBlogsPage;
