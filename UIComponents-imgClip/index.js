//同时，我们会相应扩展 index.js，使得路由函数可以被注入到服务器中: 
// var server = require("./server");
// var router = require("./router");
//此处注入
// server.start(router.route);
// 
// -------------------------------------------------------
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var handle = {}
handle["default"] = requestHandlers.defaultHandler;
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;
handle["defaultHandler"] = requestHandlers.defaultHandler;
server.start(router.route, handle);
