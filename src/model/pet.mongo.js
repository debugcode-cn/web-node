const mongoose = require('mongoose');

// 定义属性
const schema = new mongoose.Schema({
    name: String,
    namenick: String,
    email: String,
    password: String,
}, {
    minimize: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'lastModifyTime' }
});

// 定义方法
schema.methods.speak = function () {
    const greeting = this.name ? 'Meow name is ' + this.name : "I don't have a name";
    console.log(greeting);
};

module.exports = mongoose.model('pet', schema);
