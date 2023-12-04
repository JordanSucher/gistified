import { NextResponse } from "next/server";
import prisma from '../../prisma'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";


export async function GET (req) {
    try {
        let summaryId = req.nextUrl.searchParams.get('summaryId')
        let session = await getServerSession(authOptions)

        let highlights = await prisma.highlight.findMany({
            where: {
                summaryId: parseInt(summaryId),
                userId: session.user.id
            }
        })

        return NextResponse.json(highlights, {
            status: 200
        })
    } catch (error) {
        console.log(error, error.message)
        return NextResponse.json({success: false}, {
            status: 500
        })
    }

}

export async function POST (req) {
    
    try {
        let body = await req.json()
        let summaryId = body.summaryId
        let text = body.text
        let session = await getServerSession(authOptions)
        let existingHighlights = await prisma.highlight.findMany({
            where: {
                summaryId: parseInt(summaryId),
                userId: session.user.id
            }
        })

        let alreadyExists
        let promises = existingHighlights.map(async (highlight) => {
            if (highlight.content == text) {
                alreadyExists = true
            }
        })
        Promise.all(promises)

        if (alreadyExists) {
            return NextResponse.json({success: false}, {
                status: 500
            })
        }

        
        let highlight = await prisma.highlight.create({
            data: {
                summaryId: parseInt(summaryId),
                content: text,
                userId: session.user.id
            }
        })

        return NextResponse.json({highlight: highlight}, {
            status: 200
        })
    } catch (error) {
        console.log(error, error.message)
        return NextResponse.json({success: false}, {
            status: 500
        })
    }
}