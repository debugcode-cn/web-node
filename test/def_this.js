exports.first = true;
exports.THIS = {
    test:1,
    key1:{
        test:2,
        fun1:()=>{
            console.log('in key1 fun1', this.THIS.test)
        },
        fun2:function(){
            console.log('in key1 fun2',this.test)
        }
    }
}