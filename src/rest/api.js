const Router = require('koa-router')

const router = new Router({
    prefix: '/api'
});

router.get('/test', async (ctx, next) => {
    ctx.rest({ name: 'wlz', 'test': true, 'api': 'test' });
    await next();
});
router.get('/test1', async (ctx, next) => {
    ctx.rest({ name: 'wlz', 'test': true, 'api': 'test1' });
    await next();
});
router.get('/test2', async (ctx, next) => {
    ctx.rest({ name: 'wlz', 'test': true, 'api': 'test2' });
    await next();
});
router.get('/testerr', async (ctx, next) => {
    ctx.restError('test:testerr', '测试错误接口1');
    await next();
});
router.get('/testmongodb', async (ctx, next) => {
    let user = new UserSchema({ name: 'ttt' });
    let rrr = await user.save();
    console.log(typeof rrr, rrr)
    ctx.rest({ name: user.name, 'test111': true, 'api': 'testmongodb' });
    await next();
});

router.post('/testpost', async (ctx, next) => {
    console.log(ctx.query, ctx.request.query, ctx.request.body)
    let body = ctx.request.body;
    console.log(body.null === null, body.bool === false)
    console.log(ctx.href)
    ctx.rest({ 'test111': true, 'path': '/api/testpost' });
    await next();
});
module.exports = router;
