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
<meta name="description" content="Modèle 3D interactif pour comprendre une voiture : moteur thermique (boîte manuelle ou automatique) et électrique, avec des vidéos guidées.">
<meta property="og:title" content="Comment marche une voiture">
<meta property="og:description" content="Démarre le moteur, passe les vitesses et suis la force jusqu'aux roues. Thermique et électrique, en 3D.">
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
