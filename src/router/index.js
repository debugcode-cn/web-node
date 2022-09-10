const Router = require('koa-router');
const routerApi = new Router({ prefix: '/api' });
const routerWeb = new Router({ prefix: '/' });

const api = require('./api');
api.map(item => {
    routerApi.use(item.routes());
});

const web = require('./web');
web.map(item => {
    routerWeb.use(item.routes());
});

module.exports = { routerApi, routerWeb };
