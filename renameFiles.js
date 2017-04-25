/**
 * 批量重命名
 * 请修改目录名和匹配替换项
 */
var fs = require('fs');
var path = require('path');
var os = require('os');
var glob = require('glob');

// 更改这个变量为你的文件目录
var dirPath = path.join(os.homedir(), 'Downloads', '办公室英语口语（MP3+文本）');

glob(path.join(dirPath, '*.*'), function (err, files) {
    files.forEach(function (fileName) {
        var newFileName = fileName.replace(/第(\d)课/, '第00$1课').replace(/第(\d{2})课/, '第0$1课');
        fs.rename(fileName, newFileName, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
    });
});