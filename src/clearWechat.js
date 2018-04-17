loopFunc = (i=0) => {
document.querySelector('.web_wechat_add').click();
document.querySelector('.dropdown_menu a').click();
sleep(500).then(() =>{
  document.querySelector('#J_ContactPickerScrollBody').scrollTop+=600*i;
  return sleep(500);
}).then(() =>{
  Array.from(document.querySelectorAll('#J_ContactPickerScrollBody .contact_item')).forEach(item =>{item.click()});
  return sleep(500);
}).then(() =>{
  document.querySelector('.dialog_ft a').click();
  return sleep(500);
})

}
