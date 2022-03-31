
//TODO 将聊天室中发送的消息都放置到mongodb中

const WebSocket = require('ws');
const Cookies = require('cookies');
const { CookieSession } = require('../../../constant');

module.exports = function WebSocketServer(http_server) {
	const wss = new WebSocket.Server({
		server: http_server
	});
	wss.on('connection', (ws, request) => {
		let url = request.url;
		if (url !== '/wechat') {
			return ws.close(4001, 'Invalid url');
		}
		let headers = request.headers;
		if (!headers) {
			return ws.close(4001, 'Invalid headers');
		}
		let cookies = new Cookies(request, {}, { keys: CookieSession.CookieKeys });
		let session_nid = cookies.get(CookieSession.session_name, { signed: true });
		if (!session_nid) {
			return ws.close(4001, 'Invalid cookie');
		}

		console.log('全局用户', global.User.get({
			plain: true
		}))
		ws.user = global.User || undefined;
		ws.wss = wss;

		ws.on('message', function (message) {
			ws.wss.clients.forEach(function (client) {
				client.send('data from broadcast:' + message, (err) => {
					if (err) {
						console.log('broadcast err', err);
					}
				});
			});
		});
	});
}