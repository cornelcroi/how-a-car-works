// Test de fumée : charge index.html dans Chromium, vérifie qu'il n'y a pas d'erreur JS,
// puis lance une vidéo « Montre-moi » par voiture et vérifie que les sous-titres défilent, en français et en anglais.
// Usage : npm test   (nécessite : npm i -D playwright && npx playwright install chromium)
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const base = pathToFileURL(resolve('index.html')).href;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader'] });
const errors = [];

for (const lang of ['fr', 'en']) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });
  page.on('pageerror', e => errors.push(`${lang}: ${e.message}`));
  await page.goto(`${base}?lang=${lang}`);
  await page.waitForTimeout(2500);
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  if (htmlLang !== lang) errors.push(`${lang}: <html lang="${htmlLang}">`);

  for (const [mode, sc] of [['manual', 'neutral'], ['auto', 'prnd'], ['ev', 'evtour']]) {
    await page.click(`#modeSeg button[data-m="${mode}"]`);
    await page.waitForTimeout(400);
    await page.click(`#scList .sc[data-sc="${sc}"]`);
    await page.waitForTimeout(7000);
    const cap = await page.evaluate(() => document.getElementById('reelCap').innerText.trim());
    console.log(`${lang} ${mode}/${sc} → « ${cap.split('\n')[0]} »`);
    if (!cap) errors.push(`${lang} ${mode}/${sc} : aucun sous-titre`);
    await page.click('#reelClose');
  }
  // mode « Conduire » : on avance 2 s avec ↑, la voiture doit rouler
  await page.click('#appModes .mode[data-app="drive"]');
  await page.click('#tryRow .btn[data-try="par"]');
  await page.waitForTimeout(800);
  await page.keyboard.down('ArrowUp'); await page.waitForTimeout(2000);
  const kmh = await page.evaluate(() => +document.querySelector('#speedo .dial-read').textContent);
  await page.keyboard.up('ArrowUp');
  console.log(`${lang} drive → ${kmh} km/h`);
  if (!(kmh > 5)) errors.push(`${lang} drive: la voiture ne roule pas (${kmh} km/h)`);
  await page.click('#appModes .mode[data-app="explore"]');
  if (lang === 'en') {
    // Repère grossier d'oubli de traduction : accents français dans le panneau.
    const leak = await page.evaluate(() => (document.querySelector('.panel').innerText.replace(document.getElementById('langBtn').innerText, '').match(/[^\n]*[éèêàçù][^\n]*/g) || []).slice(0, 5));
    if (leak.length) errors.push('en: texte français restant :\n  ' + leak.join('\n  '));
  }
  await page.close();
}
await browser.close();
if (errors.length) { console.error('ÉCHEC :\n' + errors.join('\n')); process.exit(1); }
console.log('OK');
