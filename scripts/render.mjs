// FSV-Flyer rendern
//   node scripts/render.mjs <daten.json> [ausgabeordner] [--formate=a4,a5,quadrat] [--stil=website|vereinszeitung|typo]
// Erzeugt je Format eine HTML-Datei, dazu PDF (A4, A5) und PNG (alle Formate).
// Braucht Playwright mit Chromium; ohne Playwright entstehen nur die HTML-Dateien.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const skill = join(here, '..');

const args = process.argv.slice(2);
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => { const [k, v = ''] = a.slice(2).split('='); return [k, v]; }));
const [datenPfad, outDir = 'ausgabe', formatePos] = args.filter(a => !a.startsWith('--'));
if (!datenPfad || 'help' in flags) {
  console.error('Aufruf: node scripts/render.mjs <daten.json> [ausgabeordner] [--formate=a4,a5,quadrat] [--stil=website|vereinszeitung|typo]');
  process.exit(datenPfad ? 0 : 1);
}

const daten = JSON.parse(readFileSync(datenPfad, 'utf8'));
const stil = flags.stil || daten.stil || 'website';
const formate = (flags.formate || formatePos || (daten.formate || ['a4', 'a5', 'quadrat']).join(',')).split(',');
const vorlage = readFileSync(join(skill, 'vorlage', 'flyer.html'), 'utf8');
const logo = 'data:image/svg+xml;base64,' + readFileSync(join(skill, 'assets', 'fsv-wappen.svg')).toString('base64');
const kirche = 'data:image/jpeg;base64,' + readFileSync(join(skill, 'assets', 'bruck-kirche.jpg')).toString('base64');
const name = (daten.dateiname || 'flyer') + (stil === 'website' ? '' : '-' + stil);
mkdirSync(outDir, { recursive: true });

const SEITE = {
  a4:      { w: 794,  h: 1123, pdf: { width: '210mm', height: '297mm' }, zoom: 1 },
  a5:      { w: 559,  h: 794,  pdf: { width: '148mm', height: '210mm' }, zoom: 0.70710678 },
  quadrat: { w: 1080, h: 1080, pdf: null, zoom: 1 },
};

let chromium;
try { ({ chromium } = require('playwright')); }
catch { console.error('Playwright fehlt: nur HTML wird erzeugt (im Browser öffnen → Drucken → Als PDF speichern, Ränder: keine, Hintergrundgrafiken an).'); }

const browser = chromium ? await chromium.launch() : null;
let warnungen = 0;
for (const f of formate) {
  const s = SEITE[f]; if (!s) { console.error('Unbekanntes Format: ' + f); continue; }
  const layout = f === 'quadrat' ? 'quadrat' : 'a4';
  const pageCss = `<style>@page{size:${s.pdf ? s.pdf.width + ' ' + s.pdf.height : s.w + 'px ' + s.h + 'px'};margin:0}`
    + (s.zoom !== 1 ? `.page{zoom:${s.zoom}}` : '') + `</style></head>`;
  const html = vorlage
    .replace('/*DATA*/null', JSON.stringify(daten))
    .replace('/*FORMAT*/"a4"', JSON.stringify(layout))
    .replace('/*STIL*/null', JSON.stringify(stil))
    .replace('LOGO_DATA_URI', logo)
    .replace('KIRCHE_DATA_URI', kirche)
    .replace('</head>', pageCss);
  const htmlPfad = resolve(outDir, `${name}-${f}.html`);
  writeFileSync(htmlPfad, html);
  if (!browser) { console.log(htmlPfad); continue; }

  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: f === 'quadrat' ? 1 : 2 });
  await page.goto('file://' + htmlPfad);
  await page.waitForFunction(() => window.FLYER_WARNUNGEN !== undefined, null, { timeout: 30000 }).catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  const fontOk = await page.evaluate(() => document.fonts.check('800 40px "Barlow Condensed"') && document.fonts.check('600 20px "Barlow"'));
  if (!fontOk) { warnungen++; console.error('WARNUNG: Barlow nicht geladen (kein Zugriff auf Google Fonts?) – Ersatzschrift verwendet.'); }
  const w = await page.evaluate(() => window.FLYER_WARNUNGEN || ['Vorlage hat nicht gerendert']);
  if (w.length) { warnungen += w.length; console.error(`WARNUNG ${f}: ` + w.join('; ')); }
  const png = resolve(outDir, `${name}-${f}.png`);
  await page.screenshot({ path: png, clip: { x: 0, y: 0, width: s.w, height: s.h } });
  console.log(png);
  if (s.pdf) {
    const pdf = resolve(outDir, `${name}-${f}.pdf`);
    await page.pdf({ path: pdf, ...s.pdf, printBackground: true, preferCSSPageSize: true });
    console.log(pdf);
  }
  await page.close();
}
if (browser) await browser.close();
if (warnungen) process.exitCode = 2;
