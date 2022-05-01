const SIO = require('socket.io');

class SocketIO {
	constructor() {
		this.sio = new SIO.Server({
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
		this.sio.on('error', (...args) => {
			console.log(args);
		});
	}

	// 监听独立服务
	listen(port) {
		if (!port) {
			return false;
		}
		this.sio.listen(port);
	}

	/**
	 * 1、绑定WEB Server
	 * 2、创建连接
	 */
	bindWeb(server) {
		this.sio.bind(server);
		this._buildWeb();
	}
	_buildWeb() {
		this.sio
			.on('connection', (socket) => {
				console.log(
					'----web-server--socket-connected---socket.id',
					socket.id
				);
			})
			.on('data', (data) => {
				console.log('----web-server--socket-data', data);
			});
		this.sio
			.of('namespace2')
			.on('connection', (socket) => {
				console.log(
					'----web-server--namespace2-connected---socket.id',
					socket.id
				);
			})
			.on('data', (data) => {
				console.log('----web-server--namespace2-data', data);
			});
	}

	/**
	 * 1、绑定API Server
	 * 2、创建连接
	 */
	bindApi(server) {
		this.sio.bind(server);
		this._buildApi();
	}
	/**
	 * 实现连接功能
	 */
	_buildApi() {
		this.sio.on('connection', (p1, p2) => {
			console.log('----api-server--socket-connected---');
			console.log('----api-server---p1---', p1);
			console.log('----api-server---p2---', p2);
		});
	}
}

module.exports = SocketIO;
