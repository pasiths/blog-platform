"use client";

import Link from "next/link";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const SignInForm = () => {
  return (
    <div className="w-full flex flex-col gap-6 items-center">
      <form action="">
        <div className="flex flex-col gap-4 w-md ">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              disabled={false}
              autoFocus
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="********"
              type="password"
              autoComplete="password"
              disabled={false}
              required
            />
          </div>
          <Button type="submit" disabled={false}>
            Sign In
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" disabled={false}>
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" disabled={false}>
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
      <div className="text-center text-sm">
        <span>Don&apos;t have an account? </span>
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
