// Assemble src/ en un seul index.html autonome (servi tel quel par GitHub Pages).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const page = readFileSync('src/page.html', 'utf8');
const cut = page.indexOf('<div class="app">');
if (cut < 0) throw new Error('src/page.html : <div class="app"> introuvable');
const head = page.slice(0, cut), body = page.slice(cut);
const js = readdirSync('src/js').filter(f => f.endsWith('.js')).sort()
  .map(f => `/* ===== ${f} ===== */\n` + readFileSync(`src/js/${f}`, 'utf8')).join('\n');

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Garage &amp; Route : ouvre une voiture en 3D pour comprendre comment elle marche, puis prends le volant et gare-toi dans la rue. Thermique et électrique, en français et en anglais.">
<meta property="og:title" content="Garage &amp; Route">
<meta property="og:description" content="Comprends comment marche une voiture, puis conduis-la et gare-toi. Gratuit, dans le navigateur.">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,-apple-system,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
${head.trim()}
</head>
<body>
${body.trim()}
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<script>
${js}
</script>
</body>
</html>
`;
writeFileSync('index.html', html);
console.log(`index.html écrit (${(html.length/1024).toFixed(0)} Ko)`);
