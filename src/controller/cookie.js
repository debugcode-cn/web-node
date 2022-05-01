const Router = require('koa-router');

const router = new Router({
	prefix: '/cookie',
});
// testcookie
router.get('/test', async (ctx, next) => {
	ctx.set('Set-Cookie', 'foo=bar; Path=/; HttpOnly;maxAge:0');
	ctx.cookies.set('name', 'tobi', { signed: true });
	ctx.response.body = 'ok';
	await next();
});
module.exports = router;
