const amqplib = require('amqplib');
/**
 * 订阅-发布-演练场
*/

// (async () => {
//     const queue = 'tenant_msg_E748E167_sc22030546';
//     const conn = await amqplib.connect('amqp://tenant:tenant@123.60.56.5:5672');

//     const ch1 = await conn.createChannel();
//     // await ch1.assertQueue(queue);

//     // Listener
//     ch1.consume(queue, (msg) => {
//         if (msg !== null) {
//             console.log('Recieved:', msg.content.toString());
//             ch1.ack(msg);
//         } else {
//             console.log('Consumer cancelled by server');
//         }
//     });

//     // Sender
//     const ch2 = await conn.createChannel();

//     setInterval(() => {
//         ch2.sendToQueue(queue, Buffer.from('something to do'));
//     }, 1000);
// })();


(async () => {
    const Consumer = require('./consumer');
    const Publisher = require('./publisher');
    const consumer = new Consumer('maclei_queue_1');
    const publisher = new Publisher('maclei_queue_1');
    consumer.do();
    // publisher.do();
})();
