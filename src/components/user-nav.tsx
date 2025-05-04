"use client";

import Link from "next/link";
import { User, LogOut, Settings, Bookmark, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { UserRole } from "@prisma/client";

interface UserNavProps {
  user: {
    id: number;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
  } | null;
}

export function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full ">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user?.image || undefined}
              alt={user?.name || user?.email || ""}
            />
            <AvatarFallback>
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user?.name || "Anonymous User"}</p>
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center" asChild>
          <Link href="#">
            <User className="mr-1 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {(user?.role === UserRole.EDITOR || user?.role === UserRole.ADMIN) && (
          <DropdownMenuItem
            className="cursor-pointer flex items-center"
            asChild
          >
            <Link href="/blog/myblogs">
              <Edit3 className="mr-1 h-4 w-4" />
              My Posts
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer flex items-center" asChild>
          <Link href="/blog/savedblogs">
            <Bookmark className="mr-1 h-4 w-4" />
            Saved Posts
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer flex items-center" asChild>
          <Link href="#">
            <Settings className="mr-1 h-4 w-4" />
            Setting
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
