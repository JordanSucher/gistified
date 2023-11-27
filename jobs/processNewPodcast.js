import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "../trigger";
import { getLatestEpisodes } from "../app/lib/rss";
import { generateTranscriptWithWhisper, getTranscriptSummary } from "../app/lib/openai";
import { saveToBlobStorage, upsertEpisode, upsertSummary, doesTranscriptExist, 
    getTranscriptUrlFromEpisode } from "../app/lib/data";

client.defineJob({
    id: "new-podcast",
    name: "Process new podcast",
    version: "0.0.1",
    trigger: eventTrigger({
        name: "newpod.event",
    }),
    
    run: async (payload, io, ctx) => {
        // Extract rssFeedUrl from payload
        const { rssFeedUrl } = payload;

        // Use getLatestEpisodes to get a list of 3 MP3 URLs
        const episodes = await getLatestEpisodes(rssFeedUrl);
        // const mp3Urls = episodes.map(episode => episode.url);
        // const episodes = [{url: 'https://dcs.megaphone.fm/NPR3473178103.mp3?e=1197954683&key=aba2f830cbe3f90625553d4d668fe70f&p=510289&request_event_id=5b30dc05-9d40-4d69-a257-21c8688b621d&size=25442056&t=podcast', title: 'Planet Money Episode', description: 'Test description', pubDate: '2022-06-08T00:00:00+00:00'}];

        // Process each MP3 URL
        for (const episode of episodes) {

            await io.runTask(
                "process-episode",
                async () => {
                    let url = episode.url
                    let title = episode.title
                    let description = episode.description
                    let pubdate = episode.pubDate
        
                    // add episode to DB
                    let episodeRecord = await upsertEpisode(rssFeedUrl, url, pubdate, title, description);
        
                    // check if transcript exists
                    const transcriptExists = await doesTranscriptExist(url);
                
                    if (!transcriptExists) {
                        // trigger lambda to generate transcript

                    } else {
                        // do nothing?
                    }                    
                }
            )
        }

        // Handle completion or additional steps
        await io.logger.info("Podcast processing completed successfully.");
    }

})