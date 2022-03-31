const WebSocket = require('ws');

class Wechat{
    constructor(){
        this.connected = false;
        let ws = new WebSocket('ws://127.0.0.1:9000/test');
        ws.on('open',()=>{
            this.connected = true;
            console.log('client connect wss ok');
            this.send('Hi');
        });
        ws.on('message',(message)=>{
            console.log('client received data:',message)
        });
        this.ws = ws;
    }

    send(message){
        if(this.connected){
            this.ws.send(message);
        }
    }

    /**
     * 渲染、绑定聊天窗口
     * @param {Object} jq_element jquery 对象
     */
    render(jq_element){
        if(this.connected){

        }else{
            //开始渲染连接中，
            //开启定时检查是否已经连接
            //如果已经连接就绑定dom事件
        }
    }
}