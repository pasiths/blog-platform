import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser } from "@/server/auth/session";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword, confirmNewPassword } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: currentUser.email },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const isPsswdProtected = user.password ? true : false;

  if (isPsswdProtected) {
    const isValidPassword = await bcrypt.compare(
      currentPassword ?? "",
      user.password as string
    );
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }
  }

  if (newPassword !== confirmNewPassword) {
    return NextResponse.json(
      { message: "New passwords do not match" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: user.email },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: "Password changed successfully" });
}
