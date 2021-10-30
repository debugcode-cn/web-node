
// =========================================定义基本模块=======================================================
const ServerPort = process.env.PORT ;
const ENV_Production = process.env.NODE_ENV === 'production';
const path  = require('path');
const UUID = require("uuid");
const morgan = require('koa-morgan');
const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const cors = require('koa2-cors');
const createError = require('http-errors');
// ==========================================定义全局变量====================================================
global.session_name = 'session_nid';
global.CookieKeys = ['ewareartrat43tw4tfrf'];
global.SessionExpire = 20 * 60;
// ==========================================引入核心模块======================================================
const Model = require('./framework/model.js');
Model.loadSQL();
Model.loadNOSQL();
const View = require('./framework/view.js');
const Controller = require('./framework/controller.js');
// ============================================引入全局biz定义====================================================
global.SBiz = require(`./base/SBiz.js`);
const Bizes = require('./framework/biz.js');
Bizes.load();
// ===========================================引入数据库驱动管理器=====================================================
const DBManager = require(`./components/db-manager/index.js`);
// ============================================引入第三方组件--redis====================================================
const LoadSessionFromRedis = require(`./components/redis-session`)
// ============================================引入第三方组件--socket.io====================================================
const SocketIO = require(`socket.io`);
// ================================================================================================

class WebApp{
	
	/**
	 * 创建数据库链接、定义模型
	 */
	async loadDatabase(){
		await DBManager.createDriver('sql')
		await DBManager.createDriver('nosql')
		await DBManager.createClient('sql');//TODO pay attention to new client per req
		await DBManager.createClient('nosql');//TODO pay attention to new client per req
		await Model.defineSql(DBManager.getClient('sql'));
		await Model.defineNoSql(DBManager.getClient('nosql'));
	}
	async loadRedis(){
		if(!global.DB_Redis){
			const Redis = require(`./components/db-manager/client-redis.js`);
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
		app.use(morgan('dev'));
		app.use(KoaStatic('./assets/'));//建议加cdn
		app.use(LoadSessionFromRedis());
		app.use(KoaBody({
			multipart: true,
			encoding: 'utf-8',
			formidable:{
				uploadDir: './upload',
				keepExtensions: true,
				maxFieldsSize: 5*1024*1024,
				onFileBegin:(name, file)=>{
					// console.log('onFileBegin', name, file)
					// file.path = '/data/www/web-node/upload/upload_8test.jpg';//此处可以修改file来做修改的，比如按照年/月/日创建层级目录
				}
			}
		}));
		app.use(View(path.join(__dirname,'view'), {
			noCache: !ENV_Production,
			watch: !ENV_Production
		}));
		app.use(Controller());
		this.app = app;

		await this.run();
	}

	async run(){
		await this.loadDatabase();
		await this.loadRedis();
		this.http_server = this.app.listen(ServerPort,()=>{
			console.log('web 127.0.0.1:'+ServerPort+' 启动完成！')
		});
		this.createSocketServer();

		process.on('beforeExit', (code)=>{
			console.log('---beforeExit code---', code)
			this.closeDatabase();
		})
		process.on('uncaughtException', (err)=>{
			console.log('---uncaughtException err---', err)
			this.closeDatabase();
		})
		process.on('SIGINT', (err)=>{
			console.log('---SIGINT err---', err)
			this.closeDatabase();
		})
	}
	
	createSocketServer(){
		const sio = new SocketIO.Server(this.http_server);
		sio.on('connection', (socket) => {
			console.log('----web-server--socket-connected---socket.id', socket.id)
		}).on('data', (data)=>{
			console.log('----web-server--socket-data', data)
		})
		sio.of('namespace2').on('connection', (socket)=>{
			console.log('----web-server--namespace2-connected---socket.id', socket.id)
		}).on('data', (data)=>{
			console.log('----web-server--namespace2-data', data)
		})
		// require(`./components/websocket/wss.js`)(this.http_server);//TODO remove me
	}
	
	// 关闭数据库链接，断开redis连接
	async closeDatabase(){
		await DBManager.quitClient('sql');
		await DBManager.quitClient('nosql');
		await DB_Redis.quitClient()
	}
}


new WebApp().createDefaultApp()