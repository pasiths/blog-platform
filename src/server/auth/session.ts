import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email as string,
    },
    select: {
      id: true,
      full_name: true,
      email: true,
      image: true,
      role: true,
    },
  });
  if (!user) {
    return null;
  }
  return {
    ...user,
    role: user.role,
  };
}
