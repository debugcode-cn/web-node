const createError = require('http-errors');

class DBManager {
    // 获取mysql连接实例
    static async connectMysql() {
        const dialect_mysql = require(`./client-mysql.js`);
        await dialect_mysql.authenticate().catch((err) => {
            throw createError(500, 'Unable to connect to the database mysql', { expose: true });
        });
        console.log('连接mysql成功');
        return dialect_mysql;
    }

    // 创建mongodb连接
    static async connectMongodb() {
        try {
            const dialect_mongo = require('./client-mongodb.js');
            console.log('连接mongodb成功');
            return dialect_mongo;
        } catch (error) {
            throw createError(500, 'Unable to connect to the database mongodb', { expose: true });
        }
    }
    static close(callback) {
        const mongoose = require('mongoose');
        mongoose.connection.close(callback);
    }
}

module.exports = DBManager;
