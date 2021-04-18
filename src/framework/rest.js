
const fs = require('fs');
const path = require('path');

const Router = require('koa-router')
let router = new Router();

module.exports = {
    restify: () => {
        return async (ctx, next) => {
            // 是否是REST API前缀?
            if (ctx.request.path.startsWith('/api/')) {
                // 绑定rest()方法:
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                ctx.restError = (code,message) => {
                    code = code || 'internal:unknown_error';
                    message = message || '';
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code,
                        message
                    }
                }
            }
            await next();
        }
    },
    routes:()=>{
        require(`${__dirname}/../rest/index.js`).map((subrouters,i)=>{
            router.use(subrouters.routes()).use(subrouters.allowedMethods());
        })
        return router.routes();
    }
}