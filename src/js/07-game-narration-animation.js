
/* ======================================================================
   JEU : GARAGE
   ====================================================================== */
const FAULTS = [
  {k:'spark', modes:['manual','auto'], parts:['spark'], name:'Bougie d\'allumage morte',
   trig:()=> S.engineOn && S.runTime>4,
   sym:'Le moteur tousse et tremble, il a moins de force. Le voyant MOTEUR s\'est allumé.',
   hints:['Le problème est à l\'intérieur du moteur : enlève le « Carter moteur » dans la barre Afficher.','Regarde les petites flammes orange dans les cylindres : il en manque une. Qu\'est-ce qui fait l\'étincelle ?'],
   fix:'Le moteur tourne rond à nouveau.'},
  {k:'belt', modes:['manual','auto'], parts:['belt'], name:'Courroie de distribution cassée',
   trig:()=> S.engineOn && Math.abs(S.v)*3.6>30,
   sym:'Le moteur s\'est arrêté net en roulant et ne veut plus redémarrer : le démarreur tourne, mais le moteur ne part pas.',
   hints:['Appuie sur Démarrer et regarde la vue « Distribution » : est-ce que les arbres à cames tournent ?','Quelque chose relie le vilebrequin aux arbres à cames, et ce n\'est plus là…'],
   fix:'Les soupapes s\'ouvrent à nouveau au bon moment.'},
  {k:'battery', modes:['manual','auto'], parts:['battery'], name:'Batterie vide', atStart:true,
   sym:'Quand tu tournes la clé : juste un petit « clic ». Le voyant BATTERIE est allumé et les phares sont tout faibles.',
   hints:['Qu\'est-ce qui donne l\'électricité au démarreur et aux phares ?','Vue « Moteur » : cherche une boîte noire avec une borne rouge, au-dessus de la boîte de vitesses.'],
   fix:'La batterie est chargée.'},
  {k:'starter', modes:['manual','auto'], parts:['starter'], name:'Démarreur en panne', atStart:true,
   sym:'Quand tu tournes la clé, rien ne tourne. Pourtant les phares s\'allument bien fort : la batterie est bonne.',
   hints:['Quelle pièce fait tourner le moteur au démarrage ?','Regarde près du volant moteur, entre le moteur et la boîte (vue « Embrayage »).'],
   fix:'Le démarreur lance le moteur.'},
  {k:'clutch', modes:['manual'], parts:['disc'], name:'Disque d\'embrayage usé',
   trig:()=> S.engineOn && S.gear!=='N' && S.gear!=='1' && S.gas>0.35 && engagement()>0.95 && S.slipLast>40,
   sym:'Quand tu accélères, le moteur monte dans les tours mais la voiture n\'accélère presque pas. Ça sent le brûlé !',
   hints:['Le moteur va bien, mais sa force n\'arrive pas jusqu\'à la boîte.','Vue « Embrayage », accélère en 3e et regarde : le disque tourne moins vite que le volant moteur…'],
   fix:'L\'embrayage ne patine plus.'},
  {k:'pads', parts:['caliper'], name:'Plaquettes de frein usées',
   trig:()=> Math.abs(S.v)*3.6>25 && S.brake>0.3,
   sym:'Tu appuies sur le frein mais la voiture ralentit à peine ! Le voyant FREINS est allumé.',
   hints:['Va voir derrière une roue : vue « Roue et frein ».','Ce qui frotte sur le disque est tout usé.'],
   fix:'Les freins mordent à nouveau.'},
  {k:'cv', parts:['cv'], name:'Cardan cassé',
   trig:()=> S.engineOn && ratioNow()!==0 && engagement()>0.9 && Math.abs(S.v)*3.6>15,
   sym:'Clac ! La voiture n\'avance plus : le moteur tourne, la vitesse est passée, mais les roues ne sont plus entraînées.',
   hints:['La force arrive jusqu\'au différentiel… Regarde la vue « Dessous » en accélérant.','Un des deux arbres qui vont aux roues tourne tout seul, très vite, et son soufflet est déchiré.'],
   fix:'Les deux roues sont à nouveau entraînées.'},
  {k:'converter', modes:['auto'], parts:['tcturbine','tcimpeller','tcstator','tclockup','tcoil'], name:'Convertisseur de couple en panne',
   trig:()=> S.engineOn && S.sel==='D' && S.gas>0.15,
   sym:'En D, le moteur monte dans les tours mais la voiture ne bouge pas.',
   hints:['Le moteur va bien. Qu\'est-ce qui remplace l\'embrayage dans une boîte automatique ?','Vue « Convertisseur » : la turbine tourne-t-elle quand la pompe tourne ?'],
   fix:'La turbine est à nouveau entraînée par l\'huile.'},
  {k:'synchro', modes:['manual'], parts:['synchro'], name:'Synchro de 3e cassé', triggerOnGear3:true,
   sym:'Impossible de passer la 3e : ça craque à chaque fois, même avec l\'embrayage enfoncé.',
   hints:['Le problème est dans la boîte de vitesses (vue « Boîte »).','Qu\'est-ce qui glisse pour verrouiller un pignon sur l\'arbre ? Un des anneaux est abîmé.'],
   fix:'La 3e passe sans craquer.'},
];
FAULTS.push(
  {k:'ev12v', modes:['ev'], parts:['battery'], name:'Batterie 12 V vide', atStart:true,
   sym:'Pied sur le frein, tu appuies sur Démarrer… rien ne s\'allume, pas de READY. Le voyant BATTERIE est allumé.',
   hints:['Une voiture électrique a aussi une petite batterie 12 V, comme une voiture à essence.','Vue « Moteur » : cherche une boîte noire avec une borne rouge, à l\'avant.'],
   fix:'La voiture se réveille à nouveau.'},
  {k:'inverter', modes:['ev'], parts:['inverter'], name:'Onduleur en panne',
   trig:()=> S.engineOn && S.sel==='D' && S.gas>0.15,
   sym:'READY est allumé, tu accélères… mais la voiture ne bouge pas, et les bobines du moteur restent éteintes.',
   hints:['La batterie est chargée. Le courant arrive-t-il jusqu\'au moteur ?','Ce qui transforme le courant de la batterie pour le moteur ne marche plus (au-dessus du moteur).'],
   fix:'Le courant arrive à nouveau dans les bobines.'});
const GAME = { state:'off', f:null, t0:0, tFault:0, errors:0, hints:0, verify:null, lastHintT:0 };
function missionText(){ const f=GAME.f; if(f.k==='synchro') return 'Démarre, puis roule en passant la 1re, la 2e et la 3e.';
  if(f.k==='pads') return 'Démarre, roule jusqu\'à 50 km/h puis freine pour t\'arrêter.';
  if(S.mode==='ev') return 'Allume la voiture (pied sur le frein), passe en D et roule jusqu\'à 60 km/h.';
  if(S.mode==='auto') return 'Démarre, passe en D et roule jusqu\'à 60 km/h.';
  return 'Démarre et roule jusqu\'à 60 km/h en passant les vitesses.'; }
function gameStart(){
  stopDemo(); stopTour(); if(iso) unIsolate();
  const pool = FAULTS.filter(f=>!f.modes || f.modes.includes(S.mode));
  const f = pool[Math.floor(Math.random()*pool.length)];
  Object.assign(S,{engineOn:false, cranking:0, we:0, win:0, v:0, clutch:0, gas:0, brake:0, gear:'N', sel:'P', agear:1, lock:false}); for(const k in anim) anim[k]=null; resetLever();
  document.querySelectorAll('#shifter .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.g==='N'));
  document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s==='P'));
  Object.assign(GAME,{state:'drive', f, t0:performance.now(), errors:0, hints:0, verify:null, fastSeen:false});
  Object.assign(FAULT,{kind:f.k, active:false, cyl:1+Math.floor(Math.random()*3)});
  resetFaultVisuals(); renderGarage(); $('garageBtn').textContent='✖ Quitter le jeu';
}
function gameQuit(){ GAME.state='off'; FAULT.kind=null; FAULT.active=false; resetFaultVisuals(); refreshVis(); $('garageBox').hidden=true; $('garageBtn').textContent='🔧 Jeu : Garage'; $('infoRepair').hidden=true; }
$('garageBtn').onclick = ()=>{ GAME.state==='off' || GAME.state==='done' ? gameStart() : gameQuit(); };
function gameOnStart(){ if(GAME.state==='drive' && GAME.f.atStart) gameTrigger(); }
function gameTrigger(){
  if(GAME.state!=='drive' || FAULT.active) return;
  FAULT.active = true; GAME.state='fault'; GAME.tFault=performance.now(); GAME.lastHintT=performance.now();
  applyFaultVisuals(); refreshVis(); renderGarage();
  if(FAULT.kind==='cv'||FAULT.kind==='belt') say(FAULT.kind==='cv'?'CLAC !':'Le moteur s\'est arrêté net !',3);
}
function gameRepair(key){
  if(GAME.state!=='fault') return;
  if(GAME.f.parts.includes(key)){
    FAULT.active=false; resetFaultVisuals(); refreshVis();
    GAME.state='verify'; renderGarage(); say('Réparé ! '+GAME.f.fix+' Vérifie maintenant que tout marche.',5);
    $('infoRepair').hidden=true; $('info').hidden=true;
  } else { GAME.errors++; say(`${INFO[key]?INFO[key].t:'Cette pièce'} : en bon état. Ce n\'est pas elle ! (+1 erreur)`,4); renderGarage(); }
}
$('infoRepair').onclick = ()=>{ if(infoKey) gameRepair(infoKey); };
const gameGoal = ()=>{ const f=GAME.f, kmh=Math.abs(S.v)*3.6;
  if(f.k==='battery'||f.k==='starter'||f.k==='ev12v') return S.engineOn;
  if(f.k==='synchro') return S.gear==='3' && engagement()>0.9 && kmh>15;
  if(f.k==='pads') return GAME.fastSeen && kmh<1 || (kmh>30 && (GAME.fastSeen=true) && false);
  return S.engineOn && kmh>50; };
function gameTick(){
  if(GAME.state==='drive' && GAME.f.trig && GAME.f.trig()) gameTrigger();
  if(GAME.state==='verify'){
    if(GAME.f.k==='pads' && Math.abs(S.v)*3.6>30) GAME.fastSeen=true;
    if(gameGoal()){ GAME.state='done'; renderGarage(); }
  }
  if(GAME.state==='fault' && GAME.hints < GAME.f.hints.length && performance.now()-GAME.lastHintT > 25000 && !$('hintBtn')?.classList.contains('nudge')) $('hintBtn')?.classList.add('nudge');
  if(GAME.state==='drive' || GAME.state==='fault' || GAME.state==='verify'){ const el=$('gTime'); if(el) el.textContent = fmtT((performance.now()-GAME.t0)/1000); }
}
const fmtT = s => `${Math.floor(s/60)} min ${String(Math.floor(s%60)).padStart(2,'0')} s`;
function renderGarage(){
  const box=$('garageBox'); box.hidden=false; const f=GAME.f;
  const score = `<div class="score"><span>⏱ <span id="gTime">${fmtT((performance.now()-GAME.t0)/1000)}</span></span><span>❌ ${GAME.errors} erreur${GAME.errors>1?'s':''}</span><span>💡 ${GAME.hints} indice${GAME.hints>1?'s':''}</span></div>`;
  if(GAME.state==='drive') box.innerHTML = `<h3>🔧 Mission</h3><p>${missionText()}</p><p class="note">Une panne va arriver… À toi de trouver la pièce en cause.</p>${score}`;
  else if(GAME.state==='fault'){
    const hs = f.hints.slice(0,GAME.hints).map(h=>`<p>💡 ${h}</p>`).join('');
    box.innerHTML = `<h3>⚠️ Panne !</h3><p><b>${f.sym}</b></p><p>Inspecte la voiture : touche la pièce que tu soupçonnes, puis appuie sur « Réparer cette pièce ».</p>${hs}
      <div class="row">${GAME.hints<f.hints.length?'<button class="btn alt" id="hintBtn">💡 Indice</button>':''}</div>${score}`;
    const hb=$('hintBtn'); if(hb) hb.onclick=()=>{ GAME.hints++; GAME.lastHintT=performance.now(); renderGarage(); };
  }
  else if(GAME.state==='verify') box.innerHTML = `<h3>✅ Réparé : ${f.name}</h3><p>Vérifie que tout marche : ${missionText().toLowerCase()}</p>${score}`;
  else if(GAME.state==='done'){
    const tt = (performance.now()-GAME.t0)/1000; const stars = GAME.errors===0 && GAME.hints===0 ? 3 : GAME.errors+GAME.hints<=2 ? 2 : 1;
    box.innerHTML = `<h3>🏁 Voiture réparée !</h3><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>La panne : <b>${f.name}</b>.</p>
      <div class="score"><span>⏱ ${fmtT(tt)}</span><span>❌ ${GAME.errors} erreur${GAME.errors>1?'s':''}</span><span>💡 ${GAME.hints} indice${GAME.hints>1?'s':''}</span></div>
      <div class="row"><button class="btn warn" id="againBtn">Nouvelle panne</button></div>`;
    $('againBtn').onclick = gameStart; $('garageBtn').textContent='🔧 Jeu : Garage';
  }
}
const FV = {};   // visuels de panne
function applyFaultVisuals(){
  const k = FAULT.kind;
  if(k==='spark'){ const tip=R.plugs[FAULT.cyl].children[0]; FV.tip=[tip, tip.material]; tip.material = metal(0x111111,{roughness:1}); }
  if(k==='clutch'){ const m=R.clutch.disc.children[0].material; FV.disc=[m, m.color.getHex()]; m.color.setHex(0x3a2412); }
  if(k==='pads'){ FV.pads = []; R.calipers.forEach(c=>c.pads.forEach(p=>{ FV.pads.push(p); p.scale.z=0.3; })); }
  if(k==='cv'){ const b=R.shafts[0].boot; FV.boot=[b, b.material]; b.material = plastic(0x8c1f1a); b.scale.set(1,0.5,1); }
  if(k==='synchro'){ const c=R.man.coll['34'].g; FV.coll=[]; c.traverse(o=>{ if(o.isMesh){ FV.coll.push([o,o.material]); o.material = metal(0x8c3a2a,{roughness:0.8}); } }); }
}
function resetFaultVisuals(){
  if(FV.tip){ FV.tip[0].material=FV.tip[1]; FV.tip=null; }
  if(FV.disc){ FV.disc[0].color.setHex(FV.disc[1]); FV.disc=null; }
  if(FV.pads){ FV.pads.forEach(p=>p.scale.z=1); FV.pads=null; }
  if(FV.boot){ FV.boot[0].material=FV.boot[1]; FV.boot[0].scale.set(1,1,1); FV.boot=null; }
  if(FV.coll){ FV.coll.forEach(([o,m])=>o.material=m); FV.coll=null; }
}

/* ======================================================================
   EXPLICATIONS, LEÇON, DÉMO
   ====================================================================== */
const ORD = g => g==='R' ? 'marche arrière' : g+(g==='1'||g===1?'re':'e');
function narrate(){
  const e = engagement(), rpm = S.we*RPM, kmh = Math.abs(S.v)*3.6, ratio = ratioNow();
  const man = S.mode==='manual';
  const slipping = man && ((e>0 && e<1 && S.slipLast > 6) || (e>0 && S.slipLast > 12));
  const live = S.engineOn || S.cranking>0 || S.hand;
  const driven = live && ratio && e>0 && !cvBroken();
  const ev = S.mode==='ev';
  if(ev){ const regen = S.engineOn && S.evP < -500, push = S.engineOn && S.evP > 500;
    setChip('chE','Voiture', S.engineOn ? 'READY' : 'Éteinte', S.engineOn?'good':'');
    setChip('chC','Moteur électrique', regen ? 'Recharge' : push ? 'Pousse' : 'Au repos', regen?'good':push?'on':'');
    setChip('chW','Roues', S.engineOn && ratio && !cvBroken() ? 'Entraînées' : 'Libres', S.engineOn && ratio?'on':''); }
  else {
  setChip('chE','Moteur', S.cranking>0 ? 'Démarre…' : S.engineOn ? 'Tourne' : S.hand ? 'Tourné à la main' : 'Arrêté', live?'on':'');
  if(man){ const cs = e===0 ? 'Débrayé' : slipping ? 'Patine' : 'Embrayé'; setChip('chC','Embrayage', cs, cs==='Patine'?'slip':cs==='Embrayé'?'good':''); }
  else { const cs = S.lock ? 'Ponté' : (S.engineOn ? (S.tcSR<0.85 && (S.sel==='D'||S.sel==='R') ? 'Glisse' : 'Entraîne') : 'Arrêté'); setChip('chC','Convertisseur', cs, cs==='Glisse'?'slip':cs==='Arrêté'?'':'good'); }
  setChip('chW','Roues', driven ? (ratio<0?'Entraînées en arrière':'Entraînées') : 'Libres', driven?'on':'');
  }

  let t;
  if(ev){
    const kw = Math.round(S.evP/1000);
    if(!S.engineOn) t = kmh>1 ? 'La voiture est éteinte et roule encore : freine.' : 'La voiture est éteinte. Pied sur le frein, appuie sur Démarrer : READY s\'allume, sans aucun bruit de moteur.';
    else if(S.sel==='P') t = 'READY : tout est prêt, mais rien ne tourne. Le moteur électrique ne tourne que quand on roule : pas de ralenti ! Garde le frein et passe en D.';
    else if(S.sel==='N') t = 'N : le moteur ne reçoit pas de courant. La voiture roule librement.';
    else if(S.evP > 500) t = `L'onduleur envoie ${kw} kW de la batterie vers le moteur. Les bobines s'allument chacune leur tour et entraînent les aimants du rotor. Un seul rapport : le moteur fait ${fr(EV_TOTAL)} tours pour 1 tour de roue.`;
    else if(S.evP < -500) t = `Tu as levé le pied${S.brake>0.1?' et tu freines':''} : le moteur devient une dynamo. Il ralentit la voiture et renvoie ${-kw} kW dans la batterie (points verts).`;
    else if(kmh<2 && S.brake>0.1) t = 'En D, frein appuyé : la voiture attend. Lâche le frein, elle avance doucement toute seule.';
    else t = 'En D. Appuie sur l\'accélérateur : la force arrive tout de suite, même à l\'arrêt.';
  }
  else if(S.hand && !S.engineOn){
    t = 'Tu fais tourner le moteur à la main. Les pistons montent et descendent, les soupapes s\'ouvrent. ';
    if(man){ if(e===0) t += 'L\'embrayage est enfoncé : la boîte ne bouge pas.'; else if(!ratio) t += 'L\'embrayage est serré : l\'arbre primaire tourne et fait tourner tous les pignons, mais au point mort aucun n\'est verrouillé : les roues ne bougent pas.';
      else t += `L'embrayage est serré et la ${ORD(S.gear)} est verrouillée par un baladeur bleu : regarde les roues avancer tout doucement !`; }
    else t += S.sel==='P' ? 'Sur P, la sortie de la boîte est bloquée.' : 'L\'huile du convertisseur commence à entraîner la turbine.';
  }
  else if(S.cranking>0) t = 'Le démarreur fait tourner le volant moteur. Les pistons bougent, les bougies font des étincelles… et le moteur part tout seul.';
  else if(!S.engineOn){
    if(kmh>1) t = 'Le moteur est arrêté et la voiture roule encore. Utilise le frein.';
    else if(man) t = (S.clutch>=0.6 || S.gear==='N') ? 'Le moteur est arrêté. Appuie sur Démarrer. Astuce : passe une vitesse et maintiens « Tourner le moteur à la main » pour voir ce qui est relié.' : 'Le moteur est arrêté. Avant de démarrer, enfonce l\'embrayage à fond pour séparer le moteur des roues.';
    else t = (S.sel==='P'||S.sel==='N') ? 'Le moteur est arrêté, le levier est sur '+S.sel+'. Appuie sur Démarrer.' : 'Pour démarrer, mets le levier sur P.';
  }
  else if(man){
    if(e===0){ t = 'Pédale enfoncée : le diaphragme a libéré le disque d\'embrayage, le moteur tourne tout seul et rien n\'arrive à la boîte. C\'est le moment de changer de vitesse.'; if(S.gear==='N' && kmh<1) t+=' Passe la 1re.'; }
    else if(!ratio) t = `Ralenti à ${Math.round(rpm/10)*10} tr/min. L'embrayage est serré : l'arbre primaire et tous les pignons tournent. Mais au point mort, aucun baladeur ne verrouille de pignon : les roues ne reçoivent rien.`;
    else if(slipping) t = 'L\'embrayage patine : le disque frotte contre le volant moteur et transmet la force petit à petit. Continue à relâcher doucement en accélérant un peu.';
    else { t = `Tout est relié ! En ${ORD(S.gear)}, le moteur fait ${fr(Math.abs(ratio*FD))} tours pour 1 tour de roue.`;
      if(ratio>0 && rpm>3300 && S.gear!=='6') t += ' Le moteur tourne vite : passe la vitesse supérieure.';
      else if(ratio>0 && rpm<1300 && S.gear!=='1') t += ' Le moteur peine : rétrograde.';
      if(S.brake>0.2 && kmh<15) t += ' Débraye avant de t\'arrêter, sinon le moteur va caler.'; }
  } else {
    if(S.sel==='P') t = 'P : un cliquet bloque la sortie de la boîte, la voiture ne peut pas rouler. Garde le frein et passe en D.';
    else if(S.sel==='N') t = 'N : aucun embrayage ni frein de la boîte n\'est serré. La turbine tourne mais rien n\'arrive aux roues.';
    else { const gk = S.sel==='R' ? 'R' : String(S.agear);
      t = `${S.sel==='R'?'Marche arrière':'D, '+ORD(S.agear)} : ${SHIFT_EL[gk].join(' et ')} sont serrés. Le moteur fait ${fr(Math.abs(RATIO_A[gk]*FD))} tours pour 1 tour de roue.`;
      if(kmh<3 && S.brake>0.2) t += ' Le frein retient la voiture, mais le convertisseur glisse : le moteur ne cale pas.';
      else if(kmh<8 && S.gas<0.05) t += ' Sans accélérer, l\'huile du convertisseur pousse doucement : la voiture avance toute seule.';
      else if(S.lock) t += ' L\'embrayage de pontage est collé : plus de glissement.';
      else t += ' La boîte changera de vitesse toute seule.'; }
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
  $('startBtn').classList.toggle('nudge', !demo && startReady && GAME.state==='off');

  const gb=$('gearBig'); const gtxt = man ? S.gear : (S.sel==='D' && !ev ? 'D'+S.agear : S.sel);
  if(gb.firstChild.nodeValue!==gtxt) gb.firstChild.nodeValue=gtxt; gb.style.borderColor = driven ? 'var(--power)' : '';
  const sb=$('startBtn'); sb.classList.toggle('running', S.engineOn); sb.firstChild.firstChild.nodeValue = S.engineOn ? (ev?'ÉTEINDRE':'COUPER') : S.cranking>0 ? '…' : (ev?'ALLUMER':'DÉMARRER');
  document.querySelectorAll('#elems tr[data-g]').forEach(tr=>tr.classList.toggle('cur', !man && ((S.sel==='D' && tr.dataset.g===String(S.agear)) || (S.sel==='R' && tr.dataset.g==='R'))));
  $('wlBat').classList.toggle('lit', FAULT.active && (FAULT.kind==='battery'||FAULT.kind==='ev12v'));
  $('wlReady').classList.toggle('lit', ev && S.engineOn); $('wlReady').classList.add('green');
  if(ev){ $('socBar').style.width = Math.round(S.evSOC*100)+'%'; setText('socTxt', Math.round(S.evSOC*100)+' %'); const kw=Math.round(S.evP/1000); setText('pwrTxt', (kw>0?'+':'')+kw+' kW'); $('pwrTxt').style.color = kw<0 ? 'var(--ok)' : kw>0 ? 'var(--power)' : ''; }
  $('wlEng').classList.toggle('lit', FAULT.active && (FAULT.kind==='spark'||FAULT.kind==='belt'||FAULT.kind==='inverter')); $('wlEng').classList.add('amber');
  $('wlBrk').classList.toggle('lit', FAULT.active && FAULT.kind==='pads');
}
function setChip(id, name, val, cls){ const el=$(id); const html=`${name} <b>${val}</b>`; if(el._h!==html){ el.innerHTML=html; el._h=html; } el.className='chip '+cls; }
function setText(id, t){ const el=$(id); if(el.textContent!==t) el.textContent=t; }

const lesson = {done:0, fast:false, items:[], conds:[]};
function buildLesson(){
  const kmh = ()=>Math.abs(S.v)*3.6;
  const L = S.mode==='ev' ? [
    ['Appuie sur le frein', ()=>S.brake>0.5],
    ['Allume la voiture : READY s\'allume, sans bruit', ()=>S.engineOn],
    ['Garde le frein et passe en D', ()=>S.sel==='D'],
    ['Accélère jusqu\'à 50 km/h : regarde les points orange dans les câbles', ()=>S.sel==='D' && kmh()>50],
    ['Lève le pied : les points deviennent verts, la batterie se recharge', ()=>S.engineOn && S.evP < -2000],
    ['Arrête-toi, puis remets sur P', ()=>kmh()<0.5 && S.sel==='P' && lesson.fastEv],
  ] : S.mode==='manual' ? [
    ['Enfonce la pédale d\'embrayage à fond', ()=>S.clutch>=0.85],
    ['Démarre le moteur', ()=>S.engineOn],
    ['Passe la 1re', ()=>S.gear==='1'],
    ['Accélère un peu et relâche l\'embrayage doucement jusqu\'à ce que la voiture avance', ()=>S.gear==='1' && kmh()>4 && engagement()>0.95 && S.engineOn],
    ['Passe la 2e puis la 3e : embrayage, vitesse, relâche. Regarde le compte-tours redescendre !', ()=>S.gear==='3' && engagement()>0.95 && kmh()>10 && S.engineOn],
    ['Freine jusqu\'à l\'arrêt sans caler (débraye juste avant)', ()=>{ if(kmh()>10) lesson.fast=true; return lesson.fast && kmh()<0.5 && S.engineOn; }],
  ] : [
    ['Appuie sur le frein', ()=>S.brake>0.5],
    ['Démarre le moteur (le levier est sur P)', ()=>S.engineOn],
    ['Garde le frein et passe en D', ()=>S.sel==='D'],
    ['Relâche le frein : la voiture avance toute seule', ()=>S.sel==='D' && kmh()>2 && S.brake<0.1],
    ['Accélère : la boîte passe les vitesses toute seule jusqu\'en 3e', ()=>S.sel==='D' && S.agear>=3],
    ['Freine jusqu\'à l\'arrêt, puis remets sur P', ()=>{ if(kmh()>10) lesson.fast=true; return lesson.fast && kmh()<0.5 && S.sel==='P'; }],
  ];
  $('steps').innerHTML = L.map(l=>`<li>${l[0]}</li>`).join('');
  lesson.items=[...document.querySelectorAll('#steps li')]; lesson.conds=L.map(l=>l[1]); lesson.done=0; lesson.fast=false; lesson.fastEv=false;
}
$('resetBtn').onclick = ()=>{ stopDemo(); Object.assign(S,{engineOn:false,cranking:0,we:0,win:0,v:0,clutch:0,gas:0,brake:0,msgT:0,gear:'N',sel:'P',agear:1,lock:false}); for(const k in anim) anim[k]=null; resetLever();
  document.querySelectorAll('#shifter .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.g==='N')); document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s==='P')); buildLesson(); };

let demo = null;
const DEMOS = {
  manual: [
    {at:0.0, say:'1. On enfonce l\'embrayage à fond : le moteur sera séparé des roues.', run:()=>{ if(S.engineOn) S.engineOn=false; anim.gas={to:0,rate:3}; anim.brake={to:0,rate:3}; anim.clutch={to:1,rate:2.5}; followAction('clutch',2); }},
    {at:1.8, say:'2. On tourne la clé : le démarreur lance le moteur.', run:()=>pressStart()},
    {at:4.0, say:'3. Embrayage enfoncé, on passe la 1re : regarde le baladeur bleu glisser.', run:()=>selectGear('1')},
    {at:6.5, say:'4. Un peu d\'accélérateur, et on relâche l\'embrayage doucement… la voiture avance !', run:()=>{ anim.gas={to:0.3,rate:1}; anim.clutch={to:0,rate:0.35}; }},
    {at:11.5, say:'5. Pour passer la 2e : on lâche l\'accélérateur, on débraye…', run:()=>{ anim.gas={to:0,rate:3}; anim.clutch={to:1,rate:4}; }},
    {at:12.4, say:'…on passe la 2e…', run:()=>selectGear('2')},
    {at:13.2, say:'…et on rembraye en remettant du gaz. Le compte-tours redescend : le moteur tourne moins vite pour la même vitesse.', run:()=>{ anim.clutch={to:0,rate:0.8}; anim.gas={to:0.35,rate:1}; }},
    {at:18.0, say:'À toi de jouer !', end:true},
  ],
  auto: [
    {at:0.0, say:'1. Pied sur le frein.', run:()=>{ if(S.engineOn) S.engineOn=false; anim.gas={to:0,rate:3}; anim.brake={to:1,rate:3}; if(S.sel!=='P'){ S.sel='P'; document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s==='P')); } }},
    {at:1.2, say:'2. On démarre, le levier est sur P.', run:()=>pressStart()},
    {at:3.5, say:'3. On passe en D : les éléments K1 et B2 se serrent pour la 1re.', run:()=>selectAuto('D')},
    {at:6.0, say:'4. On relâche le frein : le convertisseur pousse doucement, la voiture avance toute seule.', run:()=>{ anim.brake={to:0,rate:2}; }},
    {at:9.5, say:'5. On accélère : regarde le tableau, la boîte passe les vitesses toute seule.', run:()=>{ anim.gas={to:0.45,rate:1}; }},
    {at:19.0, say:'6. On lâche l\'accélérateur et on freine.', run:()=>{ anim.gas={to:0,rate:3}; anim.brake={to:0.5,rate:2}; }},
    {at:27.0, say:'À l\'arrêt, on remet sur P. À toi de jouer !', run:()=>{ anim.brake={to:1,rate:2}; if(Math.abs(S.v)<0.8) selectAuto('P'); }},
    {at:28.0, end:true},
  ],
};
function startDemo(){ stopTour(); goView('car'); demo={t:0,i:0,list:DEMOS[S.mode]}; $('demoBtn').classList.add('running'); $('demoBtn').textContent='■ Arrêter la démo'; }
function stopDemo(){ if(!demo) return; demo=null; $('demoBtn').classList.remove('running'); $('demoBtn').textContent='▶ Montre-moi'; }
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
  if(S.mode==='ev'){ const t=AC.currentTime, rpmE=Math.abs(S.we*RPM); osc1.type='sine'; osc1.frequency.setTargetAtTime(120+rpmE*0.11, t, 0.05); osc2.frequency.setTargetAtTime(60+rpmE*0.055, t, 0.05);
    filt.frequency.setTargetAtTime(2500, t, 0.1); gain.gain.setTargetAtTime($('optSound').checked && S.engineOn && rpmE>50 ? 0.01 + Math.min(0.025, Math.abs(S.evP)/4e6) : 0, t, 0.1); return; }
  osc1.type='sawtooth';
  const rpm = S.we*RPM, f = Math.max(12, rpm/30), t = AC.currentTime;
  osc1.frequency.setTargetAtTime(f, t, 0.02); osc2.frequency.setTargetAtTime(f*0.5, t, 0.02);
  filt.frequency.setTargetAtTime(300 + S.gas*1500 + rpm*0.14, t, 0.04);
  let g = on ? (S.cranking>0 ? 0.05 : 0.045 + S.gas*0.05) : 0;
  if(on && misfire()) g *= (Math.sin(t*rpm/120*TAU) > 0.3 ? 0.25 : 1);
  gain.gain.setTargetAtTime(g, t, misfire()?0.01:0.06);
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
function animate(dt){
  const vis = (S.hand && !S.engineOn) ? 0.5 : S.slow, dv = dt*vis, e = engagement(), ratio = ratioNow(), man = S.mode==='manual';
  explode += (explodeTarget - explode)*Math.min(1, dt*4); const ex = explode;
  const wW = S.v/WH.r, ringW = outFree/FD;
  A.e += S.we*dv; if(!beltBroken()) A.cam += S.we*dv; A.in += S.win*dv; A.wheel += wW*dv; A.diff += ringW*dv; A.brk += (2*ringW - wW)*dv;
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
    let f=0; if(S.engineOn && !beltBroken() && !(misfire() && i===FAULT.cyl)){ const d=(((A.e-FIRE[i])%(4*Math.PI))+4*Math.PI)%(4*Math.PI); f = d<0.9 ? 1-d/0.9 : 0; }
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
    const gk = S.sel==='R' ? 'R' : String(S.agear), els = (S.sel==='D'||S.sel==='R') && !cvBroken() ? SHIFT_EL[gk] : [];
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
    R.ev.mid.rotation.z = thO; R.ev.rotor.rotation.z = cvBroken() ? -A.in : thRot;
    const rotA = cvBroken() ? -A.in : thRot, amp = S.engineOn ? clamp(Math.abs(S.evT)/EV.Tmax, 0, 1) : 0, sgnT = Math.sign(S.evT||0);
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
  R.shafts.forEach(s=>{ s.rot.rotation.y = s.sg>0 ? -(cvBroken() ? A.brk : A.wheel) : A.wheel; });
  R.wheels.forEach(w=>{ w.w.rotation.z = w.sg>0 ? -A.wheel : A.wheel; });
  R.discs.forEach(d=>{ d.g.rotation.z = -A.wheel; });
  R.calipers.forEach(c=>{ const m=c.g.children[0].material; m.emissive.setHex(0xff2a1a); m.emissiveIntensity = S.brake*0.5; });
  // habitacle
  ['clutch','brake','gas'].forEach(k=>{ R.cab.ped[k].rotation.z = 0.35*S[k]; });
  let lx=0, lz=0;
  if(man){ updateLever(dt); R.cab.lever.rotation.x = (LEV.col-0.5)*0.14; R.cab.lever.rotation.z = -LEV.row*0.3; }
  else { lz = -({P:1.5,R:0.5,N:-0.5,D:-1.5})[S.sel]*0.14; R.cab.lever.rotation.x = 0; R.cab.lever.rotation.z += (lz - R.cab.lever.rotation.z)*Math.min(1,dt*10); }
  // feux
  const lightsOn = $('optLights').checked, weak = FAULT.active && FAULT.kind==='battery';
  R.lights.head.emissiveIntensity = lightsOn ? (weak?0.15:1.3) : 0.05;
  R.lights.spots.forEach(s=>s.intensity = lightsOn ? (weak?0.25:1.6) : 0);
  R.lights.tail.emissiveIntensity = 0.08 + (lightsOn?0.45:0) + S.brake*1.6;
  R.lights.rev.emissiveIntensity = (man ? S.gear==='R' : S.sel==='R') ? 1.3 : 0;
  R.movers.forEach(m=>{ m.position.x -= S.v*dv; if(m.position.x < -25) m.position.x += 50; if(m.position.x > 25) m.position.x -= 50; });
  // chemin de la force
  const live = S.engineOn ? 1 : S.cranking>0 ? 0.4 : (S.hand ? 0.6 : 0);
  const evDrive = S.mode==='ev' && S.engineOn && Math.abs(S.evT)>1;
  setGlow('engine', live ? 0.15 + 0.45*S.gas : 0);
  const ig = man ? live*e*(0.2+0.4*S.gas) : live*(0.2+0.4*S.gas);
  setGlow('input', ig);
  const og = S.mode==='ev' ? (evDrive ? 0.2+0.4*Math.min(1,Math.abs(S.evT)/150) : 0) : (ratio && !cvBroken() ? ig : 0);
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
  runDemo(dt); simulate(dt); gameTick(); animate(dt);
  tourTick(dt);
  if(follow.back && !tween){ follow.t -= dt; if(follow.t<=0){ flyTo(follow.back.p, follow.back.t); follow.back=null; } }
  if(tween){ tween.t = Math.min(1, tween.t + dt/tween.dur); const k = 1-Math.pow(1-tween.t,3);
    camera.position.lerpVectors(tween.p0, tween.p1, k); controls.target.lerpVectors(tween.t0, tween.t1, k); if(tween.t>=1) tween=null; }
  if(controls.enabled) controls.update(); else camera.lookAt(controls.target); renderer.render(scene, camera);
  placeTags(); drawPedals(); updateAudio();
  narrT += dt; if(narrT > 0.12){ narrT = 0; narrate(); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();
