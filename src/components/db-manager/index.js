
const createError = require('http-errors');

class DBManager {
	static async loadSql(){
		const dialect_mysql = require(`./client-mysql.js`);
		return await dialect_mysql.authenticate().catch((err) => {
			throw createError(500, 'Unable to connect to the database mysql', { expose: true });
		}).then(()=>dialect_mysql);
	}
	static async loadNoSql(){
		try {
			const dialect_mongo = require(`./client-mongodb.js`);
			return dialect_mongo;
		} catch (error) {
			throw createError(500, 'Unable to connect to the database mongodb', { expose: true });
		}
	}

}

module.exports = DBManager;