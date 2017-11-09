test('getweiboBackup', () => {
  document.body.innerHTML = '\
  <div class="list_con">\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2809324184" usercard="id=2809324184">Geo橙子</a>：在过一阵子是不是要翻成英文，走出国门了\
    </div>\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2497287343" usercard="id=2497287343">dev_zk</a>\
      <a target="_blank" suda-data="key=pc_apply_entry&amp;value=feed_icon" href="http://club.weibo.com/intro">\
        <i title="微博达人" class="W_icon icon_club" node-type="daren"></i>\
      </a>\
      ：现在好了\
      <img render="ext" src="//img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_org.gif" title="[太开心]" alt="[太开心]" type="face">\
      <img render="ext" src="//img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_org.gif" title="[太开心]" alt="[太开心]" type="face">\
    </div>\
    <div class="WB_text">\
      <a target="_blank" href="//weibo.com/2497287343" usercard="id=2497287343">dev_zk</a>\
      <a target="_blank" suda-data="key=pc_apply_entry&amp;value=feed_icon" href="http://club.weibo.com/intro">\
      <i title="微博达人" class="W_icon icon_club" node-type="daren"></i>\
      </a>\
      ：哈哈\
    </div>\
  </div>';
  var textArray = require('./weiboBackup');
  expect(textArray).toEqual([
    "Geo橙子：在过一阵子是不是要翻成英文，走出国门了",
    "dev_zk：现在好了[太开心][太开心]",
    "dev_zk：哈哈",
  ]);
});