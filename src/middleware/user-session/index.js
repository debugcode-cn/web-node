/**
 * REST API中间件：用户会话信息操作
 */

const UUID = require('uuid');
const { CookieSession } = require('../../constant');

const getSessionInfo = (session_id) => {
    return new Promise((resolve, reject) => {
        global.DB_Redis.hmget(session_id, 'user_id', 'last_vt', (err, session) => {
            if (err) {
                reject(err);
            } else {
                resolve(session);
            }
        });
    });
};

module.exports = {
    loadSessionFromRedis: () => {
        return async (ctx, next) => {
            let session_name = CookieSession.session_name;
            let session_id = ctx.cookies.get(session_name, { signed: true });
            let session = {};
            if (session_id) {
                session.session_id = session_id;
                let session_info = await getSessionInfo(session_id);
                let user_id = Array.isArray(session_info) && session_info[0] || '';
                if (user_id) {
                    session.user_id = user_id;
                }
                session.last_vt = Date.now();

                let trans = await global.DB_Redis.multi();
                await trans.hset(session_id, 'last_vt', session.last_vt);
                await trans.exec((err, result) => { console.log(err, result); });
                await global.DB_Redis.expire(session_id, CookieSession.SessionExpire);
            } else {
                session_id = 'sid_' + UUID.v1().replace(/-/g, ''); //生成新的session_id
                session.session_id = session_id;
                session.last_vt = Date.now();
            }

            ctx.state.session = session;
            ctx.cookies.set(session_name, session_id, { signed: true });

            await next();
        };
    }
};
