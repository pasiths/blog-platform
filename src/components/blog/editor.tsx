"use client";

import { useEffect, useState } from "react";
import TextEditor from "../editor/text-editor";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { Alert, AlertDescription } from "../ui/alert";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

type EditorProps = { slug: string };

const Editor: React.FC<EditorProps> = ({ slug }) => {
  const router = useRouter();

  const [isScreenLoading, setIsScreenLoading] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsScreenLoading(true);
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

        setTitle(data.title || "");
        setDescription(data.description || "");
        setContent(data.content || "");
        setImageUrl(data.image || "");
        setImagePreview(data.image || "");

        setCategories(
          data.Category.map((category: { name: string }) => category.name).join(
            ", "
          ) || ""
        );

        setTags(
          data.Tag.map((tag: { name: string }) => tag.name).join(", ") || ""
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsScreenLoading(false);
      }
    };

    if (slug) {
      fetchPosts();
    } else {
      setTimeout(() => {
        setIsScreenLoading(false);
      }, 1000);
    }
  }, [slug]);

  if (isScreenLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />

            <Skeleton className="h-24 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />

            <Skeleton className="h-24 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />

            <Skeleton className="h-8 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />

            <Skeleton className="h-8 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />

            <Skeleton className="h-24 w-full" />
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  const onChange = (content: string) => {
    setContent(content);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview("");
    setImageUrl("");
  };

  // Upload image to Cloudinary
  const uploadImage = async (): Promise<string | null> => {
    if (imagePreview === imageUrl) {
      return imageUrl;
    }
    if (!image) return null;

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error("Image upload failed", err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title || !description || !categories || !tags || !content) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }
    try {
      const uploadImageUrl = await uploadImage();
      if (!uploadImageUrl) {
        setError("Image upload failed. Please try again.");
        setIsLoading(false);
        return;
      }

      let url = "/api/blogs";
      const method = slug ? "PUT" : "POST";
      if (slug) {
        const queryParams = new URLSearchParams({
          slug: slug,
        }).toString();
        url = `/api/blogs/slug/[slug]?${queryParams}`;
      }
      const res = await fetch(`${url}`, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          image: uploadImageUrl,
          content,
          categories: categories
            ? categories.split(",").map((category) => category.trim())
            : [],
          tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      setSuccess("Post created successfully!");

      setTimeout(() => {
        setTitle("");
        setDescription("");
        setImage(null);
        setCategories("");
        setTags("");
        setContent("");
        setImagePreview("");
        setImageUrl("");
        setError(null);
        setSuccess(null);
      }, 3000);

      router.push(`/blog/${data.blog.slug}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Post"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a brief description of your post..."
            className="w-full p-2 border rounded"
            disabled={isLoading}
            rows={7}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>

          {!imagePreview ? (
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          ) : (
            <div className="relative border rounded-md p-2">
              <div className="w-full">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={imagePreview || imageUrl || "/placeholder.jpg"}
                    alt="Post image preview"
                    className="rounded-md object-cover"
                    fill
                  />
                </AspectRatio>
              </div>

              <div className="flex gap-2 mt-3 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("replace-image")?.click()
                  }
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                >
                  Remove
                </Button>
              </div>

              <input
                id="replace-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="">
            Category
          </Label>
          <Input
            id="category"
            name="category"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="Type a category"
            className="w-full p-2 border rounded"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="">
            Tags
          </Label>
          <Input
            id="tags"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter tags separated by commas"
            className="w-full p-2 border rounded"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="">
            Content
          </Label>
          <TextEditor content={content} onChange={onChange} />
        </div>

        <div className="">
          {(error || success) && (
            <Alert variant={error ? "destructive" : "default"}>
              <AlertDescription>{error ? error : success}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {slug
              ? isLoading
                ? "Updating..."
                : "Update Blog"
              : isLoading
              ? "Creating..."
              : "Create Blog"}
          </Button>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => (window.location.href = "/blog")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Editor;
