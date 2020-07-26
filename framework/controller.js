
const fs = require('fs');
const path = require('path');
const createError = require('http-errors');

module.exports = function (controller) {
    let  router = require('koa-router')();
    fs.readdirSync(path.join(BasePath , 'controller')).filter((f) => {
        return f.endsWith('.js');
    }).map((v,i)=>{
        let mapping = require(path.join(BasePath , 'controller', v) );
        for (let url in mapping) {
            if (url.startsWith('GET ')) {
                let pathname = url.substring(4);
                router.get(pathname, mapping[url]);
            } else if (url.startsWith('POST ')) {
                let pathname = url.substring(5);
                router.post(pathname, mapping[url]);
            } else {
                throw createError(500, `invalid URL: ${url}`);
            }
        }
    })
    return router.middleware();
}