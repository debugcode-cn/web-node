# web-node
基于 koa2
开发mvc模式的web应用

使用pm2管理多进程

使用redis存储登录用户信息

使用mongoose、sequelize 创建对象关系映射

使用websocket进行前后端消息传输

提供api接口

查看MySQL通信连接信息
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
