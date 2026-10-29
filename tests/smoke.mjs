// Test de fumée : charge index.html dans Chromium, vérifie qu'il n'y a pas d'erreur JS,
// puis lance une vidéo « Montre-moi » par voiture et vérifie que les sous-titres défilent.
// Usage : npm test   (nécessite : npm i -D playwright && npx playwright install chromium)
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const url = pathToFileURL(resolve('index.html')).href;
const browser = await chromium.launch({ args: ['--use-gl=swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto(url);
await page.waitForTimeout(2500);

for (const [mode, sc] of [['manual', 'neutral'], ['auto', 'prnd'], ['ev', 'evtour']]) {
  await page.click(`#modeSeg button[data-m="${mode}"]`);
  await page.waitForTimeout(400);
  await page.click(`#scList .sc[data-sc="${sc}"]`);
  await page.waitForTimeout(7000);
  const cap = await page.evaluate(() => document.getElementById('reelCap').innerText.trim());
  console.log(`${mode}/${sc} → « ${cap.split('\n')[0]} »`);
  if (!cap) errors.push(`${mode}/${sc} : aucun sous-titre`);
  await page.click('#reelClose');
}
await browser.close();
if (errors.length) { console.error('ÉCHEC :\n' + errors.join('\n')); process.exit(1); }
console.log('OK');
