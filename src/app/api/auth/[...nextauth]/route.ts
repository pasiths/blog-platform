/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
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
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          email: token.email,
          role: token.role,
          image: token.image,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt" as const,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
