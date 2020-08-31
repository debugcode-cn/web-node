const {Op, Model} = require('sequelize');
const util = require('util');

module.exports = {
    "GET /":async ( ctx, next )=>{
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
    },
    "GET /wechat":async ( ctx, next )=>{
        try{
            await ctx.render('wechat.html',{});
        }catch(e){
            ctx.response.body = e.message;
        }
        await next();
    },
    "GET /testmongodb": async (ctx, next) =>{
        try{
            let ttt = new userSchema({name:'ttt'});
            let rrr = await ttt.save();
            ctx.response.body = JSON.stringify({name:ttt.name,'test111':true,'api':'testmongodb'});
        }catch(e){
            ctx.response.body = e.message;
        }
        await next();
    }
}