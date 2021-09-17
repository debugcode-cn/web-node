/**
 * {@link ctx.rest}
 */
const Router = require('koa-router')

const router = new Router({
    prefix: '/api/file'
});
router.post('/upload/:id', async (ctx, next) => {
    let body = ctx.request.body;
    let query = ctx.query;
    let params = ctx.request.params;
    console.log('params',params)
    console.log('query', query)
    console.log('body',body)
    console.log('files',ctx.request.files)
    console.log('headers',ctx.request.headers)
    // console.dir(ctx.request)
    ctx.rest({ 'path': '/api/file/upload' });
    await next();
});
router.get('/download', async (ctx, next) => {
    ctx.rest({ 'path': '/api/file/download' });
    await next();
});

module.exports = router;
