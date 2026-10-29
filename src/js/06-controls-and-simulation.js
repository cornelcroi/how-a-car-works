
/* ======================================================================
   ZOOM VERS LE POINT VISÉ (molette, pincement, double-clic)
   ====================================================================== */
controls.enableZoom = false;
function pickPoint(cx, cy){
  const r = canvas.getBoundingClientRect();
  ptr.set(((cx-r.left)/r.width)*2-1, -((cy-r.top)/r.height)*2+1);
  ray.setFromCamera(ptr, camera);
  const hits = ray.intersectObjects(LEAVES.filter(o=>o.visible && !o.isLine && !o.isPoints && !(o.material.transparent && o.material.opacity<0.2)), false);
  if(hits.length) return hits[0].point.clone();
  const n = camera.getWorldDirection(new THREE.Vector3()), pl = new THREE.Plane().setFromNormalAndCoplanarPoint(n, controls.target);
  const p = new THREE.Vector3(); return ray.ray.intersectPlane(pl, p) ? p : controls.target.clone();
}
function zoomAt(p, k){
  const nc = p.clone().add(camera.position.clone().sub(p).multiplyScalar(k));
  const nt = p.clone().add(controls.target.clone().sub(p).multiplyScalar(k));
  if(nc.distanceTo(nt) < 0.03 && k<1) return;
  if(nc.distanceTo(new THREE.Vector3(0,0.5,0)) > 18 && k>1) return;
  camera.position.copy(nc); controls.target.copy(nt); tween=null; follow.back=null;
}
canvas.addEventListener('wheel', e=>{ e.preventDefault(); if(tour){ tour.zm = clamp((tour.zm||1)*Math.exp(clamp(e.deltaY,-120,120)*0.0016), 0.3, 3); return; } zoomAt(pickPoint(e.clientX,e.clientY), Math.exp(clamp(e.deltaY,-120,120)*0.0016)); }, {passive:false});
canvas.addEventListener('dblclick', e=>{ const p=pickPoint(e.clientX,e.clientY); flyTo(p.clone().add(camera.position.clone().sub(controls.target).multiplyScalar(0.55)), p, 0.6); });
const touches = new Map(); let pinch=null;
canvas.addEventListener('pointerdown', e=>{ if(e.pointerType==='touch'){ touches.set(e.pointerId,[e.clientX,e.clientY]); if(touches.size===2){ const [a,b]=[...touches.values()]; pinch={d:Math.hypot(a[0]-b[0],a[1]-b[1]), p:pickPoint((a[0]+b[0])/2,(a[1]+b[1])/2)}; } } });
canvas.addEventListener('pointermove', e=>{ if(!touches.has(e.pointerId)) return; touches.set(e.pointerId,[e.clientX,e.clientY]);
  if(pinch && touches.size===2){ const [a,b]=[...touches.values()]; const d=Math.hypot(a[0]-b[0],a[1]-b[1]); if(d>10){ zoomAt(pinch.p, clamp(pinch.d/d,0.8,1.25)); pinch.d=d; } } });
['pointerup','pointercancel'].forEach(ev=>canvas.addEventListener(ev, e=>{ touches.delete(e.pointerId); if(touches.size<2) pinch=null; }));

/* ======================================================================
   COMMANDES
   ====================================================================== */
const pedals = {clutch:$('pClutch'), brake:$('pBrake'), gas:$('pGas')};
const anim = {clutch:null, brake:null, gas:null};
const TAP_ON = {clutch:1, brake:1, gas:0.3};
const RATE_DOWN = {clutch:4, brake:5, gas:3}, RATE_UP = {clutch:0.45, brake:4, gas:3};
Object.entries(pedals).forEach(([k,el])=>{
  let drag=null;
  el.addEventListener('pointerdown', e=>{ el.setPointerCapture(e.pointerId); drag={y:e.clientY, v:S[k], moved:false}; ensureAudio(); stopDemo(); });
  el.addEventListener('pointermove', e=>{ if(!drag || !el.hasPointerCapture(e.pointerId)) return;
    const dy=e.clientY-drag.y; if(Math.abs(dy)>5) drag.moved=true;
    if(drag.moved){ anim[k]=null; S[k]=clamp(drag.v + dy/(el.clientHeight-38),0,1); } });
  el.addEventListener('pointerup', ()=>{ if(drag && !drag.moved){ const down = S[k] < TAP_ON[k]*0.5; anim[k] = {to: down ? TAP_ON[k] : 0, rate: down ? RATE_DOWN[k] : RATE_UP[k]}; if(down && k==='clutch') followAction('clutch',3); } drag=null; });
  el.addEventListener('keydown', e=>{
    if(e.key==='ArrowDown'){S[k]=clamp(S[k]+0.1,0,1);anim[k]=null;e.preventDefault();}
    if(e.key==='ArrowUp'){S[k]=clamp(S[k]-0.1,0,1);anim[k]=null;e.preventDefault();}
    if(e.key===' '||e.key==='Enter'){ const down=S[k]<TAP_ON[k]*0.5; anim[k]={to:down?TAP_ON[k]:0, rate:down?RATE_DOWN[k]:RATE_UP[k]}; e.preventDefault(); } });
});
function drawPedals(){ Object.entries(pedals).forEach(([k,el])=>{ const h=el.clientHeight; el.querySelector('.pad').style.transform=`translateY(${S[k]*(h-38)}px)`; el.querySelector('.fill').style.height=(S[k]*100)+'%'; el.setAttribute('aria-valuenow', Math.round(S[k]*100)); }); }
const KEYMAP = {c:'clutch', a:'gas', q:'gas', arrowup:'gas', f:'brake', arrowdown:'brake'};
const DIGIT = {Digit1:'1',Digit2:'2',Digit3:'3',Digit4:'4',Digit5:'5',Digit6:'6',Numpad1:'1',Numpad2:'2',Numpad3:'3',Numpad4:'4',Numpad5:'5',Numpad6:'6'};
const held = {};
window.addEventListener('keydown', e=>{
  if(e.target.closest && e.target.closest('.pedal')) return;
  if(e.metaKey||e.ctrlKey||e.altKey) return;
  const k=e.key.toLowerCase();
  if(KEYMAP[k] && !(k==='c' && S.mode==='auto')){ const p=KEYMAP[k]; if(!held[p]){ held[p]=true; anim[p]={to: p==='gas'?0.6:1, rate:3.2}; } e.preventDefault(); ensureAudio(); stopDemo(); return; }
  if(e.repeat) return;
  if(k==='k' || k==='enter'){ stopDemo(); pressStart(); return; }
  if(S.mode==='manual'){
    if(DIGIT[e.code]) { stopDemo(); selectGear(DIGIT[e.code]); }
    else if(k==='r') { stopDemo(); selectGear('R'); }
    else if(k==='n' || e.code==='Digit0') { stopDemo(); selectGear('N'); }
  } else if('prnd'.includes(k) && k.length===1){ stopDemo(); selectAuto(k.toUpperCase()); }
});
window.addEventListener('keyup', e=>{ const p=KEYMAP[e.key.toLowerCase()]; if(p){ held[p]=false; anim[p]={to:0, rate: p==='clutch'?1.1:3}; } });
window.addEventListener('blur', ()=>{ for(const p in held) if(held[p]){ held[p]=false; anim[p]={to:0, rate:3}; } });

let nudgeClutchT = 0;
function pressStart(){
  ensureAudio();
  if(S.engineOn){ S.engineOn=false; say(S.mode==='ev'?tr('Voiture éteinte.','Car switched off.'):tr('Moteur coupé.','Engine off.'),2.5); return; }
  if(S.cranking>0) return;
  if(S.mode==='ev'){
    if(!(S.sel==='P'||S.sel==='N')){ say(tr('Mets le levier sur P pour allumer la voiture.','Put the lever in P to switch the car on.'),4); return; }
    gameOnStart();
    if(FAULT.active && FAULT.kind==='ev12v'){ say(tr('Rien ne s\'allume… La petite batterie 12 V est vide : c\'est elle qui réveille l\'ordinateur de la voiture.','Nothing lights up… The small 12 V battery is flat: it\'s the one that wakes up the car\'s computer.'),5); return; }
    if(S.brake<0.3){ say(tr('Pour allumer une voiture électrique, garde le pied sur le frein en appuyant sur Démarrer.','To switch on an electric car, keep your foot on the brake while you press Start.'),4.5); return; }
    S.engineOn=true; S.runTime=0; say(tr('READY ! La voiture est prête… et complètement silencieuse.','READY! The car is ready… and completely silent.'),4); followAction('engine',3); return;
  }
  if(S.mode==='manual' && S.gear!=='N' && S.clutch < 0.6){ say(tr('Enfonce d\'abord la pédale d\'embrayage à fond (ou mets le point mort). Sinon la voiture ferait un bond au démarrage !','First press the clutch pedal all the way down (or select neutral). Otherwise the car would jump forward when it starts!'),5); nudgeClutchT=4; return; }
  if(S.mode==='auto' && !(S.sel==='P' || S.sel==='N')){ say(tr('Une boîte automatique ne démarre que sur P ou N. Mets le levier sur P.','An automatic only starts in P or N. Put the lever in P.'),4.5); return; }
  gameOnStart();
  if(FAULT.active && FAULT.kind==='battery'){ say(tr('Clic… La batterie est vide : elle n\'a plus assez d\'électricité pour faire tourner le démarreur.','Click… The battery is flat: it no longer has enough electricity to turn the starter motor.'),4); return; }
  if(FAULT.active && FAULT.kind==='starter'){ say(tr('Rien ne tourne… Les phares marchent, donc ce n\'est pas la batterie.','Nothing turns… The headlights work, so it\'s not the battery.'),4); return; }
  S.cranking = 1.1; followAction('engine', 3);
}
$('startBtn').onclick = ()=>{ stopDemo(); pressStart(); };

const GATE = {R:[-1.5,1],1:[-0.5,1],2:[-0.5,-1],3:[0.5,1],4:[0.5,-1],5:[1.5,1],6:[1.5,-1]};
const LEV = {col:0.5, row:0, path:[], pending:null};
function leverTo(g){
  const p=[]; if(LEV.row!==0) p.push({col:LEV.col,row:0});
  if(g==='N') p.push({col:0.5,row:0}); else { p.push({col:GATE[g][0],row:0}); p.push({col:GATE[g][0],row:GATE[g][1]}); }
  LEV.path=p; LEV.pending=g;
}
function resetLever(){ LEV.path=[]; LEV.pending=null; LEV.col=0.5; LEV.row=0; }
function updateLever(dt){
  let step = dt*6;
  while(step>0 && LEV.path.length){ const w=LEV.path[0], dc=w.col-LEV.col, dr=w.row-LEV.row, d=Math.hypot(dc,dr);
    if(d<=step){ LEV.col=w.col; LEV.row=w.row; LEV.path.shift(); step-=d; } else { LEV.col+=dc/d*step; LEV.row+=dr/d*step; step=0; } }
  if(!LEV.path.length && LEV.pending){ S.gear = LEV.pending; LEV.pending=null; }
  const k=$('knob'); k.setAttribute('cx', 25+(LEV.col+1.5)*50); k.setAttribute('cy', 52-LEV.row*36);
}
function selectGear(g){
  if(g===(LEV.pending||S.gear)) return;
  if(g!=='N' && S.engineOn && S.clutch < 0.85){ say(tr('Crrrrr ! Ça craque : les pignons tournent à des vitesses différentes. Enfonce l\'embrayage à fond, puis passe la vitesse.','Crrrrr! It grinds: the gears are spinning at different speeds. Press the clutch all the way down, then change gear.'),4.5); nudgeClutchT=4; flashEl($('shifter')); return; }
  if(g==='3' && FAULT.kind==='synchro'){ gameTrigger(); if(FAULT.active){ say(tr('Crrrrr ! Impossible de passer la 3e, même avec l\'embrayage enfoncé.','Crrrrr! You can\'t get into 3rd, even with the clutch down.'),4); flashEl($('shifter')); return; } }
  if(g==='R' && S.v > 0.8){ say(tr('Arrête la voiture avant de passer la marche arrière.','Stop the car before you select reverse.'),3.5); return; }
  if(g!=='N' && g!=='R' && S.v < -0.8){ say(tr('Arrête la voiture avant de passer une vitesse pour avancer.','Stop the car before you select a forward gear.'),3.5); return; }
  if(S.gear!=='N') S.win = (S.v/WH.r)*RATIO_M[S.gear]*FD;
  S.gear = 'N'; leverTo(g);                 // le levier quitte la vitesse, passe par le point mort, puis entre dans la nouvelle
  document.querySelectorAll('#shifter .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.g===g));
  followAction('gearbox', 3.5);
}
function selectAuto(s){
  if(s===S.sel) return;
  if(S.sel==='P' && S.brake < 0.3 && S.engineOn){ say(tr('Pour quitter P, garde le pied sur le frein (sécurité).','To leave P, keep your foot on the brake (safety).'),3.5); flashEl($('selector')); return; }
  if((s==='P' || s==='R') && S.v > 0.8){ say(tr('Arrête la voiture avant de passer sur '+s+'.','Stop the car before you select '+s+'.'),3.5); return; }
  if(s==='D' && S.v < -0.8){ say(tr('Arrête la voiture avant de passer en D.','Stop the car before you select D.'),3.5); return; }
  if(s==='D' && S.sel!=='D') S.agear = 1;
  S.sel = s; S.shiftT = 0.6;
  document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s===s));
  followAction('gearbox', 3.5);
}
function flashEl(s){ if(s.animate) s.animate([{transform:'translateX(0)'},{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}],{duration:260}); }
document.querySelectorAll('#shifter .gbtn[data-g]').forEach(b=> b.onclick = ()=>{ ensureAudio(); stopDemo(); selectGear(b.dataset.g); });
document.querySelectorAll('#selector .gbtn').forEach(b=> b.onclick = ()=>{ ensureAudio(); stopDemo(); selectAuto(b.dataset.s); });
const handBtn = $('handBtn');
['pointerdown'].forEach(ev=>handBtn.addEventListener(ev, e=>{ handBtn.setPointerCapture(e.pointerId); if(S.engineOn){ say(tr('Coupe d\'abord le moteur pour le tourner à la main.','Switch the engine off first to turn it by hand.'),3); return; } S.hand=true; }));
['pointerup','pointercancel','pointerleave'].forEach(ev=>handBtn.addEventListener(ev, ()=>{ S.hand=false; }));

function setMode(m){
  if(m===S.mode) return;
  stopDemo(); stopTour(); gameQuit();
  Object.assign(S,{mode:m, engineOn:false, cranking:0, we:0, win:0, v:0, clutch:0, gas:0, brake:0, gear:'N', sel:'P', agear:1, lock:false});
  for(const k in anim) anim[k]=null; resetLever();
  document.querySelectorAll('#modeSeg button').forEach(b=>b.classList.toggle('act', b.dataset.m===m));
  const ev = m==='ev'; S.evSOC = 0.8;
  $('manualBox').hidden = m!=='manual'; $('autoBox').hidden = m==='manual';
  $('elemsWrap').hidden = ev; $('evSelNote').hidden = !ev; $('handRow').hidden = ev; $('evRead').hidden = !ev; $('wlReady').hidden = !ev;
  $('vTiming').hidden = ev; $('vClutch').hidden = ev; $('vPack').hidden = !ev; $('pEvCat').hidden = !ev;
  ['casing','internals','clutch'].forEach(k=>{ document.querySelector(`.part[data-p="${k}"]`).hidden = ev; });
  setTach(); renderSpec();
  $('clutchW').hidden = m!=='manual'; $('pedals').classList.toggle('two', m!=='manual');
  $('vClutch').textContent = m==='manual' ? tr('Embrayage','Clutch') : tr('Convertisseur','Converter');
  $('pClutchCat').textContent = m==='manual' ? tr('Embrayage','Clutch') : tr('Convertisseur','Converter');
  document.querySelectorAll('#shifter .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.g==='N'));
  document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s==='P'));
  if(iso && isoKey && INFO[isoKey].mode && INFO[isoKey].mode!==m) unIsolate();
  buildLesson(); renderScenarios(); refreshVis();
}
document.querySelectorAll('#modeSeg button').forEach(b=> b.onclick = ()=> setMode(b.dataset.m));
document.querySelectorAll('#slow button').forEach(b=> b.onclick = ()=>{ S.slow=+b.dataset.s; document.querySelectorAll('#slow button').forEach(x=>x.classList.toggle('act',x===b)); });
document.querySelectorAll('#bodySeg button').forEach(b=> b.onclick = ()=>{ bodyMode=b.dataset.b; document.querySelectorAll('#bodySeg button').forEach(x=>x.classList.toggle('act',x===b)); applyBodyMode(); });
document.querySelectorAll('#swatches .sw').forEach(b=> b.onclick = ()=>{ BODY.paint.color.set('#'+b.dataset.c); document.querySelectorAll('#swatches .sw').forEach(x=>x.classList.toggle('act',x===b)); });
$('optTags').onchange = e=>{ tagsEl.hidden = !e.target.checked; };
$('optSound').onchange = e=>{ if(e.target.checked) ensureAudio(); };



/* ======================================================================
   SIMULATION
   ====================================================================== */
function carStep(v, Fd, h){
  let brakeF = 9500*S.brake; if(FAULT.active && FAULT.kind==='pads') brakeF *= 0.18;
  if(S.mode==='ev') brakeF *= 0.6;
  if((S.mode==='auto'||S.mode==='ev') && S.sel==='P') brakeF = 30000;
  const Fres = 160 + brakeF, drag = 0.43*v*Math.abs(v);
  if(Math.abs(v) < 0.02){ if(Math.abs(Fd) <= Fres) return 0; return v + (Fd - Math.sign(Fd)*Fres)/massNow()*h; }
  const nv = v + (Fd - Math.sign(v)*Fres - drag)/massNow()*h;
  if(Math.sign(nv)!==Math.sign(v) && Math.abs(Fd) < Fres) return 0;
  return nv;
}
const misfire = () => FAULT.active && FAULT.kind==='spark';
const beltBroken = () => FAULT.active && FAULT.kind==='belt';
const cvBroken = () => FAULT.active && FAULT.kind==='cv';
let outFree = 0;   // vitesse de l'arbre de sortie quand un cardan est cassé
function engineTorque(rpm){
  let Te = 0;
  if(S.engineOn){ if(rpm < 6600) Te = S.gas*torqueCurve(rpm)*(misfire()?0.7:1); Te += clamp(10 + 3*(W_IDLE - S.we), 0, 80); }
  if(S.cranking>0) Te += 55*Math.max(0, 1 - S.we/30);
  if(S.hand && !S.engineOn && S.cranking<=0) Te += 40*Math.max(0, 1 - S.we/6.3);
  return Te;
}
function simulate(dt){
  for(const k in anim){ const a=anim[k]; if(!a) continue; const d=a.to-S[k], st=a.rate*dt; if(Math.abs(d)<=st){ S[k]=a.to; anim[k]=null; } else S[k]+=Math.sign(d)*st; }
  if(S.mode==='auto') S.clutch = 0;
  if(S.cranking>0){ S.cranking -= dt; if(S.cranking<=0){ S.cranking=0;
      if(beltBroken()) say(tr('Le démarreur fait tourner le moteur… mais il ne démarre pas. Regarde bien ce qui tourne et ce qui ne tourne pas.','The starter turns the engine… but it doesn\'t start. Look closely at what turns and what doesn\'t.'),5);
      else { S.engineOn=true; S.runTime=0; } } }
  if(S.engineOn) S.runTime += dt;
  const n = Math.max(20, Math.ceil(dt/0.0004)), h = dt/n; let slipAcc = 0;
  const ratio = ratioNow();
  if(S.mode==='ev'){ simEV(n,h,dt); }
  else if(S.mode==='manual'){
    const e = engagement(), C = (FAULT.active && FAULT.kind==='clutch' ? 75 : 330)*Math.pow(e,1.6);
    const free = !ratio || cvBroken();
    for(let i=0;i<n;i++){
      const Te = engineTorque(S.we*RPM);
      const Tf = S.we > 0.5 ? 8 + 0.03*S.we : S.we*16;
      const win = free ? S.win : (S.v/WH.r)*ratio*FD;
      const Tc = clamp(KC*(S.we - win), -C, C);
      S.we = Math.max(0, S.we + (Te - Tf - Tc)/IE*h);
      if(!free){ S.v = carStep(S.v, Tc*ratio*FD/WH.r, h); S.win = (S.v/WH.r)*ratio*FD; }
      else { const Tfi = Math.abs(S.win)>0.5 ? 0.4*Math.sign(S.win)+0.01*S.win : S.win*0.8; S.win += (Tc - Tfi)/IIN*h; S.v = carStep(S.v, 0, h); }
      slipAcc += Math.abs(S.we - S.win);
    }
    S.slipLast = slipAcc/n;
    outFree = cvBroken() && ratio ? S.win/ratio : (S.v/WH.r)*FD;
    if(S.engineOn && S.runTime > 0.6 && S.we*RPM < 350){ S.engineOn=false; say(ratio && e>0 ? tr('Le moteur a calé ! L\'embrayage est remonté trop vite. Enfonce l\'embrayage, redémarre, puis relâche-le doucement avec un peu d\'accélérateur.','The engine stalled! The clutch came up too fast. Press the clutch, restart, then let it up gently with a bit of accelerator.') : tr('Le moteur a calé.','The engine stalled.'), 6); }
  } else {
    autoShiftLogic(dt);
    const drive = (S.sel==='D' || S.sel==='R') && !cvBroken();
    const tcDead = FAULT.active && FAULT.kind==='converter';
    for(let i=0;i<n;i++){
      const Te = engineTorque(S.we*RPM);
      const Tf = S.we > 0.5 ? 8 + 0.03*S.we : S.we*16;
      const wt = drive ? (S.v/WH.r)*ratio*FD : S.win;
      let Tp, Tt;
      if(S.lock){ Tp = Tt = clamp(KC*(S.we - wt), -420, 420); }
      else { Tp = KTC*(S.we*Math.abs(S.we) - wt*Math.abs(wt)); const SR = S.we>1 ? wt/S.we : 1; S.tcSR = SR; Tt = Tp*(Tp>0 && SR<0.85 ? 2 - SR/0.85 : 1); }
      if(tcDead){ Tp *= 0.35; Tt = 0; }
      S.we = Math.max(0, S.we + (Te - Tf - Tp)/IE*h);
      if(drive){ S.v = carStep(S.v, Tt*ratio*FD/WH.r, h); S.win = (S.v/WH.r)*ratio*FD; }
      else { const Tfi = Math.abs(S.win)>0.5 ? 0.6*Math.sign(S.win)+0.012*S.win : S.win*0.8; S.win += (Tt - Tfi)/IIN*h; S.v = carStep(S.v, 0, h); }
    }
    outFree = cvBroken() && ratio ? S.win/ratio : (S.v/WH.r)*FD;
    if(S.engineOn && S.runTime > 0.6 && S.we*RPM < 300){ S.engineOn=false; say(tr('Le moteur s\'est arrêté.','The engine stopped.'),4); }
  }
  if(beltBroken() && S.engineOn){ S.engineOn=false; }
  if(S.msgT>0) S.msgT -= dt;
  if(nudgeClutchT>0) nudgeClutchT -= dt;
}
function simEV(n,h,dt){
  const dir = S.sel==='D'?1:S.sel==='R'?-1:0, dead = FAULT.active && FAULT.kind==='inverter';
  let Psum=0, T=0;
  for(let i=0;i<n;i++){
    const wm = (S.v/WH.r)*EV_TOTAL, wa = Math.abs(wm);
    T = 0;
    if(S.engineOn && dir && !dead && !cvBroken()){
      const Tav = Math.min(EV.Tmax, EV.Pmax/Math.max(wa,1)) * (wa*RPM > EV.rpmMax ? 0 : 1);
      if(S.gas>0.02) T = dir*S.gas*Tav;
      else if(Math.abs(S.v)<1.2){ if(S.brake<0.1) T = dir*30; }
      else T = -Math.sign(S.v)*Math.min(EV.Tmax, 30 + S.brake*170);     // le moteur freine et recharge
    }
    S.v = carStep(S.v, T*EV_TOTAL/WH.r, h);
    Psum += T*(S.v/WH.r)*EV_TOTAL;
  }
  S.evT = T; S.evP = Psum/n;
  S.evSOC = clamp(S.evSOC - (S.evP>0 ? S.evP/0.9 : S.evP*0.7)*dt/(EV.kWh*3.6e6)*40, 0, 1);   // ×40 pour que ça se voie
  if(cvBroken() && S.engineOn && dir){ S.win += ((dir*S.gas*900) - S.win)*Math.min(1,dt*3); S.we = S.win; outFree = S.win/EV_R1; }
  else { S.we = (S.v/WH.r)*EV_TOTAL; S.win = S.we; outFree = (S.v/WH.r)*FD; }
}
let lastAutoShift = 0;
function autoShiftLogic(dt){
  if(S.shiftT>0) S.shiftT -= dt;
  const kmh = S.v*3.6;
  if(S.sel==='D'){
    const rpmIn = (S.v/WH.r)*RATIO_A[S.agear]*FD*RPM;
    const up = 1700 + S.gas*4400, down = 1050 + S.gas*2300;
    if(S.shiftT<=0){
      if(S.agear<6 && rpmIn > up){ S.agear++; S.shiftT=0.9; onAutoShift(); }
      else if(S.agear>1 && rpmIn < down && (S.v/WH.r)*RATIO_A[S.agear-1]*FD*RPM < 5600){ S.agear--; S.shiftT=0.9; onAutoShift(); }
    }
    const SR = S.we>1 ? ((S.v/WH.r)*RATIO_A[S.agear]*FD)/S.we : 0;
    if(!S.lock && S.agear>=3 && kmh>45 && S.gas<0.8 && SR>0.9 && S.shiftT<=0) S.lock = true;
    if(S.lock && (S.agear<3 || kmh<38 || S.gas>0.85 || S.shiftT>0.5)) S.lock = false;
  } else S.lock = false;
}
function onAutoShift(){ const now=performance.now(); if(now-lastAutoShift>6000) followAction('gearbox',3); lastAutoShift=now;
  say(tr(`La boîte passe la ${S.agear}${S.agear===1?'re':'e'} toute seule : ${SHIFT_EL[S.agear].join(' et ')} se serrent.`, `The gearbox shifts into ${S.agear}${['','st','nd','rd'][S.agear]||'th'} gear by itself: ${SHIFT_EL[S.agear].join(' and ')} apply.`), 3); }
