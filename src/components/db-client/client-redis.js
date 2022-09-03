//测试和高并发( ab -c 1000 -n 10000 http://127.0.0.1:9000/)

const redis = require('redis'); //v4
const EventEmitter = require('events').EventEmitter;
const params = require(`../../config/config.redis.js`);
const base_name = __filename.replace(__dirname, '');

class EventRedisKeyExpired extends EventEmitter {
    constructor() {
        super();
    }
}

async function createClient(role = '') {
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
            console.log(
                `Redis重试连接`,
                'attempt:',
                options.attempt,
                'times_connected:',
                options.times_connected
            );
            // reconnect after
            return 1000;
        },
    });

    client.on('connect', () => {
        console.log(`连接redis服务，角色：${role}`);
    });
    client.on('error', (error) => {
        console.error('client redis error:' + error.message);
    });

    await client.connect();
    client.setMaxListeners(0);

    return client;
}

let CommonClient = null;

class RedisClientManager {
    static async getClient() {
        if (CommonClient) {
            return CommonClient;
        }
        CommonClient = await createClient('Common');
        return CommonClient;
    }
    static async getClientPublisher() {
        if (!RedisClientManager.clientPublisher) {
            RedisClientManager.clientPublisher = await createClient(
                'Publisher'
            );
        }
        return RedisClientManager.clientPublisher;
    }
    static async getClientSubscriber() {
        if (!RedisClientManager.clientSubscriber) {
            RedisClientManager.clientSubscriber = await createClient(
                'Subscriber'
            );
        }
        return RedisClientManager.clientSubscriber;
    }
    static async getKeyExpiredEmitter(db_number = 0) {
        RedisClientManager.clientSubscriber =
            RedisClientManager.getClientSubscriber();
        if (RedisClientManager.clientSubscriber.emitter) {
            console.log('-----emitter已存在---');
            return RedisClientManager.clientSubscriber.emitter;
        }
        RedisClientManager.clientSubscriber.emitter =
            new EventRedisKeyExpired();
        const channel_keyevent_expired = `__keyevent@${db_number}__:expired`;
        RedisClientManager.clientSubscriber.subscribe(channel_keyevent_expired);
        RedisClientManager.clientSubscriber.on('message', (channel, key) => {
            if (channel == channel_keyevent_expired) {
                RedisClientManager.clientSubscriber.emitter.emit(
                    'redis-key-expired',
                    key
                );
            }
        });
        return RedisClientManager.clientSubscriber.emitter;
    }

    static async beforeClosed(sth) {
        console.log(base_name, 'process event sth', sth);
        try {
            if (RedisClientManager.client) {
                RedisClientManager.client.disconnect();
            }
        } catch (error) {
            //
        }
        try {
            if (RedisClientManager.clientPublisher) {
                RedisClientManager.clientPublisher.disconnect();
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
    }
}

RedisClientManager.client = null;
RedisClientManager.clientPublisher = null;
RedisClientManager.clientSubscriber = null;

process.on('uncaughtException', RedisClientManager.beforeClosed);
process.on('SIGINT', RedisClientManager.beforeClosed);

module.exports = RedisClientManager;
