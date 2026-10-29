
/* ======================================================================
   EXPLICATIONS, LEÇON, DÉMO
   ====================================================================== */
const ORD = g => IS_EN ? (g==='R' ? 'reverse' : g+({1:'st',2:'nd',3:'rd'}[g]||'th')) : (g==='R' ? 'marche arrière' : g+(g==='1'||g===1?'re':'e'));
function narrate(){
  const e = engagement(), rpm = S.we*RPM, kmh = Math.abs(S.v)*3.6, ratio = ratioNow();
  const man = S.mode==='manual';
  const slipping = man && ((e>0 && e<1 && S.slipLast > 6) || (e>0 && S.slipLast > 12));
  const live = S.engineOn || S.cranking>0 || S.hand;
  const driven = live && ratio && e>0;
  const ev = S.mode==='ev';
  if(ev){ const regen = S.engineOn && S.evP < -500, push = S.engineOn && S.evP > 500;
    setChip('chE',tr('Voiture','Car'), S.engineOn ? 'READY' : tr('Éteinte','Off'), S.engineOn?'good':'');
    setChip('chC',tr('Moteur électrique','Electric motor'), regen ? tr('Recharge','Charging') : push ? tr('Pousse','Pushing') : tr('Au repos','Resting'), regen?'good':push?'on':'');
    setChip('chW',tr('Roues','Wheels'), S.engineOn && ratio ? tr('Entraînées','Driven') : tr('Libres','Free'), S.engineOn && ratio?'on':''); }
  else {
  setChip('chE',tr('Moteur','Engine'), S.cranking>0 ? tr('Démarre…','Starting…') : S.engineOn ? tr('Tourne','Running') : S.hand ? tr('Tourné à la main','Turned by hand') : tr('Arrêté','Stopped'), live?'on':'');
  if(man){ const cs = e===0 ? tr('Débrayé','Disengaged') : slipping ? tr('Patine','Slipping') : tr('Embrayé','Engaged'); setChip('chC',tr('Embrayage','Clutch'), cs, e===0?'':slipping?'slip':'good'); }
  else { const tcOff = !S.lock && !S.engineOn, tcSlip = !S.lock && S.engineOn && S.tcSR<0.85 && (S.sel==='D'||S.sel==='R');
    const cs = S.lock ? tr('Ponté','Locked') : tcOff ? tr('Arrêté','Stopped') : tcSlip ? tr('Glisse','Slipping') : tr('Entraîne','Driving'); setChip('chC',tr('Convertisseur','Converter'), cs, tcSlip?'slip':tcOff?'':'good'); }
  setChip('chW',tr('Roues','Wheels'), driven ? (ratio<0?tr('Entraînées en arrière','Driven backwards'):tr('Entraînées','Driven')) : tr('Libres','Free'), driven?'on':'');
  }

  let t;
  if(ev){
    const kw = Math.round(S.evP/1000);
    if(!S.engineOn) t = kmh>1 ? tr('La voiture est éteinte et roule encore : freine.','The car is off and still rolling: brake.') : tr('La voiture est éteinte. Pied sur le frein, appuie sur Démarrer : READY s\'allume, sans aucun bruit de moteur.','The car is off. Foot on the brake, press Start: READY lights up, with no engine noise at all.');
    else if(S.sel==='P') t = tr('READY : tout est prêt, mais rien ne tourne. Le moteur électrique ne tourne que quand on roule : pas de ralenti ! Garde le frein et passe en D.','READY: everything is ready, but nothing turns. The electric motor only turns when the car moves: no idling! Keep the brake on and select D.');
    else if(S.sel==='N') t = tr('N : le moteur ne reçoit pas de courant. La voiture roule librement.','N: the motor gets no current. The car rolls freely.');
    else if(S.evP > 500) t = tr(`L'onduleur envoie ${kw} kW de la batterie vers le moteur. Les bobines s'allument chacune leur tour et entraînent les aimants du rotor. Un seul rapport : le moteur fait ${fr(EV_TOTAL)} tours pour 1 tour de roue.`, `The inverter sends ${kw} kW from the battery to the motor. The coils light up one after another and pull the rotor's magnets along. A single ratio: the motor turns ${fr(EV_TOTAL)} times for 1 turn of the wheel.`);
    else if(S.evP < -500) t = tr(`Tu as levé le pied${S.brake>0.1?' et tu freines':''} : le moteur devient une dynamo. Il ralentit la voiture et renvoie ${-kw} kW dans la batterie (points verts).`, `You lifted your foot${S.brake>0.1?' and you are braking':''}: the motor becomes a generator. It slows the car down and sends ${-kw} kW back into the battery (green dots).`);
    else if(kmh<2 && S.brake>0.1) t = tr('En D, frein appuyé : la voiture attend. Lâche le frein, elle avance doucement toute seule.','In D, brake pressed: the car waits. Let go of the brake and it creeps forward on its own.');
    else t = tr('En D. Appuie sur l\'accélérateur : la force arrive tout de suite, même à l\'arrêt.','In D. Press the accelerator: the force comes straight away, even from a standstill.');
  }
  else if(S.hand && !S.engineOn){
    t = tr('Tu fais tourner le moteur à la main. Les pistons montent et descendent, les soupapes s\'ouvrent. ','You are turning the engine by hand. The pistons go up and down, the valves open. ');
    if(man){ if(e===0) t += tr('L\'embrayage est enfoncé : la boîte ne bouge pas.','The clutch is pressed down: the gearbox doesn\'t move.'); else if(!ratio) t += tr('L\'embrayage est serré : l\'arbre primaire tourne et fait tourner tous les pignons, mais au point mort aucun n\'est verrouillé : les roues ne bougent pas.','The clutch is engaged: the input shaft turns and spins all the gears, but in neutral none of them is locked: the wheels don\'t move.');
      else t += tr(`L'embrayage est serré et la ${ORD(S.gear)} est verrouillée par un baladeur bleu : regarde les roues avancer tout doucement !`, `The clutch is engaged and ${ORD(S.gear)} gear is locked by a blue selector collar: watch the wheels creep forward!`); }
    else t += S.sel==='P' ? tr('Sur P, la sortie de la boîte est bloquée.','In P, the gearbox output is locked.') : tr('L\'huile du convertisseur commence à entraîner la turbine.','The converter\'s oil starts to drive the turbine.');
  }
  else if(S.cranking>0) t = tr('Le démarreur fait tourner le volant moteur. Les pistons bougent, les bougies font des étincelles… et le moteur part tout seul.','The starter turns the flywheel. The pistons move, the spark plugs spark… and the engine runs on its own.');
  else if(!S.engineOn){
    if(kmh>1) t = tr('Le moteur est arrêté et la voiture roule encore. Utilise le frein.','The engine is off and the car is still rolling. Use the brake.');
    else if(man) t = (S.clutch>=0.6 || S.gear==='N') ? tr('Le moteur est arrêté. Appuie sur Démarrer. Astuce : passe une vitesse et maintiens « Tourner le moteur à la main » pour voir ce qui est relié.','The engine is off. Press Start. Tip: put it in gear and hold "Turn the engine by hand" to see what is connected.') : tr('Le moteur est arrêté. Avant de démarrer, enfonce l\'embrayage à fond pour séparer le moteur des roues.','The engine is off. Before starting, press the clutch all the way down to separate the engine from the wheels.');
    else t = (S.sel==='P'||S.sel==='N') ? tr('Le moteur est arrêté, le levier est sur ','The engine is off, the lever is in ')+S.sel+tr('. Appuie sur Démarrer.','. Press Start.') : tr('Pour démarrer, mets le levier sur P.','To start, put the lever in P.');
  }
  else if(man){
    if(e===0){ t = tr('Pédale enfoncée : le diaphragme a libéré le disque d\'embrayage, le moteur tourne tout seul et rien n\'arrive à la boîte. C\'est le moment de changer de vitesse.','Pedal down: the diaphragm spring has freed the clutch disc, the engine spins on its own and nothing reaches the gearbox. Now is the time to change gear.'); if(S.gear==='N' && kmh<1) t+=tr(' Passe la 1re.',' Select 1st.'); }
    else if(!ratio) t = tr(`Ralenti à ${Math.round(rpm/10)*10} tr/min. L'embrayage est serré : l'arbre primaire et tous les pignons tournent. Mais au point mort, aucun baladeur ne verrouille de pignon : les roues ne reçoivent rien.`, `Idling at ${Math.round(rpm/10)*10} rpm. The clutch is engaged: the input shaft and all the gears turn. But in neutral, no selector collar locks a gear: the wheels get nothing.`);
    else if(slipping) t = tr('L\'embrayage patine : le disque frotte contre le volant moteur et transmet la force petit à petit. Continue à relâcher doucement en accélérant un peu.','The clutch is slipping: the disc rubs against the flywheel and passes the force on little by little. Keep releasing gently while giving a little gas.');
    else { t = tr(`Tout est relié ! En ${ORD(S.gear)}, le moteur fait ${fr(Math.abs(ratio*FD))} tours pour 1 tour de roue.`, `Everything is connected! In ${ORD(S.gear)}, the engine turns ${fr(Math.abs(ratio*FD))} times for 1 turn of the wheel.`);
      if(ratio>0 && rpm>3300 && S.gear!=='6') t += tr(' Le moteur tourne vite : passe la vitesse supérieure.',' The engine is revving high: shift up.');
      else if(ratio>0 && rpm<1300 && S.gear!=='1') t += tr(' Le moteur peine : rétrograde.',' The engine is labouring: shift down.');
      if(S.brake>0.2 && kmh<15) t += tr(' Débraye avant de t\'arrêter, sinon le moteur va caler.',' Press the clutch before you stop, or the engine will stall.'); }
  } else {
    if(S.sel==='P') t = tr('P : un cliquet bloque la sortie de la boîte, la voiture ne peut pas rouler. Garde le frein et passe en D.','P: a pawl locks the gearbox output, so the car can\'t roll. Keep the brake on and select D.');
    else if(S.sel==='N') t = tr('N : aucun embrayage ni frein de la boîte n\'est serré. La turbine tourne mais rien n\'arrive aux roues.','N: none of the gearbox clutches or brakes is applied. The turbine turns but nothing reaches the wheels.');
    else { const gk = S.sel==='R' ? 'R' : String(S.agear);
      t = tr(`${S.sel==='R'?'Marche arrière':'D, '+ORD(S.agear)} : ${SHIFT_EL[gk].join(' et ')} sont serrés. Le moteur fait ${fr(Math.abs(RATIO_A[gk]*FD))} tours pour 1 tour de roue.`, `${S.sel==='R'?'Reverse':'D, '+ORD(S.agear)}: ${SHIFT_EL[gk].join(' and ')} are applied. The engine turns ${fr(Math.abs(RATIO_A[gk]*FD))} times for 1 turn of the wheel.`);
      if(kmh<3 && S.brake>0.2) t += tr(' Le frein retient la voiture, mais le convertisseur glisse : le moteur ne cale pas.',' The brake holds the car, but the converter slips: the engine doesn\'t stall.');
      else if(kmh<8 && S.gas<0.05) t += tr(' Sans accélérer, l\'huile du convertisseur pousse doucement : la voiture avance toute seule.',' Without accelerating, the converter\'s oil pushes gently: the car creeps forward on its own.');
      else if(S.lock) t += tr(' L\'embrayage de pontage est collé : plus de glissement.',' The lock-up clutch is closed: no more slipping.');
      else t += tr(' La boîte changera de vitesse toute seule.',' The gearbox will change gear on its own.'); }
  }
  setText('say', t);
  const a=$('alert'); if(S.msgT>0){ a.hidden=false; setText('alert', S.msg); } else a.hidden=true;

  if(Math.abs(S.v)*3.6>20) lesson.fastEv=true;
  if(lesson.done < lesson.conds.length && lesson.conds[lesson.done]()) lesson.done++;
  lesson.items.forEach((li,i)=>{ li.classList.toggle('done', i<lesson.done); li.classList.toggle('now', i===lesson.done); });

  const needClutch = man && (nudgeClutchT>0 || (!S.engineOn && !S.cranking && S.gear!=='N' && S.clutch<0.6) || (!S.engineOn && !S.cranking && lesson.done===0 && S.clutch<0.85));
  pedals.clutch.classList.toggle('nudge', needClutch && !demo);
  pedals.brake.classList.toggle('nudge', !man && !demo && lesson.done===0 && S.brake<0.5);
  const startReady = !S.engineOn && !S.cranking && (man ? (S.gear==='N'||S.clutch>=0.6) && lesson.done>=1 : (S.sel==='P'||S.sel==='N') && lesson.done>=1);
  $('startBtn').classList.toggle('nudge', !demo && startReady);

  const gb=$('gearBig'); const gtxt = man ? S.gear : (S.sel==='D' && !ev ? 'D'+S.agear : S.sel);
  if(gb.firstChild.nodeValue!==gtxt) gb.firstChild.nodeValue=gtxt; gb.style.borderColor = driven ? 'var(--power)' : '';
  const sb=$('startBtn'); sb.classList.toggle('running', S.engineOn); sb.firstChild.firstChild.nodeValue = S.engineOn ? (ev?tr('ÉTEINDRE','SWITCH OFF'):tr('COUPER','STOP')) : S.cranking>0 ? '…' : (ev?tr('ALLUMER','SWITCH ON'):tr('DÉMARRER','START'));
  $('wlReady').classList.toggle('lit', ev && S.engineOn); $('wlReady').classList.add('green');
  if(ev){ $('socBar').style.width = Math.round(S.evSOC*100)+'%'; setText('socTxt', Math.round(S.evSOC*100)+tr(' %','%')); const kw=Math.round(S.evP/1000); setText('pwrTxt', (kw>0?'+':'')+kw+' kW'); $('pwrTxt').style.color = kw<0 ? 'var(--ok)' : kw>0 ? 'var(--power)' : ''; }
}
function setChip(id, name, val, cls){ const el=$(id); const html=`${name} <b>${val}</b>`; if(el._h!==html){ el.innerHTML=html; el._h=html; } el.className='chip '+cls; }
function setText(id, t){ const el=$(id); if(el.textContent!==t) el.textContent=t; }

const lesson = {done:0, fast:false, items:[], conds:[]};
function buildLesson(){
  const kmh = ()=>Math.abs(S.v)*3.6;
  const L = S.mode==='ev' ? [
    [tr('Appuie sur le frein','Press the brake'), ()=>S.brake>0.5],
    [tr('Allume la voiture : READY s\'allume, sans bruit','Switch the car on: READY lights up, silently'), ()=>S.engineOn],
    [tr('Garde le frein et passe en D','Keep the brake on and select D'), ()=>S.sel==='D'],
    [tr('Accélère jusqu\'à 50 km/h : regarde les points orange dans les câbles','Accelerate to 50 km/h: watch the orange dots in the cables'), ()=>S.sel==='D' && kmh()>50],
    [tr('Lève le pied : les points deviennent verts, la batterie se recharge','Lift your foot: the dots turn green, the battery recharges'), ()=>S.engineOn && S.evP < -2000],
    [tr('Arrête-toi, puis remets sur P','Stop, then put it back in P'), ()=>kmh()<0.5 && S.sel==='P' && lesson.fastEv],
  ] : S.mode==='manual' ? [
    [tr('Enfonce la pédale d\'embrayage à fond','Press the clutch pedal all the way down'), ()=>S.clutch>=0.85],
    [tr('Démarre le moteur','Start the engine'), ()=>S.engineOn],
    [tr('Passe la 1re','Select 1st'), ()=>S.gear==='1'],
    [tr('Accélère un peu et relâche l\'embrayage doucement jusqu\'à ce que la voiture avance','Give a little gas and release the clutch gently until the car moves'), ()=>S.gear==='1' && kmh()>4 && engagement()>0.95 && S.engineOn],
    [tr('Passe la 2e puis la 3e : embrayage, vitesse, relâche. Regarde le compte-tours redescendre !','Shift to 2nd then 3rd: clutch, gear, release. Watch the rev counter drop!'), ()=>S.gear==='3' && engagement()>0.95 && kmh()>10 && S.engineOn],
    [tr('Freine jusqu\'à l\'arrêt sans caler (débraye juste avant)','Brake to a stop without stalling (press the clutch just before)'), ()=>{ if(kmh()>10) lesson.fast=true; return lesson.fast && kmh()<0.5 && S.engineOn; }],
  ] : [
    [tr('Appuie sur le frein','Press the brake'), ()=>S.brake>0.5],
    [tr('Démarre le moteur (le levier est sur P)','Start the engine (the lever is in P)'), ()=>S.engineOn],
    [tr('Garde le frein et passe en D','Keep the brake on and select D'), ()=>S.sel==='D'],
    [tr('Relâche le frein : la voiture avance toute seule','Release the brake: the car moves on its own'), ()=>S.sel==='D' && kmh()>2 && S.brake<0.1],
    [tr('Accélère : la boîte passe les vitesses toute seule jusqu\'en 3e','Accelerate: the gearbox shifts on its own up to 3rd'), ()=>S.sel==='D' && S.agear>=3],
    [tr('Freine jusqu\'à l\'arrêt, puis remets sur P','Brake to a stop, then put it back in P'), ()=>{ if(kmh()>10) lesson.fast=true; return lesson.fast && kmh()<0.5 && S.sel==='P'; }],
  ];
  $('steps').innerHTML = L.map(l=>`<li>${l[0]}</li>`).join('');
  lesson.items=[...document.querySelectorAll('#steps li')]; lesson.conds=L.map(l=>l[1]); lesson.done=0; lesson.fast=false; lesson.fastEv=false;
}
$('resetBtn').onclick = ()=>{ stopDemo(); Object.assign(S,{engineOn:false,cranking:0,we:0,win:0,v:0,clutch:0,gas:0,brake:0,msgT:0,gear:'N',sel:'P',agear:1,lock:false}); for(const k in anim) anim[k]=null; resetLever();
  document.querySelectorAll('#shifter .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.g==='N')); document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s==='P')); buildLesson(); };

let demo = null;
const DEMOS = {
  manual: [
    {at:0.0, say:tr('1. On enfonce l\'embrayage à fond : le moteur sera séparé des roues.','1. Press the clutch all the way down: the engine is separated from the wheels.'), run:()=>{ if(S.engineOn) S.engineOn=false; anim.gas={to:0,rate:3}; anim.brake={to:0,rate:3}; anim.clutch={to:1,rate:2.5}; followAction('clutch',2); }},
    {at:1.8, say:tr('2. On tourne la clé : le démarreur lance le moteur.','2. Turn the key: the starter cranks the engine.'), run:()=>pressStart()},
    {at:4.0, say:tr('3. Embrayage enfoncé, on passe la 1re : regarde le baladeur bleu glisser.','3. Clutch down, select 1st: watch the blue selector collar slide.'), run:()=>selectGear('1')},
    {at:6.5, say:tr('4. Un peu d\'accélérateur, et on relâche l\'embrayage doucement… la voiture avance !','4. A little gas, and release the clutch gently… the car moves!'), run:()=>{ anim.gas={to:0.3,rate:1}; anim.clutch={to:0,rate:0.35}; }},
    {at:11.5, say:tr('5. Pour passer la 2e : on lâche l\'accélérateur, on débraye…','5. To shift to 2nd: lift off the gas, press the clutch…'), run:()=>{ anim.gas={to:0,rate:3}; anim.clutch={to:1,rate:4}; }},
    {at:12.4, say:tr('…on passe la 2e…','…select 2nd…'), run:()=>selectGear('2')},
    {at:13.2, say:tr('…et on rembraye en remettant du gaz. Le compte-tours redescend : le moteur tourne moins vite pour la même vitesse.','…and release the clutch while giving gas again. The rev counter drops: the engine turns slower for the same speed.'), run:()=>{ anim.clutch={to:0,rate:0.8}; anim.gas={to:0.35,rate:1}; }},
    {at:18.0, say:tr('À toi de jouer !','Your turn!'), end:true},
  ],
  auto: [
    {at:0.0, say:tr('1. Pied sur le frein.','1. Foot on the brake.'), run:()=>{ if(S.engineOn) S.engineOn=false; anim.gas={to:0,rate:3}; anim.brake={to:1,rate:3}; if(S.sel!=='P'){ S.sel='P'; document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s==='P')); } }},
    {at:1.2, say:tr('2. On démarre, le levier est sur P.','2. Start the engine, the lever is in P.'), run:()=>pressStart()},
    {at:3.5, say:tr('3. On passe en D : les éléments K1 et B2 se serrent pour la 1re.','3. Select D: elements K1 and B2 are applied for 1st.'), run:()=>selectAuto('D')},
    {at:6.0, say:tr('4. On relâche le frein : le convertisseur pousse doucement, la voiture avance toute seule.','4. Release the brake: the converter pushes gently, the car creeps forward on its own.'), run:()=>{ anim.brake={to:0,rate:2}; }},
    {at:9.5, say:tr('5. On accélère : regarde le tableau, la boîte passe les vitesses toute seule.','5. Accelerate: watch the table, the gearbox shifts on its own.'), run:()=>{ anim.gas={to:0.45,rate:1}; }},
    {at:19.0, say:tr('6. On lâche l\'accélérateur et on freine.','6. Lift off the gas and brake.'), run:()=>{ anim.gas={to:0,rate:3}; anim.brake={to:0.5,rate:2}; }},
    {at:27.0, say:tr('À l\'arrêt, on remet sur P. À toi de jouer !','Once stopped, put it back in P. Your turn!'), run:()=>{ anim.brake={to:1,rate:2}; if(Math.abs(S.v)<0.8) selectAuto('P'); }},
    {at:28.0, end:true},
  ],
};
function startDemo(){ stopTour(); goView('car'); demo={t:0,i:0,list:DEMOS[S.mode]}; $('demoBtn').classList.add('running'); $('demoBtn').textContent=tr('■ Arrêter la démo','■ Stop the demo'); }
function stopDemo(){ if(!demo) return; demo=null; $('demoBtn').classList.remove('running'); $('demoBtn').textContent=tr('▶ Montre-moi','▶ Show me'); }
$('demoBtn').onclick = ()=>{ ensureAudio(); demo ? stopDemo() : startDemo(); };
function runDemo(dt){ if(!demo) return; demo.t += dt;
  while(demo && demo.i < demo.list.length && demo.t >= demo.list[demo.i].at){ const s=demo.list[demo.i++]; if(s.say) say(s.say,6); if(s.end){ stopDemo(); return; } s.run(); } }

/* ======================================================================
   SON
   ====================================================================== */
let AC=null, osc1, osc2, filt, gain;
function ensureAudio(){
  if(AC){ if(AC.state==='suspended') AC.resume(); return; }
  if(!$('optSound').checked) return;
  try{ AC = new (window.AudioContext||window.webkitAudioContext)();
    osc1 = AC.createOscillator(); osc1.type='sawtooth'; osc2 = AC.createOscillator(); osc2.type='square';
    filt = AC.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=500; filt.Q.value=3;
    gain = AC.createGain(); gain.gain.value=0; const g2 = AC.createGain(); g2.gain.value=0.35;
    osc1.connect(filt); osc2.connect(g2); g2.connect(filt); filt.connect(gain); gain.connect(AC.destination); osc1.start(); osc2.start();
  }catch(e){ AC=null; }
}
function updateAudio(){
  if(!AC) return;
  const on = $('optSound').checked && (S.engineOn || S.cranking>0);
  if(S.mode==='ev'){   // sifflement électrique doux, une quinte, qui monte avec le moteur ; silence à l'arrêt
    const t=AC.currentTime, rpmE=Math.abs(S.we*RPM), f = 150 + rpmE*0.075; osc1.type='triangle'; osc2.type='sine';
    osc1.frequency.setTargetAtTime(f, t, 0.05); osc2.frequency.setTargetAtTime(f*1.5, t, 0.05);
    filt.frequency.setTargetAtTime(1800, t, 0.1); filt.Q.setTargetAtTime(1, t, 0.1);
    gain.gain.setTargetAtTime($('optSound').checked && S.engineOn && Math.abs(S.v)>0.05 ? 0.028 + Math.min(0.03, Math.abs(S.evP)/2.5e6) : 0, t, 0.12); return; }
  osc1.type='sawtooth'; osc2.type='square'; filt.Q.setTargetAtTime(3, AC.currentTime, 0.1);
  const rpm = S.we*RPM, f = Math.max(12, rpm/30), t = AC.currentTime;
  osc1.frequency.setTargetAtTime(f, t, 0.02); osc2.frequency.setTargetAtTime(f*0.5, t, 0.02);
  filt.frequency.setTargetAtTime(300 + S.gas*1500 + rpm*0.14, t, 0.04);
  let g = on ? (S.cranking>0 ? 0.05 : 0.045 + S.gas*0.05) : 0;
  gain.gain.setTargetAtTime(g, t, 0.06);
}

/* ======================================================================
   ANIMATION
   ====================================================================== */
const A = {e:0, cam:0, in:0, wheel:0, diff:0, brk:0, c1:0, rc:0, s2:0, st:0, oil:0, starter:0};
const PEAK_IN = 2.55*Math.PI, PEAK_EX = 1.45*Math.PI;
const camInAng = ae => -ae/2, camExAng = ae => meshAng(camInAng(ae), 14, Math.PI, 14);
R.cams.in.lobes.forEach(L=>{ L.m.rotation.z = -Math.PI/2 - camInAng(FIRE[L.cyl]+PEAK_IN); });
R.cams.ex.lobes.forEach(L=>{ L.m.rotation.z = -Math.PI/2 - camExAng(FIRE[L.cyl]+PEAK_EX); });
const vIn = R.valves.filter(v=>v.kind==='in'), vEx = R.valves.filter(v=>v.kind==='ex');
const PSI_I_IDL = Math.atan2(RIDL.y-IY, RIDL.x-IX), PSI_IDL_O = Math.atan2(OY-RIDL.y, OX-RIDL.x);
const OIL_R = 0.086, tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();
// Braquage d'une roue avant (épure de Jeantaud / Ackermann : la roue intérieure braque plus)
function wheelSteer(w){
  const d = PARK.delta; if(!w.front || Math.abs(d) < 1e-4) return 0;
  const Rr = PARK_WB/Math.tan(Math.abs(d)), inner = (d>0) === (w.sg>0), t = WH.zF;
  return Math.sign(d)*Math.atan(PARK_WB/(inner ? Rr - t : Rr + t));
}
function animate(dt){
  const vis = (S.hand && !S.engineOn) ? 0.5 : S.slow, dv = dt*vis, e = engagement(), ratio = ratioNow(), man = S.mode==='manual';
  explode += (explodeTarget - explode)*Math.min(1, dt*4); const ex = explode;
  const wW = S.v/WH.r, ringW = outFree/FD;
  A.e += S.we*dv; A.cam += S.we*dv; A.in += S.win*dv; A.wheel += wW*dv; A.diff += ringW*dv; A.brk += (2*ringW - wW)*dv;
  if(S.cranking>0) A.starter = 1;
  // moteur
  R.crank.rotation.z = -A.e; R.fly.rotation.z = -A.e; R.crankSprocket.rotation.z = -A.e;
  EN.zc.forEach((z,i)=>{
    const g = -A.e + PH[i], s = EN.R*Math.sin(g), c = EN.R*Math.cos(g);
    const py = EN.yc + c + Math.sqrt(EN.L*EN.L - s*s);
    R.pistons[i].position.set(EN.xc, py, z);
    tmpA.set(EN.xc - s, EN.yc + c, z); tmpB.set(EN.xc, py, z);
    R.rods[i].position.copy(tmpA).add(tmpB).multiplyScalar(0.5); R.rods[i].scale.y = EN.L;
    R.rods[i].quaternion.setFromUnitVectors(UPV, tmpB.sub(tmpA).normalize());
    let f=0; if(S.engineOn){ const d=(((A.e-FIRE[i])%(4*Math.PI))+4*Math.PI)%(4*Math.PI); f = d<0.9 ? 1-d/0.9 : 0; }
    R.flames[i].material.opacity = f*0.85; R.flames[i].scale.set(0.9+f*0.1, 0.15+f*0.5, 0.9+f*0.1);
  });
  const ci = camInAng(A.cam), ce = camExAng(A.cam);
  R.cams.in.g.rotation.z = ci; R.cams.ex.g.rotation.z = ce; R.camPulley.rotation.z = ci;
  R.tens.rotation.z = -A.e*BELT.crank.r/BELT.tens.r; R.idler.rotation.z = -A.e*BELT.crank.r/BELT.idler.r;
  R.cams.in.lobes.forEach((L,j)=>{ const lam = ci + L.m.rotation.z; vIn[j].g.position.y = vIn[j].base - (lobeR(lam+Math.PI/2) - LOBE_BASE); });
  R.cams.ex.lobes.forEach((L,j)=>{ const lam = ce + L.m.rotation.z; vEx[j].g.position.y = vEx[j].base - (lobeR(lam+Math.PI/2) - LOBE_BASE); });
  R.throttlePlate.rotation.y = S.gas*1.3 + 0.1;
  R.stPin.position.z = S.cranking>0 ? 0.07 : 0.088;
  if(S.cranking>0) R.stPin.rotation.z = meshAng(-A.e, FLY_N, ST_DIR, ST_N);
  // embrayage
  const open = 1-e;
  R.clutch.disc.position.z = 0.084 + open*0.004 + ex*0.05; R.clutch.disc.rotation.z = -A.in;
  R.clutch.plate.position.z = 0.0955 + open*0.009 + ex*0.1; R.clutch.plate.rotation.z = -A.e;
  R.clutch.cover.position.z = ex*0.1; R.clutch.cover.rotation.z = -A.e;
  R.clutch.dia.position.z = 0.112 - open*0.006 + ex*0.15; R.clutch.dia.rotation.z = -A.e;
  R.clutch.bear.position.z = 0.121 - open*0.009 + ex*0.2;
  R.clutch.fork.position.z = 0.13 + ex*0.2; R.clutch.fork.rotation.y = open*0.06;
  // convertisseur
  const z0=0.12; R.tc.imp.rotation.z = -A.e; R.tc.imp.position.z = z0+0.002 + ex*0.07;
  R.tc.tur.rotation.z = -A.in; R.tc.tur.position.z = z0-0.002 - ex*0.04;
  R.tc.lu.rotation.z = -A.in; R.tc.lu.position.z = z0-0.045 + (S.lock?0.004:0) - ex*0.09;
  if(S.tcSR>0.85 || !S.engineOn) A.st += S.win*dv; R.tc.st.rotation.z = -A.st; R.tc.st.position.z = z0 + ex*0.02;
  if(!man){ const o=R.tc.oil; o.pts.material.opacity = S.engineOn ? 0.9 : 0.25; const flow = (S.we - S.win)*0.6 + S.we*0.08;
    o.seeds.forEach((sd,i)=>{ sd.a -= (S.we+S.win)/2*dv; sd.p += flow*dv; const rr = OIL_R + 0.03*Math.cos(sd.p);
      o.pos[i*3]=EN.xc+rr*Math.cos(sd.a); o.pos[i*3+1]=EN.yc+rr*Math.sin(sd.a); o.pos[i*3+2]=o.z0+0.035*Math.sin(sd.p) + ex*0.02; });
    o.pts.geometry.attributes.position.needsUpdate = true; }
  // pont
  const thD = -A.diff, thO = meshAng(thD, FD_N[1], PSI_DO, FD_N[0]);
  R.diff.rotation.z = thD;
  if(man){
    R.man.inShaft.rotation.z = -A.in;
    for(const g in MG) R.man.gOut[g].rotation.z = meshAng(-A.in, MG[g][0], PSI_IO, MG[g][1]);
    const thI = meshAng(-A.in, REV.in, PSI_I_IDL, REV.idl); R.man.idler.rotation.z = thI;
    R.man.gOut.R.rotation.z = meshAng(thI, REV.idl, PSI_IDL_O, REV.out);
    R.man.outShaft.rotation.z = thO;
    for(const k in R.man.coll){ const c=R.man.coll[k]; const tz = c.pos[S.gear] ?? c.pos.n; c.z += (tz-c.z)*Math.min(1,dt*8); c.g.position.z = c.z; c.g.rotation.z = thO; }
  } else {
    R.aut.inShaft.rotation.z = -A.in; R.aut.outShaft.rotation.z = thO;
    const nIn = S.win, n1 = nIn/A_PG, nR = outFree;
    const gk = S.sel==='R' ? 'R' : String(S.agear), els = (S.sel==='D'||S.sel==='R') ? SHIFT_EL[gk] : [];
    let nC;
    if(els.includes('B2')) nC = 0; else if(els.includes('K2')) nC = nIn;
    else if(els.includes('B1')) nC = (K3*nR)/(1+K3); else if(els.includes('K3')) nC = (n1+K3*nR)/(1+K3); else nC = nR;
    const nS2 = nC + K2*(nR - nC);
    A.c1 += n1*dv; A.rc += nC*dv; A.s2 += nS2*dv;
    const c1 = -A.c1; R.aut.pgCar.rotation.z = c1; let rel0=0;
    R.aut.pgPl.forEach((p,k)=>{ const rel = meshAng(-c1, PG1.s, p.b, PG1.p); p.m.rotation.z = rel; if(k===0) rel0=rel; });
    R.aut.pgRing.rotation.z = c1 + ringFromPlanet(rel0, PG1.p, 0, PG1.r);
    const thC = -A.rc, thRing = meshAng(thO, 31, PSI_OI, 31);
    R.aut.rvCar.rotation.z = thC; R.aut.rvRing.rotation.z = thRing;
    let l0=0; R.aut.longP.forEach((p,k)=>{ const rr = thRing - thC; const rel = p.b + (RV.r/RV.l)*(rr - (p.b - Math.PI/RV.r)); p.m.rotation.z = rel; if(k===0) l0=rel; });
    R.aut.s3.rotation.z = thC + meshAng(l0, RV.l, R.aut.longP[0].b + Math.PI, RV.s3);
    const ths2 = -A.s2; R.aut.s2.rotation.z = ths2;
    R.aut.shortP.forEach(p=>{ p.m.rotation.z = meshAng(ths2 - thC, RV.s2, p.b, RV.sp); });
    for(const k in R.aut.el){ const on = els.includes(k); R.aut.el[k].mats.forEach(m=>{ m.emissive.setHex(0x2fd06a); m.emissiveIntensity = on ? 0.55 : 0; }); }
  }
  if(S.mode==='ev'){
    const thRot = meshAng(thO, EV.n2, PSI_OI, EV.n1);
    R.ev.mid.rotation.z = thO; R.ev.rotor.rotation.z = thRot;
    const rotA = thRot, amp = S.engineOn ? clamp(Math.abs(S.evT)/EV.Tmax, 0, 1) : 0, sgnT = Math.sign(S.evT||0);
    const fieldE = rotA*EV.poles + sgnT*Math.PI/2;
    R.ev.coils.forEach(c=>{ const cur = Math.sin(fieldE - c.a*EV.poles - c.ph*TAU/3); c.mat.emissiveIntensity = amp*Math.max(0,cur)*1.6 + (amp>0?0.05:0); });
    const lit = Math.round(S.evSOC*R.ev.mods.length); R.ev.mods.forEach((m,i)=>{ m.emissiveIntensity = i<lit ? 0.25 : 0; });
    const fl = R.ev.flow, P = S.engineOn ? S.evP : 0, sp = clamp(P/60000, -1.2, 1.2);
    fl.pm.opacity = Math.abs(P) > 300 ? 0.95 : 0; fl.pm.color.setHex(P < 0 ? 0x3ee07a : 0xffb347);
    fl.u.forEach((u,i)=>{ let nu = u + sp*dt*0.5; nu = ((nu%1)+1)%1; fl.u[i]=nu; const pth = fl.paths[i%2], p = pth.getPoint(nu); fl.pos[i*3]=p.x; fl.pos[i*3+1]=p.y; fl.pos[i*3+2]=p.z; });
    fl.pts.geometry.attributes.position.needsUpdate = true;
    setGlow('ev', S.engineOn ? 0.1 + 0.5*amp : 0);
  }
  // cardans, roues, freins
  R.shafts.forEach(s=>{ s.rot.rotation.y = s.sg>0 ? -A.wheel : A.wheel; });
  R.wheels.forEach(w=>{ w.w.rotation.z = w.sg>0 ? -A.wheel : A.wheel; w.w.rotation.y = (w.sg>0 ? 0 : Math.PI) - wheelSteer(w); });
  R.discs.forEach(d=>{ d.g.rotation.z = -A.wheel; d.g.rotation.y = -wheelSteer(d); });
  R.calipers.forEach(c=>{ c.g.rotation.y = -wheelSteer(c); });
  R.cab.sw.rotation.x = PARK.delta*STEER_RATIO;      // volant : x positif = sens inverse des aiguilles d'une montre vu du conducteur = à gauche
  R.calipers.forEach(c=>{ const m=c.g.children[0].material; m.emissive.setHex(0xff2a1a); m.emissiveIntensity = S.brake*0.5; });
  // habitacle
  ['clutch','brake','gas'].forEach(k=>{ R.cab.ped[k].rotation.z = 0.35*S[k]; });
  let lx=0, lz=0;
  if(man){ updateLever(dt); R.cab.lever.rotation.x = (LEV.col-0.5)*0.14; R.cab.lever.rotation.z = -LEV.row*0.3; }
  else { lz = -({P:1.5,R:0.5,N:-0.5,D:-1.5})[S.sel]*0.14; R.cab.lever.rotation.x = 0; R.cab.lever.rotation.z += (lz - R.cab.lever.rotation.z)*Math.min(1,dt*10); }
  // feux
  const lightsOn = $('optLights').checked;
  R.lights.head.emissiveIntensity = lightsOn ? 1.3 : 0.05;
  R.lights.spots.forEach(s=>s.intensity = lightsOn ? 1.6 : 0);
  R.lights.tail.emissiveIntensity = 0.08 + (lightsOn?0.45:0) + S.brake*1.6;
  R.lights.rev.emissiveIntensity = (man ? S.gear==='R' : S.sel==='R') ? 1.3 : 0;
  R.movers.forEach(m=>{ m.position.x -= S.v*dv; if(m.position.x < -25) m.position.x += 50; if(m.position.x > 25) m.position.x -= 50; });
  // chemin de la force
  const live = S.engineOn ? 1 : S.cranking>0 ? 0.4 : (S.hand ? 0.6 : 0);
  const evDrive = S.mode==='ev' && S.engineOn && Math.abs(S.evT)>1;
  setGlow('engine', live ? 0.15 + 0.45*S.gas : 0);
  const ig = man ? live*e*(0.2+0.4*S.gas) : live*(0.2+0.4*S.gas);
  setGlow('input', ig);
  const og = S.mode==='ev' ? (evDrive ? 0.2+0.4*Math.min(1,Math.abs(S.evT)/150) : 0) : (ratio ? ig : 0);
  setGlow('output', og); setGlow('collar', man ? og : 0);
  ['pg1','rvc','s2','s3'].forEach(k=>setGlow(k, man ? 0 : og*0.8));
  if(man) for(const g in R.man.gearMat){ const m=R.man.gearMat[g]; m.emissive.copy(POWER); m.emissiveIntensity = g===S.gear ? og*1.4 : 0; }
  // cadrans
  needleT += (Math.abs(S.we)*RPM/1000 - needleT)*Math.min(1, dt*14);
  needleS += (Math.abs(S.v)*3.6 - needleS)*Math.min(1, dt*12);
  tach.needle.setAttribute('transform', `rotate(${-120+240*clamp(needleT/tachMax,0,1.02)} 60 60)`);
  speedo.needle.setAttribute('transform', `rotate(${-120+240*clamp(needleS/240,0,1.02)} 60 60)`);
  const rt=String(Math.round(Math.abs(S.we)*RPM/10)*10), rs=String(Math.round(Math.abs(S.v)*3.6));
  if(tach.read.textContent!==rt) tach.read.textContent=rt; if(speedo.read.textContent!==rs) speedo.read.textContent=rs;
}

/* ======================================================================
   BOUCLE
   ====================================================================== */
function syncTheme(){ const c=getComputedStyle(document.documentElement).getPropertyValue('--stage').trim(); try{ scene.fog.color.set(c); }catch(e){} }
syncTheme(); matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncTheme);
new MutationObserver(syncTheme).observe(document.documentElement, {attributes:true, attributeFilter:['data-theme']});
function resize(){ const w=stage.clientWidth, h=stage.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.fov = w<600?50:38; camera.updateProjectionMatrix(); }
new ResizeObserver(resize).observe(stage); resize();
buildLesson(); renderScenarios(); applyBodyMode(); refreshVis(); narrate();
let last = performance.now(), narrT = 0;
function frame(now){
  const dt = Math.min(0.1, (now-last)/1000); last = now;
  runDemo(dt); simulate(dt); parkTick(); hwyTick(dt); streetTick(dt); animate(dt);
  tourTick(dt);
  if(follow.back && !tween){ follow.t -= dt; if(follow.t<=0){ flyTo(follow.back.p, follow.back.t); follow.back=null; } }
  if(tween){ tween.t = Math.min(1, tween.t + dt/tween.dur); const k = 1-Math.pow(1-tween.t,3);
    camera.position.lerpVectors(tween.p0, tween.p1, k); controls.target.lerpVectors(tween.t0, tween.t1, k); if(tween.t>=1) tween=null; }
  if(controls.enabled) controls.update(); else camera.lookAt(controls.target);
  mirrorsPre(); renderer.render(scene, camera); mirrorsPost();
  placeTags(); drawPedals(); updateAudio();
  narrT += dt; if(narrT > 0.12){ narrT = 0; narrate(); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
