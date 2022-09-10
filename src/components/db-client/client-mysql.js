//固定mysql数据库
const Sequelize = require('sequelize');
const config = require('../../config/config.mysql.js');

const instance = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    timezone: '+08:00',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

module.exports = instance;
