var Controllers = require('../controllers');

var should = require('should');

var ObjectId = require('mongoose').Schema.ObjectId

describe('test/crawledData.test/js', function () {
	
	it('it should return obj and save db when create', function (done) {
		Controllers.CrawledData.create({
			word: '关键字',
			dataList: [{title: '标题1', info: 'info-1', link: 'link-1', pic: 'link-1'}, {title: '标题2', info: 'info-2', link: 'link-2', pic: 'pic-2'}],
		}, function (err, data) {
			should.not.exist(err);
			(typeof data).should.equal('object');
			done();
		})
	});

	it('it should return {...} when read', function (done) {
		Controllers.CrawledData.read(function (err, data) {
			should.not.exist(err);
			done();
		})
	});
})