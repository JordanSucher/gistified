import { cronTrigger, eventTrigger, intervalTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { getLatestEpisodes } from "../app/lib/rss";
import { getTranscriptSummary } from "../app/lib/openai";
import { upsertEpisode, upsertSummary, doesTranscriptExist, 
    getTranscriptUrlFromEpisode } from "../app/lib/data";
import Mailjet from 'node-mailjet';


client.defineJob({
    id: "send-daily-emails",
    name: "Send emails",
    version: "0.0.1",
    trigger: cronTrigger({
        cron: "0 15 * * *",
    }),

    run: async (payload, io, ctx) => {
        
        // get all users with daily subscriptions
        let users = await prisma.user.findMany({
            where: {
                emailPreference: "daily"
            }
        })

        console.log("users: ", users)

        const mailjet = new Mailjet({
            apiKey: process.env.MJ_APIKEY_PUBLIC,
            apiSecret: process.env.MJ_APIKEY_PRIVATE
        })

        for (const user of users) {
            await io.runTask(
                "send-email-to-" + user.email,
                async () => {

                    // get all summaries for user subscriptions in the last 24 hours
                    let summaries = await prisma.summary.findMany({
                        where: {
                            episode: {
                                publishedAt: {
                                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                                },
                                publication: {
                                    subscriptions: {
                                        some: {
                                            userId: 29
                                        }
                                    }                  
                                }
                            },
                        },
                        include: {
                            episode: {
                                include: {
                                    publication: {
                                        include: {
                                            subscriptions: true
                                        }
                                    }
                                }
                            }
                        }
                    })

                    summaries = summaries.map((summary) => {
                        try {
                            return {
                                ...summary,
                                content: JSON.parse(summary.content.replace("```json", "").replace("```", ""))
                            }
                        } catch (error) {
                            console.log("error", error)
                            return ""
                        }
                    }).filter((summary) => {
                        return summary !== ""
                    })

                    console.log("summaries: ", summaries)

                    const request = mailjet.post('send', {'version': 'v3.1'})
                    .request({
                        "Messages":[
                            {
                                "From": {
                                    "Email": "jsucher@gmail.com",
                                    "Name": "Gistified"
                                },
                                "To": [
                                    {
                                        "Email": user.email,
                                        "Name": user.name
                                    }
                                ],
                                "Subject": "Gistified Daily Summary",
                                "TextPart": "Gistified Daily Summary",
                                "HTMLPart":
                                `
                                ${summaries.map((summary) => {
                                    return (
                                    `
                                    <span style="display: flex; align-items: center;">
                                        <img style="width: 60px; height: 60px; margin-right: 10px" src=${summary.episode.publication.imageurl} />
                                        <div>
                                            <a href=https://gistifier.vercel.app/summaries/${summary.id}>
                                            <h2 style="margin: 0; padding: 0">${summary.episode.title}</h1>
                                            </a>
                                            <h3 style="margin: 0; padding: 0">${summary.episode.publication.title}</h2>
                                        </div>
                                    </span>
                                    <ul>
                                    ${summary.content.takeaways.map((takeaway) => {
                                        return `<li>${takeaway}</li>`
                                    }).join("\n")}
                                    </ul>
                                    `
                                    )
                                }).join("\n")}
                                `
                           
                            }]
                    })

                    try {
                        if (summaries.length > 0) {
                            let result = await request
                            console.log("result: ", result.body)
                        }
                        return true
                    }
                    catch (err) {
                        console.log(err, err)
                        return false
                    }

                    
                }

            )

        }
        
        console.log("finished sending daily emails")
        return true
        

    }
})