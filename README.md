# web-node

node web by koa2

项目使用 koa2 框架开发 mvc 模式的 web 引用

使用 pm2 管理多进程

登录 session 信息使用 redis 服务器单独存储

普通数据使用 mysql，sequelize 进行对象关系映射

包含 websocket 引用、测试程序

提供 rest 接口

引入 mongoose，尚未定义对应表规则

使用长连接：redis、mysql、mongodb

查看 MySQL 通信连接信息
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
