
/**
 * todo fix me
 * 注册登录页面应该具有独立的页面，不至于未登录状态和登录状态的逻辑处理重叠，比如首页会增加ctx.state.User
 */
const createError = require('http-errors');
module.exports = {
    "POST /signup": async (ctx, next)=>{
        const body = ctx.request.body;
        let email = body.email.trim();
        let password = body.password.trim();
        let timestamp = new Date().getTime();
    
        if(!email || !password){
            throw createError(400, 'params less');
        }
        await ModelUser.findOne({ where: {email: email} }).then(user => {
            if(user){
                console.log('findOne user',user.get({
                    plain: true
                }))
                throw createError(400, '邮箱已存在');
            }
        }).then(()=>{
            return ModelUser.create({
                namenick: 'User'+timestamp,
                email: email,
                password:password,
                gender: 1,
                birth: '10-01'
            }).then(user => {
                let user_plain = user.get({
                    plain: true
                });
                session.user_id = user_plain.id;
                DB_Redis.getClient().set(session.id, JSON.stringify(session));
                DB_Redis.getClient().expire(session.id, 20 * 60 );
                ctx.redirect('/');
            }).catch((err)=>{
                throw createError(500,'注册失败');
            })
        })
    },

    "POST /signin": async (ctx, next)=>{
        const body = ctx.request.body;
        let email = body.email.trim();
        let password = body.password.trim();

        await ModelUser.findOne({ where: {email: email, password: password} }).then(user => {
            if(user){
                let user_plain = user.get({
                    plain: true
                });
                session.user_id = user_plain.id;
                DB_Redis.getClient().set(session.id, JSON.stringify(session));
                DB_Redis.getClient().expire(session.id, 20 * 60 );
                ctx.redirect('/');
            }else{
                throw createError(400, '用户不存在或密码错误');
            }
        });
        await next();
    },

    "GET /signout": async (ctx, next)=>{
        if(!session.user_id){
            throw createError(400, '错误请求');
        }
        await ModelUser.findByPk(parseInt(session.user_id)).then(user => {
            if(user){
                let user_plain = user.get({plain: true});
                DB_Redis.getClient().expire(session.id, 0 );
                ctx.cookies.set(session_name, '', { signed: true , expires :0 });
                session = null;
                ctx.state.User = null;
                ctx.redirect('/');
            }else{
                throw createError(400, '用户不存在或密码错误');
            }
        });
        await next();
    },


    "POST /consultSubmit": async (ctx, next)=>{
        const request = ctx.request;
    
        console.log('body', request.body )
        console.log('files',request.files)
    
        const body = request.body || {};
    
        // if (!body.age) ctx.throw(400, '.age required');
    
        ctx.body = { age: body.age || '---' };
        
        await next();
    }
}