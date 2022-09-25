# 功能简介
1. 基于koa2框架，MVC模式的设计思想
2. 使用 pm2 管理多进程,pm2 deploy 进行部署更新
3. 使用redis存储登录用户信息、支持jwt令牌方式登录
4. 使用mongoose、sequelize 创建对象关系映射
5. 使用websocket进行前后端消息传输
6. 提供api接口单独调用
7. 提供前端页面渲染

# 启动说明
#### 启动API接口服务，占用端口 10091
```
npm run api
```

#### 启动 Web 网页服务，占用端口 10092
```
npm run web
```

#### pm2 方式启动开发环境服务
```
npm run pm2-dev
```

#### pm2 方式启动测试环境服务
```
npm run pm2-test
```

#### pm2 方式启动线上环境服务
```
npm run pm2
```

#### 通过 webpack 打包 API、Web 脚本
```
npm run build
```

---
# 备注
#### 查看 MySQL 通信连接信息
```
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
```

#### 随手记：用于判断是通过require执行的还是直接命令行执行的
```
const Execed = require.main === module
console.log(Execed)
```
