const fs = require('fs');
const path = require('path');

const MODEL_SUFFIX_NOSQL = 'Schema';
const MODEL_SUFFIX_SQL = 'Model';

const mongoose = require('mongoose');
const Sequelize = require('sequelize');

let defineSQLModel = (sequelize_instance, name, attributes)=> {
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
    sequelize_instance.define(name, attrs, {
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
    return sequelize_instance.model(name);
}

//输出模型
module.exports = {
    loadSQL:()=>{
        let modelMap = require(`${__dirname}/../model/index.js`);
        this.sql_list = []
        for (const name in modelMap) {
            if (Object.hasOwnProperty.call(modelMap, name)) {
                let model = modelMap[name];
                let table_name = model.name;//数据库中的表名
                let model_name = name + MODEL_SUFFIX_SQL;
                this.sql_list.push({
                    table_name,
                    model_name,
                    model
                })
            }
        }
    },
    defineSql : async (sequelize_instance)=>{
        for(let i =  0 ; i < this.sql_list.length ; i ++){
            let model_name = this.sql_list[i].model_name;
            let table_name = this.sql_list[i].table_name;
            let model = this.sql_list[i].model;
            let _model = defineSQLModel(sequelize_instance, table_name, model.attributes);
            if(!global[model_name]){
                global[model_name] = _model; // 老生代内存
            }
        }
    },

    loadNOSQL :()=>{
        let schemaMap = require(`${__dirname}/../schema/index.js`);
        this.nosql_list = [];
        for (const name in schemaMap) {
            if (Object.hasOwnProperty.call(schemaMap, name)) {
                const schema = schemaMap[name].schema;
                let table_name = schemaMap[name].name;
                let model_name = name + MODEL_SUFFIX_NOSQL;
                this.nosql_list.push({
                    table_name,
                    model_name,
                    schema
                })
            }
        }
    },
    defineNoSql : async (mongoose_instance)=>{
        for(let i =  0 ; i < this.nosql_list.length ; i ++){
            let model_name = this.nosql_list[i].model_name;
            let table_name = this.nosql_list[i].table_name;
            let schema = this.nosql_list[i].schema;
            let model = mongoose.model(table_name, schema);
            if(!global[model_name]){
                global[model_name] = model; // 老生代内存
            }
        }
    }

}