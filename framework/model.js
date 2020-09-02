/**
 * 将所有model文件挂载到ctx中
 */

const fs = require('fs');
const path = require('path');

const MODEL_SUFFIX_NOSQL = 'Schema';

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
        console.log('sql mysql 加载所有模型数据文件')
        // 加载所有模型数据文件
        let dir = 'model';
        let model_names = fs.readdirSync(path.join(BasePath , dir)).filter((f) => {
            return f.endsWith('.js');
        });
        this.sql_list = []
        for (let filename of model_names) {
            let name = filename.substring(0, filename.length - 3);
            let model = require(path.join(BasePath , dir, filename ));
            this.sql_list.push({
                name,
                model
            })
        }
    },
    loadNOSQL :()=>{
        console.log('nosql mongodb 加载所有模型数据文件')
        // 加载所有模型数据文件
        let dir = 'schema';
        let model_names = fs.readdirSync(path.join(BasePath , dir)).filter((f) => {
            return f.endsWith('.js');
        });
        this.nosql_list = [];
        for (let filename of model_names) {
            let {name, schema} = require(path.join(BasePath , dir, filename ));
            let model_name = name + MODEL_SUFFIX_NOSQL;
            this.nosql_list.push({
                model_name,
                schema
            })
        }
    },
    defineSql : async (sequelize_instance)=>{
        for(let i =  0 ; i < this.sql_list.length ; i ++){
            let name = this.sql_list[i].name;
            let model = this.sql_list[i].model;
            let _model = defineSQLModel(sequelize_instance, model.name, model.attributes);
            if(!global[name]){
                global[name] = _model; // 老生代内存
                console.log('defineSql', name, _model)
            }
        }
    },
    defineNoSql : async (mongoose_instance)=>{
        for(let i =  0 ; i < this.nosql_list.length ; i ++){
            let model_name = this.nosql_list[i].model_name;
            let schema = this.nosql_list[i].schema;
            let model = mongoose.model(model_name, schema);
            if(!global[model_name]){
                global[model_name] = model; // 老生代内存
                console.log('defineNoSql', model_name, model)
            }
        }
    }

}