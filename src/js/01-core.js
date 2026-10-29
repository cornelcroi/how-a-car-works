(function(){
"use strict";
const $ = id => document.getElementById(id);
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
const lerp = (a,b,t)=>a+(b-a)*t;
const TAU = Math.PI*2, RPM = 60/TAU, DEG = Math.PI/180;

/* ================= Langue (fr par défaut, en) ================= */
// ?lang=en|fr > choix mémorisé > langue du navigateur. Changer de langue recharge la page.
const LANG = (()=>{
  const q = new URLSearchParams(location.search).get('lang');
  if(q==='fr'||q==='en') return q;
  try{ const s = localStorage.getItem('lang'); if(s==='fr'||s==='en') return s; }catch(e){}
  return /^fr\b/i.test(navigator.language||'fr') ? 'fr' : 'en';
})();
const IS_EN = LANG==='en';
const tr = (frText, enText)=> IS_EN ? enText : frText;
const fr = (x,d=1)=> IS_EN ? x.toFixed(d) : x.toFixed(d).replace('.',',');   // nombre formaté selon la langue
if(IS_EN){
  document.documentElement.lang = 'en';
  document.title = 'Garage & Road';
  document.querySelectorAll('[data-en]').forEach(el=>{ el.innerHTML = el.dataset.en; });
  document.querySelectorAll('[data-en-label]').forEach(el=>{ el.setAttribute('aria-label', el.dataset.enLabel); });
}
$('langBtn').textContent = IS_EN ? 'Français' : 'English';
$('langBtn').addEventListener('click', ()=>{
  const next = IS_EN ? 'fr' : 'en';
  try{ localStorage.setItem('lang', next); }catch(e){}
  const u = new URL(location.href); u.searchParams.set('lang', next); location.href = u.href;
});

/* ================= Scène ================= */
const canvas = $('c'), stage = $('stage');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio||1));
renderer.setClearColor(0x000000, 0);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 120);
camera.position.set(4.3, 2.3, 3.2);
const controls = new THREE.OrbitControls(camera, canvas);
controls.target.set(0.5, 0.5, 0);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.minDistance = 0.08; controls.maxDistance = 16;
controls.update();

scene.add(new THREE.HemisphereLight(0xffffff, 0x556070, 0.85));
const sun = new THREE.DirectionalLight(0xffffff, 0.85); sun.position.set(3,5,3); scene.add(sun);
const fillL = new THREE.DirectionalLight(0xbfd4ff, 0.4); fillL.position.set(-3,1.5,-3); scene.add(fillL);
const under = new THREE.DirectionalLight(0xffffff, 0.3); under.position.set(0,-3,1); scene.add(under);
scene.fog = new THREE.Fog(0xd5ddd9, 10, 26);

/* ================= Registre des pièces ================= */
// Chaque maillage porte : part (clé de fiche), cat (catégorie d'affichage), mode (manual / auto / tous)
const LEAVES = [];
function reg(obj, part, cat, mode){
  obj.traverse(o=>{
    if(o.isMesh || o.isLine || o.isPoints){
      if(o.userData.part===undefined) o.userData.part = part;
      if(o.userData.cat===undefined) o.userData.cat = cat;
      if(o.userData.mode===undefined) o.userData.mode = mode;
      if(!LEAVES.includes(o)) LEAVES.push(o);
    }
  });
  return obj;
}
const ROOT = new THREE.Group(); scene.add(ROOT);
function put(obj, part, cat, mode, parent=ROOT){ parent.add(obj); return reg(obj, part, cat, mode); }

/* ================= Matériaux ================= */
const POWER = new THREE.Color(0xff6a1a);
const metal = (color, o={}) => new THREE.MeshStandardMaterial(Object.assign({color, metalness:0.55, roughness:0.42}, o));
const plastic = (color, o={}) => new THREE.MeshStandardMaterial(Object.assign({color, metalness:0.05, roughness:0.7}, o));
const glass = (color, op) => new THREE.MeshStandardMaterial({color, transparent:true, opacity:op, depthWrite:false, roughness:0.3, metalness:0.1, side:THREE.DoubleSide});
const lineMat = (color, op) => new THREE.LineBasicMaterial({color, transparent:true, opacity:op});
const M = {
  steel: metal(0x9aa3ab,{metalness:0.75,roughness:0.3}), dark: metal(0x3a4146), alu: metal(0xc3c9ce,{metalness:0.6,roughness:0.35}),
  cast: metal(0x6d757c,{metalness:0.5,roughness:0.6}), black: plastic(0x1e2225), rubber: plastic(0x1b1e20,{roughness:0.95}),
  copper: metal(0xb87333,{metalness:0.7}), gold: metal(0xc79b4a,{metalness:0.75,roughness:0.3}), white: plastic(0xeeeeea),
};
const glowSets = {};   // nom -> [matériaux] : s'illuminent quand la force passe
function gm(set, base){ const m = base.clone(); (glowSets[set] = glowSets[set]||[]).push(m); return m; }
function setGlow(set, v){ (glowSets[set]||[]).forEach(m=>{ m.emissive.copy(POWER); m.emissiveIntensity = v; }); }

/* ================= Formes de base ================= */
const cylX = (r,len,m,seg=24)=>{ const g=new THREE.CylinderGeometry(r,r,len,seg); g.rotateZ(Math.PI/2); return new THREE.Mesh(g,m); };
const cylY = (r,len,m,seg=24)=> new THREE.Mesh(new THREE.CylinderGeometry(r,r,len,seg), m);
const cylZ = (r,len,m,seg=24)=>{ const g=new THREE.CylinderGeometry(r,r,len,seg); g.rotateX(Math.PI/2); return new THREE.Mesh(g,m); };
const box = (sx,sy,sz,m)=> new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz), m);
const edges = (geo,color,op)=> new THREE.LineSegments(new THREE.EdgesGeometry(geo,20), lineMat(color,op));
function at(o,x,y,z){ o.position.set(x,y,z); return o; }
function tubeZ(rOut, rIn, len, m, seg=32){ // tube creux le long de z, centré
  const s=new THREE.Shape(); s.absarc(0,0,rOut,0,TAU,false); const h=new THREE.Path(); h.absarc(0,0,rIn,0,TAU,true); s.holes.push(h);
  const g=new THREE.ExtrudeGeometry(s,{depth:len,bevelEnabled:false,curveSegments:seg}); g.translate(0,0,-len/2); return new THREE.Mesh(g,m);
}
const UPV = new THREE.Vector3(0,1,0);
function between(a, b, r, m, seg=12){ // cylindre entre deux points
  const d=b.clone().sub(a), L=d.length(); const me=new THREE.Mesh(new THREE.CylinderGeometry(r,r,L,seg), m);
  me.position.copy(a).add(b).multiplyScalar(0.5); me.quaternion.setFromUnitVectors(UPV, d.normalize()); return me;
}
function spring(a, b, R, turns, wire, m){ // ressort hélicoïdal de a vers b
  const d=b.clone().sub(a), L=d.length(), pts=[];
  for(let i=0;i<=turns*24;i++){ const t=i/(turns*24), an=t*turns*TAU; pts.push(new THREE.Vector3(Math.cos(an)*R, t*L - L/2, Math.sin(an)*R)); }
  const me = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), turns*24, wire, 6, false), m);
  me.position.copy(a).add(b).multiplyScalar(0.5); me.quaternion.setFromUnitVectors(UPV, d.normalize()); return me;
}

/* ================= Engrenages qui s'engrènent vraiment =================
   Toutes les roues tournent autour de z. La dent n°k est centrée sur l'angle k·2π/N (+ rotation).
   Deux roues de même pas, à distance rpA + rpB, s'engrènent si :
   θB = ψ + π − π/NB − (NA/NB)(θA − ψ)   avec ψ = direction de A vers B. */
const pitchR = (N, p) => N*p/TAU;
function gearShape(N, p, inner){
  const m=p/Math.PI, R=pitchR(N,p), d=TAU/N;
  const ro = inner ? R - m : R + m, ri = inner ? R + 1.25*m : R - 1.25*m;
  const pts=[];
  for(let i=0;i<N;i++){ const c=i*d;
    [[ri,c-0.32*d],[ro,c-0.13*d],[ro,c+0.13*d],[ri,c+0.32*d]].forEach(([r,a])=>pts.push(new THREE.Vector2(r*Math.cos(a), r*Math.sin(a)))); }
  return pts;
}
function gearZ(N, p, width, hole, m){
  const s = new THREE.Shape(gearShape(N,p,false));
  if(hole>0){ const h=new THREE.Path(); h.absarc(0,0,hole,0,TAU,true); s.holes.push(h); }
  const g = new THREE.ExtrudeGeometry(s,{depth:width,bevelEnabled:false,curveSegments:12}); g.translate(0,0,-width/2); g.computeVertexNormals();
  const me = new THREE.Mesh(g, m); me.userData.N=N; return me;
}
function ringGearZ(N, p, width, outer, m){ // couronne à denture intérieure
  const s = new THREE.Shape(); s.absarc(0,0,outer,0,TAU,false);
  const pts = gearShape(N,p,true).reverse(); s.holes.push(new THREE.Path(pts));
  const g = new THREE.ExtrudeGeometry(s,{depth:width,bevelEnabled:false,curveSegments:48}); g.translate(0,0,-width/2); g.computeVertexNormals();
  return new THREE.Mesh(g, m);
}
const meshAng = (thA, NA, psi, NB) => psi + Math.PI - Math.PI/NB - (NA/NB)*(thA - psi);
// roue intérieure (satellite) vers couronne : même sens de rotation
const ringFromPlanet = (thPrel, Np, beta, Nr) => (beta - Math.PI/Nr) + (Np/Nr)*(thPrel - beta);
