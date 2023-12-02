import { NextResponse } from "next/server";
import prisma from '../../prisma'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";

export async function GET (req) {

    let session = await getServerSession(authOptions)

    let summaries = await prisma.summary.findMany({
        where: {
        status: 'published',
        episode:{
            publication:{
                subscriptions: {
                    some: {
                        userId: session.user.id
                    }
                }
            }
        }
    },
    include: {
        episode: {
            include: {
                publication: {
                    include: {
                        subscriptions: true
                    }
                }
            }
        }
    },
    orderBy: {
        episode:{
            publishedAt: 'desc'
        }
    }
    })

    return NextResponse.json(summaries, {
        status: 200
    })

}