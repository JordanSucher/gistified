import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prisma from '../../../prisma'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { authOptions } from './authOptions'



export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
