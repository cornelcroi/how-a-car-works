
/* ======================================================================
   GÉOMÉTRIE DE LA VOITURE  (x vers l'avant, y vers le haut, z vers la gauche ; mètres)
   ====================================================================== */
const WH = { r:0.316, xF:1.25, xR:-1.328, zF:0.7695, zR:0.764 };          // 205/55 R16, empattement 2,578 m, voies 1,539 / 1,528
const EN = { xc:1.38, yc:0.40, R:0.0464, L:0.144, bore:0.04125, zc:[-0.264,-0.176,-0.088,0.0] }; // course 92,8 mm, alésage 82,5 mm, entraxe 88 mm
const PH = [0, Math.PI, Math.PI, 0];                 // calage des manetons (4 cylindres en ligne)
const FIRE = [0, 3*Math.PI, Math.PI, 2*Math.PI];     // ordre d'allumage 1-3-4-2 (angle sur un cycle de 720°)
const DECK = 0.623, CAMY = 0.70, VX = 0.022;
const R = {};                                        // pièces animées

/* ---------------- Bloc, culasse, carters ---------------- */
(function engineCasing(){
  const C='casing';
  const blkGeo = new THREE.BoxGeometry(0.17, DECK-0.30, 0.37);
  const blk = at(new THREE.Mesh(blkGeo, glass(0x6f8fa8,0.12)), EN.xc, (DECK+0.30)/2, -0.132);
  put(blk,'block',C); put(at(edges(blkGeo,0x6f8fa8,0.5), blk.position.x, blk.position.y, blk.position.z),'block',C);
  const hdGeo = new THREE.BoxGeometry(0.17, 0.105, 0.37);
  const hd = at(new THREE.Mesh(hdGeo, glass(0x8a9aa6,0.16)), EN.xc, DECK+0.0525, -0.132);
  put(hd,'head',C); put(at(edges(hdGeo,0x7f8f9c,0.55), hd.position.x, hd.position.y, hd.position.z),'head',C);
  const vcGeo = new THREE.BoxGeometry(0.15, 0.045, 0.36);
  const vc = at(new THREE.Mesh(vcGeo, glass(0x30363b,0.35)), EN.xc, DECK+0.105+0.0225, -0.132);
  put(vc,'valvecover',C);
  const pan = at(new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.09, 0.33), glass(0x55606a,0.18)), EN.xc+0.005, 0.255, -0.132); put(pan,'sump',C);
  // couvercle de distribution (plastique) côté courroie
  const tc = at(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.42, 0.012), glass(0x22272b,0.22)), EN.xc+0.02, 0.56, -0.352); put(tc,'timingcover',C);
  // admission (devant) : répartiteur + 4 conduits + boîtier papillon
  const plen = at(cylZ(0.04, 0.4, plastic(0x2a2f33,{transparent:true,opacity:0.55})), EN.xc+0.2, 0.55, -0.13); put(plen,'intake',C);
  EN.zc.forEach(z=>{
    const pts=[new THREE.Vector3(EN.xc+0.085,0.665,z), new THREE.Vector3(EN.xc+0.15,0.68,z), new THREE.Vector3(EN.xc+0.21,0.62,z), new THREE.Vector3(EN.xc+0.2,0.56,z)];
    put(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,0.017,10,false), plastic(0x2a2f33,{transparent:true,opacity:0.55})),'intake',C);
  });
  const tb = at(cylZ(0.033, 0.06, M.alu), EN.xc+0.2, 0.55, 0.1); put(tb,'throttle',C);
  R.throttlePlate = at(cylZ(0.03, 0.003, M.dark), EN.xc+0.2, 0.55, 0.1); put(R.throttlePlate,'throttle',C);
  // échappement (derrière) : collecteur 4 en 1 puis catalyseur
  const exM = metal(0x8a6a55,{metalness:0.6,roughness:0.5});
  EN.zc.forEach(z=>{
    const pts=[new THREE.Vector3(EN.xc-0.085,0.66,z), new THREE.Vector3(EN.xc-0.14,0.64,z), new THREE.Vector3(EN.xc-0.17,0.55,lerp(z,-0.13,0.6)), new THREE.Vector3(EN.xc-0.17,0.49,-0.13)];
    put(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),16,0.018,10,false), exM),'exhaustmani',C);
  });
  put(at(cylY(0.055,0.16,metal(0xa0a6aa)),EN.xc-0.17,0.4,-0.13),'catalyst',C);
})();

/* ---------------- Vilebrequin, bielles, pistons ---------------- */
R.crank = new THREE.Group(); at(R.crank, EN.xc, EN.yc, 0); put(R.crank,'crank','internals');
(function crank(){
  const mt = gm('engine', M.steel);
  const main = cylZ(0.026, 0.40, mt); main.position.z = -0.135; R.crank.add(main);
  const flange = cylZ(0.045, 0.012, mt); flange.position.z = 0.055; R.crank.add(flange);
  EN.zc.forEach((z,i)=>{
    const t = new THREE.Group(); t.position.z = z; t.rotation.z = PH[i]; R.crank.add(t);
    const pin = cylZ(0.024, 0.026, mt); pin.position.y = EN.R; t.add(pin);
    [-0.019,0.019].forEach(dz=>{
      const web = box(0.07, 0.085, 0.012, mt); web.position.set(0, EN.R/2-0.005, dz); t.add(web);
      const cw = new THREE.Mesh(new THREE.CylinderGeometry(0.065,0.065,0.012,24,1,false,Math.PI*0.5+0.6,Math.PI-1.2), mt);
      cw.geometry.rotateX(Math.PI/2); cw.position.z = dz; t.add(cw);
    });
  });
  reg(R.crank,'crank','internals');
})();
R.pistons=[]; R.rods=[]; R.flames=[];
const pistonMat = gm('engine', metal(0xd5dade,{metalness:0.7,roughness:0.28}));
const rodMat = gm('engine', metal(0x8a939b));
EN.zc.forEach((z,i)=>{
  const bore = at(new THREE.Mesh(new THREE.CylinderGeometry(EN.bore+0.002,EN.bore+0.002,0.2,32,1,true), glass(0x9fb6c8,0.14)), EN.xc, DECK-0.1, z);
  put(bore,'pistons','internals');
  const p = new THREE.Group();
  const crown = cylY(EN.bore-0.0005, 0.052, pistonMat, 32); crown.position.y = 0.012; p.add(crown);
  [0.026,0.032,0.019].forEach(dy=>{ const rg=new THREE.Mesh(new THREE.TorusGeometry(EN.bore-0.0003,0.0016,6,32), metal(0x555c62)); rg.rotation.x=Math.PI/2; rg.position.y=dy; p.add(rg); });
  const gp = cylZ(0.011, 0.06, M.steel); p.add(gp);
  put(p,'pistons','internals'); R.pistons.push(p);
  const rd = new THREE.Group();
  const shank = box(0.018, 1, 0.014, rodMat); rd.add(shank);
  put(rd,'rods','internals'); R.rods.push(rd);
  const fl = new THREE.Mesh(new THREE.SphereGeometry(EN.bore*0.95, 20, 12), new THREE.MeshBasicMaterial({color:0xffa22b, transparent:true, opacity:0, depthWrite:false}));
  fl.scale.set(1,0.3,1); at(fl, EN.xc, DECK+0.004, z); put(fl,'spark','internals'); R.flames.push(fl);
});

/* ---------------- Soupapes, arbres à cames, bougies, bobines ---------------- */
const LOBE_BASE = 0.015, LOBE_LIFT = 0.0095, LOBE_HALF = 68*DEG;
const lobeR = phi => { const a=Math.abs(Math.atan2(Math.sin(phi),Math.cos(phi))); return LOBE_BASE + (a<LOBE_HALF ? LOBE_LIFT*Math.pow(Math.cos(a/LOBE_HALF*Math.PI/2),2) : 0); };
function lobeGeo(){ const s=new THREE.Shape(); for(let i=0;i<=72;i++){ const a=i/72*TAU, r=lobeR(a); i? s.lineTo(r*Math.cos(a), r*Math.sin(a)) : s.moveTo(r,0); }
  const g=new THREE.ExtrudeGeometry(s,{depth:0.011,bevelEnabled:false}); g.translate(0,0,-0.0055); g.computeVertexNormals(); return g; }
const LG = lobeGeo();
R.cams = {}; R.valves = [];
['in','ex'].forEach(kind=>{
  const x = EN.xc + (kind==='in'? VX : -VX);
  const g = new THREE.Group(); at(g, x, CAMY, 0);
  const cm = kind==='in' ? gm('engine', metal(0x9aa3ab)) : gm('engine', metal(0x8b949b));
  const shaft = cylZ(0.011, 0.39, cm); shaft.position.z = -0.135; g.add(shaft);
  const lobes = [];
  EN.zc.forEach((z,i)=>[-0.016,0.016].forEach(dz=>{ const l=new THREE.Mesh(LG, cm); l.position.z = z+dz; g.add(l); lobes.push({m:l, cyl:i}); }));
  // pignons qui relient les deux arbres à cames (rapport 1:1)
  const cg = gearZ(14, TAU*VX/14, 0.012, 0.006, cm); cg.position.z = -0.302; g.add(cg);
  put(g, kind==='in'?'camin':'camex', 'internals');
  R.cams[kind] = {g, lobes, gear:cg};
  EN.zc.forEach((z,i)=>[-0.016,0.016].forEach(dz=>{
    const v = new THREE.Group();
    const head = cylY(0.0135, 0.003, metal(0xb0b5ba)); head.position.y = 0; v.add(head);
    const stem = cylY(0.0028, 0.062, M.steel); stem.position.y = 0.031; v.add(stem);
    const tap = cylY(0.011, 0.012, metal(0x7a838a)); tap.position.y = 0.062+0.006-0.0005; v.add(tap);
    const spr = spring(new THREE.Vector3(0,0.03,0), new THREE.Vector3(0,0.056,0), 0.0085, 5, 0.0011, metal(0x50606a)); v.add(spr);
    at(v, x, DECK+0.001, z+dz);
    put(v, kind==='in'?'valvein':'valveex', 'internals');
    R.valves.push({g:v, kind, cyl:i, base:DECK+0.001});
  }));
});
R.plugs=[];
EN.zc.forEach((z,i)=>{
  const g = new THREE.Group(); at(g, EN.xc, 0, z);
  const tip = cylY(0.004, 0.012, metal(0x8a8f94)); tip.position.y = DECK+0.004; g.add(tip);
  const body = cylY(0.007, 0.03, M.steel); body.position.y = DECK+0.025; g.add(body);
  const ins = cylY(0.0055, 0.06, M.white); ins.position.y = DECK+0.07; g.add(ins);
  put(g,'spark','internals'); R.plugs.push(g);
  const coil = new THREE.Group(); at(coil, EN.xc, 0, z);
  const cb = cylY(0.012, 0.07, plastic(0x26292c)); cb.position.y = DECK+0.135; coil.add(cb);
  const top = box(0.035,0.03,0.04, plastic(0x2e3236)); top.position.y = DECK+0.18; coil.add(top);
  const plugc = box(0.016,0.012,0.02, plastic(0x6b4a2a)); plugc.position.set(0.02,DECK+0.185,0); coil.add(plugc);
  put(coil,'coil','internals');
});

/* ---------------- Courroie de distribution ---------------- */
const BELT = { crank:{x:EN.xc, y:EN.yc, r:0.0285}, cam:{x:EN.xc+VX, y:CAMY, r:0.057}, tens:{x:EN.xc+0.085, y:0.52, r:0.02}, idler:{x:EN.xc-0.06, y:0.5, r:0.018}, z:-0.33 };
function beltPoints(circles){ // circles dans l'ordre anti-horaire ; courroie à l'extérieur
  const n=circles.length, tang=[];
  for(let i=0;i<n;i++){ const A=circles[i], B=circles[(i+1)%n]; const dx=B.x-A.x, dy=B.y-A.y, d=Math.hypot(dx,dy);
    const phi=Math.atan2(dy,dx), al=-Math.acos(clamp((A.r-B.r)/d,-1,1)), na=phi+al; tang.push(na); }
  const pts=[];
  for(let i=0;i<n;i++){ const C=circles[i]; let a0=tang[(i-1+n)%n], a1=tang[i]; while(a1<a0) a1+=TAU;
    for(let k=0;k<=12;k++){ const a=lerp(a0,a1,k/12); pts.push(new THREE.Vector3(C.x+C.r*Math.cos(a), C.y+C.r*Math.sin(a), BELT.z)); } }
  return pts;
}
(function belt(){
  const pts = beltPoints([BELT.crank, BELT.tens, BELT.cam, BELT.idler]);
  const bm = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true), 240, 0.004, 5, true), plastic(0x1f2326,{roughness:0.9}));
  bm.scale.set(1,1,1); put(bm,'belt','internals'); R.belt = bm;
  const half = pts.slice(0, Math.floor(pts.length*0.45)); half.push(new THREE.Vector3(EN.xc+0.03, 0.3, BELT.z), new THREE.Vector3(EN.xc-0.02, 0.22, BELT.z+0.02));
  R.beltBroken = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(half), 120, 0.004, 5, false), plastic(0x1f2326,{roughness:0.9})); put(R.beltBroken,'belt','internals');
  const pm = gm('engine', metal(0x9aa3ab));
  R.crankSprocket = at(gearZ(20, TAU*BELT.crank.r/20, 0.024, 0.008, pm), BELT.crank.x, BELT.crank.y, BELT.z); put(R.crankSprocket,'belt','internals');
  R.camPulley = new THREE.Group(); at(R.camPulley, BELT.cam.x, BELT.cam.y, BELT.z);
  R.camPulley.add(gearZ(40, TAU*BELT.cam.r/40, 0.024, 0.008, pm));
  for(let k=0;k<4;k++){ const h=cylZ(0.009,0.026,M.dark); h.position.set(Math.cos(k*TAU/4)*0.032, Math.sin(k*TAU/4)*0.032, 0); R.camPulley.add(h); }
  put(R.camPulley,'belt','internals');
  R.tens = at(cylZ(BELT.tens.r,0.026,M.alu), BELT.tens.x, BELT.tens.y, BELT.z); put(R.tens,'belt','internals');
  R.tens.add(at(box(0.004,0.03,0.028,M.dark),0,0,0));
  R.idler = at(cylZ(BELT.idler.r,0.026,M.alu), BELT.idler.x, BELT.idler.y, BELT.z); put(R.idler,'belt','internals');
  R.idler.add(at(box(0.004,0.028,0.028,M.dark),0,0,0));
})();

/* ---------------- Volant moteur et démarreur ---------------- */
const PS = 0.00666;                                   // pas de la couronne de démarreur
const FLY_N = 135, ST_N = 10, ST_DIR = 150*DEG, ST_D = pitchR(FLY_N,PS)+pitchR(ST_N,PS);
const STX = EN.xc + ST_D*Math.cos(ST_DIR), STY = EN.yc + ST_D*Math.sin(ST_DIR);
R.fly = new THREE.Group(); at(R.fly, EN.xc, EN.yc, 0);
(function flywheel(){
  const fm = gm('engine', metal(0x5d666e,{metalness:0.7}));
  const disc = cylZ(0.138, 0.02, fm, 64); disc.position.z = 0.07; R.fly.add(disc);
  const ring = gearZ(FLY_N, PS, 0.014, 0.135, fm); ring.position.z = 0.07; R.fly.add(ring);
  for(let k=0;k<6;k++){ const h=cylZ(0.006,0.022,M.dark); h.position.set(Math.cos(k*TAU/6)*0.035, Math.sin(k*TAU/6)*0.035, 0.07); R.fly.add(h); }
  put(R.fly,'flywheel','clutch');
})();
R.starter = new THREE.Group();
(function starter(){
  const b = cylZ(0.038, 0.15, metal(0x2b3236,{metalness:0.4})); b.position.set(STX, STY, 0.18); R.starter.add(b);
  const sol = cylZ(0.02, 0.09, M.alu); sol.position.set(STX+0.035, STY+0.035, 0.165); R.starter.add(sol);
  const shaft = cylZ(0.006, 0.08, M.steel); shaft.position.set(STX, STY, 0.09); R.starter.add(shaft);
  put(R.starter,'starter','clutch');
  R.stPin = at(gearZ(ST_N, PS, 0.012, 0.004, M.alu), STX, STY, 0.09); put(R.stPin,'starter','clutch');
})();

/* ---------------- Embrayage (boîte manuelle) ---------------- */
R.clutch = {};
(function clutch(){
  const MODE='manual', C='clutch';
  const inMat = gm('input', M.steel);
  // disque (tourne avec l'arbre primaire)
  const d = new THREE.Group(); at(d, EN.xc, EN.yc, 0.084);
  const discM = gm('input', metal(0x8a5a36,{metalness:0.15,roughness:0.85}));
  d.add(tubeZ(0.114, 0.075, 0.008, discM, 64));
  d.add(tubeZ(0.075, 0.022, 0.0025, gm('input', metal(0xb0b6bb))));
  for(let k=0;k<6;k++){ const s=spring(new THREE.Vector3(0,-0.012,0), new THREE.Vector3(0,0.012,0), 0.006, 4, 0.0012, metal(0x50606a)); s.position.set(Math.cos(k*TAU/6)*0.048, Math.sin(k*TAU/6)*0.048, 0); s.rotation.z = k*TAU/6; d.add(s); }
  d.add(tubeZ(0.024, 0.012, 0.02, inMat));
  put(d,'disc',C,MODE); R.clutch.disc = d;
  // plateau de pression + couvercle + diaphragme (tournent avec le moteur)
  const ppm = gm('engine', metal(0xa8b0b6,{metalness:0.75}));
  const plate = at(tubeZ(0.114, 0.075, 0.011, ppm, 64), EN.xc, EN.yc, 0.0955); put(plate,'pressure',C,MODE); R.clutch.plate = plate;
  const cover = new THREE.Group(); at(cover, EN.xc, EN.yc, 0);
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.132,0.132,0.035,48,1,true), metal(0x9aa3ab,{transparent:true,opacity:0.35,depthWrite:false,side:THREE.DoubleSide}));
  shell.geometry.rotateX(Math.PI/2); shell.position.z = 0.0975; cover.add(shell);
  const back = tubeZ(0.132, 0.085, 0.003, metal(0x9aa3ab,{transparent:true,opacity:0.45,depthWrite:false})); back.position.z = 0.115; cover.add(back);
  put(cover,'pressure',C,MODE); R.clutch.cover = cover;
  const dia = new THREE.Group(); at(dia, EN.xc, EN.yc, 0.112);
  dia.add(tubeZ(0.105, 0.075, 0.0025, metal(0x3f4a52)));
  for(let k=0;k<18;k++){ const a=k*TAU/18; const f=box(0.05,0.009,0.0025,metal(0x4a5660)); f.position.set(Math.cos(a)*0.05, Math.sin(a)*0.05, 0); f.rotation.z=a; dia.add(f); }
  put(dia,'diaphragm',C,MODE); R.clutch.dia = dia;
  // butée (ne tourne pas) et fourchette
  const bear = new THREE.Group(); at(bear, EN.xc, EN.yc, 0.121);
  bear.add(tubeZ(0.032, 0.017, 0.012, metal(0x6f7a82))); bear.add(tubeZ(0.026, 0.017, 0.016, M.steel));
  put(bear,'bearing',C,MODE); R.clutch.bear = bear;
  const fork = new THREE.Group(); at(fork, EN.xc-0.11, EN.yc, 0.13);   // pivot à l'arrière
  const arm = box(0.15, 0.014, 0.008, metal(0x707a80)); arm.position.x = 0.075; fork.add(arm);
  const pv = cylY(0.006, 0.04, M.dark); fork.add(pv);
  const cyl = cylX(0.012, 0.05, M.alu); cyl.position.set(-0.035, 0, 0); fork.add(cyl);
  put(fork,'fork',C,MODE); R.clutch.fork = fork;
})();

/* ---------------- Convertisseur de couple (boîte auto) ---------------- */
R.tc = {};
(function converter(){
  const MODE='auto', C='clutch', z0=0.12, rr=0.122;
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(rr+0.006, rr+0.006, 0.095, 48, 1, true), metal(0x9aa3ab,{transparent:true,opacity:0.22,depthWrite:false,side:THREE.DoubleSide}));
  housing.geometry.rotateX(Math.PI/2); at(housing, EN.xc, EN.yc, z0); put(housing,'tcimpeller',C,MODE);
  function bladeWheel(z, dir, mat, n, r0, r1, depth, twist){
    const g = new THREE.Group();
    const prof=[]; for(let i=0;i<=16;i++){ const a=i/16*Math.PI; prof.push(new THREE.Vector2(lerp(r0,r1,0.5)+Math.cos(a)*(r1-r0)/2, dir*Math.sin(a)*depth)); }
    const shell = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), mat); shell.geometry.rotateX(Math.PI/2); g.add(shell);
    for(let k=0;k<n;k++){ const a=k*TAU/n; const b=box(r1-r0-0.01, 0.0016, depth*0.9, mat); b.position.set(Math.cos(a)*(r0+r1)/2, Math.sin(a)*(r0+r1)/2, dir*depth*0.45); b.rotation.z=a; b.rotation.x=twist; g.add(b); }
    at(g, EN.xc, EN.yc, z); return g;
  }
  const im = gm('engine', metal(0xa9b1b7,{metalness:0.6,side:THREE.DoubleSide}));
  const tm = gm('input', metal(0xc7a670,{metalness:0.6,side:THREE.DoubleSide}));
  R.tc.imp = bladeWheel(z0+0.002, 1, im, 24, 0.05, rr, 0.038, 0); put(R.tc.imp,'tcimpeller',C,MODE);
  R.tc.tur = bladeWheel(z0-0.002, -1, tm, 22, 0.05, rr, 0.034, 0); put(R.tc.tur,'tcturbine',C,MODE);
  const st = new THREE.Group(); at(st, EN.xc, EN.yc, z0);
  st.add(tubeZ(0.05, 0.03, 0.012, metal(0x6c7d8c)));
  for(let k=0;k<14;k++){ const a=k*TAU/14; const b=box(0.026,0.002,0.016,metal(0x6c7d8c)); b.position.set(Math.cos(a)*0.063, Math.sin(a)*0.063, 0); b.rotation.z=a; b.rotation.y=0.6; st.add(b); }
  put(st,'tcstator',C,MODE); R.tc.st = st;
  const lu = at(tubeZ(0.115, 0.04, 0.006, gm('input', metal(0x8a5a36,{metalness:0.2,roughness:0.8}))), EN.xc, EN.yc, z0-0.045); put(lu,'tclockup',C,MODE); R.tc.lu = lu;
  // huile qui circule (petits points)
  const n=160, pos=new Float32Array(n*3), geo=new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({color:0xff9a3c, size:0.008, transparent:true, opacity:0.9, depthWrite:false}));
  put(pts,'tcoil',C,MODE); R.tc.oil = {pts, pos, seeds:Array.from({length:n},(_,i)=>({a:Math.random()*TAU, p:Math.random()*TAU})), z0:z0};
})();

/* ---------------- Arbres de boîte : positions ---------------- */
const P62 = TAU*0.075/62;                             // module 2,4 : entraxe primaire / secondaire 75 mm
const PFD = TAU*0.12/80;                              // pont : 17 / 63 dents, entraxe 120 mm
const IX = EN.xc, IY = EN.yc;
const OX = IX + 0.075*Math.cos(200*DEG), OY = IY + 0.075*Math.sin(200*DEG);
const DX = OX + 0.12*Math.cos(202*DEG), DY = OY + 0.12*Math.sin(202*DEG);
const PSI_IO = 200*DEG, PSI_OI = 20*DEG, PSI_DO = 22*DEG;
const FD_N = [17, 63], FD = 63/17;

(function housing(){
  const hm = glass(0x9fb0bc, 0.09), C='gearbox';
  const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.15,0.15,0.11,48,1,true), hm); bell.geometry.rotateX(Math.PI/2); at(bell, IX, IY, 0.11); put(bell,'gbcase',C);
  const caseGeo = new THREE.BoxGeometry(0.43, 0.30, 0.33); const cs = at(new THREE.Mesh(caseGeo, hm), 1.29, 0.36, 0.32); put(cs,'gbcase',C);
  put(at(edges(caseGeo,0x7d95a8,0.45),1.29,0.36,0.32),'gbcase',C);
  put(at(edges(new THREE.CylinderGeometry(0.15,0.15,0.11,24,1,true).rotateX(Math.PI/2),0x7d95a8,0.3), IX, IY, 0.11),'gbcase',C);
})();

/* ---------------- Boîte manuelle 6 vitesses (2 arbres) ---------------- */
const MG = { 1:[13,49], 2:[20,42], 3:[26,36], 4:[30,32], 5:[33,29], 6:[36,26] };   // [primaire, secondaire]
const MZ = { 1:0.165, 2:0.205, R:0.24, 3:0.275, 4:0.315, 5:0.355, 6:0.395 };
const REV = { in:12, idl:20, out:43 };
const RATIO_M = { N:0, R:-(REV.out/REV.in) };
for(const g in MG) RATIO_M[g] = MG[g][1]/MG[g][0];
// pignon de marche arrière : position qui touche à la fois le primaire et le secondaire
const RIDL = (()=>{ const a=pitchR(REV.in,P62)+pitchR(REV.idl,P62), b=pitchR(REV.out,P62)+pitchR(REV.idl,P62), d=0.075;
  const xl=(a*a - b*b + d*d)/(2*d), h=Math.sqrt(Math.max(0,a*a-xl*xl)); const ux=Math.cos(PSI_IO), uy=Math.sin(PSI_IO);
  return {x: IX + ux*xl - uy*h, y: IY + uy*xl + ux*h}; })();
R.man = {gIn:{}, gOut:{}, coll:{}};
(function manualBox(){
  const MODE='manual', C='gearbox';
  const inM = gm('input', M.steel), outM = gm('output', M.steel);
  R.man.inShaft = new THREE.Group(); at(R.man.inShaft, IX, IY, 0);
  const s = cylZ(0.0135, 0.36, inM); s.position.z = 0.25; R.man.inShaft.add(s);
  s.add(at(box(0.004,0.004,0.3,M.white),0,0.0135,0));
  for(const g in MG){ const gg = gearZ(MG[g][0], P62, 0.016, 0.01, inM); gg.position.z = MZ[g]; R.man.inShaft.add(gg); }
  const ri = gearZ(REV.in, P62, 0.016, 0.008, inM); ri.position.z = MZ.R; R.man.inShaft.add(ri);
  put(R.man.inShaft,'mainshaft',C,MODE);
  R.man.outShaft = new THREE.Group(); at(R.man.outShaft, OX, OY, 0);
  const os = cylZ(0.016, 0.33, outM); os.position.z = 0.29; R.man.outShaft.add(os);
  os.add(at(box(0.004,0.004,0.28,M.white),0,0.016,0));
  const pin = gearZ(FD_N[0], PFD, 0.028, 0.01, outM); pin.position.z = 0.44; R.man.outShaft.add(pin);
  put(R.man.outShaft,'outshaft',C,MODE);
  const gearMat = {};
  ['1','2','3','4','5','6','R'].forEach(g=>{
    const mt = metal(0xb3bac0,{metalness:0.7}); gearMat[g]=mt;
    const N = g==='R' ? REV.out : MG[g][1];
    const grp = new THREE.Group(); at(grp, OX, OY, MZ[g]);
    grp.add(gearZ(N, P62, 0.016, 0.017, mt));
    const dogSide = ({1:1,2:-1,R:1,3:1,4:-1,5:1,6:-1})[g];
    const dog = gearZ(16, TAU*0.024/16, 0.006, 0.017, mt); dog.position.z = dogSide*0.011; grp.add(dog);
    put(grp,'gear'+g,C,MODE); R.man.gOut[g]=grp;
  });
  R.man.gearMat = gearMat;
  R.man.idler = at(gearZ(REV.idl, P62, 0.016, 0.006, metal(0xc9a24a,{metalness:0.6})), RIDL.x, RIDL.y, MZ.R); put(R.man.idler,'gearR',C,MODE);
  put(at(cylZ(0.006,0.05,M.dark),RIDL.x,RIDL.y,MZ.R),'gearR',C,MODE);
  // baladeurs (synchros) : glissent pour verrouiller un pignon sur l'arbre secondaire
  const collM = gm('collar', metal(0x2f87c9,{metalness:0.5,roughness:0.35}));
  const COLL = { '12':{n:0.185,1:0.1765,2:0.1935}, R:{n:0.2555,R:0.2515}, '34':{n:0.295,3:0.2865,4:0.3035}, '56':{n:0.375,5:0.3665,6:0.3835} };
  for(const k in COLL){ const c=new THREE.Group(); c.add(tubeZ(0.03,0.016,0.009,collM)); c.add(gearZ(16, TAU*0.024/16, 0.009, 0.016, collM));
    const fork = box(0.006, 0.05, 0.004, metal(0x707a80)); fork.position.y = 0.045; c.add(fork);
    at(c, OX, OY, COLL[k].n); put(c,'synchro',C,MODE); R.man.coll[k]={g:c, pos:COLL[k], z:COLL[k].n}; }
})();

/* ---------------- Boîte automatique 6 vitesses (Lepelletier : 1 train simple + 1 train Ravigneaux) ---------------- */
const PM = TAU*0.0721/87;                              // module des trains épicycloïdaux
const PG1 = { s:47, p:19, r:85 };                      // train simple : couronne entraînée, planétaire fixe
const RV = { s2:33, sp:17, l:24, s3:39, r:87 };       // Ravigneaux : petit planétaire, satellites courts, longs, grand planétaire, couronne
const A_PG = (PG1.r+PG1.s)/PG1.r, K2 = RV.r/RV.s2, K3 = RV.r/RV.s3;
const RATIO_A = { 1:A_PG*K2, 2:A_PG*(K2+K3)/(1+K3), 3:A_PG, 4:1/(1-(1-1/A_PG)/K2), 5:1/(1+(1-1/A_PG)/K3), 6:K3/(1+K3), R:-A_PG*K3 };
const SHIFT_EL = { 1:['K1','B2'], 2:['K1','B1'], 3:['K1','K3'], 4:['K1','K2'], 5:['K2','K3'], 6:['K2','B1'], R:['K3','B2'] };
const RS_L = pitchR(RV.s3+RV.l, PM), RS_S = pitchR(RV.s2+RV.sp, PM), RD_SL = pitchR(RV.sp+RV.l, PM);
const RV_DELTA = Math.acos((RS_L*RS_L + RS_S*RS_S - RD_SL*RD_SL)/(2*RS_L*RS_S));
R.aut = {};
(function autoBox(){
  const MODE='auto', C='gearbox';
  const inM = gm('input', M.steel);
  R.aut.inShaft = new THREE.Group(); at(R.aut.inShaft, IX, IY, 0);
  const s = cylZ(0.012, 0.34, inM); s.position.z = 0.23; R.aut.inShaft.add(s);
  s.add(at(box(0.004,0.004,0.3,M.white),0,0.012,0));
  put(R.aut.inShaft,'autoshaft',C,MODE);
  // Train simple
  const pg = new THREE.Group(); at(pg, IX, IY, 0.175); R.aut.pg = pg;
  R.aut.pgRing = ringGearZ(PG1.r, PM, 0.016, 0.082, gm('input', metal(0xa9b1b7))); pg.add(R.aut.pgRing);
  R.aut.pgSun = gearZ(PG1.s, PM, 0.016, 0.014, metal(0x6c7d8c)); pg.add(R.aut.pgSun);
  R.aut.pgCar = new THREE.Group(); pg.add(R.aut.pgCar); R.aut.pgPl=[];
  const c1m = gm('pg1', metal(0xd0b070,{metalness:0.6}));
  for(let k=0;k<3;k++){ const b=k*TAU/3, rr=pitchR(PG1.s+PG1.p,PM); const p=gearZ(PG1.p, PM, 0.016, 0.004, c1m); p.position.set(Math.cos(b)*rr, Math.sin(b)*rr, 0); R.aut.pgCar.add(p); R.aut.pgPl.push({m:p,b}); }
  R.aut.pgCar.add(at(tubeZ(0.06,0.016,0.004,c1m),0,0,-0.012));
  put(pg,'pg1',C,MODE);
  // Train Ravigneaux
  const rv = new THREE.Group(); at(rv, IX, IY, 0); R.aut.rv = rv;
  R.aut.rvRing = new THREE.Group(); R.aut.rvRing.position.z = 0.305; rv.add(R.aut.rvRing);
  const rm = gm('output', metal(0xa9b1b7));
  R.aut.rvRing.add(ringGearZ(RV.r, PM, 0.03, 0.082, rm));
  const tg = gearZ(31, P62, 0.016, 0.06, rm); tg.position.z = 0.04; R.aut.rvRing.add(tg);
  R.aut.rvRing.add(at(tubeZ(0.082,0.06,0.03,rm),0,0,0.02));
  R.aut.s2 = gearZ(RV.s2, PM, 0.014, 0.01, gm('s2', metal(0x6c9d8c))); R.aut.s2.position.z = 0.28; rv.add(R.aut.s2);
  R.aut.s3 = gearZ(RV.s3, PM, 0.014, 0.022, gm('s3', metal(0x8c7d6c))); R.aut.s3.position.z = 0.322; rv.add(R.aut.s3);
  R.aut.rvCar = new THREE.Group(); rv.add(R.aut.rvCar); R.aut.longP=[]; R.aut.shortP=[];
  const cm = gm('rvc', metal(0xd0b070,{metalness:0.6}));
  for(let k=0;k<3;k++){ const b=k*TAU/3;
    const lp = gearZ(RV.l, PM, 0.056, 0.003, cm); lp.position.set(Math.cos(b)*RS_L, Math.sin(b)*RS_L, 0.30); R.aut.rvCar.add(lp); R.aut.longP.push({m:lp,b});
    const bs = b - RV_DELTA; const sp = gearZ(RV.sp, PM, 0.014, 0.003, cm); sp.position.set(Math.cos(bs)*RS_S, Math.sin(bs)*RS_S, 0.28); R.aut.rvCar.add(sp); R.aut.shortP.push({m:sp,b:bs});
  }
  R.aut.rvCar.add(at(tubeZ(0.07,0.014,0.004,cm),0,0,0.268));
  put(rv,'ravigneaux',C,MODE);
  // Embrayages et freins multidisques
  R.aut.el = {};
  const EL = { K1:{z:0.205,r0:0.03,r1:0.05}, K3:{z:0.22,r0:0.055,r1:0.072}, B1:{z:0.245,r0:0.06,r1:0.08}, B2:{z:0.262,r0:0.072,r1:0.088}, K2:{z:0.385,r0:0.03,r1:0.05} };
  for(const k in EL){ const e=EL[k], g=new THREE.Group(); const mat = metal(0x8a96a0,{metalness:0.5});
    for(let i=0;i<4;i++){ const pl=tubeZ(e.r1, e.r0, 0.0022, i%2? metal(0x8a5a36,{metalness:0.15,roughness:0.8}) : mat); pl.position.z = (i-1.5)*0.0035; g.add(pl); }
    g.add(at(tubeZ(e.r1+0.003, e.r1, 0.02, metal(0x7d868d,{transparent:true,opacity:0.5,depthWrite:false})),0,0,0));
    at(g, IX, IY, e.z); put(g,'el'+k,C,MODE); R.aut.el[k]={g, mats:[], ...e};
    g.traverse(o=>{ if(o.isMesh) R.aut.el[k].mats.push(o.material); });
  }
  // arbre intermédiaire (transfert)
  R.aut.outShaft = new THREE.Group(); at(R.aut.outShaft, OX, OY, 0);
  const om = gm('output', M.steel);
  const os = cylZ(0.016, 0.12, om); os.position.z = 0.39; R.aut.outShaft.add(os);
  const trg = gearZ(31, P62, 0.016, 0.012, om); trg.position.z = 0.345; R.aut.outShaft.add(trg);
  const pin = gearZ(FD_N[0], PFD, 0.028, 0.01, om); pin.position.z = 0.44; R.aut.outShaft.add(pin);
  put(R.aut.outShaft,'transfer',C,MODE);
})();

/* ---------------- Pont, différentiel, cardans ---------------- */
R.diff = new THREE.Group(); at(R.diff, DX, DY, 0);
(function diff(){
  const C='drive', om = gm('output', metal(0xc79b4a,{metalness:0.75,roughness:0.3}));
  const crown = gearZ(FD_N[1], PFD, 0.026, 0.05, om); crown.position.z = 0.44; R.diff.add(crown);
  const cage = gm('output', metal(0x8f989f,{metalness:0.6,transparent:true,opacity:0.55,depthWrite:false}));
  const sh = new THREE.Mesh(new THREE.SphereGeometry(0.052, 24, 16), cage); sh.position.z = 0.44; R.diff.add(sh);
  const pinShaft = cylY(0.007, 0.1, M.steel); pinShaft.position.z = 0.44; R.diff.add(pinShaft);
  [-1,1].forEach(sg=>{ const sp=new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.02,0.015,12), metal(0xd0b070,{flatShading:true})); sp.position.set(0, sg*0.026, 0.44); if(sg>0) sp.rotation.z=Math.PI; R.diff.add(sp); });
  put(R.diff,'diff',C);
  put(at(new THREE.Mesh(new THREE.SphereGeometry(0.075,24,16), glass(0x9fb0bc,0.08)), DX, DY, 0.44),'diff',C);
})();
// Cardans : planétaire + joint tripode côté boîte, arbre, joint homocinétique côté roue
R.shafts = [];
[[1, 0.465, WH.zF-0.075],[-1, 0.415, -(WH.zF-0.075)]].forEach(([sg, zIn, zOut])=>{
  const C='drive';
  const a = new THREE.Vector3(DX, DY, zIn+sg*0.04), b = new THREE.Vector3(WH.xF, WH.r, zOut);
  const g = new THREE.Group(); g.position.copy(a);
  const dir = b.clone().sub(a), L = dir.length(); g.quaternion.setFromUnitVectors(UPV, dir.clone().normalize());
  const rot = new THREE.Group(); g.add(rot);
  const sm = gm('output', metal(0x8f989f,{metalness:0.7}));
  const shaft = cylY(0.0125, L-0.12, sm); shaft.position.y = L/2; rot.add(shaft);
  rot.add(at(box(0.004,L*0.6,0.004,M.white),0.0125,L/2,0));
  const tri = cylY(0.038, 0.06, metal(0x6f7a82)); tri.position.y = 0.0; rot.add(tri);
  const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.036,0.07,16), M.rubber); b1.position.y = 0.065; rot.add(b1);
  const cv = new THREE.Mesh(new THREE.SphereGeometry(0.037,18,12), metal(0x6f7a82)); cv.position.y = L-0.02; rot.add(cv);
  const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.036,0.016,0.075,16), M.rubber); b2.position.y = L-0.08; rot.add(b2);
  ROOT.add(g); reg(g,'cv',C); R.shafts.push({g, rot, sg, shaft, boot:b2, cv});
  const side = new THREE.Mesh(new THREE.CylinderGeometry(0.014,0.024,0.015,14), metal(0xd0b070,{flatShading:true}));
  side.geometry.rotateX(sg>0? -Math.PI/2 : Math.PI/2); side.position.set(0,0,zIn); R.diff.add(side); reg(side,'diff',C);
});

/* ---------------- Roues, freins, suspension ---------------- */
R.wheels=[]; R.discs=[]; R.calipers=[];
function makeWheel(front){
  const w = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.248, 0.066, 18, 56), M.rubber); tire.scale.z = 1.5; w.add(tire);
  const trM = plastic(0x2a2f33,{roughness:1});
  for(let k=0;k<36;k++){ const a=k/36*TAU; const t=box(0.018,0.008,0.19,trM); t.position.set(Math.cos(a)*0.312, Math.sin(a)*0.312, 0); t.rotation.z=a; w.add(t); }
  const rimM = front ? gm('output', metal(0xc3c9ce,{metalness:0.8,roughness:0.25})) : metal(0xc3c9ce,{metalness:0.8,roughness:0.25});
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.17,40,1,true), metal(0xaab2b8,{side:THREE.DoubleSide,metalness:0.8})); rim.geometry.rotateX(Math.PI/2); w.add(rim);
  for(let k=0;k<5;k++){ const a=k/5*TAU; const sp=box(0.04,0.15,0.016,rimM); sp.position.set(Math.cos(a)*0.11, Math.sin(a)*0.11, 0.07); sp.rotation.z=a-Math.PI/2; w.add(sp); }
  w.add(at(cylZ(0.045,0.03,rimM),0,0,0.07));
  for(let k=0;k<5;k++){ const a=k/5*TAU+0.6; w.add(at(cylZ(0.006,0.03,M.dark),Math.cos(a)*0.05,Math.sin(a)*0.05,0.08)); }
  return w;
}
[[WH.xF,WH.zF,true],[WH.xF,-WH.zF,true],[WH.xR,WH.zR,false],[WH.xR,-WH.zR,false]].forEach(([x,z,front])=>{
  const sg = Math.sign(z);
  const w = makeWheel(front); at(w, x, WH.r, z); if(sg<0) w.rotation.y = Math.PI;   // faces extérieures vers l'extérieur
  put(w, front?'wheelF':'wheelR', 'wheels'); R.wheels.push({w, sg});
  const dr = front ? 0.144 : 0.128, dz = z - sg*0.06;
  const disc = new THREE.Group(); at(disc, x, WH.r, dz);
  disc.add(tubeZ(dr, 0.06, front?0.025:0.012, metal(0x8a8f94,{metalness:0.8,roughness:0.5})));
  for(let k=0;k<5;k++){ const a=k/5*TAU; disc.add(at(cylZ(0.004,0.03,M.dark),Math.cos(a)*0.05,Math.sin(a)*0.05,0)); }
  for(let k=0;k<12;k++){ const a=k/12*TAU; disc.add(at(cylZ(0.003,0.03,M.dark),Math.cos(a)*(dr-0.025),Math.sin(a)*(dr-0.025),0)); }
  put(disc,'brakedisc','wheels'); R.discs.push({g:disc, sg});
  const cal = new THREE.Group(); at(cal, x, WH.r, dz);
  const calM = metal(0x2a2e31,{metalness:0.4});
  const ang = front ? 160*DEG : 20*DEG, cr = dr-0.02;
  const body = box(0.06, 0.08, 0.06, calM); body.position.set(Math.cos(ang)*cr, Math.sin(ang)*cr, 0); body.rotation.z = ang; cal.add(body);
  const pads=[]; [-1,1].forEach(s=>{ const p=box(0.05,0.035,0.008,metal(0x6b5a48,{roughness:0.9})); p.position.set(Math.cos(ang)*cr, Math.sin(ang)*cr, s*0.02); p.rotation.z=ang; cal.add(p); pads.push(p); });
  put(cal, 'caliper', 'wheels'); R.calipers.push({g:cal, pads, base:front?0.0205:0.0145});
});
(function suspension(){
  const C='chassis', sm=metal(0x3d4448), dm=metal(0x8a9298);
  [1,-1].forEach(sg=>{
    // jambe de force MacPherson à l'avant
    const hub = new THREE.Vector3(WH.xF-0.02, WH.r+0.12, sg*(WH.zF-0.13)), top = new THREE.Vector3(WH.xF-0.06, 0.88, sg*(WH.zF-0.2));
    put(between(hub, top, 0.022, dm), 'strut', C);
    put(spring(hub.clone().lerp(top,0.45), top.clone().lerp(hub,0.06), 0.05, 6, 0.006, metal(0xb43b2c)), 'strut', C);
    put(between(new THREE.Vector3(WH.xF, 0.22, sg*(WH.zF-0.13)), new THREE.Vector3(WH.xF+0.12, 0.24, sg*0.35), 0.014, sm), 'arm', C);
    put(between(new THREE.Vector3(WH.xF, 0.22, sg*(WH.zF-0.13)), new THREE.Vector3(WH.xF-0.18, 0.24, sg*0.35), 0.014, sm), 'arm', C);
    // essieu arrière multibras
    const rh = new THREE.Vector3(WH.xR, WH.r, sg*(WH.zR-0.12));
    put(spring(new THREE.Vector3(WH.xR-0.12, 0.2, sg*0.5), new THREE.Vector3(WH.xR-0.12, 0.42, sg*0.5), 0.05, 6, 0.006, metal(0xb43b2c)), 'rearaxle', C);
    put(between(new THREE.Vector3(WH.xR+0.06, 0.25, sg*(WH.zR-0.12)), new THREE.Vector3(WH.xR+0.05, 0.62, sg*(WH.zR-0.2)), 0.018, dm), 'rearaxle', C);
    put(between(rh, new THREE.Vector3(WH.xR+0.45, 0.28, sg*0.45), 0.014, sm), 'rearaxle', C);
    put(between(new THREE.Vector3(WH.xR, 0.22, sg*(WH.zR-0.12)), new THREE.Vector3(WH.xR, 0.24, sg*0.25), 0.013, sm), 'rearaxle', C);
    put(between(new THREE.Vector3(WH.xR, 0.38, sg*(WH.zR-0.12)), new THREE.Vector3(WH.xR, 0.36, sg*0.25), 0.012, sm), 'rearaxle', C);
  });
  put(between(new THREE.Vector3(WH.xR-0.05,0.25,-0.5), new THREE.Vector3(WH.xR-0.05,0.25,0.5), 0.03, sm), 'rearaxle', C);
  put(at(box(0.12,0.05,0.9,sm),WH.xF+0.0,0.2,0),'subframe',C);
  // échappement
  const ex = [new THREE.Vector3(EN.xc-0.17,0.32,-0.13), new THREE.Vector3(1.08,0.2,-0.1), new THREE.Vector3(0.6,0.17,0.05), new THREE.Vector3(-0.6,0.18,0.12), new THREE.Vector3(-1.5,0.22,0.3), new THREE.Vector3(-1.7,0.25,0.38)];
  put(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ex),60,0.024,10,false), metal(0x9aa0a4)),'exhaust',C);
  put(at(cylX(0.022,0.35,metal(0x9aa0a4)),-0.15,0.18,0.08),'exhaust',C);
  const muf = at(new THREE.Mesh(new THREE.SphereGeometry(0.12,24,14), metal(0x9aa0a4)), -1.82, 0.27, 0.38); muf.scale.set(1.3,0.6,1.6); put(muf,'exhaust',C);
  put(at(cylX(0.03,0.2,metal(0xc0c4c8)),-2.0,0.24,0.48),'exhaust',C);
  // réservoir, radiateur, batterie
  const tank = at(new THREE.Mesh(new THREE.BoxGeometry(0.5,0.2,0.8), plastic(0x2b3033,{transparent:true,opacity:0.6})), -0.9, 0.29, -0.05); put(tank,'tank',C);
  const rad = at(box(0.035,0.42,0.66,metal(0x5f6a72,{metalness:0.4})), 1.88, 0.5, 0); put(rad,'radiator',C);
  for(let k=0;k<20;k++) put(at(box(0.04,0.003,0.64,metal(0x8a959c)),1.88,0.31+k*0.02,0),'radiator',C);
  const bat = new THREE.Group(); at(bat, 1.45, 0.75, 0.45);
  bat.add(box(0.17,0.18,0.25,plastic(0x1d2124))); bat.add(at(box(0.17,0.012,0.25,plastic(0x2f3438)),0,0.096,0));
  bat.add(at(cylY(0.01,0.02,metal(0xc4302b)),0.05,0.11,0.08)); bat.add(at(cylY(0.01,0.02,M.dark),0.05,0.11,-0.08));
  put(bat,'battery',C);
  put(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(1.5,0.86,0.53), new THREE.Vector3(1.4,0.7,0.35), new THREE.Vector3(STX,STY+0.03,0.2)]),20,0.008,6,false), plastic(0xb3261e)),'battery',C);
})();

/* ---------------- Habitacle : sièges, volant, pédales, levier ---------------- */
R.cab = {};
(function cabin(){
  const C='cabin', sm = plastic(0x2c3135,{roughness:0.9});
  function seat(x,z,w){ const g=new THREE.Group(); g.add(at(box(0.5,0.1,w,sm),0,0.42,0)); const back=box(0.1,0.6,w,sm); back.position.set(-0.24,0.72,0); back.rotation.z=0.22; g.add(back);
    g.add(at(box(0.08,0.14,w*0.6,sm),-0.32,1.08,0)); at(g,x,0,z); return g; }
  put(seat(-0.05,0.37,0.5),'seat',C); put(seat(-0.05,-0.37,0.5),'seat',C); put(seat(-0.95,0,1.3),'seat',C);
  const dash = at(box(0.22,0.09,1.4,plastic(0x23272a)),0.8,0.9,0); put(dash,'dash',C);
  const swp = new THREE.Group(); at(swp,0.48,0.97,0.37); swp.rotation.z = 0.45;
  const rimW = new THREE.Mesh(new THREE.TorusGeometry(0.185,0.016,10,40), plastic(0x1b1e20)); rimW.rotation.y = Math.PI/2; swp.add(rimW);
  swp.add(box(0.02,0.03,0.36,plastic(0x1b1e20))); swp.add(at(cylX(0.05,0.04,plastic(0x23272a)),0,0,0));
  put(swp,'steering',C);
  put(between(new THREE.Vector3(0.48,0.97,0.37), new THREE.Vector3(0.9,0.75,0.37), 0.015, M.dark),'steering',C);
  // pédales (bougent avec les vraies pédales)
  R.cab.ped = {};
  [['clutch',0.47],['brake',0.37],['gas',0.27]].forEach(([k,z])=>{
    const g = new THREE.Group(); at(g, 0.86, 0.62, z);
    const arm = box(0.012,0.22,0.012,M.dark); arm.position.y = -0.11; g.add(arm);
    const pad = box(0.012,0.07,k==='brake'?0.08:0.055, k==='gas'?plastic(0x3b4146):plastic(0x30363a)); pad.position.set(-0.01,-0.22,0); g.add(pad);
    put(g,'pedal'+k,C, k==='clutch'?'manual':undefined); R.cab.ped[k]=g;
  });
  const lev = new THREE.Group(); at(lev, 0.42, 0.55, 0.0);
  lev.add(at(cylY(0.008,0.2,M.dark),0,0.1,0)); lev.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.025,16,12),plastic(0x1b1e20)),0,0.21,0));
  put(lev,'lever',C); R.cab.lever = lev;
  put(at(box(0.25,0.04,0.16,plastic(0x23272a)),0.42,0.54,0),'lever',C);
})();
