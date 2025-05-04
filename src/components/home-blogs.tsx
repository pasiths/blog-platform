"use client";

import Blogs from "@/components/blog/blogs";
import { PostStatus } from "@prisma/client";
import { useEffect, useState } from "react";

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

export default function HomeBlogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const queryParams = new URLSearchParams({
          postStatus: PostStatus.APPROVE,
          take: "8",
        }).toString();

        const res = await fetch(`/api/blogs?${queryParams}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();
        setPosts(data.blogs);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return <Blogs posts={posts} loading={loading} />;
}
