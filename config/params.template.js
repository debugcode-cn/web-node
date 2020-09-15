let ENV_Production = process.env.NODE_ENV === 'production';

exports.mysql = function(){
    if(ENV_Production){
        return {
            host:'',
            port:'3306',
            username:'',
            password:'',
            database:''
        }
    }
    return {
        host:'172.17.0.3',
        port:'3306',
        username:'root',
        password:'mnbvcxz@123',
        database:'test'
    } 
}

exports.mongodb = function(){
    if(ENV_Production){
        return {
            host: '',
            port:27017,
            username:'',
            password:'',
            db:''
        }
    }
    return {
        host: '121.36.202.19',
        port:27017,
        username:'root',
        password:'mnbvcxz_123',
        db:'lobby'
    }
}

exports.redis = function(){
    return {
        host:'172.17.0.5', 
        port: 6379, 
        auth_pass:''
    }
}