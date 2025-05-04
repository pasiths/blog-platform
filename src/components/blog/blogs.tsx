"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { Edit3, Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import { IsEditor } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  User: {
    full_name: string;
  };
  Comment: [];
  Like: [];
  Tag: {
    id: number;
    name: string;
  }[];
  Category: {
    id: number;
    name: string;
  }[];
}

interface BlogsProps {
  posts: Post[];
  loading: boolean;
  notFoundMessage: string;
}

const Blogs: React.FC<BlogsProps> = ({ posts, loading, notFoundMessage }) => {
  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="grid gap-6 grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="w-[350px]">
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const isEditor = IsEditor;

  return (
    <>
      {posts.length === 0 ? (
        // Show no posts message
        <div className="text-center py-12 bg-card rounded-lg">
          <p className="text-muted-foreground">
            {notFoundMessage}
          </p>

          {isEditor ? (
            <Button size="lg" className="mt-4" asChild>
              <Link href="/blog/create" className="flex items-center ">
                <Edit3 className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            </Button>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="px-4 py-6">
          <div className="grid gap-6 grid-cols-4">
            {posts.map((post) => (
              <Card key={post.id} className="w-[350px]">
                <CardHeader>
                  <CardTitle className="min-h-4 max-h-4 overflow-hidden text-ellipsis whitespace-nowrap break-words">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="min-h-10 max-h-10 overflow-hidden break-words line-clamp-2">
                    {post.description}
                  </CardDescription>
                  <CardDescription className="flex justify-between text-xs text-gray-400">
                    <span>{post.User.full_name}</span>
                    <span>
                      {post.createdAt
                        ? formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {post.image && (
                    <Image
                      width={350}
                      height={200}
                      src={post.image}
                      alt={post.title}
                      className="rounded-md mb-4 w-full h-40 object-cover"
                    />
                  )}
                  <div className="text-sm text-gray-600 mb-2 min-h-10 max-h-10 overflow-hidden break-words line-clamp-2">
                    Category:{" "}
                    {post.Category.map((category) => category.name).join(", ")}
                  </div>
                  <div className="text-xs text-gray-400 min-h-8 max-h-8 overflow-hidden break-words line-clamp-2">
                    Tags: {post.Tag.map((tag) => tag.name).join(", ")}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex flex-col gap-1 items-start">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex items-center text-base">
                        {post.Like.length}
                        <Heart className="ml-1 size-4" />
                      </span>
                      <span className="flex items-center text-base ">
                        {post.Comment.length}
                        <MessageCircle className="ml-1 size-4" />
                      </span>
                    </div>
                    
                  </div>
                  <Button>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="flex items-center gap-2"
                    >
                      Read Me
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Blogs;
