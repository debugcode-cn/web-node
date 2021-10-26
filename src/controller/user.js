
/**
 * todo fix me
 * 注册登录页面应该具有独立的页面，不至于未登录状态和登录状态的逻辑处理重叠，比如首页会增加ctx.state.User
 */
const createError = require('http-errors');
const Router = require('koa-router')

const router = new Router({
    prefix: '/user'
});

router.post('/signup', async (ctx, next) => {
    const body = ctx.request.body;
    let email = body.email.trim();
    let password = body.password.trim();
    let timestamp = new Date().getTime();

    if (!email || !password) {
        throw createError(400, 'params less');
    }
    await UserModel.findOne({ where: { email: email } }).then(user => {
        if (user) {
            console.log('findOne user', user.get({
                plain: true
            }))
            throw createError(400, '邮箱已存在');
        }
    }).then(() => {
        return UserModel.create({
            namenick: 'User' + timestamp,
            email: email,
            password: password
        }).then(user => {
            let user_plain = user.get({
                plain: true
            });
            session.user_id = user_plain.id;
            DB_Redis.getClient().hmset(session.id, session);
            DB_Redis.getClient().expire(session.id, SessionExpire);
            ctx.redirect('/');
        }).catch((err) => {
            throw createError(500, '注册失败');
        })
    })
    await next();
});
router.post('/signin', async (ctx, next) => {
    const body = ctx.request.body;
    let email = body.email.trim();
    let password = body.password.trim();

    await UserModel.findOne({ where: { email: email, password: password } }).then(user => {
        if (user) {
            let user_plain = user.get({
                plain: true
            });
            session.user_id = user_plain.id;
            DB_Redis.getClient().hmset(session.id, session);
            DB_Redis.getClient().expire(session.id, SessionExpire);
            ctx.redirect('/');
        } else {
            throw createError(400, '用户不存在或密码错误');
        }
    });
    await next();
})
router.get('/signout', async (ctx, next) => {
    if (!session || !session.user_id) {
        throw createError(400, '错误请求');
    }
    await UserModel.findByPk(parseInt(session.user_id)).then(user => {
        if (user) {
            let user_plain = user.get({ plain: true });
            DB_Redis.getClient().expire(session.id, 0);
            ctx.cookies.set(session_name, '', { signed: true, expires: 0 });
            session = null;
            delete ctx.state.User;
            ctx.redirect('/');
        } else {
            throw createError(400, '用户不存在或密码错误');
        }
    });
    await next();
});
router.post('/consultSubmit', async (ctx, next) => {
    const request = ctx.request;

    console.log('body', request.body)
    console.log('files', request.files)

    const body = request.body || {};

    // if (!body.age) ctx.throw(400, '.age required');

    ctx.body = { age: body.age || '---' };

    await next();
});

module.exports = router;