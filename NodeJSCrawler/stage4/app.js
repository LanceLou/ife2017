const Koa = require('koa'),
	phantom = require('phantom'),
	parse = require('co-busboy'),
	https = require('https'),
	path = require('path'),
	fs = require('fs'),
  crypto = require('crypto'),
	Controllers = require('./controllers'),
	app = new Koa();



/*
thunk包装的函数就在： 回调里面转移执行权
promise包装的函数就在： then方法中转移执行权
 */

var t = Date.now(),
	data = {};

app.use(function* (next) {
  if (this.path === '/favicon.ico') return;
  if (this.request.path !== '/scrawler' && this.request.method !== 'POST') return yield next;
  // if (this.request.method === 'GET') return this.body = form;
  var parts = parse(this)
  // formdata 传递过来的字段
  var part,
  	key,
  	phInstance = null,
		page = null;

  while (part = yield parts) {
    if (part.length) {
      // arrays are busboy fields
      key = part[1];
    }
  }

  var phInstance = yield phantom.create();
  page = yield phInstance.createPage();
  page.setting('userAgent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');


  var status, //page.open 返回的状态
  	list = [],
  	dbDate = null; //数据库操作返回的data

  //为什么可以直接yield调用，因为本身page.open返回的就是一个Promise。
  //https://github.com/amir20/phantomjs-node/blob/master/src/page.js
  //https://github.com/amir20/phantomjs-node/blob/master/src/phantom.js
  status = yield page.open('https://www.baidu.com/s?wd=' + encodeURIComponent(key));
	if (status !== "success") {
	  console.log('FAIL to load the address');
    //返回状态码，1为成功，0为失败 返回的信息 抓取的关键字
	 	data = {
	 		code: 0, msg: '抓取失败', word: keyword
	 	}
	}else{
  	t = Date.now() - t;
  	data = {
      code: 1, msg: '抓取成功', word: key, time: t, dataList: []
   	};

    
   	list = yield page.evaluate(pageEvaluate);
	}

	for (var i = 0; i < list.length; i++){
		if (list[i].pic === 'no picture') continue;
		try{
			list[i].pic = yield downloadImg(__dirname + '/static/images/', list[i].pic);
		}catch(e){
			console.log(e);
			continue;
		}
	}
	
	data.dataList = list;

	dbDate = yield Controllers.CrawledData.create(data);
	this.body = data;

	phInstance.exit();

});


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
                console.log('Image downloaded:', path.basename(url));
            });
        });
    }).on('error', function(err) {
        reject(err);
    });
	});
}


app.use(require('koa-static')(__dirname + '/static'));

app.use(function* (next) {
	console.log('yahaha');
  this.body = "nothing";
});

app.listen(8000);