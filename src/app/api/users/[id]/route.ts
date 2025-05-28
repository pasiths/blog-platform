import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { PostStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
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
        Post: {
          some: {
            status: PostStatus.APPROVE,
          },
        },
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

    const isPsswdProtected = user.password ? true : false;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    const userResponse = { ...userWithoutPassword, isPsswdProtected };
    return NextResponse.json(userResponse);
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
      username,
      email,
      password,
      confirmPassword,
    } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let hashedPassword: string | undefined = undefined

    if (username !== user.username || email !== user.email) {
      if (!password) {
        return NextResponse.json(
          { error: "Password is required for protected accounts" },
          { status: 400 }
        );
      }
      const isPsswdProtected = user.password ? true : false;
      if (!isPsswdProtected && password !== confirmPassword) {
        return NextResponse.json(
          { error: "Password and confirm password do not match" },
          { status: 400 }
        );
      }
      if( password && password === confirmPassword) {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      if (isPsswdProtected) {
        const isValidPassword = await bcrypt.compare(
          password ?? "",
          user?.password as string
        );
        if (!isValidPassword) {
          return NextResponse.json(
            { error: "Invalid password" },
            { status: 401 }
          );
        }
      }

      if (username !== user.username) {
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (existingUser) {
          return NextResponse.json(
            { error: "Username already taken" },
            { status: 400 }
          );
        }
      }

      if (email !== user.email) {
        const existingEmail = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (existingEmail) {
          return NextResponse.json(
            { error: "Email already taken" },
            { status: 400 }
          );
        }
      }
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
        username: username || user.username,
        email: email || user.email,
        password : hashedPassword ? await bcrypt.hash(password, 10) : user.password,
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
