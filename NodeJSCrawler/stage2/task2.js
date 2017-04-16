var page = require('webpage').create(),
	system = require('system'),
	keyword = '',
	t = null,
	data = {};

var deviceInfo = {
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
	
console.log('The default user agent is ' + page.settings.userAgent);
// page.settings.userAgent = 'SpecialAgent';

keyword = system.args[1];
device = system.args[2];
t = Date.now();

page.settings.userAgent = deviceInfo[device] ? deviceInfo[device].userAgent : page.settings.userAgent;
page.viewportSize = deviceInfo[device] ? page.viewportSize : deviceInfo[device].viewportSize;
page.clipRect = deviceInfo[device] ? page.clipRect : deviceInfo[deviceInfo].clipRect;

function generateResult(list) {
	data.dataList = list;
   	console.log(JSON.stringify(data));
}

page.open('https://www.baidu.com/s?wd=' + encodeURIComponent(keyword), function(status) {
  if (status !== "success") {
  	console.log('FAIL to load the address');
  	data = {
  		code: 0, //返回状态码，1为成功，0为失败
  		device: device,
  		msg: '抓取失败', //返回的信息
  		word: keyword  //抓取的关键字
  	}
  }else{
  	t = Date.now() - t;
  	data = {
       	code: 1, //返回状态码，1为成功，0为失败
       	msg: '抓取成功', //返回的信息
       	word: keyword, //抓取的关键字
       	device: device,
       	time: t, //任务的时间
       	dataList: []
   	};
  	var res = page.evaluate(function() {
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
  	});
  	generateResult(res);
  	page.render('example.png');
  }
  phantom.exit();
});