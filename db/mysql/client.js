

//固定mongodb数据库
const path = require('path');
const Sequelize = require('sequelize');

const params = require(path.join(BasePath,'config','params.js'));
let config = params.mysql();

class Mysql{
    constructor(){
        this.client = null;
    }
    createClient(){
        this.client = new Sequelize(config.database, config.username, config.password, {
            host: config.host,
            port: config.port,
            dialect: 'mysql',
            timezone:'+08:00',
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
    }
    quitClient(){
        if(this.client){
            this.client.close().then(()=>{
                this.client = null;
            })
        }
    }
    getClient(){
        return this.client;
    }
}

module.exports = Mysql;