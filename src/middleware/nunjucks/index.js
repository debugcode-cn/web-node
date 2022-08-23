/**
 * 渲染模板中间件
 */
const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    let autoescape = opts.autoescape === undefined ? true : opts.autoescape;
    let noCache = opts.noCache || false;
    let watch = opts.watch || false;
    let throwOnUndefined = opts.throwOnUndefined || false;
    let floader = new nunjucks.FileSystemLoader(path, {
        noCache: noCache,
        watch: watch,
    });
    let env = new nunjucks.Environment(floader, {
        autoescape: autoescape,
        throwOnUndefined: throwOnUndefined,
    });
    if (opts.filters) {
        for (let f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

module.exports = (path, opts) => {
    const env = createEnv(path, opts);
    return async (ctx, next) => {
        ctx.render = function (view, model) {
            ctx.response.body = env.render(view, { ...ctx.state, ...model });
            ctx.response.type = 'text/html';
        };
        await next();
    };
};
