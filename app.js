const path  = require('path');
const UUID = require("uuid");
const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');

global.session_name = 'session_nid';
global.CookieKeys = ['ewareartrat43tw4tfrf'];
global.ENV_Production = process.env.NODE_ENV === 'production';
global.BasePath = __dirname;
global.FrameWorkPath = path.join(BasePath, 'framework');

const Redis = require(path.join(BasePath, 'db', 'redis', 'client.js'));

const Controller = require(path.join(FrameWorkPath, 'controller.js') );
const View = require(path.join(FrameWorkPath, 'view.js') );
const Model = require(path.join(FrameWorkPath, 'model.js'));

const Rest = require(path.join(FrameWorkPath, 'rest.js') );
const createError = require('http-errors');

const app = new Koa({
	keys: CookieKeys
});

/** prebind start */
app.on('error', (err, ctx) => {
	console.error('app error',err.message)
});

/** prebind end */


/** static load start */
app.use(KoaStatic(BasePath));//建议加cdn
/** static load end */


/** header start */
app.use(async (ctx, next) => {
	const rt_start = Date.now();
	ctx.set('X-Response-Time-Start', `${rt_start}`);
	await next();
});

//加载模型对象 database(mysql|mongodb)，
//暂时不需要分开创建数据库连接与模型对象
app.use(Model.sql());
// app.use(Model.nosql());

//load redis
app.use(async (ctx, next)=>{
	if(!global.DB_Redis){
		global.DB_Redis = new Redis();
		await DB_Redis.createClient().catch((err)=>{
			throw createError(500, 'load redis error', {expose:true});
		});
	}
	await next();
});

// cookie session cache(redis)
// set session_nid and set User;
app.use(async (ctx, next)=>{
	let session_id = ctx.cookies.get(session_name, {signed:true});
	await new Promise((resolve, reject)=>{
		if(!session_id){
			resolve();
		}else{
			//获取session_id
			DB_Redis.getClient().hgetall(session_id, (err, session)=>{
				if(err){
					reject(err);
				}else{
					resolve(session);
				}
			})
		}
	}).then(async (session)=>{
		const timestamp = new Date().getTime();
		const expire = 20 * 60 * 10000;
		if(session){
			session.deadline = timestamp +  expire
			if(session.user_id){
				let user = await ModelUser.findByPk(session.user_id);
				global.User = user.get({plain:true})
				ctx.state.User = user.get({plain:true});
			}
		}else{
			session_id =  'sid_' + UUID.v1().replace(/-/g,''); //已经过期，需要生成新的
			session = {
				id : session_id,
				deadline : ''+(timestamp +  expire),
				utm : 'search'
			}
		}
		DB_Redis.getClient().hmset(session_id, session);
		global.session = session;

		//更新到期时间
		DB_Redis.getClient().expire(session_id, 20 * 60 );
		ctx.cookies.set(session_name, session_id, { signed: true });
	}).catch((err)=>{
		console.log('catch err',err)
		throw createError(500, 'session start error', {expose:true});
	})
	await next();
});


/** header end */

/** body start */
//body parse
app.use(KoaBody({
	multipart: true,
    encoding: 'utf-8',
    formidable:{
        uploadDir: path.join(BasePath, 'upload'),
        keepExtensions: true,
        maxFieldsSize: 5*1024*1024,
        onFileBegin:(name, file)=>{
			// console.log('onFileBegin', name, file)
			// file.path = '/data/www/web-node/upload/upload_8test.jpg';//此处可以修改file来做修改的，比如按照年/月/日创建层级目录
        }
	}
}));

app.use(View('view', {
    noCache: !ENV_Production,
    watch: ! ENV_Production
}));

//注册添加rest接口
app.use(Rest.restify());

app.use(Controller());

/** body end */

/** footer start */
app.use(async (ctx, next) => {
	const rt_start = ctx.response.get('X-Response-Time-Start');
	const ms = Date.now() - 1 * rt_start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
	await next();
});
/** footer end */




//HttpServer
let http_server = app.listen(9000); 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// WebSocketServer
require(path.join(BasePath,'wss.js'))(http_server);