const WebSocket = require('ws');

class Wechat{
    constructor(account='匿名'){
        this.connected = false;
        this.ws = new WebSocket('ws://127.0.0.1:9000/test');
        this.ws.on('open',()=>{
            console.log('客户端连接服务端成功');

            this.connected = true;
            this.send('大家好，我是新成员:'+account);
        });
        this.ws.on('message',(message)=>{
            console.log('客户端接收到消息:',message)
        });
    }
    send(message){
        if(this.connected){
            this.ws.send(message);
        }
    }
    isConnected(){
        return this.connected;
    }
}

module.exports = Wechat;