
module.exports = {
    test(){
        const mongoose = require('mongoose');
        mongoose.Promise = global.Promise;
        let uri = 'mongodb://127.0.0.1:27017/test';
        mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoose.connection.on('connecting',(a)=>{
            console.log('test a',a)
        });
        mongoose.connection.on('connected',(a)=>{
            console.log('test b',a)
        });
        mongoose.connection.on('error',(err)=>{
            console.log('err',err)
        });
        console.log('uri',uri)
    }    
}
