const {Op, Model} = require('sequelize');
const util = require('util');

const Router = require('koa-router')
const router = new Router({
    prefix: ''
});
router.get('/test', async (ctx, next) => {
    try{
        // let user = await ctx.UserBiz.create(Date.now());
        ctx.state.where = {
            'is':'adc'
        }
        await ctx.render('index.html',{test:{time:new Date().getTime()}});
    }catch(e){
        ctx.response.body = e.message;
    }
    await next();
});
router.get('/wechat', async (ctx, next) => {
    try{
        // let user = await ctx.UserBiz.create(Date.now());
        ctx.state.where = {
            'is':'adc'
        }
        await ctx.render('index.html',{test:{time:new Date().getTime()}});
    }catch(e){
        ctx.response.body = e.message;
    }
    await next();
});
router.get('/testmongodb', async (ctx, next) => {
    try{
        let ttt = new userSchema({name:'ttt'});
        let rrr = await ttt.save();
        ctx.response.body = JSON.stringify({name:ttt.name,'test111':true,'api':'testmongodb'});
    }catch(e){
        ctx.response.body = e.message;
    }
    await next();
});

module.exports = router;