// FSV-Flyer rendern: node render.mjs <daten.json> <ausgabeordner> [a4,a5,quadrat]
// Erzeugt je Format eine HTML-Datei, dazu PDF (A4, A5) und PNG (alle Formate).
// Braucht Playwright mit Chromium (require('playwright')); Vorlage und Wappen liegen im Skill-Ordner.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const [datenPfad, outDir = 'ausgabe', formateArg] = process.argv.slice(2);
if (!datenPfad) { console.error('Aufruf: node render.mjs <daten.json> <ausgabeordner> [a4,a5,quadrat]'); process.exit(1); }

const daten = JSON.parse(readFileSync(datenPfad, 'utf8'));
const formate = (formateArg || (daten.formate || ['a4', 'a5', 'quadrat']).join(',')).split(',');
const vorlage = readFileSync(join(here, '..', 'vorlage', 'flyer.html'), 'utf8');
const logo = 'data:image/svg+xml;base64,' + readFileSync(join(here, '..', 'assets', 'fsv-wappen.svg')).toString('base64');

const name = daten.dateiname || 'flyer';
mkdirSync(outDir, { recursive: true });

const SEITE = {
  a4:      { w: 794,  h: 1123, pdf: { width: '210mm', height: '297mm' }, zoom: 1 },
  a5:      { w: 559,  h: 794,  pdf: { width: '148mm', height: '210mm' }, zoom: 0.70710678 },
  quadrat: { w: 1080, h: 1080, pdf: null, zoom: 1 },
};

let chromium;
try { ({ chromium } = require('playwright')); }
catch { console.error('Playwright fehlt: nur HTML wird erzeugt (im Browser drucken → Als PDF speichern).'); }

const browser = chromium ? await chromium.launch() : null;
for (const f of formate) {
  const s = SEITE[f]; if (!s) { console.error('Unbekanntes Format: ' + f); continue; }
  const layout = f === 'quadrat' ? 'quadrat' : 'a4';
  const pageCss = `<style>@page{size:${s.pdf ? s.pdf.width + ' ' + s.pdf.height : s.w + 'px ' + s.h + 'px'};margin:0}`
    + (s.zoom !== 1 ? `.page{zoom:${s.zoom}}` : '') + `</style></head>`;
  const html = vorlage
    .replace('/*DATA*/null', JSON.stringify(daten))
    .replace('/*FORMAT*/"a4"', JSON.stringify(layout))
    .replace('LOGO_DATA_URI', logo)
    .replace('</head>', pageCss);
  const htmlPfad = resolve(outDir, `${name}-${f}.html`);
  writeFileSync(htmlPfad, html);
  if (!browser) { console.log(htmlPfad); continue; }

  const page = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: f === 'quadrat' ? 1 : 2 });
  await page.goto('file://' + htmlPfad);
  await page.evaluate(() => document.fonts.ready);
  const fontOk = await page.evaluate(() => document.fonts.check('800 40px "Barlow Condensed"') && document.fonts.check('600 20px "Barlow"'));
  if (!fontOk) console.error('WARNUNG: Barlow nicht geladen (kein Zugriff auf Google Fonts?) – Ersatzschrift verwendet.');
  const ueberlauf = await page.evaluate(() => {
    const p = document.querySelector('.page').getBoundingClientRect();
    const fehler = [];
    for (const sel of ['.titelblock', '.karte', '.programm']) {
      const e = document.querySelector(sel); if (!e) continue;
      const r = e.getBoundingClientRect();
      if (r.right > p.right + 1 || r.bottom > p.bottom + 1) fehler.push(sel);
    }
    const t = document.querySelector('.titelblock').getBoundingClientRect();
    const k = document.querySelector('.karte').getBoundingClientRect();
    const pr = document.querySelector('.programm').getBoundingClientRect();
    const fu = document.querySelector('.fuss'); const fr = fu && getComputedStyle(fu).display !== 'none' ? fu.getBoundingClientRect() : null;
    if (t.bottom > k.top - 8) fehler.push('Titel stößt an die Terminkarte (Titel kürzen)');
    if (k.bottom > pr.top) fehler.push('Terminkarte überlappt das Programm');
    if (fr && pr.bottom > fr.top - 12) fehler.push('Programm zu lang (Punkte kürzen oder weglassen)');
    if (!fr && pr.bottom > p.bottom - 40) fehler.push('Programm zu lang für das Quadrat (programm_quadrat kürzen)');
    return fehler;
  });
  if (ueberlauf.length) console.error(`WARNUNG ${f}: ` + ueberlauf.join('; '));
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
