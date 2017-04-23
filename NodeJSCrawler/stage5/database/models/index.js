var mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/crawlerStage5')

exports.SpiderDate = mongoose.model('SpiderDate', require('./spiderDate'))