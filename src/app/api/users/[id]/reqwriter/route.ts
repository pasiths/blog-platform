import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/server/auth/session";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.requestWriter) {
      return NextResponse.json({ error: "Already requested" }, { status: 400 });
    }

    if (user.role === UserRole.EDITOR || user.role === UserRole.ADMIN) {
      return NextResponse.json(
        { error: "You are already an editor" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        requestWriter: true,
      },
      select: {
        id: true,
        requestWriter: true,
      },
    });

    if (!updatedUser?.requestWriter) {
      return NextResponse.json(
        { error: "Failed to update request writer status" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Request sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
