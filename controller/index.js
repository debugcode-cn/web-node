const {Op} = require('sequelize');
const path = require('path');

module.exports = {
    "GET /":async ( ctx, next )=>{
        try{
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
    }

}