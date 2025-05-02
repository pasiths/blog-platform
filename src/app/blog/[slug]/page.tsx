import { BlogPostContent } from "@/components/blog/blog-post-content";
import { getCurrentUser } from "@/server/auth/session";
import { isAuthor } from "@/server/auth/role-checker";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentUser();
  const isEditor = isAuthor(user);

  return (
    <>
      <BlogPostContent params={params} user={user} isAuthor={isEditor} />
    </>
  );
}
