const Sequelize = require('sequelize');
const SBiz = require('../base/SBiz');

const schema = {
    name: 'role',
    attributes: {
        name: {
            type: Sequelize.STRING(200),
            allowNull: false,
            defaultValue: 0,
        },
    },
    options: {}
};

module.exports = SBiz.defineSequelizeModel(SBiz.getMysqlInstance(), schema.name, schema.attributes, schema.options || {});