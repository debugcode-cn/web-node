const Router = require('koa-router');
let router = new Router();

module.exports = {
	restify: () => {
		return async (ctx, next) => {
			// 是否是REST API前缀判断
			if (ctx.request.path.startsWith('/api/')) {
				ctx.json = (data = {}, code = 0, msg = 'ok') => {
					ctx.response.type = 'application/json; charset=utf-8';
					ctx.response.body = { code, msg, data };
				};
				ctx.restError = (msg = '', code = -1, status = 400) => {
					code = code || 'internal:unknown_error';
					ctx.response.status = status;
					ctx.response.type = 'application/json; charset=utf-8';
					ctx.response.body = { code, msg };
				};
			}
			await next();
		};
	},
	routes: () => {
		require(`${__dirname}/../api/index.js`).map((subrouters, i) => {
			router.use(subrouters.routes()).use(subrouters.allowedMethods());
		});
		return router.routes();
	},
};
