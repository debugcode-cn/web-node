

//固定mongodb数据库
const path = require('path');
const Sequelize = require('sequelize');
const config = require(path.join(BasePath,'config','params.mysql.js'));

class Mysql{
    constructor(){
        this.client = null;
    }
    createClient(){
        this.client = new Sequelize(config.database, config.username, config.password, {
            host: config.host,
            port: config.port,
            dialect: 'mysql',
            timezone:'+08:00',
            pool: {
                max: 10,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });
    }
    quitClient(){
        if(this.client){
            this.client.close().then(()=>{
                this.client = null;
            })
        }
    }
    getClient(){
        return this.client;
    }

    defineSQLModel(name, attributes) {
        let attrs = {};
        attrs.id = {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement:true
        };

        for (let key in attributes) {
            let value = attributes[key];
            if (typeof value === 'object' && value['type']) {
                value.allowNull = value.allowNull || false;
                attrs[key] = value;
            } else {
                attrs[key] = {
                    type: value,
                    allowNull: false
                };
            }
        }
        
        attrs.created_at = {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue:0
        };
        attrs.updated_at = {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue:0
        };
        this.client.define(name, attrs, {
            tableName: name,
            timestamps: false,
            hooks: {
                beforeValidate: function (obj) {
                    let now = Date.now();
                    if (obj.isNewRecord) {
                        obj.created_at = Math.floor(now/1000);
                    }
                    obj.updated_at = Math.floor(now/1000);
                }
            }
        });
        return this.client.model(name);
    }

}

module.exports = Mysql;