function moveFocusToTab(currentTab) {
  currentTab.focus();
}

function handleKeyDown(e, tabButtons) {
  if (!tabButtons.includes(e.target)) return;
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
      moveFocusToTab(tabButtons[0]);
      flag = true;
      break;
    case 'End':
      moveFocusToTab(tabButtons[tabButtons.length - 1]);
      flag = true;
      break;
  }
  if (flag) {
    e.stopPropagation();
    e.preventDefault();
  }
}

function makeAccessible() {
  const tabList = $('.tablist');
  const tabButtons = [...$('[role="tab"]')];
  const panels = [...$('[role="tabpanel"]')];

  tabButtons.forEach((btn, i) => {
    if (i === 0) {
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.setAttribute('aria-selected', 'false');
    }
  });

  panels.forEach((panel, i) => {
    if (i === 0) {
      panel.class = '';
    } else {
      panel.classList.add('is-hidden');
    }
  });

  function hadleTabChange(e) {
    if (!tabButtons.includes(e.target)) return;
    const tgt = e.target;
    const selectedTab = $('[aria-selected="true"]')[0];
    const panel = $(`#${tgt.getAttribute('aria-controls')}`)[0];
    if (!selectedTab) {
      $('div[role="tabpanel"]').addClass('is-hidden');
    }
    tabButtons.forEach((tab) => {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });
    panels.forEach((panel) => {
      panel.classList.add('is-hidden');
    });
    tgt.setAttribute('aria-selected', 'true');
    tgt.setAttribute('tabindex', '0');
    panel.classList.remove('is-hidden');
  }

  tabList.click(hadleTabChange);

  tabList.keydown((e) => handleKeyDown(e, tabButtons));
}

makeAccessible();
