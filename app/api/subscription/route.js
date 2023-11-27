import { NextResponse } from "next/server";
import {getPodDetails} from "../../lib/rss";
import prisma from '../../prisma'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { client } from "../../../trigger"


export async function POST(req) {
    let body = await req.json()
    let url = body.url;
   
    // check if URL exists in DB
    let publication = await prisma.publication.findFirst({
        where: {
            rssFeedUrl: url,
        }
    })

    if (!publication) {
        // if not, fetch podcast details and add it
        let details = await getPodDetails(url)
        publication = await prisma.publication.create({
            data: {
                rssFeedUrl: url,
                title: details.title,
                description: details.description
            }
        })

        // then, trigger job to generate summaries of latest 3 episodes
        await client.sendEvent({
            name: "newpod.event",
            payload: {
                rssFeedUrl: url
            }
        })

    }

   
    // get current user
    let session = await getServerSession(authOptions)
    console.log("session: ", session)

    let user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    })

    // create a subscription with the user and publication
    await prisma.subscription.create({
        data: {
            userId: user.id,
            publicationId: publication.id
        }
    })

    return NextResponse.json({success: true}, {
        status: 200
    })


}
