# FSV Erlangen-Bruck – Flyer und Plakate

KI-Skill und Vorlage für Veranstaltungsflyer des FSV Erlangen-Bruck e.V. im Vereinsdesign: A4-Plakat und A5-Flyer als PDF, dazu ein Quadrat (1080 × 1080) für Instagram, Facebook und WhatsApp.

Man nennt nur die Eckdaten, der Rest kommt aus einer festen Vorlage – Wappen, Farben und Schriften stimmen immer, und die KI erfindet nichts dazu.

![Drei Stile am Beispiel Weihnachtsfeier: Website, Vereinszeitung, Typo](docs/vorschau.png)

| Stil | Aussehen |
|---|---|
| `website` (Standard) | wie die Vereinswebsite: Navy-Kopf, Terminkarte mit Kalenderblatt, Programm-Kacheln |
| `vereinszeitung` | wie die Vereinszeitung: blaue Schrägbänder, Wappen vor der Brucker Kirche |
| `typo` | Plakat ganz in Blau, Titel und Datum riesig, Laufband mit den Highlights |

## Installation

### Kommandozeile – für Claude Code, Codex (GPT), Gemini CLI, Cursor, GitHub Copilot u. a.

Der Skill folgt dem offenen [Agent-Skills-Format](https://agentskills.io) und lässt sich mit dem Werkzeug [`skills`](https://github.com/vercel-labs/skills) in alle gängigen KI-Agenten installieren:

```bash
npx skills add sebastian-gehr/fsv-erlangen-bruck-flyer-plakat
```

Das Werkzeug erkennt die installierten Agenten und fragt, wohin der Skill soll. Ohne Rückfragen und für alle Projekte (`-g`):

```bash
npx skills add sebastian-gehr/fsv-erlangen-bruck-flyer-plakat -g -a claude-code -y   # Claude Code
npx skills add sebastian-gehr/fsv-erlangen-bruck-flyer-plakat -g -a codex -y         # OpenAI Codex
npx skills add sebastian-gehr/fsv-erlangen-bruck-flyer-plakat -g -a gemini-cli -y    # Gemini CLI
```

Aktualisieren: `npx skills update` · Entfernen: `npx skills remove fsv-erlangen-bruck-flyer-plakat`

### Claude im Browser oder in der Desktop-App

1. Unter [Releases](https://github.com/sebastian-gehr/fsv-erlangen-bruck-flyer-plakat/releases/latest) die Datei `fsv-erlangen-bruck-flyer-plakat.zip` herunterladen.
2. In Claude unter **Einstellungen → Fähigkeiten → Skills** die ZIP-Datei hochladen. „Code-Ausführung“ muss eingeschaltet sein.

### KI ohne Skill-Unterstützung (z. B. ChatGPT im Browser)

`SKILL.md` als Anleitung in den Chat geben und die Eckdaten nennen. Die KI schreibt daraus die Daten-Datei (JSON); gerendert wird dann lokal wie unter „Ohne KI“.

## Verwendung

Nach der Installation reicht ein Satz:

> Flyer für die Weihnachtsfeier, Sa 19.12.2026, 16–22 Uhr, ehemaliges Birkenwäldchen, Glühwein, Grill, Crêpes, Posaunenchor Bruck

> Plakat für die Tennis-Vereinsmeisterschaften 10.–11.07.2027 ab 10 Uhr, Tennisanlage, im Stil Vereinszeitung

Ergebnis: A4- und A5-PDF zum Drucken, PNGs zur Vorschau und das Quadrat für Social Media – als Entwurf zur Freigabe.

## Ohne KI

Voraussetzung: [Node.js](https://nodejs.org) ab Version 20. Einmalig im Ordner des Skills:

```bash
npm install
npx playwright install chromium
```

Dann die Beispiel-Datei `beispiele/weihnachtsfeier-2026.json` kopieren, Texte ändern und rendern:

```bash
node scripts/render.mjs meine-feier.json ausgabe                      # Stil website, alle Formate
node scripts/render.mjs meine-feier.json ausgabe --stil=vereinszeitung
node scripts/render.mjs meine-feier.json ausgabe --stil=typo --formate=a4,quadrat
```

Die Felder der Daten-Datei stehen in `SKILL.md` unter „Daten-Schema“. Die Schriften (Barlow) lädt die Vorlage von Google Fonts, dafür braucht der Rechner Internet.

## Inhalt

| Datei | Zweck |
|---|---|
| `SKILL.md` | Anleitung für die KI: Ablauf, Stile, Gestaltungsregeln, Daten-Schema |
| `vorlage/flyer.html` | feste Vorlage mit allen drei Stilen |
| `assets/` | Wappen (SVG) und Brucker Kirche |
| `scripts/render.mjs` | erzeugt PDF und PNG aus einer Daten-Datei |
| `beispiele/` | Beispiel-Daten |

## Regeln

Wappen, Farben und Schriften nicht ändern. Das Wappen ist Eigentum des FSV Erlangen-Bruck e.V. und nur für Vereinszwecke gedacht.
