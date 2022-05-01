const { Op, Model } = require('sequelize');
const util = require('util');
const HE = require('he');
const createError = require('http-errors');
const Router = require('koa-router');
const router = new Router({
    prefix: '',
});
router.get('/', async (ctx, next) => {
    try {
        // let user = await ctx.UserBiz.create(Date.now());
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
router.get('/wechat', async (ctx, next) => {
    try {
        // let user = await ctx.UserBiz.create(Date.now());
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
router.get('/socketio', async (ctx, next) => {
    try {
        ctx.state.where = {
            is: 'adc',
        };
        await ctx.render('socketio.html', {
            test: { time: new Date().getTime() },
        });
    } catch (e) {
        ctx.response.body = e.message;
    }
    await next();
});

router.get('/testmongodb', async (ctx, next) => {
    try {
        let ttt = new UserSchema({ name: 'ttt' });
        let rrr = await ttt.save();
        ctx.response.body = JSON.stringify({
            name: ttt.name,
            test111: true,
            api: 'testmongodb',
        });
    } catch (e) {
        ctx.response.body = e.message;
    }
    await next();
});

router.post('/openapi/xining/alert/test', async (ctx, next) => {
    try {
        let query = ctx.query;
        let headers = ctx.headers;
        let body = ctx.request.body;
        let details = JSON.parse(HE.decode(body.details));
        console.log('value is ', details.Fields.value / 1000000, details);
        ctx.response.body = JSON.stringify({
            name: 'wl',
            test111: true,
            api: 'testmongodb',
        });
    } catch (e) {
        throw createError(400, e.message);
    }
    await next();
});

router.post('/openapi/xining/alert/test2', async (ctx, next) => {
    console.log('----------------------------------');
    try {
        let query = ctx.query;
        let headers = ctx.headers;
        let body = ctx.request.body;
        console.log('body is ', body);
        ctx.response.body = JSON.stringify({
            name: 'wl',
            test111: true,
            api: 'testmongodb',
        });
    } catch (e) {
        console.log(e);
        throw createError(400, e.message);
        // ctx.response.body = e.message;
    }
    await next();
});

module.exports = router;
