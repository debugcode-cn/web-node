/**
 * 定义基本的模型操作类
 */
const Sequelize = require('sequelize');
const Router = require('koa-router');
const router = new Router();

class SBiz {

    static mysql_instance = null;

    // 设置 mysql instance
    static setMysqlInstance(value) {
        SBiz.mysql_instance = value;
    }

    // 获取 mysql instance
    static getMysqlInstance() {
        return SBiz.mysql_instance;
    }

    // 定义模型
    static defineSequelizeModel(sequelize_instance, name, attributes, options = {}) {
        let attrs = {};
        attrs.id = {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        };
        for (let key in attributes) {
            let value = attributes[key];
            if (typeof value === 'object' && value['type']) {
                value.allowNull = value.allowNull || false;
                attrs[key] = value;
            } else {
                attrs[key] = {
                    type: value,
                    allowNull: false,
                };
            }
        }
        attrs.created_at = {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        };
        attrs.updated_at = {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        };
        sequelize_instance.define(name, attrs, {
            tableName: name,
            timestamps: false,
            hooks: {
                beforeValidate: function (obj) {
                    let now = Date.now();
                    if (obj.isNewRecord) {
                        obj.created_at = Math.floor(now / 1000);
                    }
                    obj.updated_at = Math.floor(now / 1000);
                },
            },
            ...options
        });
        return sequelize_instance.model(name);
    }

}
module.exports = SBiz;
