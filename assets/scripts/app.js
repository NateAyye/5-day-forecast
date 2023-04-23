const tabList = $('.tablist');
const tabButtons = [...$('[role="tab"]')];
console.log(tabButtons);

function moveFocusToTab(currentTab) {
  currentTab.focus();
}

tabList.click((e) => {
  const tgt = e.target;
  const selectedTab = $('[aria-selected="true"]')[0];
  console.log(selectedTab);
  tgt.setAttribute('aria-selected', 'true');
  tgt.setAttribute('tabindex', '0');
  selectedTab.setAttribute('aria-selected', 'false');
  selectedTab.setAttribute('tabindex', '-1');
});

tabList.keydown((e) => {
  const currentTab = e.target;
  const index = tabButtons.indexOf(currentTab);

  flag = false;

  switch (e.code) {
    case 'ArrowDown':
    case 'ArrowRight':
      const nextTabRight =
        tabButtons[index === tabButtons.length - 1 ? 0 : index + 1];
      nextTabRight.focus();
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      const nextTabLeft =
        tabButtons[index === 0 ? tabButtons.length - 1 : index - 1];
      nextTabLeft.focus();
      break;
    case 'Home':
      this.moveFocusToTab(tabButtons[0]);
      flag = true;
      break;
    case 'End':
      this.moveFocusToTab(tabButtons[tabButtons.length - 1]);
      flag = true;
      break;
  }
  if (flag) {
    e.stopPropagation();
    e.preventDefault();
  }
});
