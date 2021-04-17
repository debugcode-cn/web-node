
const fs = require('fs');
const path = require('path');

const Router = require('koa-router')
let router = new Router();

module.exports = function (controller) {
    fs.readdirSync(path.join(BasePath , 'controller')).filter((f) => {
        return f.endsWith('.js');
    }).map((v,i)=>{
        let subrouters = require( path.join(BasePath , 'controller', v) );
        router.use(subrouters.routes()).use(subrouters.allowedMethods());
    })
    return router.routes();
}