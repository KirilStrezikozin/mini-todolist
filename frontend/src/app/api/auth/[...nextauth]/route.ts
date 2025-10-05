import api from "@/lib/api/axios";
import { AxiosError } from "axios";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";


function getAccessTokenExpiryDate() {
  const delta = (Number(process.env.ACCESS_TOKEN_EXPIRE_MINUTES) || 15) * 60;
  const now = Math.floor(Date.now() / 1000);
  return now + delta;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const { data } = await api({
      method: "post",
      url: "auth/refresh",
      headers: { "Content-Type": "application/json" },
      data: {
        refresh_token: token.refreshToken,
      },
    });

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      accessTokenExpiresAt: getAccessTokenExpiryDate(),
    };
  } catch (err) {
    console.error("Error refreshing token:", (err as AxiosError).response);
    return { ...token };
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { data } = await api({
          method: "post",
          url: "auth/login",
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        });

        return {
          id: credentials.email,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: (Number(process.env.REFRESH_TOKEN_EXPIRE_MINUTES) || 7 * 24 * 60 * 60) * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);

      if (user) {
        // On first login.
        return {
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiresAt: getAccessTokenExpiryDate(),
        };
      }

      if (now < (token.accessTokenExpiresAt ?? 0)) {
        return token; // token is still valid.
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };