//测试和高并发( ab -c 1000 -n 10000 http://127.0.0.1:9000/)

const redis = require('redis'); //v4
const EventEmitter = require('events').EventEmitter;
const params = require(`../../config/config.redis.js`);
const base_name = __filename.replace(__dirname, '');


class EventRedisKeyExpired extends EventEmitter {
    constructor() {
        super();
        this.db_number = 1;//key过期 1号数据库
    }
}

async function createClient(role = '', db = 0) {
    const client = redis.createClient({
        ...params,
        detect_buffers: true,
        legacyMode: true, //兼容旧版v3
        retry_strategy: function (options) {
            if (options.error && options.error.code === 'ETIMEDOUT') {
                console.log('Redis连接不通');
            }
            if (options.error && options.error.code === 'ECONNREFUSED') {
                console.log('Redis连接被拒绝');
            }
            console.log('Redis重试连接', 'attempt:', options.attempt, 'times_connected:', options.times_connected);
            // reconnect after
            return 1000;
        }
    });
    client.on('connect', () => {
        console.log(`连接redis服务，角色：${role}，DB：${db}`);
    });
    client.on('error', (error) => {
        console.error('client redis error:' + error.message);
    });

    await client.connect();
    client.setMaxListeners(0);

    return client;
}


class RedisClientManager {
    // 0号库普通客户端
    static getClient() {
        if (!RedisClientManager.client) {
            RedisClientManager.client = createClient('Common');
        }
        return RedisClientManager.client;
    }
    // 0号库发布
    static getClientPublisher() {
        if (!RedisClientManager.clientPublisher) {
            RedisClientManager.clientPublisher = createClient('Publisher');
        }
        return RedisClientManager.clientPublisher;
    }
    // 0号库订阅
    static getClientSubscriber() {
        if (!RedisClientManager.clientSubscriber) {
            RedisClientManager.clientSubscriber = createClient('Subscriber');
        }
        return RedisClientManager.clientSubscriber;
    }

    /**
     * 1号库---客户端
     * 设置带有过期事件的key
     * @returns
     */
    static getClient1() {
        if (!RedisClientManager.client1) {
            RedisClientManager.client1 = createClient('Common', 1);
        }
        return RedisClientManager.client1;
    }
    /**
     * 1号库---订阅者
     * 处理过期key的事件
     * @returns
     */
    static getKeyExpiredEmitter() {
        if (RedisClientManager.clientKeyExpired) {
            return RedisClientManager.clientKeyExpired;
        }
        let _emitter = new EventRedisKeyExpired();
        RedisClientManager.clientKeyExpired = createClient('Subscriber', _emitter.db_number);
        RedisClientManager.clientKeyExpired._emitter = _emitter;
        const channel_keyevent_expired = `__keyevent@${_emitter.db_number}__:expired`;
        RedisClientManager.clientKeyExpired.subscribe(channel_keyevent_expired);
        RedisClientManager.clientKeyExpired.on('message', (channel, key) => {
            if (channel == channel_keyevent_expired) {
                RedisClientManager.clientKeyExpired._emitter.emit('redis-key-expired', key);
            }
        });
        return RedisClientManager.clientKeyExpired._emitter;
    }

    static beforeClosed() {
        try {
            if (RedisClientManager.client) {
                RedisClientManager.client.close();
            }
        } catch (error) {
            //
        }
        try {
            if (RedisClientManager.client1) {
                RedisClientManager.client1.close();
            }
        } catch (error) {
            //
        }
        try {
            if (RedisClientManager.clientPublisher) {
                RedisClientManager.clientPublisher.quit();
            }
        } catch (error) {
            //
        }
        try {
            if (RedisClientManager.clientSubscriber) {
                RedisClientManager.clientSubscriber.unsubscribe();
            }
        } catch (error) {
            //
        }
        console.log('【RedisClientManager:::beforeClosed】');
    }
}

RedisClientManager.client = null;
RedisClientManager.client1 = null;
RedisClientManager.clientPublisher = null;
RedisClientManager.clientSubscriber = null;
RedisClientManager.clientKeyExpired = null;

module.exports = RedisClientManager;
