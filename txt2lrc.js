var fs = require('fs');
var path = require('path');
var os = require('os');
var glob = require('glob');
var Iconv = require('iconv').Iconv;

// 更改这个变量为你的文件目录
var dirPath = path.join(os.homedir(), 'Downloads', '办公室英语口语（MP3+文本）');

function readFileSync_encoding(filename, encoding) {
    var content = fs.readFileSync(filename);
    var iconv = new Iconv(encoding, 'UTF-8');
    var buffer = iconv.convert(content);
    return buffer.toString('utf8');
}

function txtFileToLrc(filePath) {
    var strIn = readFileSync_encoding(filePath, 'gb18030');
    var arrayOut = strIn
        .split(/[\u4e00-\u9fa5]/)[0]
        .replace(/[\r\n]/g, '')
        .replace(/’/g, '\'')
        .split(/A:|B:/);
    var strOut = arrayOut.reduce(function (last, current, index) {
        var addStr = '';
        if (index === 0) {
            addStr = '[00:00.00]';
        } else if (index === 1) {
            addStr = '\tA:';
        } else if (index % 2 === 0) {
            addStr = '\r\n[00:0' + index + '.00]B:'
        } else if (index & 1 === 1) {
            addStr = '\r\n[00:0' + index + '.00]A:'
        }
        return last + addStr + current;
    }, '');

    var lrcPath = filePath.replace('.txt', '.lrc');
    fs.writeFile(lrcPath, strOut, function (err) {
        if (err) {
            return console.error(err);
        }
        console.log(lrcPath, ' is done!');
    });
}

glob(path.join(dirPath, '*.txt'), function (err, files) {
    files.forEach(function (file) {
        txtFileToLrc(file);
    });
});
