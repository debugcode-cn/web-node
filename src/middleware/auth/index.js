
const secretOrPublicKey = 'debugcode.cn.wanglei';
const Jwt = require('jsonwebtoken');

module.exports = {
    // 用于从header authentication中解析用户信息
    authorization: () => {
        return async (ctx, next) => {
            let authorization = String(ctx.headers.authorization || '').trim().replace('Bearer ', '');
            if (!authorization) {
                return ctx.restError('缺少认证参数');
            }
            try {
                const checked = Jwt.verify(authorization, secretOrPublicKey);
                ctx.state.user = {
                    uid: checked.uid,
                };
                next();
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    // err TokenExpiredError
                    return ctx.restError('认证已过期');
                }
                // err JsonWebTokenError
                return ctx.restError('认证信息有误');
            }
        };
    },
    // 用于判断用户对目标接口的请求权限
    permission: () => {
        return async (ctx, next) => {
            // 前缀判断

            await next();
        };
    }
};