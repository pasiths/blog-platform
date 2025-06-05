import Editor from "@/components/blog/editor";
import { use } from "react";

const EditBlog = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)]">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Edit New Blog
        </h1>
        <Editor slug={slug} />
      </div>
    </main>
  );
};

export default EditBlog;
