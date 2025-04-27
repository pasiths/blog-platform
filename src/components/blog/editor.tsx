"use client";

import { useState } from "react";
import TextEditor from "../editor/text-editor";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const Editor = () => {
  const [post, setPost] = useState("");

  const onChange = (content: string) => {
    setPost(content);
    console.log(content);
  };

  return (
    <form className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="My Awesome Post"
            disabled={false}
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
            placeholder="Write a brief description of your post..."
            className="w-full p-2 border rounded"
            rows={7}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image" className="">
            Image
          </Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded h-15"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="">
            Category
          </Label>
          <Input
            id="category"
            name="category"
            placeholder="Type a category"
            className="w-full p-2 border rounded"
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
            placeholder="Enter tags separated by commas"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="">
            Content
          </Label>
          <TextEditor content={post} onChange={onChange} />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={false}>
            Create Post
          </Button>
          <Button variant="outline" disabled={false}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Editor;
