import { UserRole } from "@prisma/client";

type User = {
    id: number
    role: string
  }

export const isAdmin = (user: User | null) => {
  return user?.role === UserRole.ADMIN;
}

export const isAuthor = (user: User | null) => {
  return (user?.role === UserRole.EDITOR) || isAdmin(user);
}
