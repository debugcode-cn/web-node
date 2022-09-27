'use strict';
const secretOrPublicKey = 'debugcode.cn.wanglei';//salt
const Jwt = require('jsonwebtoken');
const Router = require('koa-router');
const Auth = require('../../middleware/auth/index');
const router = new Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const PetMongo = require('../../model/pet.mongo');

{
    router.get('/test', async (ctx, next) => {
        let time = Date.now();
        let index = new ObjectId().toString();
        console.log('::' + index + '::AAAAA');
        await new Promise((resolve, reject) => {
            console.log('::' + index + '::BBBBB');
            setTimeout(resolve, 1);
        });
        await PetMongo.create({
            name: "String",
            namenick: "String",
            email: "String",
            password: "String"
        });
        console.log('::' + index + '::CCCCCC');
        ctx.json({ name: 'wlz', test: true, api: 'test', time });
        await next();
    });

    router.get('/test/err', async (ctx, next) => {
        console.log(0x0);
        ctx.restError('test:testerr 测试错误接口1');
        console.log(111);
        await next();
    });
    router.get('/test/mongodb', async (ctx, next) => {
        let user = new UserSchema({ name: 'ttt' });
        let rrr = await user.save();
        console.log(typeof rrr, rrr);
        ctx.json({ name: user.name, test111: true, api: 'testmongodb' });
        await next();
    });

    router.post('/test/post:id?', async (ctx, next) => {
        let request = ctx.request;
        let query = request.query;
        let body = request.body;
        let params = request.params;
        console.log(query, body, params);
        ctx.json({ query, body, params });
        await next();
    });
}

{
    router.get('/state/test:index?', async (ctx, next) => {
        ctx.state.index = 1;
        console.log(1, ctx.state.session);
        ctx.json({
            done: true,
        });
        let result = await next();
        console.log('result 1', result);
    });
    router.get('/state/test:index', async (ctx, next) => {
        console.log(2, ctx.state.session);
        ctx.state.index = 2;
        let result = await next();
        await new Promise((resolve, reject) => {
            console.log('result 2', result);
            resolve();
        }).then(() => {
            console.log('result---');
        });
        return 'test1';
    });
    router.get('/state/test:index', async (ctx, next) => {
        console.log(3, ctx.state.session);
        await next();
        return 'test2';
    });
}

{
    router.post('/test/jwt', Auth.authorization(), async (ctx, next) => {
        ctx.json({ state: ctx.state });
        await next();
    });
}


module.exports = router;
