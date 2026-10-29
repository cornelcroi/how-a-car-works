
/* ---------------- Carrosserie (compacte 5 portes générique, dimensions 4,20 × 1,76 × 1,48 m) ---------------- */
const BODY = { paint: new THREE.MeshStandardMaterial({color:0x2b5d9e, metalness:0.45, roughness:0.32, side:THREE.DoubleSide}),
  glass: new THREE.MeshStandardMaterial({color:0x1d2a36, metalness:0.2, roughness:0.08, transparent:true, opacity:0.4, side:THREE.DoubleSide, depthWrite:false}),
  trim: plastic(0x1c1f22), lines: lineMat(0x10161a,0.5) };
//            x      bas   ceinture toit  ½larg ½larg-toit
const STN = [[2.13, 0.30, 0.55, 0.55, 0.66, 0.66],
             [2.10, 0.22, 0.66, 0.66, 0.78, 0.78],
             [1.95, 0.18, 0.76, 0.76, 0.85, 0.85],
             [1.60, 0.17, 0.85, 0.85, 0.875,0.875],
             [1.25, 0.17, 0.90, 0.90, 0.88, 0.88],
             [0.95, 0.17, 0.94, 0.96, 0.88, 0.72],
             [0.30, 0.17, 0.97, 1.465,0.88, 0.645],
             [-0.90,0.17, 0.99, 1.485,0.88, 0.645],
             [-1.55,0.19, 1.00, 1.44, 0.87, 0.625],
             [-1.88,0.24, 0.98, 1.30, 0.85, 0.60],
             [-2.02,0.30, 0.95, 1.06, 0.82, 0.66],
             [-2.074,0.35,0.90, 0.90, 0.78, 0.78]];
function stAt(x){ for(let i=0;i<STN.length-1;i++){ const a=STN[i], b=STN[i+1]; if(x<=a[0] && x>=b[0]){ const t=(a[0]-x)/(a[0]-b[0]), s=t*t*(3-2*t)*0.35+t*0.65; return a.map((v,k)=>lerp(v,b[k],s)); } } return x>STN[0][0]?STN[0]:STN[STN.length-1]; }
function halfSection(s){ const [x,yb,belt,roof,w,wr]=s; const y3=yb+0.11, y6=belt-0.05;
  return [[0,yb,'side'],[0.85*w,yb,'side'],[0.96*w,yb+0.035,'side'],[w,y3,'side'],[w,lerp(y3,y6,0.33),'side'],[w,lerp(y3,y6,0.66),'side'],[w,y6,'shoulder'],
          [0.975*w,belt,'green'],[lerp(0.975*w,wr,0.33),lerp(belt,roof-0.045,0.33),'green'],[lerp(0.975*w,wr,0.66),lerp(belt,roof-0.045,0.66),'green'],[wr,roof-0.045,'roof'],
          [0.82*wr,roof-0.008,'roof'],[0.42*wr,roof+0.004,'roof'],[0,roof+0.008,'roof']]; }
function ringOf(x){ const h=halfSection(stAt(x)); const pts=h.map(p=>({z:p[0],y:p[1],t:p[2]})); for(let i=h.length-2;i>=1;i--) pts.push({z:-h[i][0], y:h[i][1], t:h[i-1][2]}); return pts; }
function sidePt(x, y, sg){ const s=stAt(x); const [ , yb, belt, roof, w, wr]=s; let z = y<=belt ? w : lerp(0.975*w, wr, clamp((y-belt)/(roof-0.045-belt),0,1)); return new THREE.Vector3(x, y, sg*(z+0.003)); }
(function buildBody(){
  const xs=[]; for(let x=2.13; x>-2.074; x-=0.02) xs.push(x); xs.push(-2.074);
  const rings = xs.map(x=>ringOf(x)); const n = rings[0].length;
  const pos=[], idxPaint=[], idxGlass=[];
  rings.forEach((r,i)=> r.forEach(p=>pos.push(xs[i], p.y, p.z)));
  const inArch = (x,y)=> [WH.xF, WH.xR].some(ax=> Math.hypot(x-ax, y-WH.r) < 0.378) && y < 0.78;
  for(let i=0;i<xs.length-1;i++) for(let j=0;j<n;j++){
    const j2=(j+1)%n, a=i*n+j, b=i*n+j2, c=(i+1)*n+j, d=(i+1)*n+j2;
    const t = rings[i][j].t, xm=(xs[i]+xs[i+1])/2, ym=(rings[i][j].y+rings[i][j2].y)/2;
    if(t==='side' && Math.abs(rings[i][j].z)>0.5 && inArch(xm, ym)) continue;
    let glassQ = false;
    if(t==='green') glassQ = xm<0.80 && xm>-1.32 && !(xm<-0.04 && xm>-0.14);
    if(t==='roof')  glassQ = (xm<0.94 && xm>0.32) || (xm<-1.58 && xm>-2.0);
    (glassQ?idxGlass:idxPaint).push(a,c,b, b,c,d);
  }
  // fermetures avant / arrière
  [0, xs.length-1].forEach(i=>{ const ci=pos.length/3; let cy=0; rings[i].forEach(p=>cy+=p.y); pos.push(xs[i], cy/n, 0);
    for(let j=0;j<n;j++){ const a=i*n+j, b=i*n+(j+1)%n; idxPaint.push(a,b,ci); } });
  function mk(idx, mat){ const g=new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos,3)); g.setIndex(idx); g.computeVertexNormals(); return new THREE.Mesh(g, mat); }
  put(mk(idxPaint, BODY.paint),'body','body'); put(mk(idxGlass, BODY.glass),'glass','body');
  // passages de roue
  [[WH.xF,1],[WH.xF,-1],[WH.xR,1],[WH.xR,-1]].forEach(([x,sg])=>{ const g=new THREE.CylinderGeometry(0.38,0.38,0.27,32,1,true,Math.PI*0.42,Math.PI*1.16); g.rotateX(Math.PI/2);
    const m=new THREE.Mesh(g, plastic(0x15181a,{side:THREE.DoubleSide})); at(m,x,WH.r,sg*0.745); put(m,'body','body'); });
  // jointures des portes, du capot et du hayon
  const seam = pts=> put(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), BODY.lines),'body','body');
  [1,-1].forEach(sg=>{
    [0.92,-0.09,-1.12].forEach(x=>{ const pts=[]; for(let y=0.3;y<=stAt(x)[3]-0.05;y+=0.03) pts.push(sidePt(x,y,sg)); seam(pts); });
    const pts=[]; for(let x=0.92;x>=-1.12;x-=0.04) pts.push(sidePt(x,0.3,sg)); seam(pts);
    // poignées
    [0.36,-0.7].forEach(x=>{ const p=sidePt(x, stAt(x)[2]-0.07, sg); const h=box(0.11,0.022,0.02,BODY.trim); h.position.copy(p); put(h,'body','body'); });
    // rétroviseurs
    const mg=new THREE.Group(); const mp=sidePt(0.83, stAt(0.83)[2]+0.04, sg); mg.position.copy(mp);
    mg.add(at(box(0.05,0.03,0.06,BODY.trim),0,0,sg*0.02)); const hs=new THREE.Mesh(new THREE.BoxGeometry(0.11,0.09,0.17), BODY.paint); hs.position.set(-0.02,0.02,sg*0.12); mg.add(hs);
    mg.add(at(box(0.004,0.075,0.15,metal(0xdfe6ea,{metalness:1,roughness:0.05})),-0.078,0.02,sg*0.12)); put(mg,'body','body');
  });
  const hood=[]; for(let s=-1;s<=1.001;s+=0.1){ const st=stAt(1.98); hood.push(new THREE.Vector3(1.98, st[3]+0.006, s*st[4]*0.94)); } seam(hood);
  const hood2=[]; [1,-1].forEach(sg=>{});
  // grille, entrée d'air, plaques, essuie-glaces, antenne
  put(at(box(0.04,0.1,0.6,BODY.trim),2.105,0.555,0),'body','body');
  for(let k=0;k<4;k++) put(at(box(0.042,0.008,0.58,metal(0x8a9298)),2.107,0.515+k*0.025,0),'body','body');
  put(at(box(0.04,0.13,0.95,BODY.trim),2.12,0.33,0),'body','body');
  put(at(box(0.01,0.11,0.52,plastic(0xf2f2ee)),2.137,0.43,0),'body','body');
  put(at(box(0.01,0.11,0.52,plastic(0xf2f2ee)),-2.078,0.64,0),'body','body');
  [0.12,-0.32].forEach(z=>{ const wpr=box(0.012,0.008,0.5,BODY.trim); wpr.position.set(0.93,0.975,z); wpr.rotation.set(0,0.15,0.6); put(wpr,'body','body'); });
  const ant = cylY(0.004,0.22,BODY.trim); ant.position.set(-1.4,1.53,0); ant.rotation.z=0.7; put(ant,'body','body');
  put(at(box(0.04,0.1,1.56,BODY.trim),-2.08,0.36,0),'body','body');
})();
// Feux
R.lights = {};
(function lights(){
  const C='body';
  const headM = new THREE.MeshStandardMaterial({color:0xf3f6f8, emissive:0xfff6dd, emissiveIntensity:0.05, metalness:0.3, roughness:0.2});
  const tailM = new THREE.MeshStandardMaterial({color:0x8d1010, emissive:0xff1a1a, emissiveIntensity:0.08, roughness:0.3});
  const revM = new THREE.MeshStandardMaterial({color:0xdddddd, emissive:0xffffff, emissiveIntensity:0, roughness:0.3});
  R.lights.head=headM; R.lights.tail=tailM; R.lights.rev=revM;
  // feux ronds, simples : phares blancs devant, feux rouges derrière (avec un petit feu de recul blanc)
  const ring = plastic(0x9aa2a8,{metalness:0.6, roughness:0.3});
  const lamp = (r, m) => { const g = new THREE.Group(); g.add(cylX(r, 0.05, m)); const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.012, 8, 28), ring); t.rotation.y = Math.PI/2; t.position.x = 0.026; g.add(t); return g; };
  [1,-1].forEach(sg=>{
    const h = lamp(0.075, headM); at(h, 2.075, 0.66, sg*0.56); h.rotation.y = sg*0.12; put(h,'headlight',C);
    const t = lamp(0.06, tailM); at(t, -2.075, 0.9, sg*0.6); t.rotation.y = Math.PI - sg*0.1; put(t,'taillight',C);
    const r = lamp(0.035, revM); at(r, -2.075, 0.9, sg*0.46); r.rotation.y = Math.PI; put(r,'taillight',C);
    const sl=new THREE.SpotLight(0xfff3d6, 0, 22, 0.42, 0.5, 1.2); sl.position.set(2.1,0.66,sg*0.56); sl.target.position.set(9,0,sg*0.9); scene.add(sl); scene.add(sl.target); (R.lights.spots=R.lights.spots||[]).push(sl);
  });
  put(at(box(0.03,0.025,0.25,tailM),-1.95,1.235,0),'taillight',C);
})();

/* ---------------- Route ---------------- */
R.movers=[];
(function road(){
  const C='road';
  const rd = new THREE.Mesh(new THREE.PlaneGeometry(50, 6.6).rotateX(-Math.PI/2), new THREE.MeshStandardMaterial({color:0x474d52, roughness:1})); rd.position.set(0,-0.001,1.0); put(rd,'road',C);
  const lm = new THREE.MeshBasicMaterial({color:0xe8e4d4});
  for(let i=0;i<18;i++){ const d=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.1).rotateX(-Math.PI/2), lm); d.position.set(-24+i*2.8,0.002,1.2); put(d,'road',C); R.movers.push(d); }
  // trottoirs à la française : bordure en granit, trottoir gris, potelets sombres le long de la bordure
  const kerbM = plastic(0xb4b6b2,{roughness:0.9}), walkM = plastic(0x8e918c,{roughness:1}), bolM = plastic(0x3b3226,{roughness:0.6});
  [[-2.3,-5.2],[4.3,7.6]].forEach(([zk, zb])=>{ const sg = Math.sign(zb - zk), w = Math.abs(zb - zk);
    put(at(box(50, 0.15, 0.18, kerbM), 0, 0.075, zk + sg*0.09), 'road', C);
    put(at(box(50, 0.13, w - 0.18, walkM), 0, 0.065, zk + sg*(0.18 + (w-0.18)/2)), 'road', C); });
  for(let i=0;i<34;i++){ const b = new THREE.Group(); b.add(at(cylY(0.05, 0.75, bolM), 0, 0.5, 0)); b.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), bolM), 0, 0.88, 0));
    b.position.set(-25 + i*50/34, 0, -2.55); put(b,'road',C); R.movers.push(b); }
})();

/* ---------------- Quartier : immeubles, arbres et petit parc, des deux côtés ----------------
   Une seule texture de fenêtres (teintée par la couleur du mur), des formes simples. */
const WIN_TEX = (()=>{ const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
  x.fillStyle = '#fff'; x.fillRect(0,0,64,64); x.fillStyle = '#3d4a57'; x.fillRect(14,12,36,30); x.fillStyle = '#5d6b78'; x.fillRect(14,12,36,6);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })();
const BLD_COLS = [0xd9cbb4, 0xc7b9a6, 0xb98f78, 0xa7b0b3, 0xe3ddd0, 0xc49a7f, 0x9fa9a6];
const roofM = plastic(0x5a5f63,{roughness:0.9});
function building(w, d, h, col){            // w le long de la rue (x), d en profondeur (z)
  const wall = (rx, ry) => { const t = WIN_TEX.clone(); t.needsUpdate = true; t.repeat.set(rx, ry); return plastic(col,{map:t, roughness:0.85}); };
  const fx = wall(Math.round(d/3.2), Math.round(h/3)), fz = wall(Math.round(w/3.2), Math.round(h/3));
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [fx, fx, roofM, roofM, fz, fz]); m.position.y = h/2; return m;
}
const leafM = plastic(0x5f8a4a,{roughness:0.9, flatShading:true}), trunkM = plastic(0x6b5040,{roughness:1});
function tree(s=1){ const g = new THREE.Group(); g.add(at(cylY(0.12*s, 1.6*s, trunkM), 0, 0.8*s, 0));
  const f = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1*s, 0), leafM); f.position.y = 2.3*s; g.add(f); return g; }
let seed = 7; const rnd = ()=>{ seed = (seed*16807) % 2147483647; return (seed-1)/2147483646; };
// rangée le long de x : immeubles, avec parfois un trou de parc planté d'arbres. add(obj, x) place l'objet.
function streetRow(x0, x1, zFront, side, add){
  let x = x0;
  while(x < x1){
    if(rnd() < 0.18){ for(let k=0;k<3;k++) add(at(tree(0.8+rnd()*0.5), x + 1.5 + k*2.6, 0, zFront - side*(1.5 + rnd()*3)), x); x += 9; continue; }
    const w = 6 + rnd()*7, d = 8 + rnd()*4, h = 6 + Math.floor(rnd()*5)*3;
    const b = building(w, d, h, BLD_COLS[Math.floor(rnd()*BLD_COLS.length)]); b.position.x = x + w/2; b.position.z = zFront - side*d/2; add(b, x);
    x += w + 0.3;
  }
}
// route qui défile (vue normale) : les immeubles bougent avec les traits de la route, sur 50 m qui bouclent
(function scenery(){
  const add = o => { put(o, 'scenery', 'road'); R.movers.push(o); };
  streetRow(-25, 24, -5.2, 1, add); streetRow(-25, 24, 7.6, -1, add);
  for(let i=0;i<10;i++) add(at(tree(0.6), -24 + i*5 + 2.5, 0, -4.3));
})();

// Carrosserie « fil de fer » : les arêtes de la coque et des vitres, affichées seulement dans ce mode
BODY.wire = new THREE.LineBasicMaterial({color:0x6fa3e8, transparent:true, opacity:0.95});
BODY.wires = [];
LEAVES.filter(o=>o.isMesh && (o.material===BODY.paint || o.material===BODY.glass)).forEach(m=>{
  const l = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 6), BODY.wire);
  l.visible = false; l.raycast = ()=>{}; m.add(l); BODY.wires.push(l);
});

/* ---------------- Rue des vidéos « se garer » (fixe dans le monde, visible seulement pendant ces vidéos) ----------------
   Créneau : la voiture part de l'origine, cap +x, à côté de la voiture garée A, et finit garée derrière elle.
   Bataille : plus loin dans la rue (x ≈ 27-40), 5 places perpendiculaires au trottoir, en retrait.
   Trottoir côté droit (z négatif). */
const PARK = { on:false, delta:0, plan:null };       // delta : braquage « vélo » des roues avant (rad, + = à gauche)
const PARKG = new THREE.Group(); scene.add(PARKG);
const PARKED_Z = -2.46, KERB_Z = PARKED_Z - 0.88 - 0.25;
const BAY_W = 2.5, BAY_D = 5, BAY_X0 = 27.5, BAY_N = 5, BAY_KERB = KERB_Z - 3.5;   // places en bataille
const BAY_X = BAY_X0 + 2.5*BAY_W;                                                   // milieu de la place libre (la 3e)
const PARK_OBST = [];        // obstacles (rectangles vus de dessus : centre, demi-longueurs, cap) pour les chocs et les radars
(function street(){
  const K='parkscene', C='road', add = o => put(o, K, C, undefined, PARKG);
  const asph = new THREE.MeshStandardMaterial({color:0x474d52, roughness:1});
  const kerbM = plastic(0x9a9d99,{roughness:1}), walkM = plastic(0x80837e,{roughness:1}), grassM = plastic(0x6c8556,{roughness:1});
  const plane = (w, d, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI/2), asph); m.position.set(x, -0.002, z); add(m); };
  plane(100, 14, 10, KERB_Z + 7);
  PARK_OBST.push({x:10, z:KERB_Z + 14.5, hx:52, hz:0.5, th:0, wall:true}, {x:-40.5, z:0, hx:0.5, hz:20, th:0, wall:true}, {x:60.5, z:0, hx:0.5, hz:20, th:0, wall:true});   // bords de la rue
  // bordure, trottoir et pelouse de x1 à x2, bordure en zk
  function side(x1, x2, zk){ const w = x2-x1, cx = (x1+x2)/2; PARK_OBST.push({x:cx, z:zk-0.08, hx:w/2, hz:0.08, th:0, kerb:true});
    add(at(box(w, 0.14, 0.16, kerbM), cx, 0.07, zk - 0.08));
    add(at(box(w, 0.12, 3, walkM), cx, 0.06, zk - 1.66));
    add(at(box(w, 0.1, 14, grassM), cx, 0.05, zk - 10.16)); }
  const bx1 = BAY_X0 - 1.5, bx2 = BAY_X0 + BAY_N*BAY_W + 1.5;
  side(-40, bx1, KERB_Z); side(bx2, 60, KERB_Z); side(bx1, bx2, BAY_KERB);
  plane(bx2 - bx1, KERB_Z - BAY_KERB, (bx1+bx2)/2, (KERB_Z + BAY_KERB)/2);
  [bx1, bx2].forEach(x => { add(at(box(0.16, 0.14, KERB_Z - BAY_KERB + 3.2, kerbM), x, 0.07, (KERB_Z + BAY_KERB)/2 - 1.6));
    PARK_OBST.push({x, z:(KERB_Z + BAY_KERB)/2, hx:0.08, hz:(KERB_Z - BAY_KERB)/2, th:0, kerb:true}); });
  const paint = new THREE.MeshBasicMaterial({color:0xe8e4d4});
  const line = (w, d, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI/2), paint); m.position.set(x, 0.001, z); add(m); };
  line(bx1 + 40, 0.1, (bx1 - 40)/2, PARKED_Z + 1.2);                                                // limite des places en créneau
  [-8.6, -2.5, 2.7].forEach(x => line(0.1, 2.0, x, PARKED_Z + 0.2));                                 // séparations
  for(let i=0;i<=BAY_N;i++) line(0.1, BAY_D, BAY_X0 + i*BAY_W, BAY_KERB + BAY_D/2);                 // places en bataille
  for(let i=0;i<20;i++) line(1.4, 0.1, -36 + i*5, 2.6);                                              // axe de la rue
  for(let i=0;i<5;i++){ const lamp = new THREE.Group();                                              // lampadaires
    lamp.add(at(cylY(0.05, 3.2, plastic(0x3a4045)), 0, 1.6, 0)); lamp.add(at(box(0.5, 0.08, 0.18, plastic(0x3a4045)), 0.2, 3.2, 0.05));
    at(lamp, -26 + i*12, 0.12, KERB_Z - 0.5); add(lamp); }
  // voitures garées : génériques, volontairement simples (x, z = centre ; rot = cap)
  function parkedCar(x, z, col, rot=0){
    const g = new THREE.Group(), body = plastic(col,{roughness:0.45}), dark = plastic(0x1d2226,{roughness:0.9}), win = plastic(0x27333d,{roughness:0.15});
    g.add(at(box(4.2, 0.6, 1.74, body), 0, 0.58, 0));
    g.add(at(box(2.2, 0.46, 1.58, win), -0.3, 1.1, 0));
    g.add(at(box(2.0, 0.06, 1.5, body), -0.35, 1.35, 0));
    [[1.28,1],[1.28,-1],[-1.3,1],[-1.3,-1]].forEach(([wx,sg]) => g.add(at(cylZ(0.31, 0.2, dark), wx, 0.31, sg*0.78)));
    [1,-1].forEach(sg => { g.add(at(box(0.04, 0.1, 0.3, plastic(0xf3f6f8)), 2.1, 0.7, sg*0.6)); g.add(at(box(0.04, 0.12, 0.26, plastic(0x8d1010)), -2.1, 0.78, sg*0.6)); });
    at(g, x, 0, z); g.rotation.y = rot; add(g);
    PARK_OBST.push({x, z, hx:2.1, hz:0.87, th:-rot});
  }
  // le quartier autour : immeubles derrière le trottoir (avec un parc), et de l'autre côté de la rue
  seed = 11; streetRow(-40, 58, KERB_Z - 7, 1, o => add(o));
  add(at(box(100, 0.12, 3, walkM), 10, 0.06, KERB_Z + 15.5)); add(at(box(100, 0.1, 14, grassM), 10, 0.05, KERB_Z + 24));
  streetRow(-40, 58, KERB_Z + 19, -1, o => add(o));
  parkedCar(0.02, PARKED_Z, 0x8d969c);      // créneau, A : la voiture de devant (son arrière est en x = -2,08, comme le nôtre au départ)
  parkedCar(-11.1, PARKED_Z, 0x7a2a2e);     // créneau, B : la voiture de derrière
  parkedCar(5.4, PARKED_Z, 0x2f4a5c);
  const bayZ = BAY_KERB + 0.3 + 2.1;        // bataille : nez à 30 cm de la bordure
  parkedCar(BAY_X - BAY_W, bayZ, 0x7a2a2e, Math.PI/2);   // à droite de la place libre
  parkedCar(BAY_X + BAY_W, bayZ, 0x8d969c, Math.PI/2);   // à gauche
})();
