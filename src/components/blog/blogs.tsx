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
import { Heart, MessageCircle } from "lucide-react";

interface Post {
  id: number;
  title: string;
  description: string;
  image?: string;
  category: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: number;
}

interface BlogsProps {
  posts: Post[];
  loading: boolean;
}

const Blogs: React.FC<BlogsProps> = ({ posts, loading }) => {
  return (
    <div className="px-4 py-6">
      <div className="grid gap-6 grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
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
          ))
        ) : posts.length === 0 ? (
          // Show no posts message
          <div className="col-span-full text-center text-gray-500 text-lg">
            No posts found.
          </div>
        ) : (
          // Show posts
          posts.map((post) => (
            <Card key={post.id} className="w-[350px]">
              <CardHeader>
                <CardTitle className="min-h-4 max-h-4 overflow-hidden text-ellipsis whitespace-nowrap break-words">
                  {post.title}
                </CardTitle>
                <CardDescription className="min-h-10 max-h-10 overflow-hidden break-words line-clamp-2">
                  {post.description}
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
                <div className="text-sm text-gray-600 mb-2">
                  Category: {post.category}
                </div>
                <div className="text-xs text-gray-400">
                  Tags: {post.tags.join(", ")}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex flex-col gap-1 items-start">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center text-sm">
                      10
                      <Heart className="ml-1 size-3.5" />
                    </span>
                    <span className="flex items-center text-sm ">
                      10
                      <MessageCircle className="ml-1 size-3.5" />
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Button>Read More</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Blogs;
