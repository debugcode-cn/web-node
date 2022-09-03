const amqplib = require('amqplib');
/**
 * 地址： https://nl.yz-cloud.com/positionApi/
client_id=sc22030546
grant_type=client_credentials
client_secret=E748E167
消息队列地址 http://123.60.56.5:5672
账号密码：  tenant  tenant
队列名：tenant_msg_E748E167_sc22030546
Virtual host:   /
 */

(async () => {
    const queue = 'tenant_msg_E748E167_sc22030546';
    const conn = await amqplib.connect('amqp://tenant:tenant@123.60.56.5:5672');

    const ch1 = await conn.createChannel();
    // await ch1.assertQueue(queue);

    // Listener
    ch1.consume(queue, (msg) => {
        if (msg !== null) {
            console.log('Recieved:', msg.content.toString());
            ch1.ack(msg);
        } else {
            console.log('Consumer cancelled by server');
        }
    });

    // Sender
    const ch2 = await conn.createChannel();

    setInterval(() => {
        ch2.sendToQueue(queue, Buffer.from('something to do'));
    }, 1000);
})();
