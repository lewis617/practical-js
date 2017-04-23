var request = require('superagent');
var charset = require('superagent-charset');
var cheerio = require('cheerio');
var fs = require('fs');
var os = require('os');
var path = require('path');

var mainOrigin = 'http://www.rrting.net';
var mainPathname = '/English/oral/101167/';
var downloadPath = path.join(os.homedir(), 'Downloads');
var titleReplaceReg = /(听电影(MP3)?学英语之)|(\s?中英双语MP3\+LRC(\+文本)?)|(\s?$)/g;

charset(request);

function getPathnameAndTitles(cb) {
    request.get(mainOrigin + mainPathname)
        .charset('gb2312')
        .end(function (err, res) {
            if (err) {
                console.error(err);
            }
            var $ = cheerio.load(res.text);
            var parts = [];
            var pushTo$a = function ($a) {
                parts.push({
                    pathname: $a.attr('href').replace(mainOrigin, ''),
                    title: $a.text().replace(titleReplaceReg, '')
                });
            };

            // li 下载页面
            if ($("#tab").length > 0) {
                $("#tab li").each(function (id, element) {
                    var $a = $(element).children().last();
                    pushTo$a($a);
                });
            } else { // table 下载页面
                $("table a").each(function (id, element) {
                    var $a = $(element);
                    pushTo$a($a);
                });
            }
            downloadPath = path.join(downloadPath, $(".STYLE2").text());

            if (cb) {
                console.log('getPathnameAndTitles is complete!');
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
    getPathnameAndTitles(function (parts) {
        var numbers = 0;
        parts.forEach(function (partData, index) {
            request.get(mainOrigin + partData.pathname + 'mp3para.js')
                .buffer(true)
                .end(function (err, res) {
                    if (err) {
                        console.error(err);
                    }

                    numbers++;

                    try {
                        eval(res.text);

                        parts[index]['mp3url'] = mp3url;
                        parts[index]['texturl'] = texturl;
                        parts[index]['wordurl'] = mainOrigin + wordurl;
                    } catch (err) {
                        console.error(partData.title + ' is error: ', err);
                    }

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

        parts.forEach(function (partData) {
            // console.log(partData.mp3url);
            if ('mp3url' in partData) {
                download(partData.mp3url, path.join(downloadPath, partData.title + '.mp3'));
            }
            if ('wordurl' in partData) {
                download(partData.wordurl, path.join(downloadPath, partData.title + '.txt'));
            }
            if ('texturl' in partData && partData.texturl.slice(-11) !== 'default.lrc') {
                download(partData.texturl, path.join(downloadPath, partData.title + '.lrc'));
            }
        });
    })
}

startDownload();