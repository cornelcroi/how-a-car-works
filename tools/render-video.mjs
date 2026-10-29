// Renders the demo videos frame by frame (not committed):
//   node tools/render-video.mjs --youtube    → docs/media/youtube-4k.mp4   3840×2160, the whole page
//   node tools/render-video.mjs --linkedin   → docs/media/linkedin.mp4     1080×1080, the 3D view only
// The page runs on Playwright's fake clock: each frame advances exactly 1/30 s, then a screenshot is taken.
// Slow, but every frame is sharp and every run is identical.
// Needs: npm run build, playwright + chromium, ffmpeg.
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { statSync, rmSync } from 'node:fs';

const LINKEDIN = process.argv.includes('--linkedin');
const OUT = LINKEDIN ? 'docs/media/linkedin.mp4' : 'docs/media/youtube-4k.mp4', TMP = 'docs/media/.render.mp4', FPS = 30;
const url = pathToFileURL(resolve('index.html')).href + '?lang=en';

const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext(LINKEDIN ? { viewport: { width: 1600, height: 1000 } } : { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
// the fake clock is paused: time only moves when we tell it to (otherwise each screenshot would add real time)
async function freshPage(){ const p = await ctx.newPage(), t = Date.now(); await p.clock.install({ time: t }); await p.goto(url);
  await p.clock.pauseAt(t + 1000); await p.clock.runFor(2500); return p; }
/* Intro: the website itself. Two sharp stills (Explore tab, Drive tab) at 2×, and the rectangles of the areas to zoom on. */
const VW = LINKEDIN ? 1600 : 1920, VH = LINKEDIN ? 1000 : 1080;
const stillsCtx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 2 });
const sp = await stillsCtx.newPage(); { const t = Date.now(); await sp.clock.install({ time: t }); await sp.goto(url); await sp.clock.pauseAt(t + 1000); await sp.clock.runFor(2500); }
const rect = sel => sp.evaluate(s => { const r = [...document.querySelectorAll(s)].map(e => e.getBoundingClientRect()).filter(r => r.width);
  const x = Math.min(...r.map(b => b.left)), y = Math.min(...r.map(b => b.top)); return { x: x*2, y: y*2, w: (Math.max(...r.map(b => b.right)) - x)*2, h: (Math.max(...r.map(b => b.bottom)) - y)*2 }; }, sel);
await sp.screenshot({ path: 'docs/media/.still-explore.png' });
const R = { tabs: await rect('#appModes, #modeSeg'), show: await rect('#showMeSec') };
await sp.click('#appModes .mode[data-app="drive"]'); await sp.clock.runFor(500);
await sp.screenshot({ path: 'docs/media/.still-drive.png' });
R.drive = await rect('#streetBox'); R.page = { x: 0, y: 0, w: VW*2, h: VH*2 };
await stillsCtx.close();

let page = await freshPage();

// LinkedIn: a square cut from the middle of the 3D view
let clip;
if(LINKEDIN){ const r = await page.evaluate(() => { const b = document.getElementById('stage').getBoundingClientRect(); return { x:b.x, y:b.y, w:b.width, h:b.height }; });
  const side = Math.floor(Math.min(r.w, r.h)); clip = { x: Math.floor(r.x + (r.w - side)/2), y: Math.floor(r.y + (r.h - side)/2), width: side, height: side }; }

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  ...(LINKEDIN ? ['-vf', 'scale=1080:1080:flags=lanczos'] : []),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', LINKEDIN ? '18' : '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', TMP], { stdio: ['pipe', 'inherit', 'inherit'] });
let frames = 0;
const write = buf => new Promise(r => ff.stdin.write(buf) ? r() : ff.stdin.once('drain', r));
const skip = s => page.clock.runFor(Math.round(s * 1000));                    // advance without filming
async function film(s){                                                        // advance and film, one frame every 1/30 s
  for(let i = 0, n = Math.round(s * FPS); i < n; i++){
    await page.clock.runFor(1000 / FPS);
    await write(await page.screenshot({ type: 'jpeg', quality: 93, ...(clip ? { clip } : {}) }));
    if(++frames % 300 === 0) console.log(`${frames} frames (${(frames / FPS).toFixed(0)} s)`);
  }
}
const key = (k, how = 'press') => page.keyboard[how](k);
async function hold(keys, s, rec = true){ for(const k of keys) await key(k, 'down'); await (rec ? film(s) : skip(s)); for(const k of keys) await key(k, 'up'); }
const close = async () => { if(await page.isVisible('#reelClose')) await page.click('#reelClose'); };
async function play(id){
  await page.click(`#appModes .mode[data-app="${['parking','bay','merge','lanechange'].includes(id) ? 'drive' : 'explore'}"]`);
  await page.click(`#scList .sc[data-sc="${id}"], #parkList .sc[data-sc="${id}"]`);
}
if(LINKEDIN){
  await key('k'); await film(2.5);                                                          // Explore: start, 1st, pull away
  await key('c', 'down'); await film(0.7); await key('1'); await film(0.6);
  await key('a', 'down'); await film(0.3); await key('c', 'up'); await film(2); await key('a', 'up');
  await page.click('#modeSeg button[data-m="ev"]'); await skip(0.8);                     // the electric car: braking recharges the battery
  await play('regen'); await skip(4.8); await film(4); await skip(0.7); await film(5.5); await skip(0.5); await film(5.5); await close();
  await page.click('#modeSeg button[data-m="auto"]'); await skip(0.5);
  await play('merge'); await skip(0.5); await film(5); await skip(21.8); await film(4.5); await skip(0.5); await film(4.5); await skip(5.5); await film(4.5); await close();
  // parallel parking in one piece: steering wheel, wheels, the rear swings in, the front tucks in, parked
  await play('parking'); await skip(27.3); await film(4); await skip(0.5); await film(4); await skip(0.6); await film(8); await skip(33.4); await film(8.7); await skip(21.1); await film(3.6); await close();
} else {
  await key('k'); await film(2.5);                                                          // 1. Explore
  await key('c', 'down'); await film(0.7); await key('1'); await film(0.6);
  await key('a', 'down'); await film(0.3); await key('c', 'up'); await film(4); await key('a', 'up'); await film(0.9);
  await play('stroke'); await film(21.5); await close();                                  // 2. the 4 strokes: intake, compression, BOOM
  await page.click('#modeSeg button[data-m="ev"]'); await skip(0.8);                     // 3. the electric car
  await play('regen'); await skip(4.8); await film(4); await skip(0.7); await film(5.5); await skip(0.5); await film(5.5); await close();   // braking recharges
  await page.click('#modeSeg button[data-m="auto"]'); await skip(0.5);
  await play('merge'); await film(16); await skip(5.5); await film(15); await skip(0.5); await film(10); await close();   // 4. joining the motorway
  await play('lanechange'); await skip(5.5); await film(11); await close();               // 5. changing lanes
  await play('parking'); await film(9); await skip(18); await film(18); await skip(32.8); await film(7.9); await skip(21.9); await film(3.6); await close();   // 6. parallel parking, start to parked
}

ff.stdin.end(); await new Promise(r => ff.on('close', r));
await browser.close();
// Intro clips: a camera (centre and width, in still pixels) moving between key frames with an ease in/out.
// LinkedIn: square frame on the page padded to a square; YouTube: 16:9 frame on the 16:9 page.
const OW = LINKEDIN ? 1080 : 3840, OH = LINKEDIN ? 1080 : 2160, AR = OW / OH, PADY = LINKEDIN ? (VW*2 - VH*2) / 2 : 0;
const cam = (r, margin = 1.15) => { const w = Math.max(r.w*margin, r.h*margin*AR); return { cx: r.x + r.w/2, cy: r.y + r.h/2 + PADY, w }; };
const FULL = { cx: VW, cy: VH + PADY, w: VW*2 };
function intro(still, keys, out){       // keys: [[time s, camera]…]
  const N = Math.round(keys[keys.length-1][0] * FPS), seg = (k, f) => {
    let e = String(keys[0][1][k]);           // each later segment wraps the earlier ones: if(on ≥ start, this one, earlier)
    for(let i = 0; i < keys.length - 1; i++){ const [t0, a] = keys[i], [t1, b] = keys[i+1], f0 = Math.round(t0*FPS), f1 = Math.round(t1*FPS);
      const u = `(${f1 > f0 ? `(on-${f0})/${f1 - f0}` : '1'})`, ease = `(${u}*${u}*(3-2*${u}))`;
      e = `if(gte(on,${f0}),${a[k]}+(${b[k] - a[k]})*${ease},${e})`; }
    return e; };
  const SC = 2, w = `(${seg('w')})*${SC}`, z = `${VW*2*SC}/(${w})`;
  const vf = `${LINKEDIN ? `pad=${VW*2}:${VW*2}:0:${PADY}:color=0x0f141b,` : ''}scale=iw*${SC}:ih*${SC},`
    + `zoompan=z='${z}':x='(${seg('cx')})*${SC}-(${w})/2':y='(${seg('cy')})*${SC}-(${w})/${AR}/2':d=${N}:s=${OW}x${OH}:fps=${FPS}`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-loop', '1', '-i', still, '-vf', vf, '-frames:v', String(N),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', LINKEDIN ? '18' : '16', '-pix_fmt', 'yuv420p', out]);
}
// One zoom level for the whole tour, so it reads as one camera: the top from left to right, then the panel top to bottom.
const ZW = LINKEDIN ? 1100 : 1700, ZH = ZW / AR, X0 = ZW/2, X1 = VW*2 - ZW/2, Y0 = PADY + ZH/2, Y1 = PADY + VH*2 - ZH/2;
const at = (cx, cy) => ({ cx, cy, w: ZW });
intro('docs/media/.still-explore.png', [[0, FULL], [1.0, FULL], [2.2, at(X0, Y0)], [2.6, at(X0, Y0)], [4.4, at(X1, Y0)], [4.8, at(X1, Y0)], [7.6, at(X1, Y1)], [8.0, at(X1, Y1)]], 'docs/media/.intro1.mp4');
intro('docs/media/.still-drive.png', [[0, at(X1, Y0)], [0.4, at(X1, Y0)], [3.0, at(X1, Y1)], [3.6, at(X1, Y1)]], 'docs/media/.intro2.mp4');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', 'docs/media/.intro1.mp4', '-i', 'docs/media/.intro2.mp4', '-i', TMP, '-filter_complex', '[0:v][1:v][2:v]concat=n=3:v=1:a=0[out]', '-map', '[out]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', LINKEDIN ? '18' : '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT]);
for(const f of ['.intro1.mp4', '.intro2.mp4', '.still-explore.png', '.still-drive.png', '.render.mp4']) rmSync('docs/media/' + f, { force: true });
console.log(`${OUT}  ${(statSync(OUT).size / 1e6).toFixed(0)} MB, ${(frames / FPS + 11.6).toFixed(0)} s`);
