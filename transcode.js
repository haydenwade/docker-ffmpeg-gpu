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



const main = () => {
    const input = `./input/untranscodedFile.ps`
    const output = `./output/${new Date().getTime()}.mp4`;

    // let options = [
    //     '-profile:v baseline',
    //     '-level 3.0',
    //     '-movflags +faststart',
    //     // '-map 0:0'
    // ];

    //mp4 - from hackathon
    let options = [
        "-vsync 0",
        "-hwaccel cuvid",
        "-c:v h264_cuvid",
        "-resize 960x540",
        "-c:a copy",
        "-c:v h264_nvenc",
        "-b:v 5M"
    ]

    ffmpeg(input).outputOptions(options)
        .on('end', () => {
            console.log('end transcode')
        })
        .on('error', (err) => {
            console.error('error transcoding:', err)
        })
        .save(output);

}
main();
