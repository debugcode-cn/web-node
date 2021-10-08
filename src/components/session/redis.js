const createError = require('http-errors');
const UUID = require("uuid");

// cookie session cache(redis)
// set session_nid and set User;

module.exports = loadSessionFromRedis = ()=>{
    return async (ctx, next)=>{
        let session_id = ctx.cookies.get(session_name, {signed:true});
        await new Promise((resolve, reject)=>{
            if(!session_id){
                resolve();
            }else{
                //获取session_id
                DB_Redis.getClient().hgetall(session_id, (err, session)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(session);
                    }
                })
            }
        }).then(async (session)=>{
            if(session){
                let user = await UserBiz.getUser(session.user_id);
                if(user){
                    global.User = user;
                    ctx.state.User = user.get({plain:true});
                }else{
                    delete global.User
                    delete ctx.state.User
                }
            }else{
                session_id =  'sid_' + UUID.v1().replace(/-/g,''); //生成新的
                session = {
                    id : session_id,
                    utm : 'search'
                }
            }
            DB_Redis.getClient().hmset(session_id, session);
            DB_Redis.getClient().expire(session_id, SessionExpire );
    
            global.session = session;
            ctx.cookies.set(session_name, session_id, { signed: true });
    
        }).catch((err)=>{
            throw createError(500, 'session start error:'+err.message, {expose:true});
        })
        await next();
    }
}