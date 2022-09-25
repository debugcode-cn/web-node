const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx, next) => {
    try {
        ctx.state.where = {
            is: 'adc',
        };
        await ctx.render('index.html', {
            test: { time: new Date().getTime() },
        });
    } catch (e) {
        ctx.response.body = e.message;
    }
    await next();
});

// testcookie
router.get('/test', async (ctx, next) => {
    ctx.set('Set-Cookie', 'foo=bar; Path=/; HttpOnly;maxAge:0');
    ctx.cookies.set('name', 'tobi', { signed: true });
    ctx.response.body = 'ok';
    await next();
});

module.exports = router;
