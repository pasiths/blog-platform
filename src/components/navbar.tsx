import Link from "next/link";
import { Newspaper, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthor } from "@/server/auth/role-checker";
import { getCurrentUser } from "@/server/auth/session";
import { UserNav } from "./user-nav";
import ReqWriter from "./user/request-writer-form";

export async function Navbar() {
  const user = await getCurrentUser();
  const isEditor = isAuthor(user);

  // Check if user is logged in
  if (!user) {
    return (
      <header className="border-b bg-background">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Blogger
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/blog"
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              Blog
            </Link>
            <Button variant="outline" size="sm">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button variant="default" size="sm">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="border-b bg-background">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            Blogger
          </Link>
        </div>
        <div className="flex items-center gap-x-4">
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground flex gap-2 items-center"
          >
            <Newspaper size={18} />
            Blog
          </Link>
          {isEditor ? (
            <Link
              href="/blog/create"
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground flex gap-2 items-center"
            >
              <PenLine size={18} />
              Create Post
            </Link>
          ) : (
            <ReqWriter
              id={user?.id}
              variant={"ghost"}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground flex gap-2 items-center"
            />
          )}

          <UserNav
            user={{
              id: user.id,
              name: user.full_name, // Map full_name to name
              email: user.email,
              image: user.image,
              role: user.role,
            }}
          />
        </div>
      </nav>
    </header>
  );
}
