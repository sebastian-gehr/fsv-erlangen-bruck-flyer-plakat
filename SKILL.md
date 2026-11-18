---
name: fsv-erlangen-bruck-flyer-plakat
description: Erstellt Flyer und Plakate für Veranstaltungen des FSV Erlangen-Bruck (Weihnachtsfeier, Fasching, Sommerfest, Tennis-Vereinsmeisterschaften, Kleinfeldturnier …) im Stil der Vereinswebsite als A4-Plakat, A5-Flyer (PDF) und Social-Media-Quadrat (PNG).
---

# FSV Erlangen-Bruck – Flyer und Plakate

Mit diesem Skill entstehen Plakate und Flyer für Veranstaltungen des **FSV Erlangen-Bruck e.V.** – immer im gleichen Stil wie die Vereinswebsite (fsverlangenbruck.de). Wer ihn nutzt, nennt nur die Eckdaten, z. B.:

> Weihnachtsfeier, Sa 19.12.2026, 16–22 Uhr, ehemaliges Birkenwäldchen, Glühwein, Grill, Crêpes, Posaunenchor Bruck, Feuerkörbe

Claude füllt daraus eine **feste Vorlage** (unten) und rendert sie. Keine KI-Bildgenerierung: Logo, Schriften und Farben kommen immer aus der Vorlage, damit jeder Flyer gleich aussieht und keine Texte verfälscht werden.

## Ablauf

1. **Eckdaten klären.** Pflicht: Anlass, Titel, Datum, Uhrzeit, Ort. Optional: Zeile über dem Titel (`eyebrow`, z. B. „Gemeinsamer Jahresausklang“ oder „Tennisabteilung“), Programmpunkte, ein Hinweis (z. B. „Eintritt frei“, „Anmeldung bis …“). Fehlt eine Pflichtangabe, kurz nachfragen. **Nichts erfinden** – keine Preise, Namen, Uhrzeiten oder Programmpunkte, die nicht genannt wurden.
2. **Daten-JSON schreiben** (Schema unten). Texte kurz halten: Titel 1–2 Wörter (lange Wörter mit Bindestrich auf zwei Zeilen trennen, z. B. `["Weihnachts-", "feier"]`), Programmpunkte höchstens 4 Wörter.
3. **Dateien des Skills nutzen, nicht nachbauen:** `vorlage/flyer.html` (Layout, Farben, Symbole), `assets/fsv-wappen.svg` (Wappen als Vektorgrafik), `scripts/render.mjs` (Rendern). Nichts davon ändern.
4. **Rendern:** `node <skill-ordner>/scripts/render.mjs daten.json ausgabe` (Formate: `a4,a5,quadrat`, Standard alle drei). Ergebnis: `<dateiname>-a4.pdf/.png`, `-a5.pdf/.png`, `-quadrat.png`.
   - Fehlt Playwright: `npm i playwright && npx playwright install chromium` versuchen. Geht das nicht (kein Netz), liefert das Skript nur die HTML-Dateien; diese als Ergebnis geben mit dem Hinweis „im Browser öffnen → Drucken → Als PDF speichern, Ränder: keine, Hintergrundgrafiken an“.
   - Warnungen des Skripts beachten (Titel zu lang, Programm zu lang, Schrift nicht geladen) und Texte kürzen, dann neu rendern.
5. **Prüfen:** die PNGs ansehen (Datum, Wochentag, Uhrzeit, Ort, Schreibweise „FSV Erlangen-Bruck“). Dann alle Dateien als Entwurf zur Freigabe übergeben.

## Gestaltungsregeln (nicht ändern)

- Aufbau: Navy-Kopf mit Wappen und „FSV Erlangen-Bruck e.V. lädt ein“, großer Titel, weiße Terminkarte mit blauem Kalenderblatt, darunter Programm-Kacheln, dunkle Fußleiste mit fsverlangenbruck.de.
- Farben: FSV-Blau `#0073B6`, Navy `#0B3A5B`, Fußleiste `#0B2233`, Kachelfläche `#F1F6FA`, Text `#14212B`. **Text auf Blau oder Navy ist immer weiß** (bzw. die hellen Töne aus der Vorlage). Kein Orange.
- Schriften: Barlow (Text) und Barlow Condensed (Titel, Datum).
- Akzentfarbe je Anlass **nur für die Deko-Symbole** im Kopf, nie für Text.
- Wappen nie verzerren, umfärben oder beschneiden; immer „FSV Erlangen-Bruck“, nie „FSV Bruck“.
- Kacheln ohne Rahmen, Ecken 8 px; Schatten nur auf der Terminkarte.
- Personen nicht farbig hervorheben.

## Anlässe (`anlass`)

| Wert | Akzent | Deko |
|---|---|---|
| `weihnachten` | Gold `#F2C94C` | Sterne |
| `fasching` | Rosa `#F48FB1` | Konfetti |
| `sommerfest` | Sonnengelb `#FFD54F` | Sonnen |
| `tennis` | Ballgelb `#D4E157` | Tennisbälle |
| `fussball` | Rasengrün `#8BD3A0` | Fußbälle |
| `allgemein` | Hellblau `#8EC5EA` | Sterne |

Andere Anlässe: `allgemein` nehmen, oder `akzent` (Hexfarbe) und `deko` (ein Symbolname) direkt setzen.

## Symbole (`icon`)

`getraenke` (Tasse/Glühwein), `bier`, `grill`, `essen` (Besteck), `crepes`, `kuchen`, `blasmusik` (Posaunenchor, Blaskapelle), `musik`, `tanz`, `feuer`, `gespraech`, `kinder`, `tombola`, `pokal`, `ball`, `tennis`, `maske` (Fasching), `sonne`, `info`, `stern`, `konfetti`.

## Daten-Schema

```json
{
  "dateiname": "weihnachtsfeier-2026",
  "anlass": "weihnachten",
  "eyebrow": "Gemeinsamer Jahresausklang",
  "titel": ["Weihnachts-", "feier"],
  "datum": "2026-12-19",
  "datum_bis": null,
  "zeit": "16:00 – 22:00 Uhr",
  "ort": "Im ehemaligen Birkenwäldchen",
  "karte_zusatz": null,
  "programm_titel": "Programm",
  "programm_zusatz": "in weihnachtlicher Atmosphäre",
  "programm": [
    { "icon": "getraenke", "text": "Glühwein und andere Getränke" },
    { "icon": "grill", "text": "Spezialitäten vom Grill" },
    { "icon": "crepes", "text": "Crêpes" },
    { "icon": "blasmusik", "text": "Posaunenchor Bruck" },
    { "icon": "feuer", "text": "Feuerkörbe" },
    { "icon": "musik", "text": "Musikalischer Hintergrund" },
    { "icon": "gespraech", "text": "Nette Gespräche" }
  ],
  "programm_quadrat": [
    { "icon": "getraenke", "text": "Glühwein und Getränke" },
    { "icon": "grill", "text": "Spezialitäten vom Grill" },
    { "icon": "crepes", "text": "Crêpes" },
    { "icon": "blasmusik", "text": "Posaunenchor Bruck" },
    { "icon": "feuer", "text": "Feuerkörbe" },
    { "icon": "musik", "text": "Musik und nette Gespräche" }
  ],
  "hinweis": null,
  "einladung": "lädt ein",
  "web": "fsverlangenbruck.de"
}
```

- `datum` / `datum_bis` im Format JJJJ-MM-TT; Wochentag und Monat berechnet die Vorlage selbst. `datum_bis` für mehrtägige Veranstaltungen.
- `zeit` mit Halbgeviertstrich und Leerzeichen: „16:00 – 22:00 Uhr“ oder „ab 10:00 Uhr“.
- `karte_zusatz`: dritte Zeile in der Terminkarte (z. B. „Eintritt frei“).
- A4/A5: höchstens 8 Programmpunkte. Quadrat: höchstens 6 (`programm_quadrat`, sonst die ersten 6 aus `programm`); `hinweis` erscheint nur auf A4/A5.
- A5 ist das A4-Layout verkleinert, gut für Handzettel; A4 für Aushänge; Quadrat (1080 × 1080) für Instagram, Facebook und WhatsApp-Status.

## Dateien im Skill

- `vorlage/flyer.html` – die feste Vorlage (Daten, Format und Wappen setzt das Skript ein)
- `assets/fsv-wappen.svg` – Wappen als Vektorgrafik (Blau `#006EB7`, Schwarz, Weiß)
- `scripts/render.mjs` – erzeugt HTML, PDF (A4, A5) und PNG (alle Formate) mit Playwright/Chromium
- `beispiele/weihnachtsfeier-2026.json` – Beispieldaten (Weihnachtsfeier 19.12.2026)
