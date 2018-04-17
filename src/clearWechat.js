function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function loopFunc(i = 0) {
  return sleep(0)
    .then(() => {
      document.querySelector('.web_wechat_add').click();
      document.querySelector('.dropdown_menu a').click();
      return sleep(500);
    })
    .then(() => {
      document.querySelector('#J_ContactPickerScrollBody').scrollTop += 600 * i;
      return sleep(500);
    })
    .then(() => {
      Array.from(document.querySelectorAll('#J_ContactPickerScrollBody .contact_item')).forEach(item => { item.click() });
      return sleep(500);
    })
    .then(() => {
      document.querySelector('.dialog_ft a').click();
      return sleep(30000);
    });
};

function startLoop() {
  for (let i = 0, p = Promise.resolve(); i < 40; i++) {
    p = p.then(_ => loopFunc(i));
  }
}
