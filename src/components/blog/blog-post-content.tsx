/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
import { samplePosts } from "@/lib/samplePosts"; // Adjust the import path as necessary
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  Edit3,
  Heart,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { CommentBox } from "@/components/blog/comment-box";
import { Skeleton } from "@/components/ui/skeleton";

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
  author: {
    name: string;
    image: string;
  };
  comments: {
    id: number;
    content: string;
    createdAt: string;
    author: {
      id: number;
      name: string;
      image: string;
    };
  }[];
  like: [];
  tag: {
    id: number;
    name: string;
  }[];
  Category: {
    id: number;
    name: string;
  }[];
  saved: [];
}

export function BlogPostContent({
  params,
  user,
  isAuthor,
}: {
  params: Promise<{ slug: string }>;
  user: any;
  isAuthor: boolean;
}) {
  const { slug } = use(params);

  const isSession = user;
  const isEditor = isAuthor; // Simulating no editor role for demonstration

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filteredPost = samplePosts.find((post) => post.slug === slug) || null;
    setTimeout(() => {
      setPost(filteredPost); // set filtered data based on slug after 2 sec
      setLoading(false);
    }, 200);
  }, [slug]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)]">
        <article className="mx-auto">
          <div className="mb-8 flex flex-row justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="mb-8 px-4 w-full">
            <div className="mb-1 flex flex-row justify-between items-center ">
              <Skeleton className="h-8 w-[400px]" />

              <Skeleton className="h-8 w-[200px]" />
            </div>
            <div className="mb-8 w-full">
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="mb-8 flex justify-center items-center w-full">
              <Skeleton className="h-[400px] w-[400px]" />
            </div>

            <div className="w-full mb-4">
              <Skeleton className="h-6 w-full" />
            </div>

            <div className="max-w-full mb-4 flex flex-col gap-1">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>

            <div className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </article>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)]">
      <article className="mx-auto">
        <div className="mb-8 flex flex-row justify-between items-center">
          <Button variant="default" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft />
              Back to all posts
            </Link>
          </Button>
          {isEditor ? (
            <div className="flex flex-row gap-2 items-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="#">
                  <Edit3 />
                  Edit
                </Link>
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 />
                Delete
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>

        <Separator className="mb-8" />

        {!post ? (
          <div className="bg-muted p-4 rounded-md mb-6">
            <p className="text-sm font-medium">
              This post is either not published or could not be found.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 px-4 w-full">
              <div className="mb-1 flex flex-row justify-between items-center ">
                <h1 className="text-4xl font-bold tracking-tight">
                  {post?.title}{" "}
                </h1>

                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage
                      src={post?.author.image}
                      alt={post?.author.name}
                    />
                    <AvatarFallback>
                      {post?.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="">
                    <p className="font-medium">{post?.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Published{": "}
                      {post?.createdAt
                        ? formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8 w-full">
                <p className="font-medium mb-2">
                  Description:{" "}
                  <span className="text-lg text-muted-foreground mb-4">
                    {post?.description}
                  </span>
                </p>
              </div>

              <div className="mb-8 flex justify-center items-center w-full">
                <Image
                  src={post?.image || "/placeholder.jpg"}
                  alt={post?.title || "Default Image"}
                  className="h-auto rounded-lg"
                  width={600}
                  height={400}
                />
              </div>

              <div className="w-full mb-4">
                <div
                  className="prose prose-slate max-w-none tiptap"
                  dangerouslySetInnerHTML={{ __html: post?.content || "" }}
                />
              </div>

              <div className="max-w-full mb-4 flex flex-col gap-1">
                <p className="font-medium  felx items-center">
                  Categories:{" "}
                  {post?.Category.map((category) => (
                    <span
                      key={category.id}
                      className="text-[0.9375rem] text-muted-foreground mb-4 wrap-break-word"
                    >
                      {category.name}{" "}
                    </span>
                  ))}
                </p>
                <p className="font-medium felx items-center wrap-break-word">
                  Tags:{" "}
                  {post?.tag.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-[0.9375rem] text-muted-foreground mb-4"
                    >
                      {tag.name}{" "}
                    </span>
                  ))}
                </p>
              </div>

              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row gap-1 items-center">
                  <p className="text-lg flex flex-row justify-center items-center min-w-[50px] cursor-pointer">
                    <span className="text-muted-foreground mr-1">
                      {post?.like.length || 0}
                    </span>
                    <Heart className="h-4 w-4" />
                  </p>
                  <p className="text-lg flex flex-row justify-center items-center min-w-[50px] cursor-pointer">
                    <span className="text-muted-foreground mr-1">
                      {post?.comments.length || 0}
                    </span>
                    <MessageCircle className="h-4 w-4" />
                  </p>
                </div>

                <p className="text-lg flex flex-row justify-center items-center min-w-[50px] cursor-pointer">
                  <span className="text-muted-foreground mr-1">
                    {post?.saved.length || 0}
                  </span>
                  <Bookmark className="h-4 w-4" />
                </p>
              </div>
            </div>
            <Separator className="mb-8" />
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">Comments</h2>

              {isSession ? (
                <CommentBox />
              ) : (
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm font-medium">
                    <Link
                      href="/sign-in"
                      className="text-primary hover:underline"
                    >
                      Sign in
                    </Link>{" "}
                    to leave a comment.
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-6">
                {(post?.comments ?? []).length > 0 ? (
                  post?.comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 ">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={comment.author.image}
                              alt={comment.author.name}
                            />
                            <AvatarFallback>
                              {comment.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {comment.author.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        {isEditor && (
                          <Button variant="destructive" size="sm" type="submit">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </article>
    </main>
  );
}
