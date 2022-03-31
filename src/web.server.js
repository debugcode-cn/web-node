
// =========================================定义基本模块=======================================================
const ServerPort = process.env.PORT;
const ENV_Production = process.env.NODE_ENV === 'production';
const path = require('path');
const UUID = require("uuid");
const morgan = require('koa-morgan');
const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const cors = require('koa2-cors');
const createError = require('http-errors');
// ==========================================定义全局变量====================================================
const { CookieSession } = require('./constant');
// ==========================================引入核心模块======================================================
const Model = require('./framework/model.js');
const View = require('./framework/view.js');
const Controller = require('./framework/controller.js');
// ============================================引入全局biz定义====================================================
global.SBiz = require(`./base/SBiz.js`);
const Bizes = require('./framework/biz.js');
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

class WebApp {
	/**
	 * 创建数据库链接、定义模型
	 */
	async initDatabase() {
		await DBManager.loadNoSql();
		Model.loadNOSQL();
		Model.defineNoSql();

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
			console.error('Oh~Oh~Oh!!!! Find An Error Inter Web')
			console.error(err)
		});

		app.use(cors());
		app.use(morgan('dev'));
		app.use(KoaStatic('./assets/'));//建议加cdn
		app.use(RedisBiz.loadSessionFromRedis());
		app.use(KoaBody({
			multipart: true,
			encoding: 'utf-8',
			formidable: {
				uploadDir: './upload',
				keepExtensions: true,
				maxFieldsSize: 5 * 1024 * 1024,
				onFileBegin: (name, file) => {
					// console.log('onFileBegin', name, file)
					//TODO file.path = '/data/www/web-node/upload/upload_8test.jpg';//此处可以修改file来做修改的，比如按照年/月/日创建层级目录
				}
			}
		}));

		app.use(View(path.join(__dirname, 'view'), {
			noCache: !ENV_Production,
			watch: !ENV_Production
		}));

		app.use(Controller());

		this.app = app;

		this.start();
		this.startSocket();

		process.on('uncaughtException', this.stop)
		process.on('SIGINT', this.stop)

	}

	start() {
		this.http_server = this.app.listen(ServerPort, () => {
			console.log('web 127.0.0.1:' + ServerPort + ' 启动完成！')
		});
	}

	startSocket() {
		new SocketIO().bindWeb(this.http_server);
	}

	createWebSocketServer(){
		require(`./components/socket/websocket/wss`)(this.http_server);//TODO remove me
	}

	stop(sth) {
		setTimeout(() => {
			console.log('【Web Server Stopped】', sth)
			process.exit(0);
		})
	}
}


new WebApp().createDefaultApp()