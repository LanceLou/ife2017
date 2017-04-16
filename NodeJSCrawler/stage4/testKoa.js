var koa = require('koa');
var parse = require('co-body');
var fs = require('fs');
var port = process.argv[2];
var session = require('koa-session');
var views = require('co-views');

var app = new koa();
app.listen(port);
app.keys = ['im a newer secret', 'i like turtle'];

var render = views(__dirname + '/views', {
  ext: 'ejs'
});

var user = {
  name: {
    first: 'Tobi',
    last: 'Holowaychuk'
  },
  species: 'ferret',
  age: 3
};

app.use(function* (){
  // ignore favicon
  if (this.path === '/favicon.ico') return;

  this.body = yield render('user', {user: user});
});

/* session use
app.use(session(app));

app.use(ctx => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;

  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + ' views';
});
*/


/* cookie 设置
app.use(function* () {
	var view = this.cookies.get('view', {signed: true});
	console.log(view);
	if(!view)
  		view = 1;
  	else
  		view++;
  	this.cookies.set('view', view, {signed: true});
  	this.body = view + " views";
});
*/



/* 错误处理
app.use(errorHandler());

app.use(function* () {
  if (this.path === '/error') throw new Error('ooops');
  this.body = 'OK';
});

function errorHandler() {
  return function* (next) {
    // try catch all downstream errors here
    this.status = 404;
  };
}
*/


/* 中间件的编写
app.use(responseTime());
app.use(upperCase());

app.use(function* () {
  this.body = 'hello koa';
});

function responseTime() {
  return function* (next) {
    var start = new Date;
    yield next;
    this.set('X-Response-Time', new Date - start);
    // set X-Response-Time head
  };
}

function upperCase() {
  return function* (next) {
    // do nothing
    yield next;
    // convert this.body to upper case
    this.body = this.body.toUpperCase();
  };
}
*/

//响应body  文件响应，请求type判断
// app.use(function* (next) {
// 	console.log('-------'+this.request.type+'-----------');
// 	console.log(this.request.length);

// 	console.log(this.request.is('text'));
// 	this.body = {
//     	message: 'this will be sent as a JSON response!'
//   	};
//   // this.body = fs.createReadStream('some_file.txt');
//   // koa will automatically handle errors and leaks
// })


//返回JSON
// app.use(function* (next) {
//   this.body = {
//     message: 'this will be sent as a JSON response!'
//   };
// })


//解析请求的body
// app.use(function* (next) {
//   // skip the rest of the code if the route does not match
//   // if (this.path !== '/') return yield next;

//   var body = yield parse(this);

//   console.log(body);

//   this.body = body.name.toUpperCase();
// })


//中间件之间合作处理
// app.use(function* (next) {
//   // skip the rest of the code if the route does not match
//   if (this.path !== '/') return yield next;

//   this.body = 'hello koa';
// })

// app.use(function* (next) {
//   // skip the rest of the code if the route does not match
//   if (this.path !== '/404') return yield next;

//   this.body = 'page not found';
// })

// app.use(function* (next) {
//   // skip the rest of the code if the route does not match
//   if (this.path !== '/500') return yield next;

//   this.body = 'internal server error';
// })


// // x-response-time
// app.use(function *(next){
//   // (1) 进入路由
//   console.log('x-response-time');
//   var start = new Date;
//   yield next;
//   // (5) 再次进入 x-response-time 中间件，记录2次通过此中间件「穿越」的时间
//   var ms = new Date - start;
//   console.log('%s - %s', 'x-response-time', ms);
//   this.set('X-Response-Time', ms + 'ms');
//   // (6) 返回 this.body
// });

// // logger
// app.use(function *(next){
// 	console.log('logger');
//   // (2) 进入 logger 中间件
//   var start = new Date;
//   yield next;
//   // (4) 再次进入 logger 中间件，记录2次通过此中间件「穿越」的时间
//   var ms = new Date - start;
//   console.log('%s %s - %s', this.method, this.url, ms);
// });

// // response
// app.use(function *(){
// 	console.log('enter response');
//   // (3) 进入 response 中间件，没有捕获到下一个符合条件的中间件，传递到 upstream
//   this.body = 'Hello World';
// });

// app.listen(8000);
