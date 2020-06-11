
const Sequelize = require('sequelize');

module.exports = {
    name : "user" ,
    attributes:{
        namenick: Sequelize.STRING(200),
        email: Sequelize.STRING(100),
        password:Sequelize.STRING(500),
        gender: Sequelize.TINYINT,
        birth: Sequelize.STRING(10)
    }
}