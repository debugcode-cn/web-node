const { Server } = require('socket.io');

class SocketIOManager {
    constructor(httpServer) {
        this.sio = new Server(httpServer, {
            allowEIO3: true, // whether to enable compatibility with Socket.IO v2 clientst
            pingInterval: 10000,
            pingTimeout: 5000,
            cors: {
                origin: [
                    'http://localhost',
                    'https://localhost',
                    'http://localhost:3000',
                    'https://localhost:3000',
                    'http://localhost:3001',
                    'https://localhost:3001',
                    'http://localhost:8000',
                    'https://localhost:8000',
                ],
                methods: ['GET', 'POST', 'PUT'],
                allowedHeaders: ['X-Custom-Header'],
                credentials: true, //是否带有Cookie,认证信息
            },
        });
        this.sio.compress(true);
    }

    /**
     * 1、创建连接
     */
    build() {
        this.sio.on('connection', (socket) => {
            console.log('----bindWeb--socket-connected---socket.id', socket.id);
        }).on('data', (data) => {
            console.log('----bindWeb--socket-data', data);
        });
        this.sio.of('namespace2').on('connection', (socket) => {
            console.log('----bindWeb--namespace2-connected---socket.id', socket.id);
        }).on('data', (data) => {
            console.log('----bindWeb--namespace2-data', data);
        });
    }

}

module.exports = SocketIOManager;
