import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      full_name: string
      username: string
      role: string
    } & DefaultSession["user"]
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
  }
}
