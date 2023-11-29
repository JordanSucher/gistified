import { NextResponse } from "next/server";
import {getPodDetails} from "../../lib/rss";
import prisma from '../../prisma'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { client } from "../../../trigger"


export async function GET (req) {
    let id = req.nextUrl.searchParams.get('id')

    let summary = await prisma.summary.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            episode: {
                include: {
                    publication: true
                }
            }
        }
    })

    return NextResponse.json(summary, {
        status: 200
    })
}