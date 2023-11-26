import { NextResponse } from "next/server";
import {isThisAPodcast, getPodDetails} from "../../lib/rss";
import prisma from '../../prisma'

export async function GET(req) {
    let url = req.nextUrl.searchParams.get('url');
    return NextResponse.json({isPodcast: await isThisAPodcast(url)}, {
        status: 200
    });   
}


