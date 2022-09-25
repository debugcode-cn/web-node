//固定mongodb数据库
const config = require('../../config/config.mongodb.js');

const mongoose = require('mongoose');
mongoose.set('setDefaultsOnInsert', true); // 如果upsert选项为true，在新建时插入文档定义的默认值
mongoose.connect(config.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('error', function (err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(1);
});
mongoose.connection.setMaxListeners(0);
mongoose.Promise = global.Promise;

module.exports = mongoose.connection;
