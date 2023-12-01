import { NextResponse } from "next/server";
import {isThisAPodcast, getPodDetails} from "../../lib/rss";
import prisma from '../../prisma'
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptions"

export async function GET(req) {
    let session = await getServerSession(authOptions)

    let newflag = req.nextUrl.searchParams.get("new")
    let publications
    if (newflag=="true") {
        publications = await prisma.publication.findMany({
            include: {
                subscriptions: true
            },
            where: {
                subscriptions: {
                    none: {
                        userId: session.user.id
                    }
                }
            }
        })

    } else {
        publications = await prisma.publication.findMany()
    }

    
    return NextResponse.json(publications, {
        status: 200
    })
}