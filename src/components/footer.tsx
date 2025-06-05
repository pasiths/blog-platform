import Link from "next/link";
import { Github, Linkedin, Youtube, Mail } from "lucide-react";

const GITHUB_URL =
  process.env.NEXT_PUBLIC_GITHUB_URL! || "https://github.com/yourusername";
const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL! ||
  "https://linkedin.com/in/yourprofile";
const YOUTUBE_URL =
  process.env.NEXT_PUBLIC_YOUTUBE_URL! || "https://youtube.com/@yourchannel";
const EMAIL_ADDRESS =
  process.env.NEXT_PUBLIC_EMAIL_ADDRESS! || "youremail@gmail.com";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto p-4 pt-5 pb-5">
        <div className="flex flex-row items-center justify-between gap-3">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Blogger. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link
              href={GITHUB_URL}
              target="_blank"
              className="text-muted-foreground hover:text-primary transition"
            >
              <Github className="h-4 w-4" />
            </Link>
            <Link
              href={LINKEDIN_URL}
              target="_blank"
              className="text-muted-foreground hover:text-primary transition"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
            <Link
              href={YOUTUBE_URL}
              target="_blank"
              className="text-muted-foreground hover:text-primary transition"
            >
              <Youtube className="h-4 w-4" />
            </Link>
            <Link
              href={`mailto:${EMAIL_ADDRESS}`}
              className="text-muted-foreground hover:text-primary transition"
            >
              <Mail className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
