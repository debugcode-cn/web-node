/**
 * 发布者.创建
 * 
 * TODO 可以指定交换机
 */

const Channel = require('./channel');

class RabbitmqPublisher extends Channel {
    constructor(queue, exchange) {
        super(queue, exchange);
    }
    async do() {
        const channel_sender = await this.createChannel();
        setInterval(() => {
            let msg = 'something to do. ' + Date.now();
            let buffer = Buffer.from(msg);
            console.log(buffer.length);

            channel_sender.sendToQueue(this.queue, buffer);
        }, 1000);
    }
}

module.exports = RabbitmqPublisher;
