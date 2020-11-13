const ffmpeg = require('fluent-ffmpeg');

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
            logger.warn('audio stream corrupted');
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

        const input = `./input/m1.mp4`
        const output = `./output/${new Date().getTime()}.mp4`;


        //mp4 - from hackathon
        let outputOptions = [
            "-c:a copy",
            "-c:v h264_nvenc",
            "-b:v 5M"
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
            .on('end', () => {
                console.log('end transcode')
                hrend = process.hrtime(hrstart)
                console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
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
