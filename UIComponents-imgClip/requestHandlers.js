// var exec = require("child_process").exec;
//  function start(response) {
//    console.log("Request handler 'start' was called.");
//    exec("ls -lah", function (error, stdout, stderr) {
//      response.writeHead(200, {"Content-Type": "text/plain"});
//      response.write(stdout);
//      response.end();
// }); }
//  function upload(response) {
//    console.log("Request handler 'upload' was called.");
//    response.writeHead(200, {"Content-Type": "text/plain"});
//    response.write("Hello Upload");
//    response.end();
// }
//  exports.start = start;
//  exports.upload = upload;


// var querystring = require("querystring");
// function start(response, postData) {
//   console.log("Request handler 'start' was called.");
//   var body = '<html>'+
//     '<head>'+
//     '<meta http-equiv="Content-Type" content="text/html; '+
//     'charset=UTF-8" />'+
//     '</head>'+
//     '<body>'+
//     '<form action="/upload" method="post">'+
//     '<textarea name="text" rows="20" cols="60"></textarea>'+
//     '<input type="submit" value="Submit text" />'+
//     '</form>'+
//     '</body>'+
//     '</html>';
//     response.writeHead(200, {"Content-Type": "text/html"});
//     response.write(body);
//     response.end();
// }
// function upload(response, postData) {
//   console.log("Request handler 'upload' was called.");
//   response.writeHead(200, {"Content-Type": "text/plain"});
//   response.write("You've sent the text: "+
//   querystring.parse(postData).text);
//   console.log(postData);
//   response.end();
// }
// exports.start = start;
// exports.upload = upload;

var querystring = require("querystring"),
    fs = require("fs"),
    formidable = require("formidable");

function defaultHandler(pathname, response, request) {
  var type = pathname.slice(pathname.lastIndexOf(".")+1);
  if ("htmlcssjs".indexOf(type) <= 0) {
    fs.readFile("." + pathname, 'binary',(err, file) => {
      if (err) {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not found");
        response.end();
      }else{
        response.writeHead(200, {"Content-Type": "image/"+type});
        response.write(file, 'binary');
        response.end();
      }
    });
    return;
  }
  fs.readFile("." + pathname, (err, file) => {
    if (err) {
      console.log("No request handler found for " + pathname);
      response.writeHead(404, {"Content-Type": "text/html"});
      response.write("404 Not found");
      response.end();
    }else{
      response.writeHead(200, {"Content-Type": "text/"+type});
      response.write(file);
      response.end();
    }
  });
}

function start(response) {
  console.log("Request handler 'start' was called.");
  fs.readFile("./src/index.html", "UTF-8", function (error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "text/html"});
      response.write(file);
      response.end();
    } 
  });
}
function upload(response, request) {
  console.log("Request handler 'upload' was called.");
  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.on("progress", function (byteReceived, bytesExpected) {
    console.log(byteReceived);
  });
  form.parse(request, function(error, fields, files) {
    var name = (new Date().valueOf()) + "" + Number.parseInt(Math.random()*10000);
    fs.renameSync(files.upload.path, "./tmp/"+name+".png");
    response.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
    if (error) {
      response.write("{state: 0}");
    }else{
      response.write("{state: 1}");
    }
    response.end();
  });
}
function show(response) {
  //fs模块方法，readFile, 读二进制流(param: binary)
  console.log("Request handler 'show' was called.");
  fs.readFile("./tmp/test.png", "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    } 
  });
}
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.defaultHandler = defaultHandler;

