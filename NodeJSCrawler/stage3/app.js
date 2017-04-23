const express = require('express'),
	bodyParser = require('body-parser'),
	phantom = require('phantom'),
	Controllers = require('./controllers');

var app = express(),
	t = Date.now(),
	data = {};

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.get('/', function (req, res) {
	var keyword = req.query.word;
	var phInstance = null,
		_page = null;
	phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
    	// page.settings.userAgent = 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1';
    	_page = page;
    	page.setting('userAgent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1');
		return page.open('https://www.baidu.com/s?wd=' + encodeURIComponent(keyword));
    })
    .then(status => {
    	var lis = null;
		if (status !== "success") {
		  	console.log('FAIL to load the address');
		  	data = {
		  		code: 0, //返回状态码，1为成功，0为失败
		  		msg: '抓取失败', //返回的信息
		  		word: keyword  //抓取的关键字
		  	}

		}else{
		  	t = Date.now() - t;
		  	data = {
		       	code: 1, //返回状态码，1为成功，0为失败
		       	msg: '抓取成功', //返回的信息
		       	word: keyword, //抓取的关键字
		       	time: t, //任务的时间
		       	dataList: []
		   	};
		   	return _page.evaluate(pageEvaluate);
		}
    })
    .then(list => {
    	generateResult(list);
    	Controllers.CrawledData.create(data, function (err, data) {
				if (err) 
					res.status(500).json(null);
				else
					res.json(data);
			})
    	phInstance.exit();
    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });
})

var server = app.listen(8000, function() {
  console.log('Crawler is on port 8000!')
})

function generateResult(list) {
	console.log(list);
	data.dataList = list;
  console.log(JSON.stringify(data));
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