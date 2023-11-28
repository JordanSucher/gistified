import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { getLatestEpisodes } from "../app/lib/rss";
import { getTranscriptSummary } from "../app/lib/openai";
import { upsertEpisode, doesTranscriptExist } from "../app/lib/data";


client.defineJob({
    id: "create-summary",
    name: "Create summary",
    version: "0.0.1",
    trigger: eventTrigger({
        name: "createSummary.event",
    }),

    run: async (payload, io, ctx) => {

        await io.runTask(
            "create-summary",
            async () => {
                // will receive an episode url and a transcript url
                let { episodeUrl, transcriptUrl } = payload;

                console.log("episodeUrl", episodeUrl)
                console.log("transcriptUrl", transcriptUrl)
        
                let episode = await prisma.episode.findFirst({
                    where: {
                        url: episodeUrl
                    }
                })
        
                // create a placeholder summary record
                let summaryRecord = await prisma.summary.create({
                    data: {
                        episodeId: episode.id,
                        status: 'processing',
                        content: ""
                    }
                })
        
                let transcript = await fetch(transcriptUrl).then(res => res.text())

                console.log("transcript", transcript.slice(0, 100))
                                
                let summary = await getTranscriptSummary(transcript)

        
                // update summary record
                await prisma.summary.update({
                    where: {
                        id: summaryRecord.id
                    },
                    data: {
                        content: summary,
                        status: 'published'
                    }
                })
            
                await io.logger.info("Summary created for episode " + episode.title)

            }
            )

    }
})