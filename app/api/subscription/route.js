import { NextResponse } from "next/server";
import {getPodDetails} from "../../lib/rss";
import prisma from '../../prisma'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
// import { client } from "../../../trigger"


export async function DELETE(req) {
    let body = await req.json()
    console.log("body", body)
    let userId = body.userId;
    let publicationId = body.publicationId;

    try {
        // delete subscription
        await prisma.subscription.delete({
            where: {
                userId_publicationId: {
                    userId: userId,
                    publicationId: publicationId
                }
            }
        });
    
        return NextResponse.json({success: true}, {
            status: 200
        })
    } catch (e) {
        console.log(e, e.message)
        return NextResponse.json({success: false}, {
            status: 500
        })
    }
}

export async function POST(req) {
    let body = await req.json()
    let url = body.url;

    console.log("url: ", url)
   
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
                description: details.description,
                imageurl: details.imageUrl
            }
        })

        // then, trigger job to generate summaries of latest 3 episodes
        // await client.sendEvent({
        //     name: "newpod.event",
        //     payload: {
        //         rssFeedUrl: url,
        //         title: publication.title
        //     }
        // })

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
