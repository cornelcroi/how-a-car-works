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

// One encoder per part: the whole page (.overview.mp4), the live zooms (.live.mp4), then the body (TMP).
// `full`: the whole page, which on LinkedIn sits in the square between two dark bands.
const encoder = (out, full = false) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  ...(LINKEDIN ? ['-vf', full ? 'scale=1080:-2:flags=lanczos,pad=1080:1080:0:(oh-ih)/2:color=0x0f141b' : 'scale=1080:1080:flags=lanczos'] : []),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', LINKEDIN ? '18' : '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const LIVE = 'docs/media/.live.mp4', OVERVIEW = 'docs/media/.overview.mp4';
let ff = encoder(OVERVIEW, true);
const endEncoder = async () => { ff.stdin.end(); await new Promise(r => ff.on('close', r)); };
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

/* First, the whole page: a red box around the view buttons, then around the panel, each with a caption. */
{
  const bodyClip = clip; clip = undefined;
  await page.evaluate(fs => {
    const mk = (sel, text, side) => { const r = document.querySelector(sel).getBoundingClientRect(), pad = 8, m = 6;   // m: keep the box inside the screen
      const x0 = Math.max(r.left - pad, m), y0 = Math.max(r.top - pad, m), x1 = Math.min(r.right + pad, innerWidth - m), y1 = Math.min(r.bottom + pad, innerHeight - m);
      const box = document.createElement('div'); box.className = 'demoBox';
      Object.assign(box.style, { position: 'fixed', left: x0 + 'px', top: y0 + 'px', width: (x1 - x0) + 'px', height: (y1 - y0) + 'px', boxSizing: 'border-box',
        border: '5px solid #e0402a', borderRadius: '12px', boxShadow: '0 0 0 4px rgba(224,64,42,.25)', zIndex: 99998, pointerEvents: 'none', opacity: 0 });
      const cap = document.createElement('div'); cap.textContent = text;
      Object.assign(cap.style, { position: 'absolute', whiteSpace: 'nowrap', background: '#e0402a', color: '#fff', font: `700 ${fs}px/1.2 system-ui, sans-serif`, padding: '10px 18px', borderRadius: '10px' },
        side === 'below' ? { left: '0', top: 'calc(100% + 14px)' } : { right: 'calc(100% + 18px)', top: '40%' });
      box.appendChild(cap); document.body.appendChild(box); return box; };
    mk('#views', 'Choose what to look at: the car, the engine, the clutch…', 'below');
    mk('aside.panel', 'Pick a car, watch short videos, then drive it', 'left');
  }, LINKEDIN ? 36 : 26);   // LinkedIn shrinks the whole page into the square: bigger text
  const op = [0, 0];
  const shot = async () => { await page.clock.runFor(1000 / FPS);
    await page.evaluate(o => document.querySelectorAll('.demoBox').forEach((b, i) => { b.style.opacity = o[i]; }), op);
    await write(await page.screenshot({ type: 'jpeg', quality: 93 })); frames++; };
  const holdO = async sec => { for(let i = Math.round(sec * FPS); i > 0; i--) await shot(); };
  const fade = async (i, to, sec) => { const from = op[i], n = Math.round(sec * FPS); for(let k = 1; k <= n; k++){ op[i] = from + (to - from) * k / n; await shot(); } };
  await holdO(1.2);
  await fade(0, 1, 0.35); await holdO(2.4); await fade(0, 0, 0.3);
  await fade(1, 1, 0.35); await holdO(2.4); await fade(1, 0, 0.3);
  await holdO(0.3);
  await page.evaluate(() => document.querySelectorAll('.demoBox').forEach(b => b.remove()));
  clip = bodyClip;
  await endEncoder(); ff = encoder(LIVE);
}

/* The opening, live: zoomed in on the view buttons, a pointer clicks Engine, Clutch, Car, and each time the shot zooms out
   while the 3D camera flies to that part. The zoom is a CSS scale on the page (text stays sharp), the pointer a drawn arrow. */
{
  const bodyClip = clip;
  if(LINKEDIN) clip = { x: 0, y: 0, width: clip.width, height: clip.height };   // the buttons sit at the left of the 3D view
  const S = LINKEDIN ? 1.8 : 2.4;
  const btn = sel => page.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + r.width/2, y: r.top + r.height/2 }; }, sel);
  const VIEWS = LINKEDIN ? ['engine', 'clutch', 'car'] : ['engine', 'clutch', 'gearbox', 'diff', 'below', 'car'];
  const B = {}; for(const v of VIEWS) B[v] = await btn(`.view[data-v="${v}"]`);
  await page.evaluate(() => { const c = document.createElement('div'); c.id = 'fakeCursor';
    c.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M3 2l7 19 2.6-7.4L20 11z" fill="#111" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    Object.assign(c.style, { position: 'fixed', left: '0', top: '0', zIndex: 99999, pointerEvents: 'none', transformOrigin: '3px 2px' });
    document.body.appendChild(c); document.documentElement.style.transformOrigin = '0 0'; });
  const st = { s: 1, x: B.car.x + 70, y: B.car.y + 70, press: 1 };
  const frame = async () => { await page.clock.runFor(1000 / FPS);
    await page.evaluate(v => { document.documentElement.style.transform = `scale(${v.s})`; const c = document.getElementById('fakeCursor');
      c.style.left = v.x + 'px'; c.style.top = v.y + 'px'; c.style.transform = `scale(${v.press})`; }, st);
    await write(await page.screenshot({ type: 'jpeg', quality: 93, ...(clip ? { clip } : {}) })); frames++; };
  const smooth = u => u*u*(3 - 2*u);
  async function tween(sec, to){ const from = { ...st }, n = Math.round(sec * FPS);
    for(let i = 1; i <= n; i++){ const u = smooth(i / n); for(const k in to) st[k] = from[k] + (to[k] - from[k]) * u; await frame(); } }
  const hold = async sec => { for(let i = Math.round(sec * FPS); i > 0; i--) await frame(); };
  async function clickView(v){ await tween(0.55, { x: B[v].x, y: B[v].y }); await tween(0.12, { press: 0.8 });
    await page.evaluate(s => document.querySelector(s).click(), `.view[data-v="${v}"]`); await tween(0.12, { press: 1 }); }
  await hold(0.4); await tween(1.0, { s: S }); await hold(0.4);    // from the whole view, in on the buttons
  for(const v of VIEWS){
    if(st.s !== S) await tween(0.8, { s: S });
    await clickView(v); await hold(0.3);
    await tween(1.3, { s: 1 }); await hold(1.0);
  }
  await page.evaluate(() => { document.getElementById('fakeCursor').remove(); document.documentElement.style.transform = ''; });
  clip = bodyClip;
  await endEncoder(); ff = encoder(TMP);
}
async function hold(keys, s, rec = true){ for(const k of keys) await key(k, 'down'); await (rec ? film(s) : skip(s)); for(const k of keys) await key(k, 'up'); }
const close = async () => { if(await page.isVisible('#reelClose')) await page.click('#reelClose'); };
/* Showing how to start a video, the way a person would: zoom in on the panel, the pointer taps the option (a car, a tab),
   then the item that starts the video, and the shot zooms back out as it plays. YouTube only (the whole page is in frame).
   One zoom for both taps, centred between them, so the shot never jumps. */
async function tap2(selA, selB, { zoom = 1.5, after = 0.9 } = {}){
  await skip(1.2);   // after a video closes, the 3D camera flies back to the car for ~1 s: don't film that flight
  // null when not on screen yet (it appears after the first tap): the zoom then aims at the video list it will appear in
  const centre = s => page.evaluate(s => { const e = document.querySelector(s), r = e && e.getBoundingClientRect(); return r && r.width ? { x: r.left + r.width/2, y: r.top + r.height/2 } : null; }, s);
  const A = await centre(selA), B0 = (await centre(selB)) ?? (await centre('#scList')) ?? A, O = { x: (A.x + B0.x)/2, y: (A.y + B0.y)/2 };
  await page.evaluate(() => { if(document.getElementById('fakeCursor')) return; const k = document.createElement('div'); k.id = 'fakeCursor';
    k.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M3 2l7 19 2.6-7.4L20 11z" fill="#111" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/></svg>';
    Object.assign(k.style, { position: 'fixed', left: '0', top: '0', zIndex: 99999, pointerEvents: 'none', transformOrigin: '3px 2px' }); document.body.appendChild(k); });
  const v = { s: 1, x: A.x - 140, y: A.y + 110, press: 1, o: 0 };
  const shot = async () => { await page.clock.runFor(1000 / FPS);
    await page.evaluate(([v, O]) => { const h = document.documentElement.style; h.transformOrigin = `${O.x}px ${O.y}px`; h.transform = `scale(${v.s})`;
      const k = document.getElementById('fakeCursor'); Object.assign(k.style, { left: v.x + 'px', top: v.y + 'px', transform: `scale(${v.press})`, opacity: v.o }); }, [v, O]);
    await write(await page.screenshot({ type: 'jpeg', quality: 93 })); frames++; };
  const smooth = u => u*u*(3 - 2*u);
  const tw = async (sec, to) => { const from = { ...v }, n = Math.round(sec * FPS);
    for(let i = 1; i <= n; i++){ const u = smooth(i / n); for(const k in to) v[k] = from[k] + (to[k] - from[k]) * u; await shot(); } };
  const press = async sel => { await tw(0.12, { press: 0.8 }); await page.evaluate(s => document.querySelector(s).click(), sel); await tw(0.12, { press: 1 }); };
  await tw(0.9, { s: zoom, o: 1 });
  await tw(0.6, { x: A.x, y: A.y }); await press(selA); await tw(0.5, {});
  const B = await page.evaluate(([s, O, z]) => { const h = document.documentElement.style, t = h.transform; h.transform = '';   // the panel may have changed: measure unzoomed
    const r = document.querySelector(s).getBoundingClientRect(); h.transform = t; return { x: r.left + r.width/2, y: r.top + r.height/2 }; }, [selB, O, zoom]);
  await tw(0.7, { x: B.x, y: B.y }); await press(selB);
  await tw(after, { s: 1, o: 0 });
  await page.evaluate(() => { document.getElementById('fakeCursor')?.remove(); document.documentElement.style.transform = ''; });
}
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
  await tap2('#modeSeg button[data-m="manual"]', '#scList .sc[data-sc="stroke"]'); await film(20.6); await close();   // 2. the 4 strokes: the car, then the video
  await tap2('#modeSeg button[data-m="ev"]', '#scList .sc[data-sc="regen"]'); await skip(3.9); await film(4); await skip(0.7); await film(5.5); await skip(0.5); await film(5.5); await close();   // 3. electric: the car, then braking that recharges
  await page.click('#modeSeg button[data-m="auto"]'); await skip(0.5);
  await tap2('#appModes .mode[data-app="drive"]', '#parkList .sc[data-sc="merge"]'); await film(15.1); await skip(5.5); await film(15); await skip(0.5); await film(10); await close();   // 4. the Drive tab, then joining the motorway
  await play('lanechange'); await skip(5.5); await film(11); await close();               // 5. changing lanes
  // after the motorway the gearbox shifts down and « camera follows the action » flies to it: switch that off, back to the car
  await page.evaluate(() => { const f = document.getElementById('optFollow'); if(f.checked) f.click(); document.querySelector('.view[data-v="car"]').click(); });
  await skip(1.5);
  await tap2('#appModes .mode[data-app="drive"]', '#parkList .sc[data-sc="parking"]'); await film(8.1); await skip(18); await film(18); await skip(32.8); await film(7.9); await skip(21.9); await film(3.6); await close();   // 6. the Drive tab, then parallel parking, start to parked
}

await endEncoder();
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
// after the live opening: from the whole page into the right panel, then down it, top to bottom
intro('docs/media/.still-explore.png', [[0, FULL], [0.5, FULL], [1.7, at(X1, Y0)], [2.1, at(X1, Y0)], [4.9, at(X1, Y1)], [5.3, at(X1, Y1)]], 'docs/media/.intro1.mp4');
intro('docs/media/.still-drive.png', [[0, at(X1, Y0)], [0.4, at(X1, Y0)], [3.0, at(X1, Y1)], [3.6, at(X1, Y1)]], 'docs/media/.intro2.mp4');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', OVERVIEW, '-i', LIVE, '-i', 'docs/media/.intro1.mp4', '-i', 'docs/media/.intro2.mp4', '-i', TMP, '-filter_complex', [0,1,2,3,4].map(i => `[${i}:v]setsar=1[p${i}]`).join(';') + ';[p0][p1][p2][p3][p4]concat=n=5:v=1:a=0[out]', '-map', '[out]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', LINKEDIN ? '18' : '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT]);
for(const f of ['.overview.mp4', '.live.mp4', '.intro1.mp4', '.intro2.mp4', '.still-explore.png', '.still-drive.png', '.render.mp4']) rmSync('docs/media/' + f, { force: true });
console.log(`${OUT}  ${(statSync(OUT).size / 1e6).toFixed(0)} MB, ${(frames / FPS + 8.9).toFixed(0)} s`);
