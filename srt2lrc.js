var fs = require('fs');
var path = require('path');
var os = require('os');
var glob = require('glob');

// 更改这个变量为你的 srt 文件目录，运行 node srt2lrc ，然后生成的 lrc 文件也将会保存在这个目录中
var dirPath = path.join(os.homedir(), 'Downloads', 'C0126.A01.Subtitle');

function srtBlockToLrc(block) {
    var srtBlockReg = new RegExp("(\\d+)[^\\S\\r\\n]*[\\r\\n]" +
        "(\\d{2}:\\d{2}:\\d{2},\\d{3,4})[^\\S\\r\\n]*-->[^\\S\\r\\n]*(\\d{2}:\\d{2}:\\d{2},\\d{3,4})[^\\S\\r\\n]*[\\r\\n]" +
        "([\\s\\S]*)");

    var array = srtBlockReg.exec(block);
    var timeStart = array[2].slice(3, -1).replace(',', '.'),
        content = array[4].replace('\n', ' ');
    return '[' + timeStart + ']' + content + '\n';
}

function srtFileToLrc(filePath) {
    var buffer = fs.readFileSync(filePath);
    var strIn = buffer.toString();
    var blocksIn = strIn
        .replace(/\r\n/g, '\n')
        .split('\n\n')
        .filter(function (block) {
            return block.length > 0;
        });
    var blocksOut = blocksIn.map(srtBlockToLrc);
    var lrcPath = filePath.replace('.srt', '.lrc');
    fs.writeFile(lrcPath, blocksOut.join(''), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log(lrcPath, ' is done!');
    });
}

glob(path.join(dirPath, '*.srt'), function (err, files) {
    files.forEach(function (file) {
        srtFileToLrc(file);
    });
});
