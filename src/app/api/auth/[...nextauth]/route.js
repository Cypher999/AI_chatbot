import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getOne } from "@/utils/db/users"
import { compare } from "bcrypt"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Enter your username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password")
        }

        const user = await getOne({
          where: { username: credentials.username },
        })

        if (!user) {
          throw new Error("No user found")
        }

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) {
          throw new Error("Invalid password")
        }

        return { id: user.id, name: user.name, role: user.role }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
  cookies: {
    sessionToken: {
      name: "ai-chatbot-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Redirect to login page on error
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
