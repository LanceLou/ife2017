/*
用户自定义: 抓取的页数， 设备信息

单个用户可以选择多个设备以及 抓取多个页面

每个phantomjs只执行一次抓取，最大五个phantomjs进程

前后端websocket实时通信，

使用async来控制并发


抓取多个页面:

1： https://m.baidu.com/ssid=1e84bfd5b0d76368617267656c63924f/from=844b/pu=sz%401320_2001/s?word=%E6%88%90%E9%83%BD&sa=tb&ts=7421816&t_kt=0&ie=utf-8&rsv_t=cec5bUC14qklnr1SkH0wiJH7Dfk97VVpCKPrdt%252FxhYQni8rZLZM2gfzTVw&tn=iphone&rsv_pq=12688549665261972170&rqlang=zh&oq=%E6%88%90%E9%83%BD
2： https://m.baidu.com/from=844b/ssid=1e84bfd5b0d76368617267656c63924f/pu=sz%401320_2001/s?tn=iphone&pn=40&usm=9&word=%E6%88%90%E9%83%BD&sa=np&rsv_pq=12040323273464935654&rsv_t=9be4UE44fndNI%252Bg6zNDDBtkwgCYvlP0xZ1kcGfD%252B7Tbkql1AwbwhwH%252FDCA&rqid=12040323273464935654
=> 根据pn字段来进行设置

--> https://m.baidu.com/s?pn=30&usm=5&word=%E8%89%B2
即可: 只要浏览器一请求，就构造出nodejs端所有需要的请求，并推入queue


 */



const async = require('async');

// create a queue object with concurrency 2
var q = async.queue(function(task, callback) {
    //在此处发起异步，在异步完成之后调用callback
    //------------------------------------------------------------------------------------------
    console.log('发起'+ task.name + '的异步' );
    setTimeout(function () {
    	console.log(task.name + '的异步完成' );
    	callback();
    },1000);
}, 2);

// assign a callback
q.drain = function() {
    console.log('all items have been processed');
};

// add some items to the queue
q.push({name: 'foo'}, function(err) {
    console.log('finished processing foo');
});
q.push({name: 'bar'}, function (err) {
    console.log('finished processing bar');
});

// add some items to the queue (batch-wise)
q.push([{name: 'baz'},{name: 'bay'},{name: 'bax'}], function(err) {
    console.log('finished processing item');
});

// add some items to the front of the queue
q.unshift({name: 'bar'}, function (err) {
    console.log('finished processing bar');
});

setTimeout(function () {
	q.unshift({name: 'lalala-lancelou'}, function (err) {
    console.log('finished processing bar lalala-lancelou');
	});
}, 10000);