/**
 * 将所有model文件挂载到ctx中
 */

const fs = require('fs');
const path = require('path');
const createError = require('http-errors');

const ClientMysql = require(path.join(BasePath, 'db', 'mysql', 'client.js'));
const ClientMongo = require(path.join(BasePath, 'db', 'mongodb', 'client.js'));

const MODEL_SUFFIX_NOSQL = 'Schema';
const mongoose = require('mongoose');

//输出模型
module.exports = {
    sql:async ()=>{
        if(!global.MysqlClient || !global.MysqlClient.client){
            global.MysqlClient= new ClientMysql();
            MysqlClient.createClient()
        }
        await MysqlClient.getClient().authenticate().catch((err)=>{
            global.MysqlClient.quitClient();
            throw createError(500, 'Unable to connect to the database mysql', {expose:true});
        });

        // 加载所有模型数据文件
        let dir = 'model';
        let model_names = fs.readdirSync(path.join(BasePath , dir)).filter((f) => {
            return f.endsWith('.js');
        });
        console.log('model_names',model_names)
        for (let filename of model_names) {
            let name = filename.substring(0, filename.length - 3);
            let model = require(path.join(BasePath , dir, filename ));
            let _model = MysqlClient.defineSQLModel(model.name, model.attributes);
            // if(!ENV_Production){
            //     await _model.sync({force: true});
            // }
            if(!global[name]){
                global[name] = _model; // 老生代内存
            }
        }
    },
    nosql : async ()=>{
        console.log('nosql mongodb')
        if(!global.MongodbClient || !global.MongodbClient.client){
            global.MongodbClient = new ClientMongo();
            console.log('nosql mongodb new ClientMongo')
            await global.MongodbClient.createClient().catch((err)=>{
                console.log('err',err)
                global.MongodbClient.quitClient();
            }).then(()=>{
                console.log('nosql mongodb 加载所有模型数据文件')
                // 加载所有模型数据文件
                let dir = 'schema';
                let model_names = fs.readdirSync(path.join(BasePath , dir)).filter((f) => {
                    return f.endsWith('.js');
                });
                for (let filename of model_names) {
                    let {name, schema} = require(path.join(BasePath , dir, filename ));
                    let model_name = name + MODEL_SUFFIX_NOSQL;
                    let model = mongoose.model(model_name, schema);
                    console.log('model_name',model_name)
                    if(!global[model_name]){
                        global[model_name] = model; // 老生代内存
                    }
                    console.log('for:', global[model_name] ) 
                }
            }).catch((err)=>{
                throw createError(500, 'Unable to connect to the database '+dialect, {expose:true});
            });
        }else{
            console.log('--------global.MongodbClient.client----------')
        }
    }
}