/**
 * REST API中间件
 */
module.exports = () => {
    return async (ctx, next) => {
        // 前缀判断
        if (ctx.request.path.startsWith('/api/')) {
            ctx.json = (data = {}, code = 200, msg = 'ok') => {
                ctx.response.type = 'application/json; charset=utf-8';
                ctx.response.body = { code, msg, data };
            };
            ctx.restError = (msg = '', code = -1, status = 400) => {
                code = code || 'internal:unknown_error';
                ctx.response.status = status;
                ctx.response.expose = true;
                ctx.response.type = 'application/json; charset=utf-8';
                ctx.response.body = { code, msg };
            };
        }
        await next();
    };
};