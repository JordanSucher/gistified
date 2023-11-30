export const maxDuration = 300;


import OpenAI from "openai";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Set the ffmpeg path if not in dev
if (process.env.VERCEL_ENV !== "development") {
    ffmpeg.setFfmpegPath("@/app/lib/ffmpeg");
}


export async function generateTranscriptWithWhisper(url) {
    try {
        const response = await fetch(url);
        let abuffer = await response.arrayBuffer();
        let buffer = Buffer.from(abuffer);
        let randomprefix = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const inputFilePath = '/tmp/' + randomprefix + 'input.mp3'; // Temporary file path
        const outputFilePath = '/tmp/' + randomprefix + 'output-%03d.mp3'; // Output file pattern

        fs.writeFileSync(inputFilePath, buffer);
        abuffer = null;
        buffer = null;

        // Split the file into segments
        await new Promise((resolve, reject) => {
            ffmpeg(inputFilePath)
                .output(outputFilePath)
                .outputOptions(["-f segment", "-segment_time 300", "-c copy"])
                .on("error", (error)=> {
                    console.log("Segmentation error: ", error, error.message);
                    reject()
                })
                .on("end", () => {
                    console.log("Segmentation complete");
                    resolve ();
                })
                .run();
        });

        // Process each segment
        let transcript = "";
        for (let i = 0; fs.existsSync(`/tmp/${randomprefix}output-${i.toString().padStart(3, '0')}.mp3`); i++) {
            const segmentPath = `/tmp/${randomprefix}output-${i.toString().padStart(3, '0')}.mp3`;
            const file = fs.createReadStream(segmentPath);

            console.log("file loaded: ", segmentPath);

            const transcriptionResponse = await openai.audio.transcriptions.create({
                file: file,
                model: "whisper-1",
            });

            console.log("transcription chunk: ", transcriptionResponse.text);
            transcript += transcriptionResponse.text;

            // clean up memory
            fs.unlinkSync(segmentPath);

        }

        console.log("transcript: ", transcript);

        // clean up memory
        fs.unlinkSync(inputFilePath);

        return transcript;


    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function getTranscriptSummary(text) {

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview",
            messages: [
                {
                    role: "system", 
                    content: `
                    You are an insightful and succinct podcast summarizer. Please summarize the provided transcript in 500 words or less, with the idea of the "pareto principle" in mind - provide 80% of the value with 20% of the length. 

Correct any misspellings in the transcript, especially misspelled names.

Generate 3 sections:

Key Takeaways (provide 5-10)

Quotes (pick 3 of the most interesting or surprising, provide no commentary, specify who said them. Wrap the quote in single quotes)

Summary (break into short paragraphs)

Reply in a JSON string and nothing else: {takeaways: [1,2,3,4...], quotes: [1,2,3...], summary: [paragraph1, paragraph2...]}`},
                {
                    role: "user",
                    content: text
                }],
            max_tokens: 4096,
        })

        return response.choices[0].message.content
    } catch (error) {
        console.log(error);
        return null
    }
}