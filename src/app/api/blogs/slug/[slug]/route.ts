import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { PostStatus, UserRole } from "@prisma/client";
import { getCurrentUser } from "@/server/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    let postStatus = searchParams.get("postStatus") as PostStatus | undefined;

    const user = await getCurrentUser();
    if (user?.role !== UserRole.ADMIN) {
      postStatus = PostStatus.APPROVE;
    }

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const post = await prisma.post.findFirst({
      where: {
        slug,
        status: postStatus,
      },
      include: {
        User: {
          select: {
            id: true,
            full_name: true,
            image: true,
          },
        },
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
        Tag: {
          select: {
            id: true,
            name: true,
          },
        },
        Comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                full_name: true,
                image: true,
              },
            },
          },
        },
        Like: {
          select: {
            id: true,
            userId: true,
          },
        },
        Saved: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || undefined;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const user = await getCurrentUser();
    const post = await prisma.post.findUnique({
      where: { slug },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (post.authorId !== user?.id && user?.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: "You are not authorized to delete this post" },
        { status: 403 }
      );
    }

    await prisma.post.update({
      where: { slug },
      data: {
        status: PostStatus.DELETE,
      },
    });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug") || undefined;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }
    const user = await getCurrentUser();
    if (user?.role !== UserRole.EDITOR && user?.role !== UserRole.ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { title, description, image, categories, tags, content } =
      await req.json();

    if (!title || !description || !image || !categories || !tags || !content) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const blog = await prisma.post.update({
      where: { slug },
      data: {
        title,
        description,
        content,
        image,
        authorId: user?.id,
        Category: {
          connectOrCreate: categories.map((category: string) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
        Tag: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        status: PostStatus.PENDING,
      },
    });

    return NextResponse.json(
      { message: "Blog updated successfully", blog },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating blog" },
      { status: 500 }
    );
  }
}
