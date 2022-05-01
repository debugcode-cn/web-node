const Sequelize = require('sequelize');

module.exports = {
	name: 'user',
	attributes: {
		namenick: {
			type: Sequelize.STRING(200),
			allowNull: false,
			defaultValue: 0,
		},
		email: {
			type: Sequelize.STRING(100),
			allowNull: true,
			defaultValue: '',
		},
		password: {
			type: Sequelize.STRING(500),
			allowNull: false,
		},
		gender: {
			type: Sequelize.TINYINT,
			allowNull: true,
		},
		birth: {
			type: Sequelize.STRING(10),
			allowNull: true,
		},
	},
};
