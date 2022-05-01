const Sequelize = require('sequelize');

module.exports = {
    name: 'pet',
    attributes: {
        name: {
            type: Sequelize.STRING(100),
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
