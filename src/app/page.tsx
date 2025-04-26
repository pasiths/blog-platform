"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <h1 className="text-3xl font-bold underline">Home</h1>
      <Footer />
    </div>
  );
}
