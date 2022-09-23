const Router = require('koa-router');

// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
// ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const router = new Router({
    prefix: '/api/stream',
});

// router.get('/influxdb', async (ctx, next) => {
//     const { url } = req.query;
//     if (url) {
//         let res = ctx.res;
//         const urlobj = new URL(url);
//         let inputOption = urlobj.protocol === 'rtsp:' ? ['-rtsp_transport', 'tcp', '-buffer_size', '102400'] : [];
//         ffmpeg(url)
//             .inputOptions(inputOption)  // 这里可以添加一些 RTSP 优化的参数
//             .on('start', function () {
//                 console.log(url, 'Stream started.');
//             }).on('codecData', function () {
//                 console.log(url, 'Stream codecData.');
//                 // 摄像机在线处理
//             }).on('error', function (err, stdout, stderr) {
//                 console.log('error: ' + err.message);
//             }).on('end', function () {
//                 console.log(url, 'Stream end!');
//                 // 摄像机断线的处理
//             }).outputOptions([
//                 '-vcodec libx264', // 使用libx264编码压缩视频 H.264/AVC（ 转H.265/HEVC）
//                 '-preset veryfast',
//                 '-crf 22',
//                 '-maxrate 1000k', // 最大视频码率容忍度
//                 '-bufsize 3000k', // 码率控制缓冲区大小
//                 '-acodec libmp3lame', // 使用libmp3lame编解码
//                 '-ac 2', // 声道数1或2
//                 '-ar 44100', // 声音的采样频率，好像PSP只能支持24000Hz
//                 '-b:a 96k' //audio bitrate
//             ])
//             .format('flv')
//             .videoCodec('copy')
//             // .noAudio()
//             .pipe(res, { end: true });

//         res.on('close', () => {
//             res.end();
//         });
//     } else {
//         res.end();
//     }
// });

module.exports = router;
