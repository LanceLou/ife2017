//数据操作，数据读取与存储
 var db = require('./models')

exports.create = function(data, callback) {
  var dbData = new db.SpiderDate()
  dbData.word = data.word;
  dbData.dataList = data.dataList;
  dbData.save(callback);
}
exports.read = function(callback) {
  db.SpiderDate.find({
  }, null, {
    sort: {
      'createAt': -1
    },
    limit: 20
  }, callback)
}