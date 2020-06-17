

module.exports = {
    "GET /testcookie":async (ctx, next) => {
        ctx.set('Set-Cookie', 'foo=bar; Path=/; HttpOnly;maxAge:0');
        ctx.cookies.set('name', 'tobi', { signed: true });
        ctx.response.body = 'ok';
        await next();
    }
}