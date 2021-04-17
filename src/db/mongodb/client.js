

//固定mongodb数据库
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require(path.join(BasePath,'config','params.mongodb.js'));
// let uri = 'mongodb://'+config.username+':'+config.password+'@'+config.host+':'+config.port+'/'+config.db+'?authSource=node' ;

class Mongodb{
    constructor(){
        this.client = null;
    }
    createClient(){
        return new Promise((resolve, reject)=>{
            let tt = mongoose.connect(config.uri, {useNewUrlParser: true, useUnifiedTopology: true});
            this.client =  mongoose.connection;
            this.client.setMaxListeners(0);
            this.client.on('connected',(a)=>{
                resolve();
            });
            this.client.on('error',(err)=>{
                console.log('error',err)
                reject(err);
            });
        })
    }
    quitClient(){
        if(this.client){
            this.client.close((err)=>{
                this.client = null;
            });
        }
    }
    getClient(){
        return this.client;
    }
}

module.exports = Mongodb;