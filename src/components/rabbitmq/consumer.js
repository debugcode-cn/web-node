/**
 * 订阅者.创建
 */

const Channel = require('./channel');

class RabbitmqConsumer extends Channel {
    constructor(queue) {
        super(queue);
    }
    async do() {
        const channel_receiver = await this.createChannel();
        await channel_receiver.assets(this.queue);
        await channel_receiver.assertQueue(this.queue);
        channel_receiver.consume(this.queue, (msg) => {
            if (msg !== null) {
                console.log('Recieved:', msg.content.toString());
                // if (Date.now() % 2 == 0) {
                channel_receiver.ack(msg);
                // }
            } else {
                console.log('Consumer cancelled by server');
            }
        });
    }
}

module.exports = RabbitmqConsumer;
