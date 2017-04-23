//socket 相关调用函数处理，如链接开启，事件发生，链接断开


/*
io.sockets.on('connection', function(socket) {
  socketApi.connect(socket)

  socket.on('disconnect', function() {
    socketApi.disconnect(socket)
  })

  socket.on('technode', function(request) {
    socketApi[request.action](request, socket, io)
  })
})
 */

//处理以上事件即可呀

const dbDao = require('../database/spiderDate'),
	cookieParser = require('cookie-parser'),
	Cookie = require('cookie'),
	crypto = require('crypto'),
	async = require('async'),
	https = require('https'),
	fs = require('fs'),
	path = require('path'),
	ObjectId = require('mongoose').Schema.ObjectId,
	Spider = require('../spiders/spider');


exports.connect = function(socket) {
	var remoteAddress = socket.client.conn.remoteAddress;
  console.log('接收到来自终端的连接，对方ip: ' + remoteAddress);
}

exports.disconnect = function(socket) {
 	var remoteAddress = socket.client.conn.remoteAddress;
  console.log('与终端断开连接，对方ip: ' + remoteAddress);
}

exports.spiderRequest = function (data, fn, socket) {
	var cookies = Cookie.parse(socket.handshake.headers.cookie);
  //客服端唯一性session-id
  var uid = cookies['connect.sid'];

	Spider.receiveTaskRequest(data, function (err, data) {
		downloadedListImages(data.dataList).then(function (result) {
			data.dataList = result;
			return saveCrawledData(data);
		}).then(function (data) {
			console.log(data);
			//动态传递给客服端
			socket.emit('progress', data);
		}).catch(function (err) {
			console.log(err);
		})
	}, uid);
	fn({status: '0', msg: '服务端任务发布完成，请静候'});
}

function saveCrawledData(data) {
	return new Promise(function (resolve, reject) {
		//此处不取数据库中的数据返回，因为对应数据不可改
		dbDao.create(data, function (err, data) {
			if (err) 
				reject(err);
			else{
				resolve(data);
			}
		})
	});
}


function downloadedListImages(dataList) {
	return new Promise(function (resolve, reject) {
		async.map(dataList, function (dateItem, cb) {
			if (dateItem.pic === 'no picture') cb(null, dateItem);
			else{
				downloadImg(__dirname.slice(0, __dirname.lastIndexOf('/')) + '/static/images/', dateItem.pic).then(function (result) {
					dateItem.pic = result;
					cb(null, dateItem);
				}).catch(function (err) {
					console.log(err);
					dateItem.pic = 'no picture';
					cb(null, dateItem);
				});
			}
		}, function (err, results) {
			if (err) reject(err);
			else resolve(results);
		});
	});
}

function downloadImg(imgDir, url) {
	return new Promise(function (resolve, reject) {
		https.get(url, function(res) {
        var name = crypto.createHash('md5').update(Date.now()+'').digest('hex') + '.' + res.headers['content-type'].slice(res.headers['content-type'].lastIndexOf('/')+1);
        var data = '';

        res.setEncoding('binary');

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function() {
            // 调用 fs.writeFile 方法保存图片到本地
            fs.writeFile(imgDir + name, data, 'binary', function(err) {
                if (err) {
                    reject(err);
                }
                resolve('/images/' + name);
            });
        });
    }).on('error', function(err) {
        reject(err);
    });
	});
}