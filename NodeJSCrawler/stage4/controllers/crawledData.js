 var db = require('../models')

exports.create = function(data) {
  return new Promise(function (resolve, reject) {
    var dbData = new db.CrawledData()
    dbData.word = data.word;
    dbData.dataList = data.dataList;
    dbData.save(function (error, data) {
      if (error) reject(error);
      else resolve(data);
    });
  });
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