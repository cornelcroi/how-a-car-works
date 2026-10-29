// Regenerates the README screenshots and GIFs in docs/media/ (English UI).
// Usage: npm run capture   (--parking: only the parking GIF; --linkedin: docs/media/linkedin.mp4, not committed)
// Needs playwright + chromium, and ffmpeg on the PATH)
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdirSync, rmSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const OUT = 'docs/media', TMP = 'docs/media/.tmp';
const W = 1280, H = 760;
const url = pathToFileURL(resolve('index.html')).href + '?lang=en';
mkdirSync(TMP, { recursive: true });

const browser = await chromium.launch({ args: ['--use-gl=angle', '--ignore-gpu-blocklist'] });
const wait = ms => new Promise(r => setTimeout(r, ms));

async function open(video) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: video ? 1 : 2,
    ...(video ? { recordVideo: { dir: TMP, size: { width: W, height: H } } } : {}) });
  const page = await ctx.newPage();
  await page.goto(url);
  await wait(2500);
  return { ctx, page, t0: Date.now() };
}
const mode = (page, m) => page.click(`#modeSeg button[data-m="${m}"]`);
const playVideo = async (page, id) => { if (['parking','bay','merge','lanechange'].includes(id)) await page.click('#appModes .mode[data-app="drive"]'); await page.click(`#scList .sc[data-sc="${id}"], #parkList .sc[data-sc="${id}"]`); };

// webm → gif: start at `from` seconds, keep `dur` seconds, 2-pass palette for clean colours.
function toGif(webm, name, from, dur, speed = 1) {
  const vf = `setpts=PTS/${speed},fps=10,scale=640:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(from), '-t', String(dur * speed), '-i', webm, '-vf', vf, '-loop', '0', `${OUT}/${name}.gif`]);
  console.log(`${name}.gif  ${(statSync(`${OUT}/${name}.gif`).size / 1e6).toFixed(1)} MB`);
}
async function clip(name, from, dur, speed, script) {
  const { ctx, page, t0 } = await open(true);
  await script(page);
  const elapsed = (Date.now() - t0) / 1000;
  const webm = await page.video().path();
  await ctx.close();
  const loadPad = 2.5;   // the page load before t0 is in the recording too
  toGif(webm, name, loadPad + from, Math.min(dur, elapsed - from), speed);
}
async function shot(name, script) {
  const { ctx, page } = await open(false);
  await script(page);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await ctx.close();
  console.log(`${name}.png`);
}

const LINKEDIN = process.argv.includes('--linkedin'), PARKING_ONLY = process.argv.includes('--parking');

if (!LINKEDIN && !PARKING_ONLY) {
/* ---------- screenshots ---------- */
await shot('overview', async p => { await p.keyboard.press('k'); await wait(2500); });
await shot('show-me', async p => { await playVideo(p, 'shift'); await wait(13000); });
await shot('electric', async p => { await mode(p, 'ev'); await wait(800); await playVideo(p, 'evtour'); await wait(12000); });
await shot('drive-street', async p => {
  await p.click('#appModes .mode[data-app="drive"]'); await p.click('#tryRow .btn[data-try="par"]'); await wait(800);
  await p.keyboard.down('ArrowUp'); await wait(2200); await p.keyboard.up('ArrowUp'); await wait(1500);
  await p.click('#streetView button[data-v="driver"]'); await wait(1200); });
await shot('drive-top', async p => {
  await p.click('#appModes .mode[data-app="drive"]'); await p.click('#tryRow .btn[data-try="par"]'); await wait(800);
  await p.keyboard.down('ArrowUp'); await wait(1800); await p.keyboard.down('ArrowLeft'); await wait(900); await p.keyboard.up('ArrowLeft'); await wait(800); await p.keyboard.up('ArrowUp');
  await p.keyboard.down('ArrowDown'); await wait(1500); await p.keyboard.up('ArrowDown'); await wait(1200);
  await p.click('#streetView button[data-v="top"]'); await wait(1500); });

/* ---------- GIFs ---------- */
// A « Show me » video: changing gear in the manual.
await clip('show-me-shift', 0, 14, 1.5, async p => { await playVideo(p, 'shift'); await wait(24000); });
// Driving by hand: start, clutch down, 1st, release with a little throttle.
await clip('drive', 1, 11, 1, async p => {
  await p.click('.view[data-v="engine"]'); await wait(800);
  await p.keyboard.press('k'); await wait(2000);
  await p.keyboard.down('c'); await wait(800);
  await p.keyboard.press('1'); await wait(800);
  await p.keyboard.down('a'); await wait(300);
  await p.keyboard.up('c'); await wait(4000);
  await p.keyboard.up('a'); await wait(4000);
});
// The electric car video.
await clip('electric', 0.8, 14, 1.5, async p => { await mode(p, 'ev'); await wait(800); await playVideo(p, 'evtour'); await wait(24000); });

}

/* ---------- Parking GIF (also: node tools/capture.mjs --parking) ---------- */
// Parking video shots start at 0, 5, 10, 14, 18, 22.5, 27, 31.5, 36, 45.5, 55 … (see parkShots in 05).
if (!LINKEDIN) await clip('parking', 31.8, 13.5, 1.5, async p => { await playVideo(p, 'parking'); await wait(46000); });
// Joining the motorway: the shoulder check, then the car in the blind spot (shots start at 0, 5, 10, 15.5, 20.5 s)
if (!LINKEDIN && !PARKING_ONLY) await clip('motorway', 15.8, 10, 1.25, async p => { await playVideo(p, 'merge'); await wait(27000); });

/* ---------- LinkedIn: one square MP4 of the 3D stage (captions included), cut from one session ---------- */
if (LINKEDIN) {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, recordVideo: { dir: TMP, size: { width: 1600, height: 1000 } } });
  const p = await ctx.newPage();
  const tStart = Date.now(), mark = () => (Date.now() - tStart) / 1000;
  await p.goto(url); await wait(2500);
  const box = await p.evaluate(() => { const r = document.getElementById('stage').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const D = mark();                                                    // Explore: start, 1st, pull away
  await p.keyboard.press('k'); await wait(3000);
  await p.keyboard.down('c'); await wait(800); await p.keyboard.press('1'); await wait(700);
  await p.keyboard.down('a'); await wait(300); await p.keyboard.up('c'); await wait(4000);
  await p.keyboard.up('a'); await wait(300);
  const G = mark(); await playVideo(p, 'shift'); await wait(15000);     // « Show me »: changing gear
  await p.click('#reelClose');
  const P = mark(); await playVideo(p, 'parking'); await wait(45500);   // parallel parking (shots at 27, 31.5, 36 s)
  await p.click('#reelClose');
  const M = mark(); await playVideo(p, 'merge'); await wait(47500);     // joining the motorway (shots at 0, 27, 32, 42 s)
  await p.click('#reelClose');
  await p.click('#tryRow .btn[data-try="par"]'); await wait(800);       // Drive it yourself, driver's view with mirrors
  await p.click('#streetView button[data-v="driver"]');
  const S2 = mark(); await p.keyboard.down('ArrowUp'); await wait(2600); await p.keyboard.up('ArrowUp'); await wait(1500);
  await p.keyboard.down('ArrowRight'); await p.keyboard.down('ArrowUp'); await wait(1400); await p.keyboard.up('ArrowRight'); await p.keyboard.up('ArrowUp'); await wait(1200);
  const webm = await p.video().path();
  await ctx.close();
  const segs = [[D + 2.5, 6], [G + 9, 8],
    [P + 27.3, 4], [P + 31.8, 4], [P + 36.4, 8],
    [M + 0.5, 5], [M + 27.3, 4.5], [M + 32.3, 4.5], [M + 42.3, 4.5],
    [S2, 6.5]];
  const side = Math.floor(Math.min(box.w, box.h)), cx = Math.floor(box.x + (box.w - side) / 2), cy = Math.floor(box.y + (box.h - side) / 2);
  const fc = segs.map(([a, d], i) => `[0:v]trim=start=${a.toFixed(2)}:duration=${d},setpts=PTS-STARTPTS[v${i}]`).join(';')
    + ';' + segs.map((_, i) => `[v${i}]`).join('') + `concat=n=${segs.length}:v=1:a=0,crop=${side}:${side}:${cx}:${cy},scale=1080:1080:flags=lanczos,fps=30[out]`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', webm, '-filter_complex', fc, '-map', '[out]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', '-an', `${OUT}/linkedin.mp4`]);
  const total = segs.reduce((t, [, d]) => t + d, 0);
  console.log(`linkedin.mp4  ${(statSync(`${OUT}/linkedin.mp4`).size / 1e6).toFixed(1)} MB, ${total.toFixed(0)} s`);
}

await browser.close();
rmSync(TMP, { recursive: true, force: true });
console.log('done:', readdirSync(OUT).join(', '));
