/**
 * 根据不同的驱动连接不同的客户端
 */

//  TODO 使用类继承的模式, 使用 throw Error

const path =  require('path');
const createError = require('http-errors');

const ClientMysql = require(`./client-mysql.js`);
const ClientMongo = require(`./client-mongodb.js`);

class DBManager{
    static async createDriver(driver){
        if(driver == 'sql'){
            if(!global.MysqlClient){
                global.MysqlClient= new ClientMysql();
            }
        }
        else if(driver == 'nosql'){
            if(!global.MongodbClient){
                global.MongodbClient = new ClientMongo();
            }
        }else{
            throw createError(500, 'Unable to createDriver ' + driver , {expose:true});
        }
    }

    static async createClient(driver){
        if(driver == 'sql' && MysqlClient){
            global.MysqlClient.createClient()
            await MysqlClient.getClient().authenticate().catch((err)=>{
                throw createError(500, 'Unable to connect to the database mysql', {expose:true});
            });
        }else if(driver == 'nosql' && MongodbClient){
            await MongodbClient.createClient().catch((err)=>{
                throw createError(500, 'Unable to connect to the database mongodb', {expose:true});
            });
        }else{
            throw createError(500, 'Unable to createClient ' + driver , {expose:true});
        }
    }

    static async quitClient(driver){
        if(driver == 'sql' && MysqlClient){
            await MysqlClient.quitClient()
        }else if(driver == 'nosql' && MongodbClient){
            await MongodbClient.quitClient();
        }
    }

    static getClient(driver){
        if(driver == 'sql' && MysqlClient){
            return MysqlClient.getClient();
        }else if(driver == 'nosql' && MongodbClient){
            return MongodbClient.getClient();
        }else{
            throw createError(500, 'Unable to getClient ' + driver , {expose:true});
        }
    }
}

module.exports = DBManager;