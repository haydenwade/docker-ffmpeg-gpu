const ffmpeg = require('fluent-ffmpeg');
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config = {
    accessKeyId: process.env.AWS_AKI,
    secretAccessKey: process.env.AWS_SAK,
    region: 'us-east-1',
    maxRetries: 3,
  };

// const ffmpegPath = '/usr/local/app/dependencies/linux/ffmpeg';
// const ffprobePath = '/usr/local/app/dependencies/linux/ffprobe';

// const ffmpegPath = './dependencies/linux/ffmpeg';
// const ffprobePath = './dependencies/linux/ffprobe';

// const ffmpegPath = '/usr/local/bin/ffmpeg';
// const ffprobePath = '/usr/local/bin/ffprobe';

//aws
const ffmpegPath = '/usr/bin/ffmpeg';
const ffprobePath = '/usr/bin/ffprobe';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const enrichTranscodeOptions = (streams = [], options) => {
    let newOptions = options.concat([]);//clone it

    for (let index = 0; index < streams.length; index++) {
        const item = streams[index];
        if (item.codec_type == 'audio' && item.channels == 0) {
            console.warn('audio stream corrupted');
            continue;
        }
        newOptions.push(`-map 0:${item.index}`)
    }

    return newOptions;
}

const getFileMetadata = (filePath) => new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
            return reject(new Error(err));
        }
        return resolve({ metadata });
    });
});

const main = async () => {
    try {
        var hrstart = process.hrtime()

        const input = `./input/80.ps`
        const fileName = `${new Date().getTime()}.mp4`
        const output = `./output/${fileName}`;


        let outputOptions = [
            "-c:a copy",
            "-c:v h264_nvenc",
            "-b:v 5M",
            // '-profile:v baseline',
            // '-level 3.0',
            // '-movflags +faststart',
            // `-s 960x540`
        ]

        let inputOptions = [
            "-vsync 0",
            "-hwaccel cuvid",
            "-c:v h264_cuvid",
            // "-resize 960x540",
        ]


        const fileMetadata = await getFileMetadata(input);

        const additionalOutputOptions = enrichTranscodeOptions(fileMetadata.metadata.streams, outputOptions)

        ffmpeg(input).inputOptions(inputOptions).outputOptions(additionalOutputOptions)
            .on('end', async() => {
                console.log('end transcode')
                hrend = process.hrtime(hrstart)
                console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
            
                console.log('uploading')
                const bodyStream = fs.createReadStream(output);
                const data = {
                    Key: fileName,
                    Body: bodyStream,
                    ContentType: 'video/mp4',
                    ContentDisposition : 'attachment'
                  };
                  const s3 = new AWS.S3({ params: { Bucket: 'hw-temp' } });
                  await s3.putObject(data).promise();
                  console.log('done uploading')
            })
            .on('error', (err) => {
                console.error('error transcoding:', err)
            })
            .save(output);

           
    }
    catch (err) {
        console.log(err);
    }
}
main();
