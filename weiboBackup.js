/**
 * 获取微博以及评论文字
 * 先打开微博页面，
 * 然后将下面的js拷贝到浏览器的console面板中
 */

var nodeArray = Array.from(document.querySelectorAll('.WB_text'));

var textArray = nodeArray.map(function (node) {
    return node.lastChild.nodeValue.replace(/(^：)|(\s*$)|(^\s*)/g, '');
});

console.log(textArray.join('\n'));