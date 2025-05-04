/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";

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
    id: number;
    full_name: string;
    image: string;
  };
  Comment: {
    id: number;
    content: string;
    createdAt: string;
    User: {
      id: number;
      full_name: string;
      image: string;
    };
  }[];
  Like: {
    id: number;
    userId: number;
  }[];
  Tag: {
    id: number;
    name: string;
  }[];
  Category: {
    id: number;
    name: string;
  }[];
  Saved: {
    id: number;
    userId: number;
  }[];
}

export function BlogPostContent({
  params,
  user,
  isAuthor,
  isAdmin,
}: {
  params: Promise<{ slug: string }>;
  user: any;
  isAuthor: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const { slug } = use(params);

  const isSession = user;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLike, setIsLike] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const queryParams = new URLSearchParams({
          slug: slug,
        }).toString();

        const res = await fetch(`/api/blogs/slug/[slug]?${queryParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          return null;
          // throw new Error("Failed to fetch posts");
        }
        const data = await res.json();

        setLikeCount(data.Like.length);
        setCommentCount(data.Comment.length);
        setSavedCount(data.Saved.length);

        const isPostLiked = data.Like.some(
          (like: { userId: number }) => like.userId === user?.id
        );
        setIsLike(isPostLiked);

        const isPostSaved = data.Saved.some(
          (save: { userId: number }) => save.userId === user?.id
        );
        setIsSaved(isPostSaved);
        setPost(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkIfDeletedEditor = async () => {
      const checkerDelete =
        (post?.User?.id === user?.id || isAdmin) && isSession;
      const checkerEditor = post?.User?.id === user?.id && isAuthor;
      setIsDeleted(checkerDelete);
      setIsEditor(checkerEditor);
    };

    fetchPosts();
    checkIfDeletedEditor();
  }, [isAdmin, isAuthor, isSession, post?.User?.id, slug, user?.id]);

  const handleDelete = async () => {
    try {
      const queryParams = new URLSearchParams({
        slug: slug,
      }).toString();

      const res = await fetch(`/api/blogs/slug/[slug]?${queryParams}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: slug,
        }),
      });

      if (!res.ok) {
        console.log("Error deleting the post:", res);
      }

      router.push("/blog");
    } catch (error) {
      console.error("Error deleting the post:", error);
    }
  };

  const handleLike = async () => {
    if (!isSession) {
      return;
    }
    try {
      if (!isLike) {
        const res = await fetch("/api/blogs/like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post?.id,
          }),
        });

        if (!res.ok) {
          return null;
        }
        setLikeCount((prev) => prev + 1);
        setIsLike(!isLike);
      } else {
        const res = await fetch("/api/blogs/like", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post?.id,
          }),
        });

        if (!res.ok) {
          return null;
        }
        setLikeCount((prev) => prev - 1);
        setIsLike(!isLike);
      }
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleSave = async () => {
    if (!isSession) {
      return;
    }
    try {
      if (!isSaved) {
        const res = await fetch("/api/blogs/saved", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post?.id,
          }),
        });

        if (!res.ok) {
          return null;
        }
        setSavedCount((prev) => prev + 1);
        setIsSaved(!isSaved);
      } else {
        const res = await fetch("/api/blogs/saved", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post?.id,
          }),
        });

        if (!res.ok) {
          return null;
        }
        setSavedCount((prev) => prev - 1);
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error("Error saving the post:", error);
    }
  };

  const handleCommentDelete = async (id: number) => {
    try {
      const res = await fetch("/api/blogs/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });
      if (!res.ok) {
        return;
      }

      window.location.reload();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

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
          <div className="flex flex-row gap-2 items-center">
            {isEditor && (
              <Button variant="outline" size="sm" asChild>
                <Link href="#">
                  <Edit3 />
                  Edit
                </Link>
              </Button>
            )}
            {isDeleted && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="cursor-pointer"
              >
                <Trash2 />
                Delete
              </Button>
            )}
          </div>
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
                      src={post?.User.image}
                      alt={post?.User.full_name}
                    />
                    <AvatarFallback>
                      {post?.User.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="">
                    <p className="font-medium">{post?.User.full_name}</p>
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
                  {post?.Tag.map((tag) => (
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
                  <p
                    className="text-lg font-bold flex flex-row justify-center items-center min-w-[50px] cursor-pointer"
                    onClick={handleLike}
                  >
                    <span className="mr-1">{likeCount || 0}</span>
                    <Heart
                      className="h-5 w-5"
                      color={isLike ? "red" : "currentColor"}
                      fill={isLike ? "red" : "none"}
                    />
                  </p>
                  <p className="text-lg font-bold flex flex-row justify-center items-center min-w-[50px] cursor-pointer">
                    <span className="mr-1">{commentCount || 0}</span>
                    <MessageCircle className="h-5 w-5" />
                  </p>
                </div>

                <p
                  className="text-lg font-bold flex flex-row justify-center items-center min-w-[50px] cursor-pointer"
                  onClick={handleSave}
                >
                  <span className="mr-1">{savedCount || 0}</span>
                  <Bookmark
                    className="h-5 w-5"
                    color={isSaved ? "black" : "currentColor"}
                    fill={isSaved ? "black" : "none"}
                  />
                </p>
              </div>
            </div>
            <Separator className="mb-8" />
            <div className="space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">Comments</h2>

              {isSession ? (
                <CommentBox postId={post?.id} />
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
                {(post?.Comment ?? []).length > 0 ? (
                  post?.Comment.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 ">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={comment.User.image}
                              alt={comment.User.full_name}
                            />
                            <AvatarFallback>
                              {comment.User.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {comment.User.full_name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        {comment.User.id === user?.id && (
                          <Button
                            variant="destructive"
                            size="sm"
                            type="submit"
                            onClick={() => handleCommentDelete(comment.id)}
                            className="cursor-pointer"
                          >
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
