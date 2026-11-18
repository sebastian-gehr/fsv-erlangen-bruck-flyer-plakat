# FSV Erlangen-Bruck – Flyer und Plakate

Vorlage und KI-Skill für Veranstaltungsflyer des FSV Erlangen-Bruck e.V. im Stil der Vereinswebsite: A4-Plakat und A5-Flyer als PDF, dazu ein Quadrat (1080 × 1080) für Instagram, Facebook und WhatsApp.

Die Anleitung für die KI steht in `SKILL.md`. Dieses README richtet sich an Menschen.

## Inhalt

| Datei | Zweck |
|---|---|
| `SKILL.md` | Anleitung für die KI: Ablauf, Gestaltungsregeln, Daten-Schema |
| `vorlage/flyer.html` | feste Vorlage (Layout, Farben, Symbole) |
| `assets/fsv-wappen.svg` | Wappen als Vektorgrafik |
| `scripts/render.mjs` | erzeugt PDF und PNG aus einer Daten-Datei |
| `beispiele/weihnachtsfeier-2026.json` | Beispiel |

## Herunterladen

Die aktuelle Fassung gibt es unter **Releases** (rechts auf der GitHub-Seite) als `fsv-erlangen-bruck-flyer-plakat.zip`, dazu das Beispiel als PDF.

## Nutzung mit KI

Der Ordner folgt dem offenen Skill-Format (ein Ordner mit `SKILL.md` und Zusatzdateien), das Claude und weitere KI-Werkzeuge lesen.

- **Claude (claude.ai, Desktop-App):** Einstellungen → Fähigkeiten → Skills → ZIP dieses Ordners hochladen. Code-Ausführung muss eingeschaltet sein.
- **Claude Code:** Ordner nach `~/.claude/skills/fsv-erlangen-bruck-flyer-plakat/` kopieren.
- **Andere Werkzeuge mit Skill-Unterstützung:** Ordner in deren Skill-Verzeichnis kopieren (siehe Doku des Werkzeugs).
- **KI ohne Skills (z. B. ein normaler Chat):** `SKILL.md` als Anleitung in den Chat geben. Die KI erstellt daraus die Daten-Datei; gerendert wird dann wie unten „ohne KI“.

Danach reicht ein Satz wie:

> Flyer für die Weihnachtsfeier, Sa 19.12.2026, 16–22 Uhr, ehemaliges Birkenwäldchen, Glühwein, Grill, Crêpes, Posaunenchor Bruck

## Nutzung ohne KI

Voraussetzung: [Node.js](https://nodejs.org) ab Version 20.

```bash
npm install
npx playwright install chromium
npm run beispiel                               # Beispiel nach ausgabe/
node scripts/render.mjs meine-feier.json ausgabe
```

Für eine neue Veranstaltung die Beispiel-Datei kopieren, Texte ändern und das Skript damit aufrufen. Die Felder sind in `SKILL.md` unter „Daten-Schema“ beschrieben. Die Schriften (Barlow) lädt die Vorlage von Google Fonts, dafür braucht der Rechner Internet.

## Regeln

Wappen, Farben und Schriften nicht ändern. Gestaltungsregeln: siehe `SKILL.md`. Das Wappen ist Eigentum des FSV Erlangen-Bruck e.V. und nur für Vereinszwecke gedacht.

## Neue Fassung veröffentlichen (für Pflegende)

Änderungen auf `main` committen, dann Version in `package.json` erhöhen und ein Tag pushen, z. B. `git tag v1.1.0 && git push origin v1.1.0`. Der Workflow `.github/workflows/release.yml` legt daraus das Release mit ZIP und Beispiel-PDFs an.
