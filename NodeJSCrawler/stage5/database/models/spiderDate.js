var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 不必为每一个数据项创建对应的表格，因为对应的项没有存储必要性
var CrawledData = new Schema({
  word: String,
  dataList: [{
    title: String,
    info: String,
    link: String,
    pic: String
  }],
  crawlerAt:{type: Date, default: Date.now}
})

module.exports = CrawledData