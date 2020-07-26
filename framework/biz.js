/**
 * 将所有biz文件挂载到ctx中
 */
const fs = require('fs');
const path = require('path');
module.exports = function () {
    return async (ctx, next)=>{
        let dir = 'biz';
        let biz_names = fs.readdirSync(path.join(BasePath , dir)).filter((f) => {
            return f.endsWith('.js');
        });
        for (let filename of biz_names) {
            let biz_name = filename.substring(0, filename.length - 3);
            let biz = require(path.join(BasePath , dir, filename ));
            if(!ctx[biz_name]){
                ctx[biz_name] = biz; // 老生代内存
            }
        }
        await next();
    }
}


