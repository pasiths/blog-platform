"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Edit3, Heart, PenLine, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const session = null; // Simulating no session for demonstration
  // const session = {
  //   user: {
  //     role: "READER", // Replace with dynamic session data when available
  //   },
  // };

  // Check user role
  let isEditor: boolean = false;
  if (session) {
    const session: { user: { role: string } } = { user: { role: "READER" } }; // Simulating session data for demonstration
    const isAdmin = session?.user?.role === "ADMIN";
    isEditor = session?.user?.role === "EDITOR" || isAdmin;
  }

  return (
    <main>
      <section className="bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 py-24 ">
          <div className="grid grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="font-bold tracking-tight text-5xl">
                Share Your Ideas with the World
              </h1>
              <p className="text-xl text-muted-foreground">
                A modern blogging platform for creators, writers, and thinkers.
                Publish, engage, and grow your audience.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="#" className="flex items-center ">
                    Explore Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                {session ? (
                  <>
                    {isEditor ? (
                      <Button size="lg" asChild>
                        <Link href="#" className="flex items-center ">
                          <Edit3 className="mr-2 h-4 w-4" />
                          Create Post
                        </Link>
                      </Button>
                    ) : (
                      <Button size="lg" asChild>
                        <Link href="#" className="flex items-center ">
                          <PenLine className="mr-2 h-4 w-4" />
                          Request Writer
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <Button size="lg" asChild>
                    <Link href="#" className="flex items-center ">
                      <Users className="mr-2 h-4 w-4" />
                      Join Us
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="relative h-[400px] ">
              <Image
                src="/placeholder.jpg"
                width={500}
                height={300}
                alt="Blog Platform"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight ">
              Platform Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to create, publish, and grow your blog
            </p>
          </div>
          <div className="grid gap-8 grid-cols-3">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                <Edit3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Rich Text Editor</h3>
              <p className="mt-2 text-muted-foreground">
                Create beautiful content with our intuitive rich text editor.
                Format text, add images, and more.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">User Roles</h3>
              <p className="mt-2 text-muted-foreground">
                Different permission levels for admins, editors, and readers.
                Control who can create and edit content.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Engagement</h3>
              <p className="mt-2 text-muted-foreground">
                Like, comment, and save posts. Build a community around your
                content and engage with your readers.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
            <Button asChild variant="outline">
              <Link href="#">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-muted-foreground">
              No posts yet. Be the first to create one!
            </p>

            {isEditor ?? (
              <Button asChild className="mt-4">
                <Link href="#">Create Post</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 ">
        <div className="container mx-auto px-4 ">
          <div className="bg-card rounded-lg  p-12 shadow-sm text-center ">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to start blogging?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join our community of writers and readers today.
            </p>
            <div className="mt-8">
            {session ? (
                  <>
                    {isEditor ? (
                      <Button size="lg" asChild>
                        <Link href="#" className="flex items-center ">
                          <Edit3 className="mr-2 h-4 w-4" />
                          Create Post
                        </Link>
                      </Button>
                    ) : (
                      <Button size="lg" asChild>
                        <Link href="#" className="flex items-center ">
                          <PenLine className="mr-2 h-4 w-4" />
                          Request Writer
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <Button size="lg" asChild>
                    <Link href="#" className="flex items-center ">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
