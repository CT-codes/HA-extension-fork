# Home Assistant Extension (local Chrome build)

Shows a Home Assistant dashboard view in a popup on the Chrome toolbar.

Personal fork of [bokub/home-assistant-extension](https://github.com/bokub/home-assistant-extension),
rebuilt as a local, unpacked extension.

## What is different from the original

| | Original | This fork |
| --- | --- | --- |
| Build | Webpack + Vue 2 + Bulma, `npm run build` | none — plain HTML, CSS and JS, loaded as-is |
| Settings storage | `chrome.storage.sync` (synced to your Google account) | `chrome.storage.local` (stays on this machine) |
| Browsers | Chrome (MV3) and Firefox (MV2) | Chrome only |
| Distribution | Chrome Web Store / Firefox Add-ons | loaded unpacked from this folder |

The context menu is also registered in `chrome.runtime.onInstalled` instead of at the
top level of the service worker, which avoids a duplicate-id error every time MV3
restarts the worker.

## 1. Prepare Home Assistant

Home Assistant sends an `X-Frame-Options` header that stops any page from embedding it
in a frame. That has to be turned off, otherwise the popup stays blank.

**Recent versions** (HTTP config has been migrated to the UI):

**Settings > System > Network > HTTP server > Advanced options**, then turn off
**Send X-Frame-Options** (German UI: _HTTP-Server > Weitere Optionen > X-Frame-Options senden_).

An `http:` block in `configuration.yaml` is ignored once this migration has happened,
and stops working entirely in 2027.2.0 — remove it if it is still there.

**Older versions:** add this to `configuration.yaml` and restart Home Assistant.

```yaml
http:
  use_x_frame_options: false
```

> Only do this if your Home Assistant is not exposed to the open internet, or is behind
> a reverse proxy that sets its own framing rules. The header exists to prevent
> clickjacking.

Then, in your dashboard, **create a new view** holding the cards you want in the popup:

- With a single card, turn on **panel mode** — it looks much better
- A view-specific theme lets the popup match your browser's color scheme
- The view can be hidden from the dashboard's tab bar; the extension still reaches it
- Give the view its own URL, for example `extension`

## 2. Install in Chrome

1. Open `chrome://extensions` and turn on **Developer mode** (top right)
2. Click **Load unpacked** and select this folder
3. Pin the extension so the icon stays visible in the toolbar

Chrome loads the extension from this folder for as long as it stays in place — don't
move or delete it. Keep Developer mode on, or Chrome disables unpacked extensions.

## 3. Configure

Right-click the toolbar icon and choose **Configure**, or click **Open options** in the
popup while it is still unconfigured.

| Setting | Meaning |
| --- | --- |
| **URL** | Address of the view as it appears in your browser, e.g. `https://home.example.com/lovelace/extension` |
| **Width** / **Height** | Size of the popup, in pixels |
| **Hide header** | Crops the top of the view so the dashboard header is not shown |
| **Header height** | How much to crop — Home Assistant's header is 56 pixels |

The preview on the right updates as you type. Click **Save** to keep the settings; the
popup uses them the next time you open it.

Chrome caps extension popups at **800 × 600 pixels**. The sliders allow a bit more than
that so a cropped header still leaves 600 usable pixels (655 − 56 = 599); going past the
cap just gets you scrollbars.

## Project layout

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (MV3) |
| `background.js` | Service worker — adds the _Configure_ context menu |
| `popup.html` / `popup.js` / `popup.css` | Toolbar popup |
| `options.html` / `options.js` / `options.css` | Options page with the live preview |
| `dashboard.js` / `dashboard.css` | Shared code: defaults, storage access, rendering the frame |
| `images/` | Icons |

`dashboard.js` is loaded by both pages as a plain script, so the popup and the preview
on the options page render through exactly the same code path.

## Making changes

There is no build step. Edit a file, then:

- **Popup or options page:** just reopen it
- **`manifest.json` or `background.js`:** press **Reload** on the extension's card in
  `chrome://extensions`

To debug the popup, right-click it and choose **Inspect**. The service worker has its
own **Service worker** link on the `chrome://extensions` card.

## Troubleshooting

**Popup is blank or shows a frame error.** `X-Frame-Options` is still being sent — see
step 1. Check the popup's console (right-click > Inspect) for the exact message.

**Popup shows a login screen every time.** The frame uses the browser's normal cookies,
so log in to Home Assistant once in a regular tab and tick "Keep me logged in".

**Settings are gone after reinstalling.** Chrome derives the extension ID from the
folder path, and `chrome.storage.local` is tied to that ID. Loading the extension from a
different location gives you a fresh, empty configuration.

**"Configure" is missing from the context menu.** It is only created on install. Press
**Reload** on the `chrome://extensions` card.

## License

MIT — see [LICENSE](LICENSE). Original work by Boris K ([bokub](https://github.com/bokub)).
