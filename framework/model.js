
const fs = require('fs');
const path = require('path');
const createError = require('http-errors');

const DBMysql = require(path.join(BasePath, 'db', 'mysql', 'client.js'));
const DBMongo = require(path.join(BasePath, 'db', 'mongodb', 'client.js'));

//输出模型
module.exports = {
    sql(dialect='mysql'){
        return async (ctx, next)=>{
            if(!global.MysqlClient || !global.MysqlClient.client){
                global.MysqlClient= new DBMysql();
                await MysqlClient.createClient().then(()=>{
                    // 加载所有模型数据文件
                    let dir = 'model';
                    let model_names = fs.readdirSync(path.join(BasePath , dir)).filter((f) => {
                        return f.endsWith('.js');
                    });
                    for (let filename of model_names) {
                        let name = filename.substring(0, filename.length - 3);
                        let model = require(path.join(BasePath , dir, filename ));
                        let _model = MysqlClient.defineSQLModel(model.name, model.attributes);
                        // if(!ENV_Production){
                        //     await _model.sync({force: true});
                        // }
                        global['Model'+name] = _model; // 老生代内存
                    }
                }).catch(async (err)=>{
                    throw createError(500, 'Unable to connect to the database'+dialect, {expose:true});
                })
            }
            await next();
        }
    },
    nosql(dialect='mongodb'){
        return async (ctx, next)=>{
            if(!global.MongodbClient || !global.MongodbClient.client){
                global.MongodbClient = new DBMongo();
                await global.MongodbClient.createClient().then(()=>{
                    // 加载所有模型数据文件
                    let dir = 'model';
                    let model_names = fs.readdirSync(path.join(BasePath , dir)).filter((f) => {
                        return f.endsWith('.js');
                    });
                    for (let filename of model_names) {
                        let name = filename.substring(0, filename.length - 3);
                        let model = require(path.join(BasePath , dir, filename ));
                    }
                }).catch(async (err)=>{
                    throw createError(500, 'Unable to connect to the database '+dialect, {expose:true});
                });
            }
            await next();
        }
    }
}