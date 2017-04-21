var request = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var fs = require('fs');

var baseUrl = 'http://www.rrting.net/English/movie_mp3/';
var movieId = '3322';
var downloadPath = '/Users/liuyiqi/Downloads/风雨哈佛路/';

charset(request);

function getIdsAndTitles(cb) {
    request.get(baseUrl + movieId)
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
                    id: $a.attr('href').split('/')[3],
                    title: $a.attr('title').split(' ')[0].split('之')[1]
                });
            });
            if (cb) {
                cb(parts.sort(function (a, b) {
                    if (a.id > b.id) {
                        return 1;
                    } else if (a.id < b.id) {
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
    if(!fs.existsSync(downloadPath)){
        fs.mkdirSync(downloadPath)
    }
    getMp3AndLrcUrls(function (parts) {
        parts.forEach(function (partData, index) {
            // console.log(partData.mp3url);
            download(partData.mp3url, downloadPath + partData.title + '.mp3');
            download(partData.texturl, downloadPath + partData.title + '.lrc');
        });
    })
}

startDownload();