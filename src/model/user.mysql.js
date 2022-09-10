const Sequelize = require('sequelize');
const SBiz = require('../base/SBiz');

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
    options: {}
};

module.exports = SBiz.defineSequelizeModel(SBiz.getMysqlInstance(), schema.name, schema.attributes, schema.options || {});

