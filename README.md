# web-node
node web by koa2

项目使用koa2框架开发mvc模式的web引用

使用pm2管理多进程

登录session信息使用redis服务器单独存储

普通数据使用mysql，sequelize进行对象关系映射

包含websocket引用、测试程序

提供rest接口

引入mongoose，尚未定义对应表规则

使用长连接：redis、mysql、mongodb

查看MySQL通信连接信息
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'


# pm2模板
// {
//     "apps": {
//         "name": "web-node",                         // 项目名          
//         "script": "app.js",                         // 执行文件
//         "cwd": "./",                                // 根目录
//         "args": "--env_dev",                        // 传递给脚本的参数
//         "interpreter": "",                          // 指定的脚本解释器
//         "interpreter_args": "",                     // 传递给解释器的参数
//         "watch": true,                              // 是否监听文件变动然后重启
//         "ignore_watch": [                           // 不用监听的文件
//             "node_modules",
//             "logs"
//         ],
//         "exec_mode": "cluster",                     // 应用启动模式，支持fork和cluster模式
//         "instances": 3,                             // 应用启动实例个数，仅在cluster模式有效 默认为fork；或者 max
//         "max_memory_restart": 8,                    // 最大内存限制数，超出自动重启
//         "error_file": "./logs/web-err.log",         // 错误日志文件
//         "out_file": "./logs/web-out.log",           // 正常日志文件
//         "merge_logs": true,                         // 设置追加日志而不是新建日志
//         "log_date_format": "YYYY-MM-DD HH:mm:ss",   // 指定日志文件的时间格式
//         "min_uptime": "60s",                        // 应用运行少于时间被认为是异常启动
//         "max_restarts": 100,                        // 最大异常重启次数，即小于min_uptime运行时间重启次数；
//         "autorestart": true,                        // 默认为true, 发生异常的情况下自动重启
//         "cron_restart": "",                         // crontab时间格式重启应用，目前只支持cluster模式; ----- 感觉比较适用于过期刷新操作
//         "restart_delay": 1,                         // 异常重启情况下，延时重启时间
//         "env": {
//            "NODE_ENV": "production",                // 环境参数，当前指定为生产环境 process.env.NODE_ENV
//            "REMOTE_ADDR": "a.b.c.d",                 // process.env.REMOTE_ADDR
//            "PORT": 9000
//         },
//         "env_development": {
//             "NODE_ENV": "development",              // 环境参数，当前指定为开发环境 pm2 start app.js --env development
//             "REMOTE_ADDR": "127.0.0.1",
//             "PORT": 9000
//         },
//         "env_test": {                               // 环境参数，当前指定为测试环境 pm2 start app.js --env test
//             "NODE_ENV": "test",
//             "REMOTE_ADDR": "",
//             "PORT": 9000
//         }
//     },
//      "deploy" : {                                   // 各个环境部署参数
//          "production" : {
//              "user" : "ubuntu",
//              "host" : ["192.168.0.13"],
//              "ref"  : "origin/master",
//              "repo" : "git@github.com:Username/repository.git",
//              "path" : "/var/www/my-repository",
//              "post-deploy" : "npm install; grunt dist"
//          }
//      }
// }