const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://linuxlei', { port: 1883 });

client.on('connect', function () {
    client.subscribe('presence', function (err) {
        if (!err) {
            client.publish('presence', 'Hello mqtt');
        }
    });
});

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    client.end();
});