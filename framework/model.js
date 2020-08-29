/**
 * 将所有model文件挂载到ctx中
 */

const fs = require('fs');
const path = require('path');
const createError = require('http-errors');

const ClientMysql = require(path.join(BasePath, 'db', 'mysql', 'client.js'));
const ClientMongo = require(path.join(BasePath, 'db', 'mongodb', 'client.js'));

const MODEL_SUFFIX_NOSQL = 'S';

//输出模型
module.exports = {
    sql(dialect='mysql'){
        return async (ctx, next)=>{
            if(!global.MysqlClient || !global.MysqlClient.client){
                global.MysqlClient= new ClientMysql();
                MysqlClient.createClient()
            }
            await MysqlClient.getClient().authenticate().catch(async (err)=>{
                console.log(err)
                throw createError(500, 'Unable to connect to the database '+dialect, {expose:true});
            });

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
                if(!ctx[name]){
                    ctx[name] = _model; // 老生代内存
                }
            }
            
            await next();
        }
    },
    nosql(dialect='mongodb'){
        return async (ctx, next)=>{
            if(!global.MongodbClient || !global.MongodbClient.client){
                await global.MongodbClient.createClient().then(()=>{
                    global.MongodbClient = new ClientMongo();
                    // 加载所有模型数据文件
                    let dir = 'schema';
                    let model_names = fs.readdirSync(path.join(BasePath , dir)).filter((f) => {
                        return f.endsWith('.js');
                    });
                    for (let filename of model_names) {
                        let {name, schema} = require(path.join(BasePath , dir, filename ));
                        let model_name  = name + MODEL_SUFFIX_NOSQL;
                        let model = mongoose.model(model_name, schema);
                        if(!ctx[model_name]){
                            ctx[model_name] = model; // 老生代内存
                        }
                    }
                }).catch(async (err)=>{
                    throw createError(500, 'Unable to connect to the database '+dialect, {expose:true});
                });
            }
            await next();
        }
    }
}