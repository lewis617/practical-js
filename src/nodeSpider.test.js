var fs = require('fs');
var nock = require('nock');
var nodeSpider = require('./nodeSpider');

test('test getHtml', function (done) {
  var example = nock('http://example.com/')
    .get('/search')
    .reply(200, '<body>Hello</body>');
  nodeSpider.getHtml(function (htmlStr) {
    expect(htmlStr).toBe('<body>Hello</body>');
    nock.cleanAll();
    done();
  })
});

test('test getJs', function (done) {
  nodeSpider.getJs(function (jsStr) {
    expect(jsStr).toBe('\'use strict\';\nmodule.exports = x => Object.is(x, -0);\n');
    done();
  })
});

test('test download', function (done) {
  var url = 'https://raw.githubusercontent.com/sindresorhus/negative-zero/master/index.js';
  var localPath = 'downloadDemo.js'
  nodeSpider.download(url, localPath, function(){
    var data = fs.readFileSync(localPath);
    expect(data.toString()).toBe('\'use strict\';\nmodule.exports = x => Object.is(x, -0);\n');
    fs.unlinkSync(localPath);  
    done();
  });
});

test('test cheerioDemo', function(){
  var htmlStr = nodeSpider.cheerioDemo();
  expect(htmlStr).toBe('<h2 class=\"title welcome\">Hello there!</h2>');
});

test('test regDemo', function(){
  var strOut = nodeSpider.regDemo('听电影学英语之海上钢琴师');
  expect(strOut).toBe('海上钢琴师');
  strOut = nodeSpider.regDemo('听电影MP3学英语之海上钢琴师');
  expect(strOut).toBe('海上钢琴师');
  strOut = nodeSpider.regDemo('听电影MP3学英语之海上钢琴师中英双语MP3+LRC');
  expect(strOut).toBe('海上钢琴师');
  strOut = nodeSpider.regDemo('听电影MP3学英语之海上钢琴师 中英双语MP3+LRC');
  expect(strOut).toBe('海上钢琴师');
  strOut = nodeSpider.regDemo('听电影MP3学英语之海上钢琴师 中英双语MP3+LRC+文本');
  expect(strOut).toBe('海上钢琴师');
  strOut = nodeSpider.regDemo('听电影MP3学英语之海上钢琴师 中英双语MP3+LRC+文本 ');
  expect(strOut).toBe('海上钢琴师');
});
