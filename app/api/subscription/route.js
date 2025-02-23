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

        // 🔹 Trigger Airflow DAG via REST API
        try {
            let airflowResponse = await fetch("http://65.109.13.184:8080/api/v1/dags/process_new_podcast/dagRuns", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + Buffer.from(process.env.AIRFLOW_USERNAME + ":" + process.env.AIRFLOW_PASSWORD).toString("base64")
                },
                body: JSON.stringify({
                    conf: {
                        feed_url: url,
                        pub_id: publication.id,
                    }
                })
            });

            if (!airflowResponse.ok) {
                let errorResponse = await airflowResponse.json();
                console.error("Airflow DAG trigger failed:", errorResponse);
            } else {
                console.log("Airflow DAG triggered successfully!");
            }
        } catch (error) {
            console.error("Error triggering Airflow DAG:", error);
        }

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
