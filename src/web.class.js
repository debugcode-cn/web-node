
// =========================================定义基本模块=======================================================
const path  = require('path');
const UUID = require("uuid");
const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const cors = require('koa2-cors');
const createError = require('http-errors');
// ==========================================定义全局变量====================================================
global.session_name = 'session_nid';
global.CookieKeys = ['ewareartrat43tw4tfrf'];
global.ENV_Production = process.env.NODE_ENV === 'production';
global.BasePath = __dirname;
global.FrameWorkPath = path.join(BasePath, 'framework');
global.ViewPath = path.join(BasePath,'view');

global.SessionExpire = 20 * 60;
// ==========================================引入核心模块======================================================
const Model = require(path.join(FrameWorkPath, 'model.js'));
Model.loadSQL();
Model.loadNOSQL();
const View = require(path.join(FrameWorkPath, 'view.js'));
const Controller = require(path.join(FrameWorkPath, 'controller.js'));
// ============================================引入全局biz定义====================================================
global.SBiz = require(path.join(BasePath , 'base', 'SBiz.js'));
const Bizes = require(path.join(FrameWorkPath, 'biz.js'));
Bizes.load();
// ===========================================引入数据库驱动管理器=====================================================
const DBManager = require(path.join(BasePath, 'db', 'DBManager.js'));
// ============================================引入第三方组件--redis====================================================
const LoadSessionFromRedis = require(path.join(BasePath,'components','session','redis.js'))
// ================================================================================================

class WebApp{
	
	/**
	 * 创建数据库链接、定义模型
	 */
	async loadDatabase(){
		// await DBManager.createDriver('sql')
		await DBManager.createDriver('nosql')
		// await DBManager.createClient('sql');//TODO pay attention to new client per req
		await DBManager.createClient('nosql');//TODO pay attention to new client per req
		// await Model.defineSql(DBManager.getClient('sql'));
		await Model.defineNoSql(DBManager.getClient('nosql'));
	}
	async loadRedis(){
		if(!global.DB_Redis){
			const Redis = require(path.join(BasePath, 'db', 'redis', 'client.js'));
			global.DB_Redis = new Redis();
		}
		await DB_Redis.createClient().catch((err)=>{
			throw createError(500, 'load redis error', {expose:true});
		});
	}

	async createDefaultApp(){
		const app = new Koa({
			keys: CookieKeys
		});
		app.on('error', (err, ctx) => {console.error('app error',err.message)});
		app.use(cors());
		app.use(KoaStatic(BasePath));//建议加cdn
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
		app.use(View(ViewPath, {
			noCache: !ENV_Production,
			watch: !ENV_Production
		}));
		app.use(Controller());
		this.app = app;
	}

	async run(){
		await this.loadDatabase();
		await this.loadRedis();

		let PORT = process.env.PORT || 9000 ;
		let http_server = this.app.listen(PORT,()=>{
			console.log('127.0.0.1:'+PORT+' 启动完成！')
		});
		this.http_server = http_server;

		process.on('beforeExit',()=>{
			console.log('------exited and closeDatabase-----')
			this.closeDatabase();
		})
	}
	
	// WebSocketServer
	createSocketServer(){
		require(path.join(BasePath,'components','websocket','wss.js'))(this.http_server);
	}
	
	// 关闭数据库链接，断开redis连接
	async closeDatabase(){
		// await DBManager.quitClient('sql');
		await DBManager.quitClient('nosql');
		await DB_Redis.quitClient()
		await next();
	}
	
}


let app = new WebApp();
app.createDefaultApp().then(()=>{
	app.run()
})