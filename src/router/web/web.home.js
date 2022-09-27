const Router = require('koa-router');
const router = new Router();
const PetMongo = require('../../model/pet.mongo');

router.get('/', async (ctx, next) => {
    try {
        ctx.state.where = {
            is: 'adc',
        };
        let pet = await PetMongo.findById("63333c8adb7ec2fc2de2e0e8");
        await ctx.render('index.html', {
            test: { time: new Date().getTime(), password: pet.password },
            password: pet.password,
            axss_link: "javascript:alert(456)"
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
