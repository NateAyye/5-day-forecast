function makeAccessible() {
  const tabList = $('.tablist');
  const tabButtons = [...$('[role="tab"]')];
  const panels = [...$('[role="tabpanel"]')];
  // console.log(tabButtons);

  tabButtons.forEach((btn, i) => {
    if (i === 0) {
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.setAttribute('aria-selected', 'false');
    }
  });

  panels.forEach((panel, i) => {
    if (i === 0) {
      panel.classList.remove('is-hidden');
    } else {
      panel.classList.add('is-hidden');
    }
  });

  function moveFocusToTab(currentTab) {
    currentTab.focus();
  }
  function hadleTabChange(e) {
    const tgt = e.target;
    const tabpanel = $(`#${tgt.getAttribute('aria-controls')}`)[0];
    const selectedTab = $('[aria-selected="true"]')[0];

    const nextTabPanel = $(`#${selectedTab.getAttribute('aria-controls')}`)[0];
    //  Sanity Check for making sure the tab(button) doesn't get unselected
    if (tgt === selectedTab || !tabButtons.includes(tgt)) return;

    // console.log(tabpanel, nextTabPanel);

    selectedTab.setAttribute('aria-selected', 'false');
    selectedTab.setAttribute('tabindex', '-1');
    tabpanel.classList.remove('is-hidden');

    tgt.setAttribute('aria-selected', 'true');
    tgt.setAttribute('tabindex', '0');
    nextTabPanel.classList.add('is-hidden');
  }

  function handleKeyDown(e) {
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

  tabList.click(hadleTabChange);

  tabList.keydown(handleKeyDown);
}

makeAccessible();
