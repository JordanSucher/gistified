import { cronTrigger, eventTrigger, intervalTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { getLatestEpisodes } from "../app/lib/rss";
import { getTranscriptSummary } from "../app/lib/openai";
import { upsertEpisode, upsertSummary, doesTranscriptExist, 
    getTranscriptUrlFromEpisode } from "../app/lib/data";
import AWS from "aws-sdk";
    
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2'
})


client.defineJob({
    id: "fetch-episodes",
    name: "Retrieve new episodes of all podcasts",
    version: "0.0.2",
    trigger: intervalTrigger({
        seconds: 3600,
    }),

    run: async (payload, io, ctx) => {

        const lambda = new AWS.Lambda();

        // get all publications
        let publications = await prisma.publication.findMany();

        for (const publication of publications) {

            await io.runTask(
                "process-publication-" + publication.title,
                async () => {
                    // get latest 3 episodes
                    const latestEpisodes = await getLatestEpisodes(publication.rssFeedUrl);
                    const latestThreeEpisodes = latestEpisodes.slice(0, 3);
                    
                    // check if episode already exists
                    let existingEpisodes = await prisma.episode.findMany({
                        where: {
                            url: {
                                in: latestThreeEpisodes.map((episode) => episode.url)
                            }
                        }
                    })

                    // filter out episodes that already exist
                    let existingEpisodeUrls = existingEpisodes.map((episode) => episode.url);
                    let newEpisodes = latestThreeEpisodes.filter((episode) => {
                        return !existingEpisodeUrls.includes(episode.url);
                    });

                    // add new episodes to DB
                    for (const episode of newEpisodes) {
                        await upsertEpisode(publication.rssFeedUrl, episode.url, episode.pubDate, episode.title, episode.description);
                    
                        // trigger lambda to generate transcript for episode
        
                        const params = {
                            FunctionName: "gistifier-transcript-creator",
                            InvocationType: "Event",
                            Payload: JSON.stringify({
                                url: episode.url
                            })
                        }
        
                        lambda.invoke(params, (err, data) => {
                            if (err) {
                                console.log(err, err.stack); // an error occurred
                            } else {
                                console.log("success"); // successful response
                            }
                        })
                    }
                    
                    await io.logger.info("Added "+newEpisodes.length+" new episodes for "+publication.title);
                }
            )
        }
    }
})