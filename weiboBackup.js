/**
 * 获取微博以及评论文字
 * 先打开微博页面，
 * 然后将下面的js拷贝到浏览器的console面板中
 */

var nodeArray = Array.from(document.querySelectorAll('.WB_text'));

var textArray = nodeArray.map(function (node) {
  var startContent = false;
  return Array.from(node.childNodes).map(function(childNode){
    // 过滤评论人
    if(childNode.nodeName==='#text' && childNode.nodeValue.match(/^：/)) startContent = true;
  
    // 判断是否开始评论内容
    if(startContent){
      // 文字的情况
      if(childNode.nodeName==='#text') return childNode.nodeValue.replace(/(^：)|(\s+$)|(^\s+)/g, '');
      // 图片表情的情况
      else if(childNode.nodeName === 'IMG') return childNode.alt;
    }
  }).join('');
});

console.log(textArray.join('\n'));