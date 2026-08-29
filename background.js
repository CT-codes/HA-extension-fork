const ID = 'configure';

// The service worker restarts often, so the menu is created once per install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Configure',
    contexts: ['action'],
    id: ID,
  });
});

chrome.contextMenus.onClicked.addListener((menuItem) => {
  if (menuItem.menuItemId === ID) {
    chrome.runtime.openOptionsPage();
  }
});
