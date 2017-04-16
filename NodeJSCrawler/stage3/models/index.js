var mongoose = require('mongoose')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/crawlerStage1')

exports.CrawledData = mongoose.model('CrawledData', require('./CrawledData'))