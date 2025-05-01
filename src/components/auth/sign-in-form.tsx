"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Alert, AlertDescription } from "../ui/alert";

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.ok) {
        router.push(callbackUrl);
        setSuccess("Login Successful");
      } else if (res?.status === 401) {
        setError("Invalid credentials. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    signIn(value, { callbackUrl: "/" });
  };

  return (
    <div className="w-full flex flex-col gap-6 items-center">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 w-md ">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
              disabled={isLoading}
              required
            />
          </div>

          {(error || success) && (
            <Alert variant={error ? "destructive" : "default"}>
              <AlertDescription>
                {error ? error : " Account created successfully!"}
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={isLoading}>
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
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={(e) => handleProvider(e, "github")}
        >
          <FaGithub className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={(e) => handleProvider(e, "google")}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Google
        </Button>
      </div>
      <div className="text-center text-sm">
        <span>Don&apos;t have an account? </span>
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
