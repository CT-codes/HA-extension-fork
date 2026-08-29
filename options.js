const fields = {
  url: document.getElementById('url'),
  width: document.getElementById('width'),
  height: document.getElementById('height'),
  hideHeader: document.getElementById('hide-header'),
  headerHeight: document.getElementById('header-height'),
};

const saveButton = document.getElementById('save');
const previewWrapper = document.getElementById('preview-wrapper');
const widthValue = document.getElementById('width-value');
const heightValue = document.getElementById('height-value');

let savedTimeout = null;

function currentOptions() {
  return {
    url: fields.url.value.trim(),
    width: Number(fields.width.value),
    height: Number(fields.height.value),
    hideHeader: fields.hideHeader.checked,
    headerHeight: Number(fields.headerHeight.value) || DEFAULT_OPTIONS.headerHeight,
  };
}

function refresh() {
  const options = currentOptions();

  widthValue.textContent = options.width + 'px';
  heightValue.textContent = options.height + 'px';
  fields.headerHeight.disabled = !options.hideHeader;

  const offset = options.hideHeader ? options.headerHeight : 0;
  previewWrapper.style.width = options.width + 'px';
  previewWrapper.style.height = options.height - offset + 'px';

  if (options.url) {
    renderDashboard(previewWrapper, options);
  } else {
    previewWrapper.textContent = '';
  }
}

function save() {
  saveOptions(currentOptions(), () => {
    saveButton.textContent = 'Gespeichert!';
    saveButton.disabled = true;

    clearTimeout(savedTimeout);
    savedTimeout = setTimeout(() => {
      saveButton.textContent = 'Speichern';
      saveButton.disabled = false;
    }, 2000);
  });
}

loadOptions((options) => {
  fields.url.value = options.url;
  fields.width.value = options.width;
  fields.height.value = options.height;
  fields.hideHeader.checked = options.hideHeader;
  fields.headerHeight.value = options.headerHeight;
  refresh();
});

Object.values(fields).forEach((field) => {
  field.addEventListener('input', refresh);
  field.addEventListener('change', refresh);
});

saveButton.addEventListener('click', save);
