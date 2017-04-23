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

const bodyParser = require('body-parser'),
	express = require('express'),
  Cookie = require('cookie'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
	phantom = require('phantom'),
	path = require('path'),
	socketApi = require('./controllers/socketApi');

// 用于将Session存入mongodb中
var MongoStore = require('connect-mongo')(session)
var sessionStore = new MongoStore({
  url: 'mongodb://localhost/crawlerStage5'
})

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(session({
  secret: 'technode', //加密签名
  cookie:{
    maxAge: 60 * 1000
  },
  ttl: 14 * 24 * 60 * 60,
  store: sessionStore,
  resave: true, //resave : 是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  saveUninitialized: true //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
}))

app.get('/spider', function (req, res) {
	
  console.log(req.ip);
});

app.set('staticPath', '/static');

app.use(express.static(__dirname + app.get('staticPath')));

var server = app.listen(8000, function() {
  console.log('ready')
});


var io = require('socket.io').listen(server);

io.set('authorization', function(handshakeData, accept) {
  var cookies = Cookie.parse(handshakeData.headers.cookie),
    connectSid = cookies['connect.sid'];
  if (connectSid) {
    accept(null, true);

  }else
    accept('resused');
});

io.sockets.on('connection', function(socket) {
  socketApi.connect(socket);

  socket.on('disconnect', function() {
    socketApi.disconnect(socket)
  });

  //ready for implement
  socket.on('spider', function (data, cb) {
    socketApi.spiderRequest(data, cb, socket);
  });
});