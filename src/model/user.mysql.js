const crypto = require('crypto');
const Sequelize = require('sequelize');
const SBiz = require('../base/SBiz');

const schema = {
    name: 'user',
    attributes: {
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true
        },
        namenick: {
            type: Sequelize.STRING(200),
            allowNull: false,
            defaultValue: 0,
        },
        password: {
            type: Sequelize.STRING(500),
            allowNull: false,
            get() {
                return undefined;
            },
            set(value) {
                const sha256 = crypto.createHash('sha256');
                sha256.update(`${value}${this.getDataValue('salt')}`);
                this.setDataValue('password', sha256.digest('hex'));
            }
        },
        salt: {
            type: Sequelize.STRING(100),
            allowNull: false,
            defaultValue: crypto.randomBytes(16).toString('base64'),
            get() {
                return undefined;
            }
        },
        gender: {
            type: Sequelize.TINYINT,
            allowNull: true,
        },
        birth: {
            type: Sequelize.STRING(10),
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM('1', '21', '31', '41'),
            allowNull: false,
            defaultValue: '1'
        }
    },
    options: {}
};

let model = SBiz.defineSequelizeModel(SBiz.getMysqlInstance(), schema.name, schema.attributes, schema.options || {});
module.exports = model;

