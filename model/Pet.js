
const Sequelize = require('sequelize');

module.exports = {
    name : "pet" ,
    attributes:{
        name: Sequelize.STRING(100),
        gender: Sequelize.TINYINT,
        birth: Sequelize.STRING(10),
        createdAt: Sequelize.BIGINT,
        updatedAt: Sequelize.BIGINT,
        version: Sequelize.BIGINT
    }
}