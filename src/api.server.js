// =========================================定义基本模块============================================
const ServerPort = process.env.PORT;
const path = require('path');
const UUID = require('uuid');
const Koa = require('koa');
const morgan = require('koa-morgan');
const KoaBody = require('koa-body');
const cors = require('koa2-cors');
const createError = require('http-errors');
const ENV_Production = process.env.NODE_ENV === 'production';
// ==========================================定义全局变量===========================================
const { CookieSession } = require('./constant');
// ==========================================引入核心模块===========================================
const SBiz = require('./base/SBiz');
// ==========================================引入路由=============================================
const Router = require('./router');
const Controller = require('./middleware/controller');
const UserSession = require('./middleware/user-session');
// ===========================================引入数据库驱动管理器===================================
const DBManager = require(`./components/db-client/index.js`);
// ============================================引入redis===========================================
const ClientRedis = require(`./components/db-client/client-redis.js`);
// ================================================================================================

class ApiApp {
    /**
     * 创建数据库链接、定义模型
     */
    async _initDatabase() {
        await DBManager.connectMongodb();
        SBiz.setMysqlInstance(await DBManager.connectMysql());
    }

    async _initRedis() {
        global.DB_Redis = await ClientRedis.getClient();
    }

    async createDefaultApp() {
        await this._initDatabase();
        await this._initRedis();

        const app = new Koa({
            keys: CookieSession.CookieKeys,
        });
        app.on('error', (err, ctx) => {
            console.error('Oh~Oh~Oh!!!! Find An Error Inner Api');
            console.error(err);
        });

        app.use(cors());
        app.use(morgan('dev'));
        app.use(KoaBody({
            multipart: true,
            encoding: 'utf-8',
            formidable: {
                uploadDir: __dirname + '/assets/uploaded',
                keepExtensions: true,
                maxFieldsSize: 5 * 1024 * 1024,
                onFileBegin: (name, file) => {
                    console.log(name, file);
                    // console.log('onFileBegin', name, file)
                    //TODO file.path = '/data/www/web-node/upload/upload_8test.jpg';//此处可以修改file来做修改的，比如按照年/月/日创建层级目录
                },
            },
        }));

        app.use(UserSession.loadSessionFromRedis());
        app.use(Controller.api());

        app.use(Router.routerApi.routes());
        app.use(Router.routerApi.allowedMethods());

        this.app = app;

        this._start();

        process.on('uncaughtException', this.stop);
        process.on('SIGINT', this.stop);
    }

    _start() {
        this.http_server = this.app.listen(ServerPort, () => {
            console.log('【api】 127.0.0.1:' + ServerPort + ' 启动完成！进程号：' + process.pid);
        });
    }

    stop(sth) {
        process.nextTick(() => {
            DBManager.close((err) => {
                console.log('【Api Server Stopped】', sth, err);
                process.exit(0);
            });
        });
    }
}

new ApiApp().createDefaultApp();
