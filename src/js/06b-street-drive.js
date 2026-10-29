/* ======================================================================
   CONDUIRE DANS LA RUE : on conduit soi-même dans la rue des vidéos « se garer ».
   Même simulation (moteur, embrayage, boîte), + volant, vues, rétroviseurs,
   radars de recul, chocs, et une place à atteindre.
   ====================================================================== */
const STREET = { on:false, spot:'par', gearbox:'simple', view:'behind', slow:0.05, steerKey:0, keys:{}, trail:[], hit:0, done:false };
const CAR_HX = 2.11, CAR_CX = 0.03, CAR_HZ = 0.88;            // la voiture vue de dessus (centre à x = +3 cm)
const planEnd = P => { const old = PARK.plan; PARK.plan = P; const s = parkState(P.steps.length, 0); PARK.plan = old; return s; };
const STREET_SPOTS = {
  par: { start:{x:PLAN_PAR.x - 7, z:0, th:0}, plan:PLAN_PAR },
  bay: { start:{x:PLAN_PERP.x - 9, z:PLAN_PERP.z, th:0}, plan:PLAN_PERP },
};
const rearAxle = () => STREET.pose;                            // pose : milieu de l'essieu arrière {x, z, th}
const originOf = p => ({x:p.x - WH.xR*Math.cos(p.th), z:p.z - WH.xR*Math.sin(p.th), th:p.th});

// Rectangles orientés qui se chevauchent ? (axes séparateurs)
function obbHit(a, b){
  const axes = [a.th, a.th + Math.PI/2, b.th, b.th + Math.PI/2];
  for(const t of axes){
    const ux = Math.cos(t), uz = Math.sin(t);
    const r = o => o.hx*Math.abs(Math.cos(o.th)*ux + Math.sin(o.th)*uz) + o.hz*Math.abs(-Math.sin(o.th)*ux + Math.cos(o.th)*uz);
    if(Math.abs((b.x-a.x)*ux + (b.z-a.z)*uz) > r(a) + r(b)) return false;
  }
  return true;
}
const carBox = o => ({x:o.x + CAR_CX*Math.cos(o.th), z:o.z + CAR_CX*Math.sin(o.th), hx:CAR_HX, hz:CAR_HZ, th:o.th});

// Radars : des points tous les 15 cm sur le contour des obstacles, vus depuis la voiture
const SENS_PTS = [];
PARK_OBST.filter(o=>!o.wall).forEach(o=>{
  const c = Math.cos(o.th), s = Math.sin(o.th);
  [[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]].forEach(([a,b,e,f])=>{
    const n = Math.max(1, Math.ceil(Math.hypot((e-a)*o.hx, (f-b)*o.hz)/0.15));
    for(let i=0;i<n;i++){ const lx = (a + (e-a)*i/n)*o.hx, lz = (b + (f-b)*i/n)*o.hz; SENS_PTS.push([o.x + lx*c - lz*s, o.z + lx*s + lz*c]); }
  });
});
// Distance (m) entre le pare-chocs et l'obstacle le plus proche, derrière (back) ou devant
function sensorDist(o, back){
  const c = Math.cos(o.th), s = Math.sin(o.th); let best = Infinity;
  for(const [px,pz] of SENS_PTS){
    const dx = px - o.x, dz = pz - o.z; if(Math.abs(dx) > 5 || Math.abs(dz) > 5) continue;
    const lx = dx*c + dz*s, lz = -dx*s + dz*c; if(Math.abs(lz) > 0.95) continue;
    const d = back ? -2.08 - lx : lx - 2.14; if(d >= -0.05 && d < best) best = d;
  }
  return Math.max(0, best);
}
let beepNext = 0;
function sensorsTick(o){
  const el = $('sensors'), rev = S.mode==='manual' ? S.gear==='R' : S.sel==='R';
  const fwdSlow = !rev && Math.abs(S.v) < 3 && (S.mode==='manual' ? S.gear!=='N' : S.sel==='D');
  const d = (rev || fwdSlow) ? sensorDist(o, rev) : Infinity;
  if(d > 1.5){ el.hidden = true; return; }
  el.hidden = false;
  const lvl = d < 0.35 ? 3 : d < 0.8 ? 2 : 1, col = ['#3cc46a','#f0b429','#e0402a'][lvl-1];
  [...el.querySelectorAll('b')].forEach((b,i)=>{ b.style.background = i < lvl ? col : ''; });
  $('sensTxt').textContent = (rev ? '▼ ' : '▲ ') + Math.round(d*100) + ' cm';
  if(!AC || !$('optSound').checked) return;
  const t = AC.currentTime; if(t < beepNext) return;
  const period = d < 0.3 ? 0.13 : 0.12 + (d - 0.3)/1.2*0.6, len = d < 0.3 ? 0.14 : 0.07;
  const os = AC.createOscillator(), g = AC.createGain(); os.type = 'sine'; os.frequency.value = rev ? 2050 : 1650;
  g.gain.setValueAtTime(0.08, t); g.gain.setValueAtTime(0, t + len); os.connect(g); g.connect(AC.destination); os.start(t); os.stop(t + len + 0.02);
  beepNext = t + period;
}

// La place à atteindre, tracée en vert au sol
const SPOT_LINE = ribbon(6, 0x3cc46a, 0.08, 0.007, 0.95);
function drawSpot(){
  const e = planEnd(STREET_SPOTS[STREET.spot].plan), c = Math.cos(e.th), s = Math.sin(e.th);
  const P = [[2.5,1.05],[2.5,-1.05],[-2.45,-1.05],[-2.45,1.05],[2.5,1.05],[2.5,-1.05]].map(([lx,lz])=>[e.x + lx*c - lz*s, e.z + lx*s + lz*c]);
  SPOT_LINE.set(P);
}

// Vues : coordonnées dans la voiture (x avant, y haut, z gauche), sauf « dessus » (monde) et « libre » (souris)
const STREET_VIEWS = {
  driver: {p:[-0.3,1.25,0.37], t:[8,0.85,0.37]},
  behind: {p:[-6.8,2.7,0], t:[2,0.6,0]},
  front:  {p:[7.2,1.9,0.4], t:[0,0.6,0]},
};
function streetCam(dt, o){
  if(STREET.view==='free'){                                    // la souris tourne autour, la caméra suit la voiture
    if(STREET.lastO){ const dx = o.x - STREET.lastO.x, dz = o.z - STREET.lastO.z; camera.position.x += dx; camera.position.z += dz; controls.target.x += dx; controls.target.z += dz; }
    STREET.lastO = {x:o.x, z:o.z}; return;
  }
  STREET.lastO = null;
  const k = 1 - Math.exp(-dt*7);
  let want, look;
  if(STREET.view==='top'){ want = new THREE.Vector3(o.x, 22, o.z + 1.8); look = new THREE.Vector3(o.x, 0, o.z - 0.3); }
  else { const v = STREET_VIEWS[STREET.view]; want = ROOT.localToWorld(new THREE.Vector3(...v.p)); look = ROOT.localToWorld(new THREE.Vector3(...v.t)); }
  if(STREET.view==='driver'){ camera.position.copy(want); controls.target.copy(look); }   // assis dans la voiture : pas de retard
  else { camera.position.lerp(want, k); controls.target.lerp(look, k); }
}

// Rétroviseurs (vue conducteur) : trois petites caméras rendues dans des textures, affichées en miroir par-dessus
const MIRRORS = [
  {p:[0.78,1.0,0.98],  t:[-6,0.8,2.2],  fov:28, w:360, h:180, x:0.68,  y:-0.5, sx:0.32},    // gauche (le canvas est retourné : à l'écran, il est à gauche)
  {p:[0.78,1.0,-0.98], t:[-6,0.8,-2.4], fov:28, w:360, h:180, x:-0.68, y:-0.5, sx:0.32},    // droit
  {p:[0.55,1.27,0.02], t:[-6,1.0,0],    fov:34, w:500, h:140, x:0,     y:0.76,  sx:0.42},   // intérieur
].map(m=>{
  m.rt = new THREE.WebGLRenderTarget(m.w, m.h); m.cam = new THREE.PerspectiveCamera(m.fov, m.w/m.h, 0.05, 80);
  return m;
});
const HUD = new THREE.Scene(), hudCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
MIRRORS.forEach(m=>{
  const frame = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({color:0x15181b}));
  m.quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({map:m.rt.texture}));   // le retournement CSS du canvas en fait un miroir
  m.frame = frame; HUD.add(frame); HUD.add(m.quad);
});
const mirrorsOn = ()=> (STREET.on && STREET.view==='driver') || (tour && tour.shots[tour.i] && tour.shots[tour.i].mirrors);
function mirrorsPre(){
  if(!mirrorsOn()) return;
  const asp = canvas.clientWidth / Math.max(1, canvas.clientHeight);
  MIRRORS.forEach(m=>{
    m.cam.position.copy(ROOT.localToWorld(new THREE.Vector3(...m.p))); m.cam.lookAt(ROOT.localToWorld(new THREE.Vector3(...m.t)));
    renderer.setRenderTarget(m.rt); renderer.render(scene, m.cam);
    const sy = m.sx * asp * m.h/m.w;
    m.quad.position.set(m.x, m.y, 0); m.quad.scale.set(m.sx, sy, 1);
    m.frame.position.set(m.x, m.y, -0.1); m.frame.scale.set(m.sx + 0.02, sy + 0.02*asp, 1);
  });
  renderer.setRenderTarget(null);
}
function mirrorsPost(){
  if(!mirrorsOn()) return;
  renderer.autoClear = false; renderer.clearDepth(); renderer.render(HUD, hudCam); renderer.autoClear = true;
}

function streetStart(spot){
  if(tour) stopTour();
  // Boîte « simple » : la boîte auto (ou l'électrique) en D, moteur tournant ; on ne s'occupe que d'avancer, reculer et braquer
  const simple = STREET.gearbox==='simple';
  if(simple && S.mode==='manual') setMode('auto'); else if(!simple && S.mode!=='manual') setMode('manual');
  resetForTour();
  if(simple){ Object.assign(S, {engineOn:true, runTime:5, we:W_IDLE, sel:'D', agear:1, brake:1}); STREET.keys = {}; }
  document.querySelector('.panel').classList.toggle('street-simple', simple);
  document.querySelectorAll('#streetGear button').forEach(b=>b.classList.toggle('act', b.dataset.g===STREET.gearbox));
  const sp = STREET_SPOTS[spot]; STREET.spot = spot;
  if(!STREET.on){ STREET.slow = S.slow; STREET.body = bodyMode; }
  STREET.on = true; STREET.trail = []; STREET.done = false; STREET.hit = 0;
  STREET.pose = {x:sp.start.x + WH.xR*Math.cos(sp.start.th), z:sp.start.z + WH.xR*Math.sin(sp.start.th), th:sp.start.th};
  PARK.on = true; PARK.plan = sp.plan; PARK.delta = 0; S.slow = 1;
  scene.fog.near = 30; scene.fog.far = 80;
  bodyMode = 'wire'; applyBodyMode(); refreshVis(); drawSpot();
  stage.classList.add('street-on'); $('driveCtl').hidden = false; appTab('drive'); document.querySelector('.panel').classList.add('driving');
  document.querySelectorAll('#tryRow .btn').forEach(b=>b.classList.toggle('act', b.dataset.try===spot));
  setSteer(0); streetPlace();
  const go = simple ? tr('↑ pour avancer, ↓ pour reculer, Espace pour freiner, ← → pour tourner. ','↑ to go forward, ↓ to reverse, Space to brake, ← → to steer. ')
                    : tr('Démarre et passe la 1re. ','Start the engine and select 1st. ');
  say(go + (spot==='par' ? tr('Gare-toi en créneau dans la place verte, derrière la voiture grise.','Parallel park in the green space, behind the grey car.')
                         : tr('Gare-toi en bataille dans la place verte.','Park nose-in in the green space.')), 8);
}
function streetStop(){
  if(!STREET.on) return;
  STREET.on = false; $('sensors').hidden = true; S.slow = STREET.slow; bodyMode = STREET.body; applyBodyMode();
  stage.classList.remove('street-on'); $('driveCtl').hidden = true; document.querySelector('.panel').classList.remove('driving');
  document.querySelectorAll('#tryRow .btn').forEach(b=>b.classList.remove('act'));
  document.querySelector('.panel').classList.remove('street-simple');
  controls.enabled = true; parkOff(); TRACKS.forEach(t=>t.set([])); SPOT_LINE.set([]); goView('car');
}
function streetPlace(){
  const o = originOf(STREET.pose);
  ROOT.position.set(o.x, 0, o.z); ROOT.rotation.y = -o.th; ROOT.updateMatrixWorld(true);
  return o;
}
function setSteer(d){ PARK.delta = clamp(d, -PARK_DMAX, PARK_DMAX); $('steer').value = Math.round(-PARK.delta/PARK_DMAX*100); }

// Boîte simple : ↑ avance (D), ↓ recule (R), Espace freine. Touche lâchée : la voiture freine jusqu'à l'arrêt et y reste.
function streetPedals(){
  const K = STREET.keys, v = S.v; let gas = 0, brake = 0, sel = S.sel;
  if(K.brake) brake = 1;
  else if(K.up){ if(v < -0.3) brake = 1; else { sel = 'D'; gas = 0.45; } }
  else if(K.down){ if(v > 0.3) brake = 1; else { sel = 'R'; gas = 0.35; } }
  else brake = Math.abs(v) < 0.4 ? 1 : 0.45;                          // touche lâchée : la voiture s'arrête en douceur
  if(sel !== S.sel){ S.sel = sel; if(sel==='D') S.agear = 1; document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s===sel)); }
  anim.gas = {to:gas, rate:2}; anim.brake = {to:brake, rate:brake ? 4 : 3};
  streetDirUI();
}
function streetTick(dt){
  if(!STREET.on) return;
  if(STREET.gearbox==='simple') streetPedals();
  // direction façon jeu de voiture : on tient la flèche pour tourner, on lâche et le volant revient au centre ;
  // plus on va vite, moins les roues braquent (pleine butée seulement au pas)
  const lim = PARK_DMAX/(1 + Math.pow(Math.abs(S.v)/7, 2));
  if(STREET.steerKey) setSteer(clamp(PARK.delta + STREET.steerKey*2.2*dt, -lim, lim));
  else if(!STREET.sliderHeld) setSteer(Math.sign(PARK.delta)*Math.max(0, Math.abs(PARK.delta) - 2.6*dt));
  // avance la voiture de la distance parcourue, sauf si ça touche
  const ds = S.v*dt, next = parkArc(STREET.pose, PARK.delta, ds), box = carBox(originOf(next));
  const hit = PARK_OBST.find(ob=>obbHit(box, ob));
  if(hit){
    S.v = 0; S.win = 0; if(S.mode==='ev') S.we = 0;
    if(STREET.hit <= 0) say(hit.kerb ? tr('Aïe, le trottoir ! Recule un peu et redresse.','Ouch, the kerb! Back up a little and straighten.')
                       : hit.wall ? tr('Fin de la rue : fais demi-tour en marche arrière.','End of the street: back up.')
                       : tr('Boum ! Tu as touché une voiture. Repars dans l\'autre sens.','Bump! You touched a car. Go the other way.'), 4);
    STREET.hit = 1.5;
  } else STREET.pose = next;
  if(STREET.hit > 0) STREET.hit -= dt;
  const o = streetPlace();
  // traces des pneus
  const last = STREET.trail[STREET.trail.length-1];
  if(!last || Math.hypot(o.x-last.x, o.z-last.z) > 0.05){ STREET.trail.push(o); if(STREET.trail.length > 600) STREET.trail.shift(); }
  TRACKS.forEach((t,i)=>t.set(STREET.trail.map(p=>toWorld(p, WHEEL_PTS[i][0], WHEEL_PTS[i][1]))));
  drawGuides({...o, d:PARK.delta, g:(S.mode==='manual' ? S.gear==='R' : S.sel==='R') ? 'R' : 'F'});
  sensorsTick(o);
  // garée ?
  const e = planEnd(STREET_SPOTS[STREET.spot].plan), dTh = Math.abs(Math.atan2(Math.sin(o.th-e.th), Math.cos(o.th-e.th)));
  const ok = Math.hypot(o.x-e.x, o.z-e.z) < 0.45 && dTh < 6*DEG && Math.abs(S.v) < 0.05;
  if(ok && !STREET.done){ STREET.done = true; say(tr('Bravo, bien garée ! Coupe le moteur, ou choisis un autre exercice.','Well done, parked! Switch the engine off, or pick another exercise.'), 8); }
  if(!ok && Math.hypot(o.x-e.x, o.z-e.z) > 1) STREET.done = false;
  streetCam(dt, o);
}

// Onglets : « Découvrir » (la voiture ouverte) et « Conduire » (les vidéos pour se garer, puis on essaie)
function appTab(m){ document.querySelectorAll('#appModes .mode').forEach(b=>b.classList.toggle('act', b.dataset.app===m)); document.querySelector('.panel').classList.toggle('tab-drive', m==='drive'); }
document.querySelectorAll('#appModes .mode').forEach(b=> b.onclick = ()=>{ if(b.dataset.app==='explore') streetStop(); appTab(b.dataset.app); });
document.querySelectorAll('#tryRow .btn').forEach(b=> b.onclick = ()=>{ ensureAudio(); streetStart(b.dataset.try); });
$('streetStop').onclick = streetStop;
document.querySelectorAll('#streetGear button').forEach(b=> b.onclick = ()=>{ STREET.gearbox = b.dataset.g; streetStart(STREET.spot); });
function streetDirUI(){ document.querySelectorAll('#streetDir button').forEach(b=>b.classList.toggle('act', !!STREET.keys[b.dataset.k])); }
document.querySelectorAll('#streetDir button').forEach(b=>{       // boutons à maintenir (téléphone)
  const k = b.dataset.k, on = v => e => { STREET.keys[k] = v; if(v) ensureAudio(); e.preventDefault(); };
  b.addEventListener('pointerdown', on(true)); ['pointerup','pointerleave','pointercancel'].forEach(t=>b.addEventListener(t, on(false)));
});
function setStreetView(v){
  STREET.view = v; controls.enabled = v==='free';
  document.querySelectorAll('#streetView button').forEach(b=>b.classList.toggle('act', b.dataset.v===v));
  if(v==='free'){ const o = originOf(STREET.pose); controls.target.set(o.x, 0.6, o.z); }
}
document.querySelectorAll('#streetView button').forEach(b=> b.onclick = ()=>setStreetView(b.dataset.v));
$('steer').addEventListener('input', e=>{ PARK.delta = -e.target.value/100*PARK_DMAX; });
$('steer').addEventListener('pointerdown', ()=>{ STREET.sliderHeld = true; });
['pointerup','pointercancel'].forEach(t=>$('steer').addEventListener(t, ()=>{ STREET.sliderHeld = false; }));
window.addEventListener('keydown', e=>{
  if(!STREET.on || e.metaKey || e.ctrlKey || e.altKey) return;
  const SK = {ArrowUp:'up', ArrowDown:'down', ' ':'brake'}[e.key];
  if(SK && STREET.gearbox==='simple'){ STREET.keys[SK] = true; e.preventDefault(); ensureAudio(); return; }
  if(e.key==='ArrowLeft'){ STREET.steerKey = 1; e.preventDefault(); }
  else if(e.key==='ArrowRight'){ STREET.steerKey = -1; e.preventDefault(); }
  else if(e.key.toLowerCase()==='v' && !e.repeat){ const L = ['driver','behind','front','top','free']; setStreetView(L[(L.indexOf(STREET.view)+1) % L.length]); }
});
window.addEventListener('keyup', e=>{ if(e.key==='ArrowLeft' || e.key==='ArrowRight') STREET.steerKey = 0;
  const SK = {ArrowUp:'up', ArrowDown:'down', ' ':'brake'}[e.key]; if(SK) STREET.keys[SK] = false; });
