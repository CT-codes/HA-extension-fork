# Home Assistant Extension (lokaler Chrome-Build)

Zeigt eine Home-Assistant-Dashboard-Ansicht in einem Popup in der Chrome-Symbolleiste.

Persönlicher Fork von [bokub/home-assistant-extension](https://github.com/bokub/home-assistant-extension),
umgebaut zu einer lokalen, entpackten Erweiterung.

## Unterschiede zum Original

| | Original | Dieser Fork |
| --- | --- | --- |
| Build | Webpack + Vue 2 + Bulma, `npm run build` | keiner — reines HTML, CSS und JS, wird direkt geladen |
| Einstellungen | `chrome.storage.sync` (Sync mit dem Google-Konto) | `chrome.storage.local` (bleibt auf diesem Rechner) |
| Browser | Chrome (MV3) und Firefox (MV2) | nur Chrome |
| Verteilung | Chrome Web Store / Firefox Add-ons | entpackt aus diesem Ordner geladen |

Außerdem wird das Kontextmenü in `chrome.runtime.onInstalled` registriert statt auf oberster
Ebene des Service Workers. Das vermeidet einen Fehler wegen doppelter ID, sobald MV3 den
Worker neu startet.

## 1. Home Assistant vorbereiten

Home Assistant sendet einen `X-Frame-Options`-Header, der jede Einbettung in einen Frame
verhindert. Der muss abgeschaltet werden, sonst bleibt das Popup leer.

**Aktuelle Versionen** (die HTTP-Konfiguration wurde in die Oberfläche migriert):

**Einstellungen > System > Netzwerk > HTTP-Server > Weitere Optionen**, dort
**X-Frame-Options senden** deaktivieren.

Ein `http:`-Block in der `configuration.yaml` wird nach dieser Migration ignoriert und
funktioniert ab Version 2027.2.0 gar nicht mehr — falls noch vorhanden, entfernen.

**Ältere Versionen:** Folgendes in die `configuration.yaml` eintragen und Home Assistant
neu starten.

```yaml
http:
  use_x_frame_options: false
```

> Nur abschalten, wenn dein Home Assistant nicht offen im Internet steht oder hinter einem
> Reverse Proxy sitzt, der eigene Framing-Regeln setzt. Der Header schützt vor Clickjacking.

Danach im Dashboard **eine neue Ansicht anlegen** mit den Karten, die im Popup erscheinen sollen:

- Bei nur einer Karte den **Panel-Modus** aktivieren — sieht deutlich besser aus
- Ein eigenes Theme für die Ansicht passt das Popup an das Farbschema des Browsers an
- Die Ansicht darf in der Tab-Leiste des Dashboards ausgeblendet sein, die Erweiterung
  erreicht sie trotzdem
- Der Ansicht eine eigene URL geben, zum Beispiel `extension`

## 2. In Chrome installieren

1. `chrome://extensions` öffnen und oben rechts den **Entwicklermodus** einschalten
2. Auf **Entpackte Erweiterung laden** klicken und diesen Ordner auswählen
3. Die Erweiterung anpinnen, damit das Symbol dauerhaft sichtbar bleibt

Chrome lädt die Erweiterung aus diesem Ordner, solange er dort liegt — also nicht
verschieben oder löschen. Der Entwicklermodus muss eingeschaltet bleiben, sonst
deaktiviert Chrome entpackte Erweiterungen.

## 3. Einrichten

Rechtsklick auf das Symbol in der Symbolleiste und **Configure** wählen, oder im noch
nicht eingerichteten Popup auf **Open options** klicken.

| Einstellung | Bedeutung |
| --- | --- |
| **URL** | Adresse der Ansicht, so wie sie im Browser steht, z. B. `https://home.example.com/lovelace/extension` |
| **Width** / **Height** | Größe des Popups in Pixeln |
| **Hide header** | Schneidet den oberen Rand ab, sodass der Dashboard-Header verschwindet |
| **Header height** | Wie viel abgeschnitten wird — der Header von Home Assistant ist 56 Pixel hoch |

Die Vorschau rechts aktualisiert sich beim Tippen. **Save** speichert die Einstellungen,
das Popup übernimmt sie beim nächsten Öffnen.

Chrome begrenzt Popups von Erweiterungen auf **800 × 600 Pixel**. Die Regler erlauben
etwas mehr, damit bei abgeschnittenem Header noch 600 nutzbare Pixel übrig bleiben
(655 − 56 = 599). Alles darüber führt nur zu Scrollbalken.

## Aufbau des Projekts

| Datei | Zweck |
| --- | --- |
| `manifest.json` | Manifest der Erweiterung (MV3) |
| `background.js` | Service Worker — legt den Kontextmenü-Eintrag _Configure_ an |
| `popup.html` / `popup.js` / `popup.css` | Popup in der Symbolleiste |
| `options.html` / `options.js` / `options.css` | Optionsseite mit Live-Vorschau |
| `dashboard.js` / `dashboard.css` | Gemeinsamer Code: Standardwerte, Storage-Zugriff, Aufbau des Frames |
| `images/` | Symbole |

`dashboard.js` wird von beiden Seiten als einfaches Skript eingebunden. Popup und Vorschau
auf der Optionsseite laufen dadurch über exakt denselben Code.

## Änderungen vornehmen

Es gibt keinen Build-Schritt. Datei bearbeiten, dann:

- **Popup oder Optionsseite:** einfach neu öffnen
- **`manifest.json` oder `background.js`:** auf der Karte der Erweiterung in
  `chrome://extensions` auf **Aktualisieren** klicken

Zum Debuggen des Popups Rechtsklick darauf und **Untersuchen** wählen. Der Service Worker
hat auf der Karte in `chrome://extensions` einen eigenen Link.

## Fehlerbehebung

**Popup bleibt leer oder zeigt einen Frame-Fehler.** `X-Frame-Options` wird noch gesendet
— siehe Schritt 1. Die genaue Meldung steht in der Konsole des Popups
(Rechtsklick > Untersuchen).

**Popup zeigt jedes Mal den Login.** Der Frame nutzt die normalen Cookies des Browsers.
Einmal in einem regulären Tab bei Home Assistant anmelden und „Angemeldet bleiben"
ankreuzen.

**Einstellungen sind nach einer Neuinstallation weg.** Chrome leitet die Erweiterungs-ID
aus dem Ordnerpfad ab, und `chrome.storage.local` hängt an dieser ID. Wird die Erweiterung
aus einem anderen Verzeichnis geladen, ist die Konfiguration leer.

**Der Eintrag „Configure" fehlt im Kontextmenü.** Er wird nur bei der Installation
angelegt. Auf der Karte in `chrome://extensions` auf **Aktualisieren** klicken.

## Lizenz

MIT — siehe [LICENSE](LICENSE). Ursprüngliche Arbeit von Boris K ([bokub](https://github.com/bokub)).
