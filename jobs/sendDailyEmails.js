import { cronTrigger, eventTrigger, intervalTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { getLatestEpisodes } from "../app/lib/rss";
import { getTranscriptSummary } from "../app/lib/openai";
import { upsertEpisode, upsertSummary, doesTranscriptExist, 
    getTranscriptUrlFromEpisode } from "../app/lib/data";
import AWS from "aws-sdk";
import { sourceMapsEnabled } from "process";
import Mailjet from 'node-mailjet';


client.defineJob({
    id: "send-daily-emails",
    name: "Send emails",
    version: "0.0.1",
    trigger: cronTrigger({
        cron: "0 8 * * *",
    }),

    run: async (payload, io, ctx) => {
        
        // get all users with daily subscriptions
        let users = await prisma.user.findMany({
            where: {
                emailPreference: "daily"
            }
        })

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
                                }
                            }
                        },
                        include: {
                            episode: {
                                include: {
                                    publication: {
                                        include: {
                                            subscriptions: {
                                                where: {
                                                    userId: user.id
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })

                    summaries = summaries.map((summary) => {
                        return {
                            ...summary,
                            content: JSON.parse(summary.content)
                        }
                    })
                    console.log("summaries: ", summaries)


                    const request = mailjet.post('send', {'version': 'v3.1'})
                    .request({
                        "Messages":[
                            {
                                "From": {
                                    "Email": "jsucher@gmail.com",
                                    "Name": "Gistifier"
                                },
                                "To": [
                                    {
                                        "Email": user.email,
                                        "Name": user.name
                                    }
                                ],
                                "Subject": "Gistifier Daily Summary",
                                "TextPart": "Gistifier Daily Summary",
                                "HTMLPart":
                                `
                                ${summaries.map((summary) => {
                                    return (
                                    `
                                    <a href=https://gistifier.vercel.app/summaries/${summary.id}>
                                    <h1>${summary.episode.title}</h1>
                                    </a>
                                    <h2>${summary.episode.publication.title}</h2>
                                    ${summary.content.takeaways.map((takeaway) => {
                                        return `<p>${takeaway}</p>`
                                    }).join("\n")}
                                    `
                                    )
                                }).join("\n")}
                                `
                           
                            }]
                    })

                    request.then((result) => {
                        console.log(result.body)
                    })
                    .catch((err) => {
                        console.log(err, err.statusCode)
                    })

                    return true
                }

            )

        }
        
        return true

    }
})