import io from 'socket.io-client';

const socket = io();

//管理整个客服端与服务端的socket通信
const ServerSocket = {
	emitSpiderRequest: function (data, cb) {
		socket.emit('spider', data, cb);
	},
	addServerUpdateEventHandler: function (context, fn) {
		socket.on('progress', function (data) {
			fn.call(context, data);
		});
	}
};

export default ServerSocket;