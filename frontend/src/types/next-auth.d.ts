import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      accessToken?: string
      refreshToken?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
    refreshToken?: string
    accessTokenExpiresAt?: number
  }
}