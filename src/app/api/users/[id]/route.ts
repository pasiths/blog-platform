import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (id) {
      const userId = Number(id);
      if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Post: {
          include: {
            Like: true,
            Comment: true,
            Saved: true,
            User: {
              select: {
                id: true,
                full_name: true,
                image: true,
              },
            },
            Category: true,
            Tag: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (id) {
      const userId = Number(id);
      if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.id !== Number(id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      full_name,
      bio,
      location,
      website,
      linkedin,
      instagram,
      youtube,
      github,
      x,
      image,
    } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        full_name,
        bio,
        location,
        website,
        linkedin,
        instagram,
        youtube,
        github,
        x,
        image,
      },
      select: {
        id: true,
        full_name: true,
        username: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        linkedin: true,
        github: true,
        instagram: true,
        youtube: true,
        x: true,
        image: true,
      },
    });
    if (!newUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ newUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
