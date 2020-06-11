/**
 * 根据不同的驱动连接不同的客户端
 */

class DBConnection{
    constructor(){
        this.client = null;
    }
    static createDriver(name){
        if(Array.isArray(name)){

        }else{
            
        }
        
    }
    createClient(){

    }
    quitClient(){
        
    }
    getClient(){

    }
}

module.exports = DBConnection;