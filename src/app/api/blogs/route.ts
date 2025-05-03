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
