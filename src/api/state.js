
const Router = require('koa-router')
const router = new Router({
    prefix: '/api/state'
});
router.get('/test', async (ctx, next) => {
    ctx.state.index = 1;
    console.log(1,ctx.state)
    ctx.json({
        done:true
    })
    console.log('next ', next.toString())
    let result = await next();
    console.log('result', result)
});
router.get('/test', async (ctx, next) => {
    console.log(2,ctx.state)
    let result = await next();
    console.log('result', result)
    return 'test1';
});
router.get('/test', async (ctx, next) => {
    console.log(3,ctx.state)
    await next();
    return 'test2';
});

module.exports = router;