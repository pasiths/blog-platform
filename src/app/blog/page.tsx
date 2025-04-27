"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IsEditor } from "@/lib/utils";
import { Edit3 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { samplePosts } from "@/lib/samplePosts"; // Adjust the import path as necessary
import Blogs from "@/components/blog/blogs";

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

const POSTS_PER_PAGE = 8;

const BlogsPage = () => {
  const isEditor = IsEditor; // Simulating no editor role for demonstration

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  useEffect(() => {
    setTimeout(() => {
      setPosts(samplePosts); // set sample data after 2 sec
      setLoading(false);
    }, 2000);
  }, []);

  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <Button asChild>
          <Link href="#">
            <Edit3 className="mr-2 h-4 w-4" />
            Create Post
          </Link>
        </Button>
      </div>

      {posts.length > 0 ? (
        <>
          <Blogs posts={paginatedPosts} loading={loading} />
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(index + 1);
                        }}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-card rounded-lg">
          <p className="text-muted-foreground">
            No posts yet. Be the first to create one!
          </p>

          {isEditor && (
            <Button size="lg" className="mt-4" asChild>
              <Link href="#" className="flex items-center ">
                <Edit3 className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            </Button>
          )}
        </div>
      )}
    </main>
  );
};

export default BlogsPage;
