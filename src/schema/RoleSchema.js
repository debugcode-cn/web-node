const mongoose = require('mongoose')

// 定义属性
const RoleSchema = new mongoose.Schema({
  name: String,
  namenick: String,
  email: String,
  password: String
})

// 定义方法
RoleSchema.methods.speak = function () {
  const greeting = this.name
    ? 'Meow name is ' + this.name
    : "I don't have a name"
  console.log(greeting)
}

module.exports = {
  name: 'role',
  schema: RoleSchema
}
