const ID = 'configure';

// Der Service Worker startet ständig neu, deshalb wird das Menü einmalig bei der Installation angelegt
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Einstellungen',
    contexts: ['action'],
    id: ID,
  });
});

chrome.contextMenus.onClicked.addListener((menuItem) => {
  if (menuItem.menuItemId === ID) {
    chrome.runtime.openOptionsPage();
  }
});
