import { NextResponse } from "next/server";
import prisma from '../../prisma'
import { saveToBlobStorage } from "../../lib/data";
import { client } from "../../../trigger"



export async function POST(req) {
    let body = await req.json()
    let url = body.url;
    let transcript = body.transcript;
   

    try {

        // get episode record from DB
        let episode = await prisma.episode.findFirst({
            where: {
                url: url
            }
        })
    
        // persist transcript to Blob storage
        let path = url + ".txt";
        const blob = await saveToBlobStorage(path, transcript);
    
        // update episode record
        await prisma.episode?.update({
            where: {
                id: episode?.id
            },
            data: {
                transcriptUrl: blob.url
            }
        });
    
        // maybe trigger job to generate summary here
        await client.sendEvent({
            name: "createSummary.event",
            payload: {
                rssFeedUrl: url
            }
        })
    
    
        return NextResponse.json({success: true}, {
            status: 200
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json({success: false}, {
            status: 500
        })
    }

}
