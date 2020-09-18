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
    },
    "GET /testBasicAuthorization": async (ctx, next) =>{
        let header_auth = ctx.get('Authorization');
        if(header_auth && header_auth.split(' ')[1]){
            let auth_key = header_auth.split(' ')[1];
            let text = Buffer.from(auth_key,'base64').toString('utf-8');
            console.log('------auth text ',text);
            let spliter_index = text.indexOf(':');
            let account = text.substring(0,spliter_index);
            let password = text.substring(spliter_index+1);
            console.log('------auth info ',account, password );
        }
        ctx.response.body = '';
        ctx.response.status  = 401;
        ctx.set('WWW-Authenticate','Basic')
        await next();
    }
}