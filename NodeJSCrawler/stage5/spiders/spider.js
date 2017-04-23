
const async = require('async'),
	phantom = require('phantom'),
	dbDao = require('../database/spiderDate');

//客服端列表，使用对象存储，键为能唯一代表客服端的字符串
const clientList = {};
const media = {
	iphone5: {
		userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
		viewportSize: {
			width: 320,
			height: 568
		},
		clipRect: { top: 0, left: 0, width: 320, height: 568 }
	},
	iphone6: {
		userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
		viewportSize: {
			width: 375,
			height: 667
		},
		clipRect: { top: 0, left: 0, width: 375, height: 667 }
	},
	ipad: {
		userAgent: 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
		viewportSize: {
			width: 768,
			height: 1024
		},
		clipRect: { top: 0, left: 0, width: 768, height: 1024 }
	}
}

function pageEvaluate() {
	var list = document.querySelectorAll(".c-container"),
  		listItem = null,
  		tempList = [];
  for (var i = 0; i < list.length; i++) {
 		try{
   		listItem = {};
   		listItem.title = list[i].querySelector("a:first-child").textContent;
   		listItem.info = list[i].querySelector(".c-abstract") ? list[i].querySelector(".c-abstract").textContent : 'pic result';
   		listItem.link = list[i].querySelector("a:first-child").href;
   		listItem.pic = list[i].querySelector("img") ? list[i].querySelector("img").src : "no picture";
   		tempList.push(listItem);
   	}catch(e){
   		continue;
   	}
	}
  return tempList;
}

function scrawlData(params, callback) {
	var phInstance = null,
		data = {},
		t = Date.now(),
		_page = null;
	phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
    	// page.settings.userAgent = 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
    	_page = page;
    	page.setting('userAgent', media[params.media].userAgent);
			return page.open('https://m.baidu.com/s?word=' + encodeURIComponent(params.keyWord) + '&pn=' + params.pn + '&usm=5');
    })
    .then(status => {
    	var lis = null;
			if (status !== "success") {
		  	console.log('FAIL to load the address');
		  	data = {
		  		code: 0, //返回状态码，1为成功，0为失败
		  		msg: '抓取失败', //返回的信息
		  		word: params.keyWord  //抓取的关键字
		  	}
			}else{
		  	t = Date.now() - t;
		  	data = {
		      code: 1, //返回状态码，1为成功，0为失败
		      msg: '抓取成功', //返回的信息
		      word: params.keyWord, //抓取的关键字
		      time: t, //任务的时间
		      dataList: []
		   	};
		   	return _page.evaluate(pageEvaluate);
			}
    })
    .then(list => {
    	data.dataList = list;
    	callback(null, data);
    	phInstance.exit();
    })
    .catch(error => {
    	callback(err, null);
      phInstance.exit();
    });
}

var q = async.queue(function(task, callback) {
  //在此处发起异步，在异步完成之后调用callback
  // console.log('发起'+ task.name + '的异步' );
  console.log('开始并发抓取');
  console.log(task);
  scrawlData(task, function (err, data) {
  	if (err) callback(err);
  	else callback(null, data);
  	clientList[task.uid].splice(clientList[task.uid].indexOf(Object.values(task).join()), 1);
  });

}, 5);



// 当队列为空时调用
q.drain = function() {
	// console.log('当前爬虫任务队列空!');
};

/**
 * 根据客服端的请求进行任务划分push入队列。
 * @param  {Object}   data     客服端拼凑的任务描述对象
 * @param  {Function} callback 每一个独立的task完成之后的回调函数
 * @param  {String}   uid      客服端唯一标注，用来表示客服端完成状态
 */
exports.receiveTaskRequest = function (data, callback, uid) {
	// 根据到达的请求划分任务，并添加至异步queue队列
	var tasks = [],
		task = null;
	clientList[uid] = clientList[uid] ? clientList[uid] : [];
	for (var i = 0; i < data.pagenum; i++) {
		task = {};
		Object.assign(task, data, {pn: i * 10, name: 'spiderTask'+'---'+i, uid: uid});
		clientList[uid].push(Object.values(task).join());
		tasks.push(task);
	}
	q.push(tasks, function (err, data) {
		console.log('异步并发单发处理回调');
		if (err) callback(err, null);
		else callback(null, data);
	});
	
}

exports.getClientTaskRemainedNum = function (uid, data) {
	data['remainder'] = clientList[uid] ? clientList[uid].length : 0;
	return data;
}


