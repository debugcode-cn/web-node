
const Redis = require('ioredis');

const Koa = require('koa');
const app = new Koa({});
app.on('error', (err, ctx) => {console.error('app error',err.message)});

app.use(async (ctx, next)=>{
	if(!global.DB_Redis){
        console.log('进程ID：', process.pid, '!global.DB_Redis')
		global.DB_Redis = new Redis({
            host:'172.17.0.5', 
            port: 6379, 
            password:'mnbvcxz_123'
        });
	}
	await next();
});

app.use(async (ctx, next)=>{
    let id = ctx.query.id;
    if(!id){
        console.log('缺少参数id');
        return false;
    }
    id = ''+id;

    //获取session_id
    let id_value = await DB_Redis.hget('map_cache',id) ;

    if(!id_value){
        await DB_Redis.hset('map_cache',id,id) ;
        console.log('进程ID：', process.pid, '插入新键值对：',id)
    }else{
        console.log('进程ID：', process.pid, '命中键值对：', id)
    }

    await next();
});

let PORT = 7799 ;
let http_server = app.listen(PORT,()=>{
	console.log('127.0.0.1:'+PORT+' 启动完成！','进程ID：', process.pid)
}); 

// setInterval(() => {
//     console.log('进程ID：', process.pid,'setInterval：', map_cache)
// }, 5*1000);