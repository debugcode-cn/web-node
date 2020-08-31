
//测试和高并发( ab -c 1000 -n 10000 http://127.0.0.1:9000/)

const path = require('path');
const redis = require('redis');
const params = require(path.join(BasePath,'config','params.redis.js'));
const config = Object.assign({}, params, { detect_buffers: true }, {});

class Redis{
    constructor(){
        this.client = null;
    }
    createClient(){
        return new Promise((resolve, reject)=>{
            if(!this.client){
                this.client = redis.createClient(config);
                this.client.setMaxListeners(0);
                this.client.on('connect',()=>{
                    resolve();
                });
                this.client.on('error',(err)=>{
                    reject(err);
                });
            }else{
                resolve();
            }
        })
    }
    quitClient(){
        if(this.client){
            this.client.quit(()=>{
                this.client = null;
            });
        }
    }
    getClient(){
        return this.client;
    }
}
module.exports = Redis;