import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { SessionStrategy } from "next-auth"

const prisma = new PrismaClient()

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        // Ensure credentials are passed
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password")
          throw new Error("Missing email or password")
        }

        // Look up user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        // Check if user exists
        if (!user) {
          console.error("User not found")
          throw new Error("User not found")
        }

        // Compare passwords
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          console.error("Incorrect password")
          throw new Error("Incorrect password")
        }

        // Return user if authentication is successful
        return user
      }
    })
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
  },
  pages: {
    signIn: '/auth/signin', // Specify custom sign-in page if needed
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}
