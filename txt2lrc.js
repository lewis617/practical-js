var fs = require('fs');
var path = require('path');
var os = require('os');
var glob = require('glob');
var Iconv = require('iconv').Iconv;
var mp3Duration = require('mp3-duration');

// 更改这个变量为你的文件目录
var dirPath = path.join(os.homedir(), 'Downloads', '求职英语300句');

function readFileSync_encoding(filename, encoding) {
    var content = fs.readFileSync(filename);
    var iconv = new Iconv(encoding, 'UTF-8');
    var buffer = iconv.convert(content);
    return buffer.toString('utf8');
}

function txtFileToLrc(filePath) {
    var strIn = readFileSync_encoding(filePath, 'gb18030');

    try {
        var arrayOut = strIn
            .split(/A:|I:|R:|B:/)
            .filter(function (item) {
                return item && !/[\u4e00-\u9fa5]/.test(item)
            });

        // var arrayOut = strIn
        //     .split(/[\u4e00-\u9fa5]/)[0]
        //     .replace(/[\r\n]/g, '')
        //     .replace(/’/g, '\'')
        //     .split(/A:|B:/)
        //     .slice(1);
    } catch (err) {
        console.log(err, filePath);
    }

    mp3Duration(filePath.replace('.txt', '.mp3'), function (err, duration) {
        if (err) return console.log(err.message);

        var durationLength = duration/arrayOut.join('').length;

        var lastSec = 0.00;

        var strOut = arrayOut.reduce(function (last, current, index) {
            var currentSec = lastSec + (current.length *durationLength).toFixed(2) * 1;

            var sec = (lastSec % 60).toFixed(2);
            var min = Math.floor(lastSec / 60);
            var numFormate = function (num) {
                return num >= 10 ? num : ('0' + num);
            };

            lastSec = currentSec;
            var minSec = '[' + numFormate(min) + ':' + numFormate(sec) + ']';
            var addStr = (index > 0 ? '\r\n' : '') + minSec + (index % 2 === 0 ? 'A:' : 'B:');
            return last + addStr + current.replace(/？/g, '?').replace(/，/g, ',');
        }, '');

        var lrcPath = filePath.replace('.txt', '.lrc');
        fs.writeFile(lrcPath, strOut, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log(lrcPath, ' is done!');
        });

    });


}

glob(path.join(dirPath, '*.txt'), function (err, files) {
    files.forEach(function (file) {
        txtFileToLrc(file);
    });
});
