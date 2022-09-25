
const createError = require('http-errors');
const Router = require('koa-router');
const JWT = require('jsonwebtoken');

const { CookieSession, Jwtkey } = require('../../constant');
const UserModel = require('../../model/user.mysql');
const UserBiz = require('../../biz/User.biz');

const router = new Router({
    prefix: '/user',
});

// 用户：注册
router.post('/signup', async (ctx, next) => {
    const body = ctx.request.body;
    let email = String(body.email || '').trim();
    let password = String(body.password || '').trim();
    let timestamp = new Date().getTime();
    if (!email || !password) {
        return ctx.restError('params less');
    }
    let user = await UserModel.findOne({ where: { email: email } });
    if (user) {
        console.log('findOne user', user.getDataValue('password'), user.get({ plain: true }));
        return ctx.restError('邮箱已存在');
    }
    user = await UserModel.create({
        namenick: 'User' + timestamp,
        email: email,
        password: password,
    });
    let user_plain = user.get({
        plain: true,
    });
    ctx.json(user_plain);
    console.log('user_plain', user_plain);
    await next();
});

// 用户：登录
router.post('/signin', async (ctx, next) => {
    const body = ctx.request.body;
    let email = String(body.email || '').trim();
    let password = String(body.password || '').trim();
    if (!email || !password) {
        return ctx.restError('用户不存在或密码错误');
    }
    // 校验用户存在否
    let user = await UserModel.findOne({ where: { email: email }, });
    if (!user) {
        return ctx.restError('用户不存在或密码错误');
    }
    // 校验密码正确否
    if (!UserBiz.verifyPassword(user, password)) {
        return ctx.restError('用户不存在或密码错误');
    }
    let user_plain = user.get({ plain: true });
    let token = JWT.sign({ user_id: user_plain.id }, Jwtkey, { expiresIn: '30d' });
    console.log(token);
    ctx.json({ user: user_plain, authorization: 'Bearer ' + token });
    await next();
});

router.get('/signout', async (ctx, next) => {
    if (!session || !session.user_id) {
        throw createError(400, '错误请求');
    }
    let user = await UserModel.findByPk(parseInt(session.user_id));
    if (user) {
        let user_plain = user.get({ plain: true });
        DB_Redis.expire(session.id, 0);
        ctx.cookies.set(CookieSession.session_name, '', {
            signed: true,
            expires: 0,
        });
        session = null;
        delete ctx.state.User;
        ctx.redirect('/');
    } else {
        throw createError(400, '用户不存在或密码错误');
    }
    await next();
});

module.exports = router;
