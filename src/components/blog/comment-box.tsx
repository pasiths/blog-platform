"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";

interface CommentBoxProps {
  postId: number | undefined;
}

export function CommentBox({ postId }: CommentBoxProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (!postId) {
      setError("Post ID is required");
      setIsLoading(false);
      return;
    }
    if (!content) {
      setError("Content is required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/blogs/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }
      setSuccess("Comment created successfully!");
      setContent("");
      setIsLoading(false);

      window.location.reload();
    } catch (error) {
      console.error("Error creating comment:", error);
      setError("Error creating comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Textarea
        id="content"
        name="content"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={false}
        required
        className="min-h-[100px]"
      />

      {(error || success) && (
        <Alert variant={error ? "destructive" : "default"}>
          <AlertDescription>{error ? error : success}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={false}>
        {isLoading ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
