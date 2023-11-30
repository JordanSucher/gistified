import { NextResponse } from "next/server";
import {getPodDetails} from "../../lib/rss";
import prisma from '../../prisma'
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { client } from "../../../trigger"


export async function POST(req) {
    let body = await req.json()

    let id = body.id
    let emailPreference = body.emailPref


    try {
        let session = await getServerSession(authOptions)

        if (id == session.user.id) {
            await prisma.user.update({
                where: {
                    id: id
                },
                data: {
                    emailPreference: emailPreference
                }
            })
        }
    
        return NextResponse.json({success: true}, {
            status: 200
        })
    } catch (e) {
        console.log("error", e, e.message)
        return NextResponse.json({success: false}, {
            status: 500
        })
    }

}