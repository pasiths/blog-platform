"use client";

import Link from "next/link";
import {
  User,
  LogOut,
  Settings,
  Newspaper,
  PenLine,
  Bookmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const session = null; // Simulating no session for demonstration
  // const session = {
  //   user: {
  //     role: "READER", // Replace with dynamic session data when available
  //   },
  // };

  // Check if user is logged in
  if (!session) {
    return (
      <header className="border-b bg-background">
        <nav className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Blogger
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
            >
              Blog
            </Link>
            <Button variant="outline" size="sm">
              <Link href="#">Sign In</Link>
            </Button>
            <Button variant="default" size="sm">
              <Link href="#">Sign Up</Link>
            </Button>
          </div>
        </nav>
      </header>
    );
  }

  // Check user role
  let isEditor: boolean = false;
  if (session) {
    const session: { user: { role: string } } = { user: { role: "READER" } }; // Simulating session data for demonstration
    const isAdmin = session?.user?.role === "ADMIN";
    isEditor = session?.user?.role === "EDITOR" || isAdmin;
  }

  // Define navigation items based on user role
  const navigation = [
    {
      name: "Blog",
      href: "#",
      icon: <Newspaper size={18} />,
    },
    ...(isEditor
      ? [
          {
            name: "Create Post",
            href: "#",
            icon: <PenLine size={18} />,
          },
        ]
      : []),
  ];

  return (
    <header className="border-b bg-background">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold">
            Blogger
          </Link>
        </div>
        <div className="flex items-center gap-x-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground flex gap-2 items-center"
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full "
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={undefined} alt={"User"} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">User</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                asChild
              >
                <Link href="#">
                  <User className="mr-1 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                asChild
              >
                <Link href="#">
                  <Bookmark className="mr-1 h-4 w-4" />
                  Saved Posts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center"
                asChild
              >
                <Link href="#">
                  <Settings className="mr-1 h-4 w-4" />
                  Setting
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onSelect={() => {}}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
