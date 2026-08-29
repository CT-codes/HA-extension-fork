// Shared by the popup and the live preview on the options page.

const DEFAULT_OPTIONS = {
  url: '',
  width: 300,
  height: 300,
  hideHeader: false,
  headerHeight: 56,
};

function loadOptions(callback) {
  chrome.storage.local.get(['options'], ({ options }) => {
    callback(Object.assign({}, DEFAULT_OPTIONS, options || {}));
  });
}

function saveOptions(options, callback) {
  chrome.storage.local.set({ options }, callback);
}

function renderDashboard(container, options) {
  container.textContent = '';
  container.appendChild(options.url ? buildFrame(options) : buildAlert());
}

function buildFrame(options) {
  const width = Number(options.width);
  const height = Number(options.height);
  const offset = options.hideHeader ? Number(options.headerHeight) : 0;

  const iframe = document.createElement('iframe');
  iframe.src = options.url;
  iframe.width = width;
  iframe.height = height;
  iframe.style.top = -offset + 'px';
  iframe.name = 'ha-main-window';

  // The wrapper is shorter than the iframe, so the header scrolls out of sight
  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  wrapper.style.width = width + 'px';
  wrapper.style.height = height - offset + 'px';
  wrapper.appendChild(iframe);

  return wrapper;
}

function buildAlert() {
  const section = document.createElement('section');
  section.className = 'alert';

  const title = document.createElement('p');
  title.className = 'title';
  title.textContent = 'The Home Assistant extension is not configured';

  const link = document.createElement('a');
  link.href = '/options.html';
  link.target = '_blank';
  link.textContent = 'Open options';

  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.appendChild(link);

  section.appendChild(title);
  section.appendChild(subtitle);
  return section;
}
