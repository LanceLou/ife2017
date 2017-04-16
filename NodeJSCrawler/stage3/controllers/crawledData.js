 var db = require('../models')

exports.create = function(data, callback) {
  var dbData = new db.CrawledData()
  dbData.word = data.word;
  dbData.dataList = data.dataList;
  dbData.save(callback);
}
exports.read = function(callback) {
  db.CrawledData.find({
  }, null, {
    sort: {
      'createAt': -1
    },
    limit: 20
  }, callback)
}