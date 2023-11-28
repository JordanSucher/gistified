
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { HfInference } = require('@huggingface/inference');
const fs = require('fs');

const token = `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`

const inference = new HfInference(token);
const whisper = inference.endpoint('https://rl3ysj1ua139fr4h.us-east-1.aws.endpoints.huggingface.cloud');
const url = 'https://dcs.megaphone.fm/NPR3473178103.mp3?e=1197954683&key=aba2f830cbe3f90625553d4d668fe70f&p=510289&request_event_id=5b30dc05-9d40-4d69-a257-21c8688b621d&size=25442056&t=podcast'

const main = async () => {

    const { data } = await axios.get(url, { responseType: 'arraybuffer', maxRedirects: 10 });
    const buffer = Buffer.from(data);
    
    const inputFilePath = './tmp/' + 'input.wav'; // Temporary file path
    const outputFilePath = './tmp/' + 'output-%03d.wav'; // Output file pattern

    fs.writeFileSync(inputFilePath, buffer);

    // Split the file into segments

    console.log("attempting to segment: ", inputFilePath);
    await new Promise((resolve, reject) => {
        ffmpeg(inputFilePath)
            .output(outputFilePath)
            .outputOptions(["-f segment", "-segment_time 150", "-c copy"])
            .on("error", (error)=> {
                console.log("Segmentation error: ", error, error.response.data);
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

    const maxRetries = 3; // Maximum number of retries

    for (let i = 0; fs.existsSync(`./tmp/output-${i.toString().padStart(3, '0')}.wav`); i++) {
        const segmentPath = `./tmp/output-${i.toString().padStart(3, '0')}.wav`;
        const file = fs.createReadStream(segmentPath);

        console.log("file loaded: ", segmentPath);

        let retryCount = 0;
        let transcriptionResponse;
        while (retryCount < maxRetries) {
            try {

                await fetch(
                    "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        method: "POST",
                        body: file,
                        duplex: "half",

                    }
                );
                const result = await response.json();

                console.log("result: ", result);
                transcript += transcriptionResponse;
                break; // Break the loop if the request is successful
            } catch (error) {
                console.error("Error in transcription: ", error, error.response);
                retryCount++;
                console.log(`Retrying (${retryCount}/${maxRetries})...`);
            }
        }

        if (retryCount === maxRetries) {
            console.log("Max retries reached. Skipping this segment.");
        }
    }

}

main()