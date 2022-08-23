var host = location.host; //本地域名
var port = 32772; //与docker 容器中web端口对应的本地端口
var wsServer = "ws://" + host + "/wechat";
var websocket = createWebSocket();

function createWebSocket() {
	console.log("wsServer", wsServer);
	var websocket = new WebSocket(wsServer);
	websocket.onopen = function (evt) {
		onOpen(evt);
	};
	websocket.onclose = function (evt) {
		onClose(evt);
	};
	websocket.onmessage = function (evt) {
		onMessage(evt);
	};
	websocket.onerror = function (evt) {
		onError(evt);
	};
	return websocket;
}
function onOpen(evt) {
	websocket.send("_SYN_" + new Date().getTime());
	console.log("Connected to ", websocket.url);
	websocket.HeartBeat = setInterval(() => {
		websocket.send("_SYN_" + new Date().getTime());
	}, 40000);
}
function onClose(evt) {
	console.log("Disconnected");
	clearInterval(websocket.HeartBeat);
	websocket.HeartBeat = undefined;
}
function onError(evt) {
	console.log("Error occured: ", evt);
	clearInterval(websocket.HeartBeat);
	websocket.HeartBeat = undefined;
	setTimeout(() => {
		websocket = createWebSocket(); //重新连接
	}, 6000);
}

function onMessage(evt) {
	console.log("Retrieved data from server: ", evt.data);
}
