"use client";

import { Bookmark, Heart, MessageCircle, Newspaper } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

interface Blog {
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

const UserBlogDetails = ({
  blogs,
  loading,
}: {
  blogs: Blog[] | null;
  loading: boolean;
}) => {
  const blogCount = blogs?.length || 0;
  const likeCount =
    blogs?.reduce((acc, blog) => acc + blog.Like.length, 0) || 0;
  const savedCount =
    blogs?.reduce((acc, blog) => acc + blog.Comment.length, 0) || 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="space-y-4 mt-2">
          <Skeleton className="w-40 h-6 mt-2" />
          <div className="flex justify-around">
            <Skeleton className="w-16 h-6" />
            <Skeleton className="w-16 h-6" />
            <Skeleton className="w-16 h-6" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="w-40 h-6 mt-2" />
          <div className="px-4 py-6">
            <div className="grid gap-4 grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="w-[300px]">
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
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 mt-2">
        <h1 className="text-xl font-semibold">Your Blog Stats</h1>
        <div className="flex justify-around">
          <p className="flex items-center gap-2">
            <Newspaper size={24} />
            <span className="">{blogCount}</span>
          </p>
          <p className="flex items-center gap-2">
            <Heart size={24} />
            <span className="">{likeCount}</span>
          </p>
          <p className="flex items-center gap-2">
            <Bookmark size={24} />
            <span className="">{savedCount}</span>
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Your Blogs</h1>

        {blogs?.length === 0 ? (
          // Show no posts message
          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-muted-foreground">No blogs found</p>
          </div>
        ) : (
          <div className="px-4 py-6">
            <div className="grid gap-4 grid-cols-3">
              {blogs?.map((blog) => (
                <Card key={blog.id} className="w-[300px]">
                  <CardHeader>
                    <CardTitle className="min-h-4 max-h-4 overflow-hidden text-ellipsis whitespace-nowrap break-words">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="min-h-10 max-h-10 overflow-hidden break-words line-clamp-2">
                      {blog.description}
                    </CardDescription>
                    <CardDescription className="flex justify-between text-xs text-gray-400">
                      <span>{blog.User.full_name}</span>
                      <span>
                        {blog.createdAt
                          ? formatDistanceToNow(new Date(blog.createdAt), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {blog.image && (
                      <Image
                        width={350}
                        height={200}
                        src={blog.image}
                        alt={blog.title}
                        className="rounded-md mb-4 w-full h-40 object-cover"
                      />
                    )}
                    <div className="text-sm text-gray-600 mb-2 min-h-5 max-h-5 overflow-hidden break-words line-clamp-1">
                      Category:{" "}
                      {blog.Category.map((category) => category.name).join(
                        ", "
                      )}
                    </div>
                    <div className="text-xs text-gray-400 min-h-4 max-h-4 overflow-hidden break-words line-clamp-1">
                      Tags: {blog.Tag.map((tag) => tag.name).join(", ")}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center text-base">
                          {blog.Like.length}
                          <Heart className="ml-1 size-4" />
                        </span>
                        <span className="flex items-center text-base ">
                          {blog.Comment.length}
                          <MessageCircle className="ml-1 size-4" />
                        </span>
                      </div>
                    </div>
                    <Button>
                      <Link
                        href={`/blog/${blog.slug}`}
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
      </div>
    </div>
  );
};

export default UserBlogDetails;
