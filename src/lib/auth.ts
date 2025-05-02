import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email,
            },
          });

          if (!user || !user.password) {
            return null;
          }
          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password as string
          );
          if (!isValidPassword) {
            return null;
          }
          return {
            ...user,
            id: user.id.toString(),
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({
      account,
      profile,
    }: {
      account: { provider?: string } | null;
      profile?: {
        email?: string;
        name?: string;
        login?: string;
        picture?: string;
        avatar_url?: string;
      } | null;
    }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const imageUrl: any = profile?.picture || profile?.avatar_url;
      if (account?.provider === "github" || account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: {
            email: profile?.email,
          },
        });
        if (!existingUser) {
          await prisma.user.create({
            data: {
              full_name: profile?.name as string,
              username:
                (profile?.login as string) ||
                (profile?.email?.split("@")[0] as string),
              email: profile?.email as string,
              image: imageUrl,
            },
          });
        }
      }
      return true;
    },

    async session({ token, session }) {
      console.log("Session1", session);
      console.log("token1", token);

      if (token) {
        session.user.id = token.id as string;
        session.user.full_name = token.full_name as string;
        session.user.username = token.username as string;
        session.user.email = token.email;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
      }
      console.log("Session2", session);
      console.log("token2", token);
      return session;
    },

    async jwt({ token, user }) {
      console.log("JWT2 t", token);
      console.log("JWT2 u", user);

      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email as string,
        },
      });

      if (dbUser) {
        token.id = dbUser.id.toString();
        token.full_name = dbUser.full_name;
        token.username = dbUser.username;
        token.email = dbUser.email;
        token.image = dbUser.image;
        token.role = dbUser.role;
      }
      console.log("JWT3 t", token);
      console.log("JWT3 u", user);

      return token;
    },
  },
};
