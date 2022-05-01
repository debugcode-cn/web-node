const Router = require('koa-router');
let router = new Router();

module.exports = function () {
	require(`${__dirname}/../controller/index.js`).map((subrouters, i) => {
		router.use(subrouters.routes()).use(subrouters.allowedMethods());
	});
	return router.routes();
};
