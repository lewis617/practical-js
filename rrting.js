var request = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var fs = require('fs');
var os = require('os');
var path = require('path');

var baseUrl = 'http://www.rrting.net/English/';
var urlSuffix = 'oral/101025/';
var downloadPath = path.join(os.homedir(), 'Downloads');
var titleReplaceReg = /(听电影(MP3)?学英语之)|(\s?中英双语MP3\+LRC(\+文本)?)/g;
var dirReplaceReg = /([0-9][0-9]$)|(\s?第[0-9][0-9]?课$)/g;

charset(request);

function getIdsAndTitles(cb) {
    request.get(baseUrl + urlSuffix)
        .charset('gb2312')
        .end(function (err, res) {
            if (err) {
                console.error(err);
            }
            var $ = cheerio.load(res.text);
            var parts = [];

            // li 下载页面
            if ($("#tab").length > 0) {
                $("#tab li").each(function (id, element) {
                    var $a = $(element).children().last();
                    parts.push({
                        id: $a.attr('href').replace(baseUrl, ''),
                        title: $a.text().replace(titleReplaceReg, '')
                    });
                });
            } else { // table 下载页面
                $("table a").each(function (id, element) {
                    var $a = $(element);
                    parts.push({
                        id: $a.attr('href').replace(baseUrl, ''),
                        title: $a.text().replace(titleReplaceReg, '')
                    });
                });
            }
            downloadPath = path.join(downloadPath, parts[0].title.replace(dirReplaceReg, ''));

            if (cb) {
                console.log('getIdsAndTitles is complete!');
                cb(parts.sort(function (a, b) {
                    if (a.title > b.title) {
                        return 1;
                    } else if (a.title < b.title) {
                        return -1;
                    } else {
                        return 0;
                    }
                }));
            }
        })
}

function getMp3AndLrcUrls(cb) {
    getIdsAndTitles(function (parts) {
        var numbers = 0;
        parts.forEach(function (partData, index) {
            request.get(baseUrl + partData.id + '/mp3para.js')
                .buffer(true)
                .end(function (err, res) {
                    if (err) {
                        console.error(err);
                    }

                    numbers++;

                    eval(res.text);

                    parts[index]['mp3url'] = mp3url;
                    parts[index]['texturl'] = texturl;

                    if (numbers === parts.length && cb) {
                        console.log('getMp3AndLrcUrls is complete!');
                        cb(parts);
                    }
                })

        });
    })
}

function download(url, localPath) {
    var stream = fs.createWriteStream(localPath);
    stream.on('finish', function () {
        console.log('The download of ' + localPath + ' is complete!');
    });
    var req = request.get(url);
    req.pipe(stream);
}

function startDownload() {
    getMp3AndLrcUrls(function (parts) {

        if (!fs.existsSync(downloadPath)) {
            fs.mkdirSync(downloadPath)
        }

        parts.forEach(function (partData, index) {
            // console.log(partData.mp3url);
            download(partData.mp3url, path.join(downloadPath, partData.title + '.mp3'));
            download(partData.texturl, path.join(downloadPath, partData.title + '.lrc'));
        });
    })
}

startDownload();