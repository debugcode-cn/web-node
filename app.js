const path  = require('path');
const UUID = require("uuid");
const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const cors = require('koa2-cors');

global.session_name = 'session_nid';
global.CookieKeys = ['ewareartrat43tw4tfrf'];
global.ENV_Production = process.env.NODE_ENV === 'production';
global.BasePath = __dirname;
global.FrameWorkPath = path.join(BasePath, 'framework');
global.SessionExpire = 20 * 60;

const PORT = process.env.PORT;

const Redis = require(path.join(BasePath, 'db', 'redis', 'client.js'));

const SessionRedis = require(path.join(BasePath,'components','session','redis.js'))

const Controller = require(path.join(FrameWorkPath, 'controller.js') );
const View = require(path.join(FrameWorkPath, 'view.js') );
const Model = require(path.join(FrameWorkPath, 'model.js'));
const Bizes = require(path.join(FrameWorkPath, 'biz.js'));

const Rest = require(path.join(FrameWorkPath, 'rest.js') );
const createError = require('http-errors');

const app = new Koa({
	keys: CookieKeys
});

app.on('error', (err, ctx) => {console.error('app error',err.message)});
app.use(cors());


app.use(async (ctx, next) => {
	ctx.set('X-Response-Time-Start', `${Date.now()}`);
	await next();
});
app.use(KoaStatic(BasePath));//建议加cdn

// load base;
app.use(async (ctx, next)=>{
	let sbiz = require(path.join(BasePath , 'base', 'SBiz' ));
	if(!global['SBiz']){
		sbiz.setCtx(ctx);
		global['SBiz'] = sbiz; // 老生代内存
	}
	await next();
});
// load biz
app.use(Bizes());

//load redis
app.use(async (ctx, next)=>{
	if(!global.DB_Redis){
		global.DB_Redis = new Redis();
	}
	await DB_Redis.createClient().catch((err)=>{
		throw createError(500, 'load redis error', {expose:true});
	});
	await next();
});

//加载模型对象 database(mysql|mongodb)，
//暂时不需要分开创建数据库连接与模型对象
app.use(Model.sql());
app.use(Model.nosql());
app.use(SessionRedis());
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
    watch: !ENV_Production
}));
//注册添加rest接口
app.use(Rest.restify());
app.use(Controller());
/** body end */

/** footer start */
app.use(async (ctx, next) => {
	const rt_start = ctx.response.get('X-Response-Time-Start');
	const ms = Date.now() - 1 * rt_start;
	console.log(`pid: ${process.pid} ; ${ctx.method} ${ctx.url} - ${ms}ms`);
	await next();
});

// 关闭链接
app.use(async (ctx, next)=>{
	if(global.DB_Redis){
		await DB_Redis.quitClient().catch((err)=>{
			throw createError(500, 'quit redis error', {expose:true});
		});
	}
	await next();
});

/** footer end */

//HttpServer
let http_server = app.listen(PORT); 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// WebSocketServer
require(path.join(BasePath,'components','websocket','wss.js'))(http_server);