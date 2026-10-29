
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
  const indM = new THREE.MeshStandardMaterial({color:0xd98a1a, emissive:0xff9a1a, emissiveIntensity:0.05, roughness:0.3});
  R.lights.head=headM; R.lights.tail=tailM; R.lights.rev=revM;
  [1,-1].forEach(sg=>{
    const h=new THREE.Group(); at(h,2.04,0.66,sg*0.57); h.rotation.y = sg*0.5;
    h.add(box(0.06,0.1,0.3,BODY.trim)); h.add(at(cylX(0.038,0.02,headM),0.03,0,sg*0.05)); h.add(at(cylX(0.03,0.02,headM),0.03,0,-sg*0.07));
    h.add(at(box(0.065,0.1,0.3,glass(0xeaf2f8,0.25)),0.005,0,0)); h.add(at(box(0.02,0.03,0.06,indM),0.03,-0.03,sg*0.12));
    put(h,'headlight',C);
    const fog=at(cylX(0.03,0.02,headM),2.125,0.32,sg*0.55); put(fog,'headlight',C);
    const t=new THREE.Group(); at(t,-2.04,0.89,sg*0.6); t.rotation.y = -sg*0.35;
    t.add(box(0.06,0.12,0.26,tailM)); t.add(at(box(0.062,0.04,0.08,revM),0,-0.03,-sg*0.06));
    put(t,'taillight',C);
    const sl=new THREE.SpotLight(0xfff3d6, 0, 22, 0.42, 0.5, 1.2); sl.position.set(2.1,0.66,sg*0.57); sl.target.position.set(9,0,sg*0.9); scene.add(sl); scene.add(sl.target); (R.lights.spots=R.lights.spots||[]).push(sl);
  });
  put(at(box(0.03,0.025,0.25,tailM),-1.95,1.235,0),'taillight',C);
})();

/* ---------------- Route ---------------- */
R.movers=[];
(function road(){
  const C='road';
  const rd = new THREE.Mesh(new THREE.PlaneGeometry(50, 4.6).rotateX(-Math.PI/2), new THREE.MeshStandardMaterial({color:0x474d52, roughness:1})); rd.position.set(0,-0.001,0.6); put(rd,'road',C);
  const lm = new THREE.MeshBasicMaterial({color:0xe8e4d4});
  [-1.6, 2.8].forEach(z=>{ const l=new THREE.Mesh(new THREE.PlaneGeometry(50,0.1).rotateX(-Math.PI/2), lm); l.position.set(0,0.001,z); put(l,'road',C); });
  for(let i=0;i<18;i++){ const d=new THREE.Mesh(new THREE.PlaneGeometry(1.4,0.1).rotateX(-Math.PI/2), lm); d.position.set(-24+i*2.8,0.002,1.6); put(d,'road',C); R.movers.push(d); }
  for(let i=0;i<10;i++){ const p=new THREE.Group();
    p.add(at(cylY(0.03,0.7,new THREE.MeshStandardMaterial({color:0xeeeeea,roughness:0.7})),0,0.35,0));
    p.add(at(box(0.02,0.1,0.065,new THREE.MeshBasicMaterial({color:0xff5a1f})),0,0.6,0.03));
    p.position.set(-24+i*5,0,-2.1); put(p,'road',C); R.movers.push(p); }
})();
