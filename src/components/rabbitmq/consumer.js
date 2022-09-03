/**
 * 订阅者.创建
 */

const EventEmitter = require('events');

class EventSomething extends EventEmitter {
    constructor() {
        super();
        this.event_name = 'consumer_something';
    }
}

class EventRabbitmq extends EventEmitter {
    constructor() {
        super();
        this.event_name = 'consumer_rabbitmq';
    }
}
