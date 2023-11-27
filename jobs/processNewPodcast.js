import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { getLatestEpisodes } from "../app/lib/rss";
import { upsertEpisode, doesTranscriptExist } from "../app/lib/data";

import AWS from "aws-sdk";

client.defineJob({
    id: "new-podcast",
    name: "Process new podcast",
    version: "0.0.1",
    trigger: eventTrigger({
        name: "newpod.event",
    }),
    
    run: async (payload, io, ctx) => {
        // Extract rssFeedUrl from payload
        const { rssFeedUrl, title } = payload;

        // Use getLatestEpisodes to get a list of 3 episodes
        const episodes = await getLatestEpisodes(rssFeedUrl);

        // Set up AWS Lambda
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: 'us-east-2'
        })

        const lambda = new AWS.Lambda();

        // Process each episode
        for (const episode of episodes) {

            await io.runTask(
                "process-episode-" + episode.title,
                async () => {
                    let url = episode.url
                    let title = episode.title
                    let description = episode.description
                    let pubdate = episode.pubDate
        
                    // add episode to DB
                    let episodeRecord = await upsertEpisode(rssFeedUrl, url, pubdate, title, description);
                          
                    // check if transcript exists
                    const transcriptExists = await doesTranscriptExist(url);
                    
                    const params = {
                        FunctionName: "gistifier-transcript-creator",
                        InvocationType: "Event",
                        Payload: JSON.stringify({
                            url
                        })
                    }
                
                    if (!transcriptExists) {
                        // trigger lambda to generate transcript
                        lambda.invoke(params, (err, data) => {
                            if (err) {
                                console.log(err, err.stack); // an error occurred
                            } else {
                                console.log("success"); // successful response
                            }
                        })
                    }                 
                }
            )

            await io.logger.info("Processed episode " + episode.title);
        }

        // Handle completion or additional steps
        await io.logger.info("Podcast processing completed for " + title);
    }

})