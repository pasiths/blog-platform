import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { PostStatus, UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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

    const slug = `${title.toLowerCase().replace(/\s+/g, "-")}-${user?.full_name
      ?.toLowerCase()
      .replace(/\s+/g, "-")}`;

    const existingBlog = await prisma.post.findUnique({
      where: { slug },
    });
    if (existingBlog) {
      return NextResponse.json(
        { message: "Blog with this slug already exists" },
        { status: 400 }
      );
    }

    const blog = await prisma.post.create({
      data: {
        title,
        slug,
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
      { message: "Blog created successfully", blog },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating blog" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || undefined;
    const userId = parseInt(searchParams.get("userId")!) || undefined;
    const userName = searchParams.get("userName") || undefined;
    const categoryName = searchParams.get("categoryName") || undefined;
    const tagName = searchParams.get("tagName") || undefined;
    const take = searchParams.get("take")
      ? parseInt(searchParams.get("take")!)
      : undefined;
    const postStatus = searchParams.get("postStatus") || PostStatus.APPROVE;

    const blogs = await prisma.post.findMany({
      where: {
      AND: [
        title ? { title: { contains: title, mode: "insensitive" } } : {},
        userId ? { authorId: userId } : {},
        userName
        ? {
          User: {
            full_name: { contains: userName, mode: "insensitive" },
          },
          }
        : {},
        categoryName
        ? {
          Category: {
            some: {
            name: { contains: categoryName, mode: "insensitive" },
            },
          },
          }
        : {},
        tagName
        ? {
          Tag: {
            some: { name: { contains: tagName, mode: "insensitive" } },
          },
          }
        : {},
        postStatus ? { status: postStatus as PostStatus } : {},
      ],
      },
      orderBy: {
      createdAt: "desc",
      },
      take,
      include: {
      User: {
        select: {
        id: true,
        full_name: true,
        email: true,
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
        updatedAt: true,
        User: {
          select: {
          id: true,
          full_name: true,
          email: true,
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
      },
    });

    return NextResponse.json({
      blogs,
      message: "Blogs fetched successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching blogs" },
      { status: 500 }
    );
  }
}
