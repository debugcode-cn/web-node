//固定mysql数据库
const Sequelize = require('sequelize');
const config = require('../../config/params.mysql.js');

const base_name = __filename.replace(__dirname, '');

const instance = new Sequelize(
	config.database,
	config.username,
	config.password,
	{
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
	}
);

function close(sth) {
	console.log(base_name, 'process event sth', sth);
	if (!instance) {
		return;
	}
	try {
		instance.close();
	} catch (error) {
		//
	}
}

process.on('uncaughtException', close);
process.on('SIGINT', close);

module.exports = instance;
