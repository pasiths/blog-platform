"use client";

import Blogs from "@/components/blog/blogs";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HomeBlogs({ queryParams, notFoundMessage  }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
  }, [queryParams]);

  return (
    <Blogs
      posts={posts}
      loading={loading}
      // notFoundMessage="No posts yet. Be the first to create one!"
      notFoundMessage={notFoundMessage}
    />
  );
}
