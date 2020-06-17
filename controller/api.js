
module.exports = {
    "GET /api/test":async (ctx, next) => {
        ctx.rest({name:'wlz','test':true,'api':'test'});
    },
    "GET /api/test1":async (ctx, next) => {
        ctx.rest({name:'wlz','test':true,'api':'test1'});
    },
    "GET /api/test2":async (ctx, next) => {
        ctx.rest({name:'wlz','test':true,'api':'test2'});
    },
    "GET /api/testerr":async (ctx, next) => {
        ctx.restError('test:testerr','测试错误接口1');
    }
}