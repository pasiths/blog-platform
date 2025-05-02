"use client";

import Blogs from "@/components/blog/blogs";
import { samplePosts } from "@/lib/samplePosts"; // Adjust the import path as necessary
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
  author: {
    name: string;
  };
  comments: [];
  like: [];
  tag: {
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
    setTimeout(() => {
      setPosts(samplePosts.slice(0, 8)); // set sample data with a limit of 8 posts after 2 sec
      setLoading(false);
    }, 2000);
  }, []);
  return <Blogs posts={posts} loading={loading} />;
}
