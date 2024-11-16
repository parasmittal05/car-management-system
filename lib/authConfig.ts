import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { SessionStrategy } from "next-auth"

const prisma = new PrismaClient()

export const authOptions = {
  // Prisma Adapter to connect NextAuth.js to Prisma for database management
  adapter: PrismaAdapter(prisma),
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // Custom authentication logic
      async authorize(credentials: any) {
        // Ensure credentials are provided
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password")
          throw new Error("Missing email or password")
        }

        // Fetch user from database based on the email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, password: true } // Fetch only necessary fields
        })

        // Check if the user exists
        if (!user) {
          console.error("User not found")
          throw new Error("User not found")
        }

        // Verify password using bcrypt
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        // Check if password is correct
        if (!isCorrectPassword) {
          console.error("Incorrect password")
          throw new Error("Incorrect password")
        }

        // Return the user object if authentication is successful
        return user
      }
    })
  ],

  // Session strategy is set to JWT
  session: {
    strategy: 'jwt' as SessionStrategy,
  },

  pages: {
    signIn: '/auth/signin', // Optional: Custom sign-in page if needed
  },

  // Callbacks to handle JWT and session
  callbacks: {
    async jwt({ token, user }: any) {
      // Attach user id to JWT token
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      // Attach user id from JWT token to session
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}
