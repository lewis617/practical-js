/**
 * 获取微博以及评论文字
 * 先打开微博页面，
 * 然后将下面的js拷贝到浏览器的console面板中
 */

var nodeArray = Array.from(document.querySelectorAll('.list_con .WB_text'));

var textArray = nodeArray.map(function (node) {
  return Array.from(node.childNodes).map(function (childNode) {
    var value;
    // 文字的情况
    if (childNode.nodeName === '#text') value = childNode.nodeValue;
    // 图片表情的情况
    else if (childNode.nodeName === 'IMG') value = childNode.alt;
    // 链接的情况
    else if (childNode.nodeName === 'A') value = childNode.lastChild.nodeValue;
    return value.replace(/(\s+$)|(^\s+)/g, '');
  }).join('');
});

// console.log(textArray.join('\n'));

// 本行代码用于单元测试，请不要拷贝到浏览器的console中运行
module.exports = textArray;
