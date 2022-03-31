const Router = require('koa-router')
const Stream = require('stream')
const router = new Router({
    prefix: '/api/stream'
});

router.get('/influxdb', async (ctx, next) => {
    const readStream = new Stream.Readable();
    setInterval(() => {
        readStream.write(Buffer.from(''+new Date().getTime()), 'utf8')
    }, 3000)
    ctx.body = readStream;
});

module.exports = router;
