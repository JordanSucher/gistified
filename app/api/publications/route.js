import { NextResponse } from "next/server";
import {isThisAPodcast, getPodDetails} from "../../lib/rss";
import prisma from '../../prisma'

export async function GET(req) {
    let publications = await prisma.publication.findMany()

    return NextResponse.json(publications, {
        status: 200
    })
}