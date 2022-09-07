/**
 * 通道.创建
 */

const amqplib = require('amqplib');
const config = require('../../config/config.rabbitmq');

class RabbitmqChannel {
    constructor(queue) {
        this.queue = String(queue);
    }
    async createChannel() {
        if (!config.username) {
            throw new Error('RabbitmqConsumer.缺少用户名');
        }
        if (!config.password) {
            throw new Error('RabbitmqConsumer.缺少密码');
        }
        let url = `amqp://${config.username}:${config.password}@${config.host}:${config.port}${config.vhost}`;
        const conn = await amqplib.connect(url);
        const channel_sender = await conn.createChannel();
        return channel_sender;
    }
}

module.exports = RabbitmqChannel;
