// ================================================================================================

const path  = require('path');
const UUID = require("uuid");
const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const cors = require('koa2-cors');
const createError = require('http-errors');

// ================================================================================================

global.session_name = 'session_nid';
global.CookieKeys = ['ewareartrat43tw4tfrf'];
global.ENV_Production = process.env.NODE_ENV === 'production';
global.BasePath = __dirname;
global.FrameWorkPath = path.join(BasePath, 'framework');
global.SessionExpire = 20 * 60;

// ================================================================================================

const DBManager = require(path.join(BasePath, 'db', 'DBManager.js'));
const Redis = require(path.join(BasePath, 'db', 'redis', 'client.js'));
const LoadSessionFromRedis = require(path.join(BasePath,'components','session','redis.js'))

// ================================================================================================

const Controller = require(path.join(FrameWorkPath, 'controller.js') );
const Rest = require(path.join(FrameWorkPath, 'rest.js') );
const View = require(path.join(FrameWorkPath, 'view.js') );
const Model = require(path.join(FrameWorkPath, 'model.js'));
Model.loadSQL();
Model.loadNOSQL();

// ================================================================================================

global.SBiz = require(path.join(BasePath , 'base', 'SBiz.js' ));
const Bizes = require(path.join(FrameWorkPath, 'biz.js'));
Bizes.load();

// ================================================================================================

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

// ================================================================================================

/**
 * 创建数据库链接、定义模型
 * 创建缓存链接
 */
app.use(async (ctx, next)=>{
	await DBManager.createDriver('sql')
	await DBManager.createDriver('nosql')

	await DBManager.createClient('sql');//TODO pay attention to new client per req
	await DBManager.createClient('nosql');//TODO pay attention to new client per req

	await Model.defineSql(DBManager.getClient('sql'));
	await Model.defineNoSql(DBManager.getClient('nosql'));

	await next();
});
app.use(async (ctx, next)=>{
	if(!global.DB_Redis){
		global.DB_Redis = new Redis();
	}
	await DB_Redis.createClient().catch((err)=>{
		console.log('err',err)
		throw createError(500, 'load redis error', {expose:true});
	});
	await next();
});


// ================================================================================================

/** body start */
//body parse
app.use(LoadSessionFromRedis());
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

// ================================================================================================

/** footer start */
// 关闭数据库链接，断开redis连接
// app.use(async (ctx, next)=>{
	// await DBManager.quitClient('sql');
	// await DBManager.quitClient('nosql');
	// await DB_Redis.quitClient()
	// await next();
// });

app.use(async (ctx, next) => {
	const rt_start = ctx.response.get('X-Response-Time-Start');
	const ms = Date.now() - 1 * rt_start;
	console.log(`pid: ${process.pid} ; ${ctx.method} ${ctx.url} - ${ms}ms`);
	await next();
});

/** footer end */

//HttpServer
let PORT = process.env.PORT || 80 ;
let http_server = app.listen(PORT,()=>{
	console.log('127.0.0.1:'+PORT+' 启动完成！')
}); 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// WebSocketServer
require(path.join(BasePath,'components','websocket','wss.js'))(http_server);