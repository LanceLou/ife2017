var querystring = require("querystring"),
    fs = require("fs"),
    mongoose = require('mongoose'),
    formidable = require("formidable");

mongoose.connect('mongodb://localhost/imgClipDb');

var Image = mongoose.model('Image', {
  url: String,
  width: Number,
  height: Number
});

function insertData2Db(data, response) {
  var img = new Image({url: data.url, width: data.width, height: data.height});
  img.save(function (err) {
    if (err) response.write("{state: 0}");
    response.write("{state: 1}");
    response.end();
  });
}

function getAllImagesFromDb(response) {
  Image.find(function (err, imgs) {
    if (err) response.write("{state: 0}")
    response.write(JSON.stringify(imgs));
    // console.log(JSON.stringify(imgs));
    response.end();
  });
}

function imgClipedShow(response) {
  console.log("Request handler 'start' was called.");
  fs.readFile("./src/imgClipedShow.html", "UTF-8", function (error, file) {
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
    console.log(fields);
    var name = (new Date().valueOf()) + "" + Number.parseInt(Math.random()*10000);
    fs.renameSync(files.img.path, "./tmp/"+name+".png");
    response.writeHead(200, {"Content-Type": "text/html;charset=UTF-8"});
    if (error) {
      response.write("{state: 0}");
      response.end();
    }else{
      insertData2Db({url: "/tmp/"+name+".png", width: fields.width, height: fields.height}, response);
    }
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

function getAllClipedImages(response) {
  getAllImagesFromDb(response);
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.defaultHandler = defaultHandler;
exports.getAllClipedImages = getAllClipedImages;
exports.imgClipedShow = imgClipedShow;
