import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prisma from '../../../prisma'
import { PrismaAdapter } from "@auth/prisma-adapter"


export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    adapter: PrismaAdapter(prisma) ,
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id
            return session
        }
    }
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
