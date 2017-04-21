var request = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var fs = require('fs');

var baseUrl = 'http://www.rrting.net/English/';
var urlSuffix = 'movie_mp3/3738/';
var downloadPath = '/Users/liuyiqi/Downloads/';
var replaceReg = /(听电影(MP3)?学英语之)|(\s?中英双语MP3\+LRC(\+文本)?)/g;

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

            $("#tab li").each(function (idx, element) {
                var $a = $(element).children().last();
                parts.push({
                    id: $a.attr('href').split('English/')[1],
                    title: $a.attr('title').replace(replaceReg,'')
                });
            });
            downloadPath += parts[0].title.slice(0, -2) + '/';

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
            download(partData.mp3url, downloadPath + partData.title + '.mp3');
            download(partData.texturl, downloadPath + partData.title + '.lrc');
        });
    })
}

startDownload();