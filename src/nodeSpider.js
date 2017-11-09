var request = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var fs = require('fs');
var os = require('os');
var path = require('path');

charset(request);

function getHtml(cb) {
  request
    .get('http://example.com/search')
    .end(function (err, res) {
      // 将会打印页面的 HTML 字符串
      // console.log(res.text);
      cb(res.text);
    });
}

function getJs(cb) {
  request.get('https://raw.githubusercontent.com/sindresorhus/negative-zero/master/index.js')
    .buffer(true)
    .end(function (err, res) {
      cb(res.text);
    });
}

function download(url, localPath, cb) {
  var stream = fs.createWriteStream(localPath);
  stream.on('finish', function () {
      // console.log('The download of ' + localPath + ' is complete!');
      cb();
  });
  request.get(url).pipe(stream);
}

function cheerioDemo(){
  var cheerio = require('cheerio')
  var $ = cheerio.load('<h2 class="title">Hello world</h2>')
  
  $('h2.title').text('Hello there!')
  $('h2').addClass('welcome')
  
  return $.html()
}

function regDemo(strIn){
  var strOut = strIn.replace(/(听电影(MP3)?学英语之)|(\s?中英双语MP3\+LRC(\+文本)?)|(\s?$)/g, '');
  return strOut;
}

module.exports = {
  getHtml: getHtml,
  getJs: getJs,
  download: download,
  cheerioDemo: cheerioDemo,
  regDemo: regDemo
}