const Sequelize = require('sequelize');

module.exports = {
	name: 'role',
	attributes: {
		name: {
			type: Sequelize.STRING(200),
			allowNull: false,
			defaultValue: 0,
		},
	},
};
