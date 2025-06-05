import Editor from "@/components/blog/editor";

const CreateBlog = () => {
  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-8rem)]">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Create New Blog
        </h1>
        <Editor slug="" />
      </div>
    </main>
  );
};

export default CreateBlog;
