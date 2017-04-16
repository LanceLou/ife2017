var page = require('webpage').create(),
	system = require('system'),
	keyword = '',
	t = null,
	data = {};
	
console.log('The default user agent is ' + page.settings.userAgent);
// page.settings.userAgent = 'SpecialAgent';

keyword = system.args[1];


page.onConsoleMessage = function(list) {
	var domLis = null;
	try{
		domLis = JSON.parse(list)
	}catch(e){
		return;
	}
	data.dataList = domLis;	
   	console.log(JSON.stringify(data));
};

t = Date.now();

page.open('https://www.baidu.com/s?wd=' + encodeURIComponent(keyword), function(status) {
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
  	page.evaluate(function() {
	  	var list = document.querySelectorAll(".c-container"),
	  		listItem = null,
	  		tempStrObj = [];
	  	for (var i = 0; i < list.length; i++) {
	   		try{
		   		listItem = {};
		   		listItem.title = list[i].querySelector("h3").textContent;
		   		listItem.info = list[i].querySelector(".c-abstract").textContent;
		   		listItem.link = list[i].querySelector("h3 > a:first-child").href;
		   		listItem.pic = list[i].querySelector("img") ? list[i].querySelector("img").src : "";
		   	}catch(e){
		   		continue;
		   	}
		   	tempStrObj.push(listItem);
   		}
	  	console.log(JSON.stringify(tempStrObj));
  	});
  	page.render('example.png');
  }
  phantom.exit();
});



//----------------------------------------------------------------------------------

//计时
/*
var page = require('webpage').create(),
  system = require('system'),
  t, address;

if (system.args.length === 1) {
  console.log('Usage: loadspeed.js <some URL>');
  phantom.exit();
}

t = Date.now();
address = system.args[1];
page.open(address, function(status) {
  if (status !== 'success') {
    console.log('FAIL to load the address');
  } else {
    t = Date.now() - t;
    console.log('Loading ' + system.args[1]);
    console.log('Loading time ' + t + ' msec');
  }
  phantom.exit();
});
*/

//JavaScript代码执行
/*
var page = require('webpage').create(),
	url = 'http://ife.baidu.com/course/detail/id/85';
page.onConsoleMessage = function(msg) {
  console.log('Page title is ' + msg);
};
page.open(url, function(status) {
  page.evaluate(function() {
    console.log(document.title);
  });
  phantom.exit();
});
*/

/*
var page = require('webpage').create(),
	url = 'http://ife.baidu.com/course/detail/id/85';
page.onResourceRequested = function(request) {
  console.log('Request ' + JSON.stringify(request, undefined, 4));
};
page.onResourceReceived = function(response) {
  console.log('Receive ' + JSON.stringify(response, undefined, 4));
  phantom.exit();
};
page.open(url);
*/