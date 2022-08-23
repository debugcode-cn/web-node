// TODO 使用 redis-connect
// cookie session cache(redis)
// set session_nid and set User;
const createError = require('http-errors');
const UUID = require('uuid');
const { CookieSession } = require('../constant');

class RedisBiz {
    static loadSessionFromRedis() {
        return async (ctx, next) => {
            let session_id = ctx.cookies.get(CookieSession.session_name, {
                signed: true,
            });
            await new Promise((resolve, reject) => {
                if (!session_id) {
                    resolve();
                } else {
                    //获取session_id
                    global.DB_Redis.hgetall(session_id, (err, session) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(session);
                        }
                    });
                }
            })
                .then(async (session) => {
                    if (session) {
                        let user = await UserBiz.getUser(session.user_id);
                        if (user) {
                            global.User = user;
                            ctx.state.User = user.get({ plain: true });
                        } else {
                            delete global.User;
                            delete ctx.state.User;
                        }
                    } else {
                        session_id = 'sid_' + UUID.v1().replace(/-/g, ''); //生成新的
                        session = {
                            id: session_id,
                            utm: 'search',
                        };
                    }
                    DB_Redis.hset(session_id, session);
                    DB_Redis.expire(session_id, CookieSession.SessionExpire);

                    global.session = session;
                    ctx.cookies.set(CookieSession.session_name, session_id, {
                        signed: true,
                    });
                })
                .catch((err) => {
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
