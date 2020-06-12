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
