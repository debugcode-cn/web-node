const createError = require('http-errors');
const UUID = require('uuid');
const { CookieSession } = require('../constant');
const UserBiz = require('./User.biz');

class RedisBiz {
    static loadSessionFromRedis() {
        return async (ctx, next) => {
            let session_id = ctx.cookies.get(CookieSession.session_name, {
                signed: true,
            });
            await new Promise((resolve, reject) => {
                if (!session_id) {
                    return resolve();
                }
                //获取session_id
                global.DB_Redis.hmget(session_id, 'user_id', 'user_name', (err, session) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(session);
                    }
                });
            }).then(async (session) => {
                let user_id = Array.isArray(session) && session[0] || '';
                let user_name = Array.isArray(session) && session[1] || '';
                if (user_id) {
                    let user = await UserBiz.getUser(user_id);
                    if (user) {
                        global.User = user;
                        ctx.state.User = user.get({ plain: true });
                    } else {
                        delete global.User;
                        delete ctx.state.User;
                    }
                } else {
                    session_id = 'sid_' + UUID.v1().replace(/-/g, ''); //生成新的
                    user_id = session_id;
                }

                let trans = await global.DB_Redis.multi();
                await trans.hset(session_id, 'user_id', session_id);
                await trans.hset(session_id, 'user_name', user_name);
                await trans.expire(session_id, CookieSession.SessionExpire);
                await trans.exec((err, result) => {
                    console.log(err, result);
                });
                global.session = session;
                ctx.cookies.set(CookieSession.session_name, session_id, {
                    signed: true,
                });
            }).catch((err) => {
                throw createError(
                    500,
                    'session start error:' + err.message,
                    {
                        expose: true,
                    }
                );
            });
            await next();
        };
    }
}

module.exports = RedisBiz;

class RedisCluster {
    constructor() {
        this.config = [];
    }
    createCluster() {
        return;
    }
}
// const Execed = require.main === module
// console.log(Execed)
// console.log(redis.createCluster)
