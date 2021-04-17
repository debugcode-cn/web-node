const Needle = require('needle');
const Router = require('koa-router')
const router = new Router({
    prefix: '/sinaimg'
});
router.get('/', async (ctx, next) => {
    await Needle('get', 'https://wx4.sinaimg.cn/large/60718250ly1gflpmgpk77j20bv0bvjrp.jpg').then((res) => {
        ctx.response.type = 'image/jpg';
        ctx.response.body = res.body;
    }).catch((err) => {
        ctx.response.type = 'ico';
        ctx.response.body = fs.createReadStream('./favicon.ico');
    })
    await next();
});
module.exports = router;

