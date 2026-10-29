
/* ---------------- Voiture électrique : batterie, onduleur, moteur synchrone, réducteur ---------------- */
const EV = { n1:17, n2:45, poles:4, slots:9, Tmax:290, Pmax:100000, rpmMax:12000, kWh:35.8 };
const EV_R1 = EV.n2/EV.n1;                              // 1er étage du réducteur (puis pont 17/63)
const EV_TOTAL = EV_R1*FD;
R.ev = {coils:[]};
(function evModel(){
  const MODE='ev', C='ev';
  // moteur : carcasse, stator avec bobines, rotor à aimants
  const case_ = new THREE.Mesh(new THREE.CylinderGeometry(0.135,0.135,0.24,48,1,true), glass(0x9fb0bc,0.14)); case_.geometry.rotateX(Math.PI/2);
  at(case_, IX, IY, -0.14); put(case_,'evstator',C,MODE);
  put(at(edges(new THREE.CylinderGeometry(0.135,0.135,0.24,24,1,true).rotateX(Math.PI/2),0x7d95a8,0.35), IX, IY, -0.14),'evstator',C,MODE);
  const core = at(tubeZ(0.128, 0.11, 0.2, metal(0x6c757c,{metalness:0.6,transparent:true,opacity:0.55,depthWrite:false})), IX, IY, -0.14); put(core,'evstator',C,MODE);
  const PH_COL = [0xff5a2a, 0x2fd06a, 0x3a8dff];
  for(let k=0;k<EV.slots;k++){
    const a = k*TAU/EV.slots, ph = k%3;
    const g = new THREE.Group(); at(g, IX, IY, -0.14); g.rotation.z = a;
    const tooth = box(0.04, 0.022, 0.2, metal(0x7a838a)); tooth.position.x = 0.092; g.add(tooth);
    const mat = new THREE.MeshStandardMaterial({color:0xb87333, metalness:0.6, roughness:0.35, emissive:PH_COL[ph], emissiveIntensity:0});
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 8, 20), mat); coil.scale.set(0.75,1,3.1); coil.position.x = 0.094; coil.rotation.y = Math.PI/2; g.add(coil);
    put(g,'evcoil',C,MODE); R.ev.coils.push({mat, a, ph});
  }
  R.ev.rotor = new THREE.Group(); at(R.ev.rotor, IX, IY, 0);
  const rm = gm('ev', metal(0x9aa3ab,{metalness:0.7}));
  const rc = cylZ(0.066, 0.2, rm, 40); rc.position.z = -0.14; R.ev.rotor.add(rc);
  for(let k=0;k<EV.poles*2;k++){ const a=k*TAU/(EV.poles*2); const mg=box(0.012,0.04,0.19, plastic(k%2?0x2a6fd6:0xd33b2c,{roughness:0.4}));
    mg.position.set(Math.cos(a)*0.066, Math.sin(a)*0.066, -0.14); mg.rotation.z=a; R.ev.rotor.add(mg); }
  const sh = cylZ(0.016, 0.42, rm); sh.position.z = -0.04; R.ev.rotor.add(sh);
  const p1 = gearZ(EV.n1, P62, 0.022, 0.01, rm); p1.position.z = 0.12; R.ev.rotor.add(p1);
  put(R.ev.rotor,'evrotor',C,MODE);
  // réducteur : arbre intermédiaire avec grande roue et pignon d'attaque
  R.ev.mid = new THREE.Group(); at(R.ev.mid, OX, OY, 0);
  const om = gm('ev', metal(0xb3bac0,{metalness:0.7}));
  R.ev.mid.add(at(gearZ(EV.n2, P62, 0.022, 0.012, om),0,0,0.12));
  R.ev.mid.add(at(cylZ(0.016, 0.38, om),0,0,0.29));
  R.ev.mid.add(at(gearZ(FD_N[0], PFD, 0.028, 0.01, om),0,0,0.44));
  put(R.ev.mid,'reducer',C,MODE);
  const rg = new THREE.BoxGeometry(0.43, 0.3, 0.42); const rcs = at(new THREE.Mesh(rg, glass(0x9fb0bc,0.08)), 1.29, 0.36, 0.28); put(rcs,'reducer',C,MODE);
  put(at(edges(rg,0x7d95a8,0.4),1.29,0.36,0.28),'reducer',C,MODE);
  // onduleur
  const inv = new THREE.Group(); at(inv, IX+0.01, 0.63, -0.14);
  inv.add(box(0.24, 0.09, 0.3, metal(0xaab2b8,{metalness:0.5,roughness:0.4})));
  for(let k=0;k<6;k++) inv.add(at(box(0.24,0.012,0.006,metal(0x7a838a)),0,0.05,-0.12+k*0.048));
  [-0.06,0,0.06].forEach((dz,i)=>{ inv.add(at(cylY(0.012,0.12,plastic(0xff7a1a)),-0.05,-0.09,dz)); });
  put(inv,'inverter',C,MODE); R.ev.inv = inv;
  // batterie sous le plancher : 24 modules
  const pack = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.BoxGeometry(1.9,0.15,1.24), glass(0x5c7a8e,0.22)); pack.add(shell);
  pack.add(edges(new THREE.BoxGeometry(1.9,0.15,1.24),0x5c7a8e,0.6));
  R.ev.mods = [];
  for(let i=0;i<6;i++) for(let j=0;j<4;j++){ const m=new THREE.MeshStandardMaterial({color:0x2c4a63, metalness:0.3, roughness:0.5, emissive:0x2fd06a, emissiveIntensity:0});
    const b=box(0.28,0.11,0.27,m); b.position.set(-0.8+i*0.32, 0, -0.45+j*0.3); pack.add(b); R.ev.mods.push(m); }
  at(pack, -0.08, 0.2, 0); put(pack,'hvbat',C,MODE);
  // câbles haute tension (orange) et flux d'énergie
  const path = new THREE.CatmullRomCurve3([new THREE.Vector3(0.86,0.2,-0.2), new THREE.Vector3(1.05,0.22,-0.25), new THREE.Vector3(1.18,0.45,-0.3), new THREE.Vector3(1.26,0.62,-0.22)]);
  put(new THREE.Mesh(new THREE.TubeGeometry(path,40,0.012,8,false), plastic(0xff7a1a,{roughness:0.5})),'hvcable',C,MODE);
  const path2 = new THREE.CatmullRomCurve3([new THREE.Vector3(0.86,0.2,-0.1), new THREE.Vector3(1.07,0.22,-0.14), new THREE.Vector3(1.2,0.45,-0.18), new THREE.Vector3(1.26,0.62,-0.08)]);
  put(new THREE.Mesh(new THREE.TubeGeometry(path2,40,0.012,8,false), plastic(0xff7a1a,{roughness:0.5})),'hvcable',C,MODE);
  const n=36, pos=new Float32Array(n*3), geo=new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const pm = new THREE.PointsMaterial({color:0xffb347, size:0.03, transparent:true, opacity:0, depthWrite:false});
  const pts = new THREE.Points(geo, pm); put(pts,'hvcable',C,MODE);
  R.ev.flow = {pts, pos, pm, paths:[path,path2], u:Array.from({length:n},(_,i)=>i/n)};
  // prise de recharge (à l'arrière droit)
  const port = new THREE.Group(); at(port, -1.62, 0.93, -0.86);
  port.add(cylX(0.035,0.02,plastic(0x23272a))); port.add(at(cylX(0.022,0.022,plastic(0x2a6fd6)),0.004,0,0));
  put(port,'chargeport',C,MODE);
})();
