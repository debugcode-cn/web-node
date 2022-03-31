// =========================================定义基本模块=======================================================
const ENV_Production = process.env.NODE_ENV === 'production';
const ServerPort = process.env.PORT;
const path = require('path');
const UUID = require("uuid");
const Koa = require('koa');
const morgan = require('koa-morgan');
const KoaBody = require('koa-body');
const cors = require('koa2-cors');
const createError = require('http-errors');
// ==========================================定义全局变量====================================================
const { CookieSession } = require('./constant')
// ==========================================引入核心模块======================================================
const Model = require(`./framework/model.js`);
const Rest = require(`./framework/api.js`);
// ============================================引入全局biz定义====================================================
global.SBiz = require(`./base/SBiz.js`);
const Bizes = require(`./framework/biz.js`);
Bizes.load();
// ===========================================引入数据库驱动管理器=====================================================
const DBManager = require(`./components/db-manager/index.js`);
// ===========================================引入socket=====================================================
const SocketIO = require(`./components/socket/socket-io`);
const WebSocket = require(`./components/socket/websocket/wss`);
// ============================================引入redis====================================================
const ClientRedis = require(`./components/db-manager/client-redis.js`);
const RedisBiz = require(`./biz/RedisBiz`);
// ================================================================================================


class ApiApp {
	/**
	 * 创建数据库链接、定义模型
	 */
	async initDatabase() {
		// no sql
		await DBManager.loadNoSql();
		Model.loadNOSQL();
		Model.defineNoSql();

		// sql
		let instance = await DBManager.loadSql();
		Model.loadSQL();
		Model.defineSql(instance);
	}
	
	async initRedis() {
		global.DB_Redis = await ClientRedis.getClient();
	}

	async createDefaultApp() {
		await this.initDatabase();
		await this.initRedis();

		const app = new Koa({
			keys: CookieSession.CookieKeys
		});
		app.on('error', (err, ctx) => {
			console.error('Oh~Oh~Oh!!!! Find An Error Inner Api')
			console.error(err)
		});
		
		app.use(cors());
		app.use(morgan('short'));
		app.use(RedisBiz.loadSessionFromRedis());
		app.use(KoaBody({
			multipart: true,
			encoding: 'utf-8',
			formidable: {
				uploadDir: './src/assets/uploaded',
				keepExtensions: true,
				maxFieldsSize: 5 * 1024 * 1024,
				onFileBegin: (name, file) => {
					console.log(name, file)
					// console.log('onFileBegin', name, file)
					//TODO file.path = '/data/www/web-node/upload/upload_8test.jpg';//此处可以修改file来做修改的，比如按照年/月/日创建层级目录
				}
			}
		}));

		app.use(Rest.restify());
		app.use(Rest.routes());

		this.app = app;

		this.start();
		this.startSocket();

		process.on('uncaughtException', this.stop)
		process.on('SIGINT', this.stop)
	}

	start() {
		this.http_server = this.app.listen(ServerPort, () => {
			console.log('api 127.0.0.1:' + ServerPort + ' 启动完成！进程号：' + process.pid)
		});
	}

	startSocket() {
		new SocketIO().listen(10099);
	}

	stop(sth) {
		setTimeout(() => {
			console.log('【Api Server Stopped】', sth)
			process.exit(0);
		})
	}
}

new ApiApp().createDefaultApp()