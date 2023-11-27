const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI(process.env.OPENAI_API_KEY);


ffmpeg.setFfmpegPath('/opt/bin/ffmpeg');

exports.handler = async (event, context) => {
    // receive an mp3 url 
    let url = event.url;

   //grab file, split it into segments + generate transcript
   try{
       let transcript = await generateTranscriptWithWhisper(url); 
       
       // persist the transcript to vercel blob storage
       await axios.post('https://gistifier.vercel.app/api/transcript', { url, transcript });

   } catch (error) {
       console.log(error);
   }

}


async function generateTranscriptWithWhisper(url) {
    try {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(data);
        const randomprefix = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const inputFilePath = '/tmp/' + randomprefix + 'input.mp3'; // Temporary file path
        const outputFilePath = '/tmp/' + randomprefix + 'output-%03d.mp3'; // Output file pattern

        fs.writeFileSync(inputFilePath, buffer);

        // Split the file into segments

        console.log("attempting to segment: ", inputFilePath);
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

