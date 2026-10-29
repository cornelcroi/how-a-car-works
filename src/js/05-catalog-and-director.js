
/* ======================================================================
   FICHES DES PIÈCES
   ====================================================================== */
const ENG_IN = ['pistons','rods','crank','spark','coil','valvein','valveex','camin','camex','belt','flywheel'];
const CLUTCH_SET = ['flywheel','disc','pressure','diaphragm','bearing','fork'];
const TC_SET = ['tcimpeller','tcturbine','tcstator','tclockup','tcoil','flywheel'];
const MBOX = ['mainshaft','outshaft','gear1','gear2','gear3','gear4','gear5','gear6','gearR','synchro'];
const ABOX = ['autoshaft','pg1','ravigneaux','elK1','elK2','elK3','elB1','elB2','transfer'];
const INFO = {
  block:{t:'Bloc moteur', a:[EN.xc+0.09,0.45,-0.33], l:1, p:'La grosse pièce en fonte qui contient les 4 cylindres, où les pistons montent et descendent. De l\'eau circule tout autour pour le refroidir.'},
  head:{t:'Culasse', a:[EN.xc+0.09,0.68,-0.33], l:2, p:'Le « couvercle » des cylindres. Elle contient les soupapes, les bougies et les arbres à cames. C\'est là que l\'essence explose.'},
  valvecover:{t:'Couvre-culasse', a:[EN.xc,0.78,0.06], l:2, p:'Le capot en plastique sur le dessus du moteur. Il garde l\'huile à l\'intérieur, autour des arbres à cames.'},
  sump:{t:'Carter d\'huile', a:[EN.xc+0.08,0.22,-0.1], l:2, p:'Le réservoir d\'huile sous le moteur. Une pompe envoie cette huile partout pour que les pièces glissent sans s\'user.'},
  timingcover:{t:'Cache de distribution', a:[EN.xc+0.12,0.75,-0.36], l:2, p:'Un cache en plastique qui protège la courroie de distribution. Touche « Carter moteur » pour l\'enlever.'},
  intake:{t:'Collecteur d\'admission', a:[EN.xc+0.25,0.62,-0.3], l:2, p:'Les tuyaux qui amènent l\'air jusqu\'aux cylindres. Chaque cylindre a son propre tuyau.'},
  throttle:{t:'Papillon des gaz', a:[EN.xc+0.2,0.6,0.15], l:2, p:'Une petite porte ronde qui s\'ouvre quand tu appuies sur l\'accélérateur. Plus elle est ouverte, plus d\'air entre, plus le moteur pousse fort. Regarde-la tourner quand tu accélères !'},
  exhaustmani:{t:'Collecteur d\'échappement', a:[EN.xc-0.18,0.62,0.02], l:2, p:'Les 4 tuyaux qui récupèrent les gaz brûlés de chaque cylindre et les rassemblent en un seul.'},
  catalyst:{t:'Catalyseur', a:[EN.xc-0.24,0.38,-0.13], l:2, p:'Une boîte remplie d\'une sorte d\'éponge en céramique avec des métaux précieux. Elle rend les gaz d\'échappement beaucoup moins polluants.'},
  crank:{t:'Vilebrequin', a:[EN.xc+0.02,EN.yc-0.08,-0.33], l:2, with:['pistons','rods','flywheel'], p:'Il transforme le mouvement de haut en bas des pistons en rotation, comme tes jambes font tourner les pédales d\'un vélo. Les masses rondes (contrepoids) l\'équilibrent.'},
  pistons:{t:'Pistons', a:[EN.xc,0.6,-0.3], l:1, with:['rods','crank','spark'], p:'4 pistons de 82,5 mm de diamètre qui montent et descendent de 92,8 mm. Chacun fait 4 temps : il aspire l\'air et l\'essence, il comprime, BOUM ça explose et le pousse vers le bas, puis il chasse les gaz brûlés.'},
  rods:{t:'Bielles', a:[EN.xc+0.03,0.5,-0.176], l:2, with:['pistons','crank'], p:'Les « bras » qui relient chaque piston au vilebrequin. Elles poussent et tirent des milliers de fois par minute.'},
  spark:{t:'Bougies d\'allumage', a:[EN.xc,0.72,-0.088], l:1, with:['coil','pistons'], p:'Au centre de chaque cylindre, une bougie fait une étincelle juste quand le piston est tout en haut. L\'ordre est 1-3-4-2 : un cylindre s\'allume à chaque demi-tour du vilebrequin. Regarde la petite flamme orange !'},
  coil:{t:'Bobines d\'allumage', a:[EN.xc,0.83,0.0], l:2, with:['spark'], p:'Une bobine posée sur chaque bougie. Elle transforme les 12 volts de la batterie en plus de 20 000 volts pour faire jaillir l\'étincelle.'},
  camin:{t:'Arbre à cames d\'admission', a:[EN.xc+VX,0.74,-0.2], l:2, with:['camex','valvein','valveex','belt'], p:'Ses bosses (les cames) appuient sur les soupapes pour les ouvrir au bon moment. Il tourne 2 fois moins vite que le vilebrequin, grâce à la courroie.'},
  camex:{t:'Arbre à cames d\'échappement', a:[EN.xc-VX,0.74,-0.2], l:2, with:['camin','valvein','valveex','belt'], p:'Il ouvre les soupapes d\'échappement. Les deux arbres à cames sont reliés par deux petits engrenages, c\'est pour ça qu\'ils tournent en sens inverse.'},
  valvein:{t:'Soupapes d\'admission', a:[EN.xc+VX+0.02,0.64,-0.25], l:2, with:['camin','pistons'], p:'2 par cylindre, côté avant. Elles s\'ouvrent pour laisser entrer l\'air pendant que le piston descend. Un ressort les referme.'},
  valveex:{t:'Soupapes d\'échappement', a:[EN.xc-VX-0.02,0.64,-0.25], l:2, with:['camex','pistons'], p:'2 par cylindre, côté arrière. Elles s\'ouvrent pour laisser sortir les gaz brûlés pendant que le piston remonte.'},
  belt:{t:'Courroie de distribution', a:[EN.xc+0.07,0.45,-0.35], l:1, with:['crank','camin','camex','valvein','valveex','pistons'], p:'Une courroie crantée qui relie le vilebrequin à l\'arbre à cames. Le pignon du haut a 2 fois plus de dents : les soupapes s\'ouvrent une fois tous les 2 tours. Si elle casse, le moteur s\'arrête net.'},
  flywheel:{t:'Volant moteur', a:[EN.xc,EN.yc+0.16,0.07], l:1, with:['starter','crank'], p:'Un disque lourd au bout du vilebrequin. Il aide le moteur à tourner régulièrement entre deux explosions. Sa couronne dentée sert au démarreur.'},
  starter:{t:'Démarreur', a:[STX,STY+0.05,0.25], l:2, with:['flywheel','battery'], p:'Un moteur électrique alimenté par la batterie. Quand tu tournes la clé, son petit pignon avance, s\'engrène sur la couronne du volant moteur et le fait tourner, puis il recule.'},
  disc:{t:'Disque d\'embrayage', mode:'manual', a:[EN.xc,EN.yc+0.135,0.084], l:1, with:CLUTCH_SET, p:'Un disque recouvert d\'une garniture qui accroche, fixé sur l\'arbre de la boîte. Serré contre le volant moteur, il tourne avec le moteur. Ses petits ressorts amortissent les à-coups.'},
  pressure:{t:'Mécanisme d\'embrayage', mode:'manual', a:[EN.xc+0.1,EN.yc+0.08,0.1], l:2, with:CLUTCH_SET, p:'Le plateau de pression et son couvercle, vissés sur le volant moteur. Le plateau serre le disque très fort contre le volant moteur.'},
  diaphragm:{t:'Diaphragme', mode:'manual', a:[EN.xc-0.05,EN.yc+0.07,0.114], l:2, with:CLUTCH_SET, p:'Un grand ressort en forme d\'assiette, avec des doigts. Au repos, il pousse le plateau pour serrer le disque. Quand la butée appuie sur ses doigts, il se retourne et libère le disque.'},
  bearing:{t:'Butée d\'embrayage', mode:'manual', a:[EN.xc,EN.yc-0.05,0.125], l:2, with:CLUTCH_SET, p:'Un roulement qui avance contre les doigts du diaphragme quand tu appuies sur la pédale.'},
  fork:{t:'Fourchette d\'embrayage', mode:'manual', a:[EN.xc-0.12,EN.yc+0.03,0.135], l:2, with:CLUTCH_SET, p:'Le levier que la pédale fait bouger (par un tuyau d\'huile). Il pousse la butée.'},
  tcimpeller:{t:'Convertisseur : pompe', mode:'auto', a:[EN.xc,EN.yc+0.15,0.13], l:1, with:TC_SET, p:'Le convertisseur de couple remplace l\'embrayage. La pompe tourne avec le moteur et projette de l\'huile, comme un ventilateur qui soufflerait de l\'huile.'},
  tcturbine:{t:'Convertisseur : turbine', mode:'auto', a:[EN.xc+0.08,EN.yc+0.1,0.09], l:2, with:TC_SET, p:'L\'huile projetée par la pompe vient frapper ses aubes et la fait tourner. Elle est reliée à la boîte. À l\'arrêt, elle peut rester immobile pendant que le moteur tourne : c\'est pour ça qu\'une auto ne cale pas.'},
  tcstator:{t:'Convertisseur : réacteur', mode:'auto', a:[EN.xc-0.07,EN.yc-0.02,0.12], l:2, with:TC_SET, p:'La petite roue du milieu. Elle redresse l\'huile qui revient vers la pompe. Au démarrage, cela double presque la force !'},
  tclockup:{t:'Embrayage de pontage', mode:'auto', a:[EN.xc-0.08,EN.yc+0.08,0.06], l:2, with:TC_SET, p:'À vitesse stable, ce disque se colle et relie directement le moteur à la boîte, pour ne plus perdre d\'énergie dans l\'huile.'},
  tcoil:{t:'Huile du convertisseur', mode:'auto', l:2, with:TC_SET, p:'Les points orange montrent l\'huile qui tourne en rond entre la pompe, la turbine et le réacteur.'},
  gbcase:{t:'Boîte de vitesses', a:[1.29,0.53,0.32], l:1, p:'Elle contient les engrenages qui changent la vitesse de rotation entre le moteur et les roues, et le différentiel. Touche les engrenages à l\'intérieur pour les découvrir.'},
  mainshaft:{t:'Arbre primaire', mode:'manual', a:[IX,IY+0.06,0.42], l:2, with:MBOX, p:'L\'arbre qui sort de l\'embrayage. Ses 6 pignons font tourner en permanence les 6 pignons de l\'arbre secondaire.'},
  outshaft:{t:'Arbre secondaire', mode:'manual', a:[OX,OY-0.06,0.43], l:2, with:MBOX.concat(['diff']), p:'Ses pignons tournent fou, sauf celui qui est verrouillé par un baladeur. Au bout, un petit pignon (le pignon d\'attaque) entraîne la couronne du différentiel.'},
  synchro:{t:'Baladeurs (synchros)', mode:'manual', a:[OX,OY+0.07,0.3], l:2, with:MBOX, p:'Les anneaux bleus. Quand tu bouges le levier, une fourchette fait glisser un anneau qui verrouille un pignon sur l\'arbre. Un petit cône (le synchro) égalise d\'abord les vitesses pour que ça ne craque pas.'},
  gear1:{t:'Pignons de 1re', mode:'manual', with:MBOX, p:'13 dents font tourner 49 dents : les roues tournent 3,8 fois moins vite que le moteur mais avec beaucoup de force. Pour démarrer.'},
  gear2:{t:'Pignons de 2e', mode:'manual', with:MBOX, p:'20 dents pour 42 dents : rapport 2,1.'},
  gear3:{t:'Pignons de 3e', mode:'manual', with:MBOX, p:'26 dents pour 36 dents : rapport 1,38.'},
  gear4:{t:'Pignons de 4e', mode:'manual', with:MBOX, p:'30 dents pour 32 dents : presque la même vitesse que le moteur.'},
  gear5:{t:'Pignons de 5e', mode:'manual', with:MBOX, p:'33 dents pour 29 dents : la sortie tourne plus vite que le moteur.'},
  gear6:{t:'Pignons de 6e', mode:'manual', with:MBOX, p:'36 dents pour 26 dents : pour l\'autoroute, le moteur tourne lentement et consomme peu.'},
  gearR:{t:'Marche arrière', mode:'manual', with:MBOX, p:'Un pignon en plus (le doré) se glisse entre les deux arbres et inverse le sens de rotation.'},
  autoshaft:{t:'Arbre d\'entrée', mode:'auto', a:[IX,IY+0.05,0.4], l:2, with:ABOX, p:'Il sort de la turbine du convertisseur et entraîne les trains épicycloïdaux.'},
  pg1:{t:'Train épicycloïdal simple', mode:'auto', a:[IX,IY+0.1,0.175], l:2, with:ABOX, p:'Un soleil au centre (bloqué), 3 satellites autour, et une couronne dentée à l\'intérieur. La couronne, entraînée par le moteur, fait tourner le porte-satellites 1,55 fois moins vite.'},
  ravigneaux:{t:'Train Ravigneaux', mode:'auto', a:[IX,IY-0.1,0.3], l:2, with:ABOX, p:'Deux soleils, des satellites courts et longs, une seule couronne qui sort vers les roues. Selon ce qu\'on bloque ou qu\'on relie, il donne 6 vitesses et la marche arrière. Pas besoin de déplacer d\'engrenages !'},
  elK1:{t:'Embrayage K1', mode:'auto', with:ABOX, p:'Relie le train simple au petit soleil du Ravigneaux. Serré en 1re, 2e, 3e et 4e.'},
  elK2:{t:'Embrayage K2', mode:'auto', with:ABOX, p:'Relie l\'arbre d\'entrée au porte-satellites du Ravigneaux. Serré en 4e, 5e et 6e.'},
  elK3:{t:'Embrayage K3', mode:'auto', with:ABOX, p:'Relie le train simple au grand soleil. Serré en 3e, 5e et marche arrière.'},
  elB1:{t:'Frein B1', mode:'auto', with:ABOX, p:'Bloque le grand soleil. Serré en 2e et 6e.'},
  elB2:{t:'Frein B2', mode:'auto', with:ABOX, p:'Bloque le porte-satellites. Serré en 1re et marche arrière.'},
  transfer:{t:'Arbre de transfert', mode:'auto', a:[OX,OY-0.06,0.4], l:2, with:ABOX.concat(['diff']), p:'La couronne du Ravigneaux entraîne cet arbre, qui porte le pignon d\'attaque du différentiel.'},
  diff:{t:'Pont et différentiel', a:[DX,DY+0.12,0.44], l:1, with:['cv','outshaft','transfer'], p:'Le petit pignon d\'attaque (17 dents) fait tourner la grande couronne (63 dents) : encore 3,7 fois moins vite. À l\'intérieur, des petits engrenages laissent les roues gauche et droite tourner à des vitesses différentes dans les virages.'},
  cv:{t:'Cardans', a:[1.24,0.33,-0.35], l:1, with:['diff','wheelF'], p:'Les arbres qui vont du différentiel aux roues avant. Leurs joints homocinétiques (sous les soufflets en caoutchouc) laissent les roues tourner et monter-descendre tout en transmettant la force.'},
  wheelF:{t:'Roues avant (motrices)', a:[WH.xF,0.67,WH.zF+0.05], l:1, with:['cv','brakedisc','caliper'], p:'Sur cette voiture, ce sont les roues avant qui tirent la voiture, et ce sont aussi elles qui tournent pour diriger. Pneus 205/55 R16 : 63 cm de diamètre.'},
  wheelR:{t:'Roues arrière', a:[WH.xR,0.67,WH.zR+0.05], l:2, with:['brakedisc','caliper'], p:'Elles ne sont pas reliées au moteur : elles roulent simplement et portent l\'arrière de la voiture.'},
  brakedisc:{t:'Disques de frein', a:[WH.xF+0.05,WH.r+0.17,WH.zF-0.09], l:2, with:['caliper','wheelF'], p:'Des disques en acier qui tournent avec les roues (28,8 cm à l\'avant). Ils ont des trous et sont creux pour refroidir.'},
  caliper:{t:'Étriers et plaquettes', a:[WH.xF-0.15,WH.r+0.08,WH.zF-0.09], l:2, with:['brakedisc','wheelF'], p:'Quand tu freines, l\'huile pousse les plaquettes contre le disque. Le frottement transforme la vitesse en chaleur.'},
  strut:{t:'Jambes de force', a:[WH.xF-0.05,0.8,WH.zF-0.2], l:2, p:'Le ressort rouge et l\'amortisseur. Ils absorbent les bosses de la route.'},
  arm:{t:'Triangles de suspension', p:'Ils tiennent le bas de la roue avant et la laissent monter et descendre.'},
  rearaxle:{t:'Essieu arrière multibras', a:[WH.xR+0.1,0.45,0.5], l:2, p:'Plusieurs bras qui guident chaque roue arrière, avec un ressort et un amortisseur.'},
  subframe:{t:'Berceau', p:'Le cadre qui porte le moteur et la suspension avant.'},
  exhaust:{t:'Ligne d\'échappement', a:[-1.82,0.4,0.38], l:2, p:'Les gaz passent par le catalyseur puis le silencieux, qui calme le bruit des explosions, avant de sortir à l\'arrière.'},
  tank:{t:'Réservoir d\'essence', a:[-0.9,0.42,-0.05], l:2, p:'Environ 55 litres d\'essence, sous la banquette arrière. Une pompe l\'envoie au moteur.'},
  radiator:{t:'Radiateur', a:[1.88,0.75,0.2], l:2, p:'L\'eau chaude du moteur passe dans ses fines lamelles et l\'air qui entre par la calandre la refroidit.'},
  battery:{t:'Batterie', a:[1.45,0.9,0.45], l:1, with:['starter'], p:'12 volts. Elle fait tourner le démarreur et allume les phares. Quand le moteur tourne, l\'alternateur la recharge.'},
  seat:{t:'Sièges', p:'5 places : deux à l\'avant, une banquette à l\'arrière.'},
  dash:{t:'Tableau de bord', p:'Avec le compte-tours, le compteur de vitesse et les voyants.'},
  steering:{t:'Volant', p:'Il fait tourner les roues avant par une crémaillère.'},
  pedalclutch:{t:'Pédale d\'embrayage', mode:'manual', a:[0.8,0.42,0.47], l:2, p:'Elle bouge quand tu appuies sur la pédale d\'embrayage à droite de l\'écran.'},
  pedalbrake:{t:'Pédale de frein', a:[0.8,0.42,0.37], l:2, p:'La pédale du milieu (ou de gauche en boîte auto).'},
  pedalgas:{t:'Accélérateur', a:[0.8,0.42,0.27], l:2, p:'Il ouvre le papillon des gaz dans le moteur.'},
  lever:{t:'Levier de vitesses', a:[0.42,0.8,0], l:2, p:'Il bouge comme le levier de l\'écran.'},
  body:{t:'Carrosserie', p:'La coque en acier : 4,20 m de long, 1,76 m de large et 1,48 m de haut. Choisis « Pleine », « Transparente » ou « Masquée » dans Affichage.'},
  glass:{t:'Vitres', p:'Pare-brise, vitres latérales et lunette arrière.'},
  headlight:{t:'Phares', a:[2.06,0.75,0.57], l:2, p:'Allume-les avec « Phares » dans Affichage.'},
  taillight:{t:'Feux arrière', a:[-2.04,0.98,0.6], l:2, p:'Ils s\'allument plus fort quand tu freines, et le feu blanc de recul s\'allume en marche arrière.'},
  road:{t:'Route', p:'Elle défile quand la voiture roule.'},
  evstator:{t:'Moteur électrique', mode:'ev', a:[IX+0.05,IY+0.17,-0.24], l:1, with:['evcoil','evrotor','inverter'], p:'Il remplace tout le moteur à essence : pas de pistons, pas d\'explosions, presque pas de bruit. 100 kW et 290 Nm, disponibles dès l\'arrêt. Il tourne jusqu\'à 12 000 tours par minute.'},
  evcoil:{t:'Bobines du stator', mode:'ev', a:[IX-0.1,IY+0.1,-0.03], l:2, with:['evstator','evrotor','inverter'], p:'9 bobines de cuivre fixes. L\'onduleur les alimente chacune à leur tour (3 couleurs = 3 phases) : cela crée un champ magnétique qui tourne en rond, comme un aimant invisible qui tournerait.'},
  evrotor:{t:'Rotor à aimants', mode:'ev', a:[IX,IY-0.05,0.0], l:2, with:['evstator','evcoil','reducer'], p:'La partie qui tourne. Ses aimants (rouges = nord, bleus = sud) sont attirés par le champ qui tourne et le suivent. Quand on freine, c\'est l\'inverse : les aimants qui tournent créent du courant dans les bobines.'},
  inverter:{t:'Onduleur', mode:'ev', a:[IX,0.72,-0.14], l:1, with:['hvcable','evcoil','evstator'], p:'Le « cerveau » électrique. La batterie donne du courant continu ; l\'onduleur le découpe en courant alternatif à 3 phases pour le moteur. Plus tu appuies sur l\'accélérateur, plus il envoie de courant.'},
  reducer:{t:'Réducteur', mode:'ev', a:[1.29,0.53,0.28], l:1, with:['evrotor','diff','cv'], p:'Pas de boîte de vitesses ! Un seul rapport : le petit pignon du moteur (17 dents) entraîne une grande roue (45 dents), puis le pignon d\'attaque fait tourner le différentiel. Au total, le moteur fait 9,8 tours pour 1 tour de roue.'},
  hvbat:{t:'Batterie haute tension', mode:'ev', a:[-0.08,0.33,0.62], l:1, with:['hvcable'], p:'24 modules remplis de cellules lithium-ion, environ 320 volts. Elle stocke 35,8 kWh, de quoi rouler environ 200 km. Elle est sous le plancher : le poids est bas, la voiture tient mieux la route.'},
  hvcable:{t:'Câbles haute tension', mode:'ev', a:[1.1,0.36,-0.32], l:2, with:['hvbat','inverter'], p:'Toujours orange : c\'est la couleur des câbles haute tension, dangereux à toucher. Les points montrent l\'énergie : orange quand elle va vers le moteur, vert quand elle revient recharger la batterie.'},
  chargeport:{t:'Prise de recharge', mode:'ev', a:[-1.62,1.0,-0.9], l:2, p:'On y branche le câble pour recharger la batterie, à la maison ou sur une borne.'},
};

/* ======================================================================
   ÉTAT
   ====================================================================== */
const MASS = 1350, IE = 0.16, IIN = 0.05, KC = 60, W_IDLE = 760/RPM, KTC = 0.0032;
const torqueCurve = rpm => rpm<1000 ? 140 : rpm<3500 ? lerp(150,200,(rpm-1000)/2500) : rpm<4500 ? 200 : rpm<6000 ? lerp(200,178,(rpm-4500)/1500) : lerp(178,150,clamp((rpm-6000)/800,0,1));
const S = { mode:'manual', engineOn:false, cranking:0, runTime:0, we:0, win:0, v:0, gear:'N', sel:'P', agear:1, shiftT:0, lock:false,
  clutch:0, gas:0, brake:0, slow:0.05, msg:'', msgT:0, hand:false, slipLast:0, tcSR:0, evSOC:0.8, evT:0, evP:0 };
const FAULT = { kind:null, cyl:1, active:false };
const ratioNow = ()=> S.mode==='manual' ? RATIO_M[S.gear] : S.mode==='ev' ? (S.sel==='D' ? EV_R1 : S.sel==='R' ? -EV_R1 : 0) : (S.sel==='D' ? RATIO_A[S.agear] : S.sel==='R' ? RATIO_A.R : 0);
const massNow = ()=> S.mode==='ev' ? 1615 : MASS;
const engagement = () => S.mode==='manual' ? clamp((0.72 - S.clutch)/0.42, 0, 1) : 1;
function say(msg, t=4){ S.msg=msg; S.msgT=t; }

/* ======================================================================
   VISIBILITÉ, ISOLEMENT, ÉCLATÉ
   ====================================================================== */
const catOn = {ev:true, casing:true, internals:true, clutch:true, gearbox:true, drive:true, wheels:true, chassis:true, cabin:true, body:true, road:true};
let bodyMode = 'ghost', iso = null, isoKey = null, explode = 0, explodeTarget = 0;
let simple = false;
const SIMPLE_CATS = new Set(['internals','clutch','gearbox','drive','wheels','road','ev']);
const ICE_CATS = new Set(['casing','internals']), ICE_PARTS = new Set(['flywheel','starter','gbcase','exhaust','tank','catalyst']);
const iceOnly = u => ICE_CATS.has(u.cat) || ICE_PARTS.has(u.part);
const SIMPLE_HIDE = new Set(['camin','camex','valvein','valveex','belt','coil','starter','caliper','brakedisc','tcoil']);
function refreshVis(){
  LEAVES.forEach(o=>{ const u=o.userData;
    let v = simple ? (SIMPLE_CATS.has(u.cat) && !SIMPLE_HIDE.has(u.part)) : catOn[u.cat] !== false;
    if(u.mode && u.mode!==S.mode) v = false;
    if(u.cat==='body' && bodyMode==='off') v = false;
    if(iso) v = iso.has(u.part) && (!u.mode || u.mode===S.mode);
    if(S.mode==='ev' && iceOnly(u)) v = false;
    if(o===R.beltBroken) v = v && FAULT.kind==='belt' && FAULT.active;
    if(o===R.belt) v = v && !(FAULT.kind==='belt' && FAULT.active);
    o.visible = v;
  });
}
function applyBodyMode(){
  const ghost = bodyMode==='ghost';
  BODY.paint.transparent = ghost; BODY.paint.opacity = ghost ? 0.13 : 1; BODY.paint.depthWrite = !ghost;
  BODY.glass.opacity = ghost ? 0.07 : 0.45;
  BODY.paint.needsUpdate = true; BODY.glass.needsUpdate = true;
  refreshVis();
}
function isolate(key){
  const v = INFO[key]; if(!v) return;
  iso = new Set([key, ...(v.with||[])]); isoKey = key;
  $('isobar').hidden = false; $('isoLbl').textContent = v.t;
  const canExplode = CLUTCH_SET.includes(key) || TC_SET.includes(key);
  $('explodeBtn').hidden = !canExplode; explodeTarget = 0; $('explodeBtn').textContent = 'Écarter les pièces';
  refreshVis(); frameVisible();
}
function unIsolate(){ iso=null; isoKey=null; $('isobar').hidden=true; explodeTarget=0; refreshVis(); goView('car'); }
$('isoAll').onclick = unIsolate;
$('explodeBtn').onclick = ()=>{ explodeTarget = explodeTarget ? 0 : 1; $('explodeBtn').textContent = explodeTarget ? 'Rassembler' : 'Écarter les pièces'; };
function frameVisible(){
  const bb = new THREE.Box3(), tmp = new THREE.Box3(); let any=false;
  LEAVES.forEach(o=>{ if(!o.visible || !iso || !iso.has(o.userData.part)) return; tmp.setFromObject(o); if(!tmp.isEmpty()){ bb.union(tmp); any=true; } });
  if(!any) return;
  const c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3()).length();
  const dir = camera.position.clone().sub(controls.target).normalize();
  if(dir.y < 0.15) dir.y = 0.35; dir.normalize();
  flyTo(c.clone().add(dir.multiplyScalar(Math.max(0.25, sz*1.25))), c);
}

/* ======================================================================
   ÉTIQUETTES ET FICHE
   ====================================================================== */
const tagsEl = $('tags'), tagEls = {};
Object.entries(INFO).forEach(([k,v])=>{ if(!v.a) return; const d=document.createElement('div'); d.className='tag'; d.textContent=v.t; tagsEl.appendChild(d); tagEls[k]={el:d, p:new THREE.Vector3(...v.a), l:v.l||2}; });
const partVisible = {};
const tmpV = new THREE.Vector3();
function placeTags(){
  if(tagsEl.hidden) return;
  for(const k in partVisible) partVisible[k]=false;
  LEAVES.forEach(o=>{ if(o.visible) partVisible[o.userData.part]=true; });
  const w = canvas.clientWidth, h = canvas.clientHeight;
  for(const k in tagEls){
    const t = tagEls[k]; tmpV.copy(t.p).project(camera);
    const off = tmpV.z>1 || Math.abs(tmpV.x)>1.02 || Math.abs(tmpV.y)>1.02;
    const near = camera.position.distanceTo(t.p);
    const show = !off && partVisible[k] && (iso ? iso.has(k) : (t.l===1 ? near < 7 : near < 1.1));
    t.el.style.display = show ? '' : 'none';
    if(show) t.el.style.transform = `translate(${(tmpV.x+1)/2*w}px, ${(1-tmpV.y)/2*h - 10}px)`;
  }
}
let infoKey = null;
function showInfo(k){
  const v=INFO[k]; if(!v) return; infoKey = k;
  $('infoH').textContent=v.t; $('infoP').textContent=v.p; $('info').hidden=false;
  $('infoIso').hidden = isoKey===k;
  $('infoRepair').hidden = !(GAME.state==='fault');
}
$('infoX').onclick = ()=>{ $('info').hidden=true; };
$('infoIso').onclick = ()=>{ if(infoKey) isolate(infoKey); $('infoIso').hidden=true; };
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let downAt=null;
canvas.addEventListener('pointerdown', e=>{ downAt=[e.clientX,e.clientY]; });
canvas.addEventListener('pointerup', e=>{
  if(!downAt || Math.hypot(e.clientX-downAt[0], e.clientY-downAt[1])>6) return;
  const r = canvas.getBoundingClientRect();
  ptr.set(((e.clientX-r.left)/r.width)*2-1, -((e.clientY-r.top)/r.height)*2+1);
  ray.setFromCamera(ptr, camera); ray.params.Points = {threshold:0.004};
  const hits = ray.intersectObjects(LEAVES.filter(o=>o.visible && !o.isLine && !o.isPoints), false);
  if(!hits.length){ $('info').hidden=true; return; }
  const solid = hits.find(h=>!h.object.material.transparent || h.object.material.opacity>0.5) || hits[0];
  showInfo(solid.object.userData.part);
});

/* ---- Afficher / masquer ---- */
document.querySelectorAll('.part').forEach(b=>{ const k=b.dataset.p;
  b.onclick = ()=>{ catOn[k]=!catOn[k]; b.setAttribute('aria-pressed', catOn[k]); refreshVis(); }; });

/* ======================================================================
   CAMÉRA : vues, vol, visite guidée, caméra qui suit
   ====================================================================== */
const VIEWS = {
  car:{p:[4.3,2.3,3.2], t:[0.5,0.5,0]},
  engine:{p:[2.25,1.15,-0.95], t:[EN.xc,0.55,-0.13]},
  timing:{p:[1.75,0.85,-1.05], t:[EN.xc,0.55,-0.33]},
  clutch:{p:[1.75,0.75,0.65], t:[EN.xc,EN.yc,0.1]},
  gearbox:{p:[1.95,0.95,0.6], t:[1.3,0.38,0.3]},
  diff:{p:[0.75,0.7,0.95], t:[DX,DY,0.44]},
  wheel:{p:[1.0,0.55,0.05], t:[WH.xF,WH.r,WH.zF-0.06]},
  pack:{p:[1.4,-0.9,1.6], t:[-0.1,0.2,0]},
  cabin:{p:[-0.35,1.25,0.15], t:[0.75,0.6,0.3]},
  below:{p:[0.4,-2.2,1.0], t:[0.3,0.3,0]},
};
let tween=null;
function flyTo(p, t, dur=1.0){ tween={t:0, dur, p0:camera.position.clone(), t0:controls.target.clone(), p1:p.clone(), t1:t.clone()}; }
function goView(k){ const v=VIEWS[k]; flyTo(new THREE.Vector3(...v.p), new THREE.Vector3(...v.t));
  document.querySelectorAll('.view').forEach(b=>b.classList.toggle('act', b.dataset.v===k)); }
document.querySelectorAll('.view[data-v]').forEach(b=> b.onclick = ()=>{ stopTour(); if(iso) { iso=null; isoKey=null; $('isobar').hidden=true; refreshVis(); } goView(b.dataset.v); });
controls.addEventListener('start', ()=>{ tween=null; follow.back=null; document.querySelectorAll('.view').forEach(b=>b.classList.remove('act')); });

$('simpleBtn').onclick = ()=>{ stopTour(); if(iso) { iso=null; isoKey=null; $('isobar').hidden=true; }
  simple = !simple; $('simpleBtn').setAttribute('aria-pressed', simple); refreshVis();
  if(simple){ flyTo(new THREE.Vector3(2.9,1.7,2.3), new THREE.Vector3(0.95,0.4,0)); say('Vue simple : seulement le moteur et ses cylindres, l\'embrayage, la boîte, les cardans et les roues. Démarre et passe une vitesse pour voir tout bouger !',6); }
  else goView('car'); };
// Caméra qui suit l'action (mode apprentissage)
const follow = { back:null, t:0 };
function followAction(viewKey, hold=3.5){
  if(!$('optFollow').checked || tour || simple) return;
  if(!follow.back) follow.back = {p:camera.position.clone(), t:controls.target.clone()};
  goView(viewKey); follow.t = hold;
}

// Visite guidée façon vidéo courte : caméra automatique, pointeur, gros sous-titres
let tour = null;
const reelEl = $('reel');
function cap(txt){ return txt.split(' ').map((w,i)=>{ const hot=/^\*.*\*[.,!?…:]*$/.test(w); const ww=w.replace(/\*/g,''); return `<span style="animation-delay:${i*0.07}s">${hot?'<b>'+ww+'</b>':ww}</span>`; }).join(' '); }
function tourShift(g){ const tok=tour; anim.gas={to:0,rate:3}; anim.clutch={to:1,rate:5};
  setTimeout(()=>{ if(tour!==tok) return; selectGear(g); }, 450);
  setTimeout(()=>{ if(tour!==tok) return; anim.clutch={to:0,rate:0.55}; anim.gas={to:0.3,rate:1}; }, 1500); }
function resetForTour(){
  stopDemo(); if(GAME.state!=='off') gameQuit();
  Object.assign(S,{engineOn:false,cranking:0,we:0,win:0,v:0,clutch:0,gas:0,brake:0,gear:'N',sel:'P',agear:1,lock:false}); for(const k in anim) anim[k]=null; resetLever();
  document.querySelectorAll('#shifter .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.g==='N'));
  document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s==='P'));
}
function startEngineForTour(){ if(S.mode==='auto'){ anim.brake={to:1,rate:4}; } pressStart(); }
function reelShots(){
  const auto = S.mode==='auto';
  const common1 = [
    {focus:null, body:'ghost', dir:[1,0.42,0.85], zoom:[1.3,1.0], orbit:0.6, dur:5, cap:'Comment une voiture *avance* ?', sub:'On suit la force, du moteur jusqu\'aux roues', act:resetForTour},
    {focus:'block', body:'ghost', dir:[0.9,0.65,-0.7], zoom:[1.7,1.05], orbit:0.35, dur:4.5, cap:'Sous le capot : le *moteur*', sub:'4 cylindres en ligne, posé en travers'},
    {focus:'pistons', iso:['pistons','rods','crank','spark','coil'], dir:[1,0.35,-0.75], zoom:[1.5,0.95], orbit:0.4, dur:5, cap:'4 *pistons* montent et descendent', sub:'Course : 9,3 cm à chaque passage', act:startEngineForTour},
    {focus:'spark', iso:['pistons','rods','crank','spark','coil'], dir:[0.8,0.55,-0.5], zoom:[1.1,0.7], orbit:0.25, dur:5.5, slow:0.0167, cap:'L\'*étincelle* enflamme l\'essence… BOUM !', sub:'L\'explosion pousse le piston vers le bas'},
    {focus:'valvein', iso:['camin','camex','valvein','valveex','pistons'], dir:[1,0.5,-0.9], zoom:[1.2,0.85], orbit:0.3, dur:5, slow:0.0167, cap:'Les *soupapes* laissent respirer le moteur', sub:'Les cames les poussent au bon moment'},
    {focus:'belt', iso:['belt','crank','camin','camex'], dir:[0.5,0.35,-1], zoom:[1.4,1.0], orbit:0.35, dur:4.5, cap:'La *courroie* fait tourner les cames', sub:'2 fois moins vite que le vilebrequin'},
    {focus:'crank', iso:['crank','pistons','rods','flywheel'], dir:[0.9,0.2,-0.6], zoom:[1.3,0.9], orbit:0.5, dur:4.5, cap:'Le *vilebrequin* transforme tout en rotation', sub:'Comme tes jambes sur les pédales d\'un vélo'},
  ];
  const manualMid = [
    {focus:'disc', iso:CLUTCH_SET, explode:1, dir:[0.55,0.35,1], zoom:[1.3,0.95], orbit:0.5, dur:5.5, cap:'L\'*embrayage* : des pièces serrées ensemble', sub:'Volant moteur, disque, plateau, diaphragme'},
    {focus:'disc', iso:CLUTCH_SET, explode:0, dir:[0.7,0.3,1], zoom:[1.1,0.85], orbit:0.3, dur:5, cap:'Pédale enfoncée : le disque est *libéré*', sub:'Le moteur ne touche plus la boîte', act:()=>{ anim.clutch={to:1,rate:2.5}; }},
    {focus:'synchro', iso:MBOX, dir:[0.6,0.6,0.9], zoom:[1.3,0.95], orbit:0.35, dur:5, cap:'On passe la *1re* : le baladeur bleu glisse', sub:'Il verrouille un pignon sur l\'arbre', act:()=>{ const tok=tour; setTimeout(()=>{ if(tour===tok) selectGear('1'); }, 900); }},
    {focus:'gear1', iso:MBOX.concat(['disc','flywheel']), dir:[0.75,0.5,0.85], zoom:[1.2,0.9], orbit:0.3, dur:6, cap:'On relâche la pédale : la force *passe* !', sub:'Petit pignon → grand pignon = beaucoup de force', act:()=>{ anim.gas={to:0.3,rate:1}; anim.clutch={to:0,rate:0.35}; }},
  ];
  const autoMid = [
    {focus:'tcimpeller', iso:TC_SET, explode:1, dir:[0.55,0.35,1], zoom:[1.3,0.95], orbit:0.5, dur:5.5, cap:'Le *convertisseur* : de l\'huile à la place de l\'embrayage', sub:'Pompe, réacteur et turbine'},
    {focus:'tcturbine', iso:TC_SET, explode:0, dir:[0.7,0.3,1], zoom:[1.1,0.85], orbit:0.3, dur:5, cap:'En *D*, l\'huile pousse la turbine', sub:'Pied sur le frein, la voiture veut déjà avancer', act:()=>{ anim.brake={to:1,rate:4}; const tok=tour; setTimeout(()=>{ if(tour===tok) selectAuto('D'); }, 700); }},
    {focus:'ravigneaux', iso:ABOX, dir:[0.6,0.5,1], zoom:[1.3,0.9], orbit:0.4, dur:5.5, cap:'Les *trains épicycloïdaux* changent la vitesse', sub:'Soleils, satellites et couronne', act:()=>{ anim.brake={to:0,rate:3}; anim.gas={to:0.35,rate:1}; }},
    {focus:'elK1', iso:ABOX, dir:[0.8,0.6,0.7], zoom:[1.1,0.85], orbit:0.3, dur:5, cap:'Les embrayages *K* et freins *B* se serrent', sub:'2 éléments serrés = 1 vitesse (en vert)'},
  ];
  const common2 = [
    {focus:'diff', iso:['diff','cv', auto?'transfer':'outshaft'], dir:[-0.5,0.55,1], zoom:[1.4,1.0], orbit:0.4, dur:4.5, cap:'Le *différentiel* partage la force', sub:'Entre la roue gauche et la roue droite'},
    {focus:'cv', iso:['diff','cv','wheelF'], dir:[0.15,-0.9,0.55], zoom:[1.2,0.95], orbit:0.3, dur:4.5, cap:'Les *cardans* l\'emmènent jusqu\'aux roues', sub:'Celui de droite passe derrière le moteur'},
    {focus:'wheelF', body:'ghost', dir:[0.35,0.25,1], zoom:[1.6,1.1], orbit:0.4, dur:4.5, cap:'Et la roue *pousse* sur la route !', sub:'Pneu 205/55 R16'},
    auto ? {focus:'ravigneaux', iso:ABOX, dir:[0.6,0.5,1], zoom:[1.2,0.95], orbit:0.3, dur:6, cap:'La boîte change de vitesse *toute seule*', sub:'Regarde le compte-tours redescendre', act:()=>{ anim.gas={to:0.6,rate:1}; }}
         : {focus:'gear2', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.2,0.95], orbit:0.3, dur:6, cap:'On passe la *2e* : le moteur tourne moins vite', sub:'Regarde le compte-tours redescendre', act:()=>tourShift('2')},
    {focus:null, body:'ghost', dir:[0.9,0.35,-0.9], zoom:[1.15,1.35], orbit:0.6, dur:5, cap:'Du moteur *aux roues* !', sub:'À toi de jouer maintenant', act:()=>{ anim.gas={to:0.2,rate:1}; }},
  ];
  return common1.concat(auto?autoMid:manualMid, common2);
}
function startTour(shotList, title){
  ensureAudio(); stopDemo(); if(iso) unIsolate(); $('info').hidden=true;
  const shots = shotList || reelShots();
  tour = {i:-1, t:0, shots, paused:false, saved:{slow:S.slow, body:bodyMode, cats:{...catOn}, simple}}; simple=false;
  for(const k in catOn) catOn[k]=true;
  controls.enabled = false; tween=null; follow.back=null;
  stage.classList.add('reeling'); reelEl.hidden=false;
  $('reelBars').innerHTML = shots.map(()=>'<span><i></i></span>').join('');
  nextShot();
}
function stopTour(){
  if(!tour) return; const sv = tour.saved; tour=null;
  S.slow = sv.slow; bodyMode = sv.body; Object.assign(catOn, sv.cats); simple = sv.simple; applyBodyMode();
  controls.enabled = true; stage.classList.remove('reeling'); reelEl.hidden=true; explodeTarget=0;
  iso=null; isoKey=null; $('isobar').hidden=true; refreshVis();
}
function nextShot(){
  tour.i++; tour.t=0;
  if(tour.i >= tour.shots.length){ stopTour(); goView('car'); return; }
  const s = tour.shots[tour.i];
  if(s.act) s.act(); if(s.at) s.at.forEach(a=>a.done=false);
  S.slow = s.slow || 0.05;
  if(s.body){ bodyMode = s.body; applyBodyMode(); }
  iso = s.iso ? new Set(s.iso) : null; explodeTarget = s.explode ? 1 : 0; refreshVis();
  // cadrage : boîte englobante de la pièce visée
  const bb = new THREE.Box3(), tmp = new THREE.Box3(); let any=false;
  if(s.focus){ LEAVES.forEach(o=>{ if(o.visible && o.userData.part===s.focus && !o.isPoints){ tmp.setFromObject(o); if(!tmp.isEmpty()){ bb.union(tmp); any=true; } } }); }
  const c = any ? bb.getCenter(new THREE.Vector3()) : new THREE.Vector3(0.3,0.55,0);
  const sz = any ? Math.max(0.12, bb.getSize(new THREE.Vector3()).length()) : 4.6;
  s._c = c; s._d = Math.max(0.22, sz*1.35); s._p0 = camera.position.clone(); s._t0 = controls.target.clone();
  s._dir = new THREE.Vector3(...s.dir).normalize();
  $('reelCap').innerHTML = cap(s.cap) + (s.sub ? `<em class="reel-sub" style="animation-delay:${s.cap.split(' ').length*0.07+0.15}s">${s.sub}</em>` : '');
  const tagEl = $('reelTag'); tagEl.textContent = s.focus && INFO[s.focus] ? INFO[s.focus].t : ''; tagEl.hidden = !s.focus;
  [...$('reelBars').children].forEach((b,i)=>{ b.firstChild.style.width = i<tour.i ? '100%' : '0%'; });
}
const ease = p => p<0.5 ? 2*p*p : 1-Math.pow(-2*p+2,2)/2;
function tourTick(dt){
  if(!tour) return;
  const s = tour.shots[tour.i]; if(!tour.paused) tour.t += dt;
  if(s.at) s.at.forEach(a=>{ if(!a.done && tour.t>=a[0]){ a.done=true; a[1](); } });
  const p = clamp(tour.t/s.dur, 0, 1);
  const ang = s.orbit*(p-0.5), ca=Math.cos(ang), sa=Math.sin(ang);
  const d = new THREE.Vector3(s._dir.x*ca + s._dir.z*sa, s._dir.y, -s._dir.x*sa + s._dir.z*ca).normalize();
  const want = s._c.clone().add(d.multiplyScalar(s._d*lerp(s.zoom[0], s.zoom[1], ease(p))*(tour.zm||1)));
  const k = clamp(tour.t/0.9, 0, 1), kk = k*k*(3-2*k);
  camera.position.lerpVectors(s._p0, want, kk); controls.target.lerpVectors(s._t0, s._c, kk);
  $('reelBars').children[tour.i].firstChild.style.width = (p*100)+'%';
  // pointeur
  const ring=$('ptrRing'), line=$('ptrLine'), tag=$('reelTag');
  if(s.focus && k>0.6){
    tmpV.copy(s._c).project(camera); const w=canvas.clientWidth, h=canvas.clientHeight;
    const x=(tmpV.x+1)/2*w, y=(1-tmpV.y)/2*h, r=16+4*Math.sin(performance.now()/180);
    ring.setAttribute('cx',x); ring.setAttribute('cy',y); ring.setAttribute('r',r); ring.style.opacity=1;
    const tx = clamp(x + (x < w*0.6 ? 60 : -60), 70, w-70), ty = clamp(y - 70, 60, h*0.6);
    line.setAttribute('x1',x); line.setAttribute('y1',y-r); line.setAttribute('x2',tx); line.setAttribute('y2',ty+14); line.style.opacity=1;
    tag.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`; tag.style.opacity=1;
  } else { ring.style.opacity=0; line.style.opacity=0; tag.style.opacity=0; }
  if(!tour.paused && tour.t >= s.dur) nextShot();
}
$('reelPause').onclick = ()=>{ if(!tour) return; tour.paused=!tour.paused; $('reelPause').textContent = tour.paused ? '▶' : '❚❚'; };
$('reelClose').onclick = ()=>{ stopTour(); goView('car'); };

/* ---- Scénarios « Montre-moi » : chacun est une courte vidéo sur une seule idée ---- */
function setupState(o){
  resetForTour(); Object.assign(S, o);
  if(o.engineOn){ S.runTime = 5; }
  if(o.gear){ S.gear = o.gear; if(GATE[o.gear]){ LEV.col=GATE[o.gear][0]; LEV.row=GATE[o.gear][1]; }
    document.querySelectorAll('#shifter .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.g===o.gear));
    if(RATIO_M[o.gear]) S.win = (S.v/WH.r)*RATIO_M[o.gear]*FD; }
  if(o.sel){ document.querySelectorAll('#selector .gbtn').forEach(b=>b.classList.toggle('act', b.dataset.s===o.sel)); if(o.sel==='D' && S.v>0) S.win = (S.v/WH.r)*RATIO_A[S.agear]*FD; }
}
const ENGINE_SHOT = ['pistons','rods','crank','spark'];
const SCENARIOS = {
  manual: [
    {id:'neutral', t:'Moteur allumé, voiture à l\'arrêt', d:'Pourquoi les roues ne tournent pas au point mort', shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.5, dur:5, cap:'Le moteur tourne… mais la voiture ne bouge *pas* !', sub:'Levier au point mort, pied levé de l\'embrayage', act:()=>{ setupState({}); pressStart(); }},
      {focus:'pistons', iso:ENGINE_SHOT, dir:[1,0.35,-0.75], zoom:[1.4,0.95], orbit:0.4, dur:5, cap:'Dans le moteur, tout *tourne*', sub:'Environ 760 tours par minute au ralenti'},
      {focus:'disc', iso:CLUTCH_SET.concat(['mainshaft']), dir:[0.6,0.35,1], zoom:[1.3,0.95], orbit:0.4, dur:5, cap:'L\'embrayage est *serré* : la boîte tourne aussi', sub:'Le disque tourne avec le volant moteur'},
      {focus:'mainshaft', iso:MBOX, dir:[0.6,0.6,0.9], zoom:[1.25,0.95], orbit:0.35, dur:5.5, cap:'L\'arbre primaire fait tourner *tous* les pignons', sub:'Les 6 pignons de l\'arbre du bas tournent… mais dans le vide'},
      {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.8], orbit:0.3, dur:5, cap:'Les baladeurs bleus sont au *milieu*', sub:'Aucun pignon n\'est accroché à l\'arbre de sortie'},
      {focus:'outshaft', iso:MBOX.concat(['diff']), dir:[0.4,0.3,1], zoom:[1.2,0.9], orbit:0.3, dur:5, cap:'L\'arbre de sortie reste *immobile*', sub:'Rien ne part vers le différentiel'},
      {focus:'wheelF', iso:['diff','cv','wheelF','brakedisc'], dir:[0.35,0.4,1], zoom:[1.4,1.0], orbit:0.3, dur:4.5, cap:'Les roues ne reçoivent *rien*', sub:'C\'est ça, le point mort'},
      {focus:'disc', iso:CLUTCH_SET.concat(MBOX), dir:[0.7,0.4,0.9], zoom:[1.3,1.0], orbit:0.3, dur:6, cap:'On appuie sur l\'*embrayage*…', sub:'Le disque se libère : la boîte ralentit et s\'arrête', at:[[0.8,()=>{ anim.clutch={to:1,rate:2}; }]]},
      {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.8], orbit:0.3, dur:5, cap:'…on passe la *1re*', sub:'Le baladeur accroche le pignon : la boîte est prête', at:[[0.8,()=>selectGear('1')]]},
      {focus:null, dir:[0.9,0.5,0.9], zoom:[1.2,1.0], orbit:0.5, dur:7, cap:'On relâche : *tout* tourne ensemble !', sub:'Moteur → embrayage → boîte → roues', at:[[0.3,()=>{ anim.gas={to:0.3,rate:1}; anim.clutch={to:0,rate:0.35}; }]]},
    ]},
    {id:'start', t:'Démarrer sans caler', d:'Le point de patinage de l\'embrayage', shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:'Comment démarrer *sans caler* ?', sub:'Moteur allumé, 1re passée, embrayage enfoncé', act:()=>{ setupState({engineOn:true, we:W_IDLE, clutch:1, gear:'1'}); }},
      {focus:'disc', iso:CLUTCH_SET.concat(MBOX), dir:[0.6,0.35,1], zoom:[1.2,0.9], orbit:0.3, dur:5, cap:'Pédale enfoncée : le disque ne touche *rien*', sub:'Le moteur tourne, la boîte est immobile'},
      {focus:'disc', iso:CLUTCH_SET.concat(MBOX), dir:[0.7,0.3,0.9], zoom:[1.0,0.8], orbit:0.3, dur:7, cap:'On relâche *doucement* : le disque frotte', sub:'C\'est le point de patinage : la force passe petit à petit', at:[[0.2,()=>{ anim.gas={to:0.25,rate:1}; anim.clutch={to:0.45,rate:0.25}; }]]},
      {focus:'wheelF', iso:['diff','cv','wheelF','disc','flywheel'].concat(MBOX), dir:[0.6,0.5,1], zoom:[1.4,1.1], orbit:0.4, dur:6, cap:'Les roues commencent à *tourner*', sub:'On finit de relâcher la pédale', at:[[0.2,()=>{ anim.clutch={to:0,rate:0.3}; }]]},
      {focus:null, dir:[0.9,0.4,-0.8], zoom:[1.2,1.0], orbit:0.5, dur:5, cap:'Et si on lâche *d\'un coup* ?', sub:'Regarde le compte-tours…', act:()=>{ setupState({engineOn:true, we:W_IDLE, clutch:1, gear:'1'}); }, at:[[2.0,()=>{ anim.clutch={to:0,rate:20}; }]]},
      {focus:'pistons', iso:ENGINE_SHOT.concat(['flywheel','disc']), dir:[1,0.35,-0.75], zoom:[1.3,1.0], orbit:0.3, dur:5, cap:'Le moteur *cale* !', sub:'Les roues l\'ont arrêté d\'un coup. Il faut doser.'},
    ]},
    {id:'shift', t:'Changer de vitesse', d:'Le levier, les baladeurs et le compte-tours', shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:'On roule en *1re*…', sub:'Le moteur tourne vite', act:()=>{ setupState({engineOn:true, gear:'1', v:5, we:5/WH.r*RATIO_M[1]*FD, gas:0.35}); }},
      {focus:'lever', iso:['lever','pedalclutch','pedalbrake','pedalgas','steering'], dir:[0.2,1,0.6], zoom:[1.3,1.0], orbit:0.3, dur:6, cap:'Embrayage enfoncé, le levier passe par le *point mort*…', sub:'…puis entre dans la 2e', at:[[0.3,()=>{ anim.gas={to:0,rate:3}; anim.clutch={to:1,rate:5}; }],[1.0,()=>selectGear('2')],[3.5,()=>{ anim.clutch={to:0,rate:0.6}; anim.gas={to:0.35,rate:1}; }]]},
      {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.8], orbit:0.3, dur:6, cap:'Dans la boîte, le baladeur *glisse*', sub:'Il lâche la 1re et accroche la 2e', at:[[0.5,()=>{ anim.gas={to:0,rate:3}; anim.clutch={to:1,rate:5}; }],[1.2,()=>selectGear('3')],[3.5,()=>{ anim.clutch={to:0,rate:0.6}; anim.gas={to:0.35,rate:1}; }]]},
      {focus:null, dir:[0.9,0.5,0.9], zoom:[1.1,1.0], orbit:0.4, dur:6, cap:'Le compte-tours *redescend* à chaque vitesse', sub:'Même vitesse de roue, moteur plus lent : il consomme moins'},
    ]},
    {id:'enginebrake', t:'Le frein moteur', d:'Lever le pied en vitesse ralentit la voiture', shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:'On roule en *3e* à 55 km/h', sub:'Le moteur pousse la voiture', act:()=>{ setupState({engineOn:true, gear:'3', v:15.3, we:15.3/WH.r*RATIO_M[3]*FD, gas:0.3}); }},
      {focus:'pistons', iso:ENGINE_SHOT.concat(['flywheel','disc']), dir:[1,0.35,-0.75], zoom:[1.4,1.0], orbit:0.3, dur:5.5, cap:'On lève le pied : ce sont les roues qui font *tourner* le moteur', sub:'Sans essence, le moteur résiste : il freine la voiture', at:[[0.3,()=>{ anim.gas={to:0,rate:3}; }]]},
      {focus:'gear3', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.2,0.95], orbit:0.3, dur:5, cap:'La force fait le chemin *à l\'envers*', sub:'Des roues vers le moteur, à travers la boîte'},
      {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.85], orbit:0.3, dur:6, cap:'En *rétrogradant*, ça freine plus fort', sub:'Le compte-tours remonte : le moteur résiste davantage', at:[[0.3,()=>{ anim.clutch={to:1,rate:5}; }],[0.9,()=>selectGear('2')],[2.2,()=>{ anim.clutch={to:0,rate:0.8}; }]]},
      {focus:null, dir:[0.9,0.4,-0.8], zoom:[1.2,1.0], orbit:0.5, dur:5, cap:'Utile dans les *descentes*', sub:'Les freins ne chauffent pas. Au point mort, il n\'y a plus de frein moteur.'},
    ]},
    {id:'stroke', t:'Les 4 temps du moteur', d:'Admission, compression, explosion, échappement', shots:()=>strokeShots()},
    {id:'tour', t:'Tout le chemin de la force', d:'La grande visite, du piston à la route', shots:()=>reelShots()},
  ],
  auto: [
    {id:'prnd', t:'P, R, N, D', d:'Moteur allumé, que se passe-t-il dans la boîte ?', shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:'Moteur allumé sur *P*', sub:'Un cliquet bloque la sortie de la boîte', act:()=>{ setupState({brake:1}); pressStart(); }},
      {focus:'tcimpeller', iso:TC_SET, dir:[0.6,0.35,1], zoom:[1.3,0.95], orbit:0.4, dur:5.5, cap:'La *pompe* tourne avec le moteur', sub:'Elle projette de l\'huile sur la turbine'},
      {focus:'tcturbine', iso:TC_SET.concat(ABOX), dir:[0.7,0.35,0.9], zoom:[1.3,1.0], orbit:0.3, dur:6, cap:'En *N*, la turbine tourne… dans le vide', sub:'Aucun embrayage K ni frein B n\'est serré', at:[[0.6,()=>selectAuto('N')]]},
      {focus:'tcturbine', iso:TC_SET.concat(ABOX), dir:[0.6,0.4,1], zoom:[1.2,0.95], orbit:0.3, dur:6, cap:'En *D*, frein appuyé : la turbine s\'arrête', sub:'L\'huile glisse, le moteur ne cale pas', at:[[0.6,()=>selectAuto('D')]]},
      {focus:'wheelF', iso:['diff','cv','wheelF','brakedisc','caliper'], dir:[0.35,0.4,1], zoom:[1.4,1.0], orbit:0.4, dur:6, cap:'On lâche le frein : la voiture *avance seule*', sub:'C\'est le « rampage » d\'une boîte auto', at:[[0.4,()=>{ anim.brake={to:0,rate:2}; }]]},
    ]},
    {id:'autoshift', t:'La boîte change toute seule', d:'Embrayages K et freins B', shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:'En *D*, on accélère…', sub:'Regarde le tableau des éléments', act:()=>{ setupState({engineOn:true, we:W_IDLE, sel:'D', agear:1}); anim.gas={to:0.5,rate:1}; }},
      {focus:'ravigneaux', iso:ABOX, dir:[0.6,0.5,1], zoom:[1.3,0.95], orbit:0.4, dur:7, cap:'Selon ce qui est *serré*, la vitesse change', sub:'Soleils, satellites et couronne tournent différemment'},
      {focus:'elK1', iso:ABOX, dir:[0.8,0.6,0.7], zoom:[1.1,0.85], orbit:0.3, dur:7, cap:'Les éléments en *vert* sont serrés', sub:'Deux éléments serrés = une vitesse'},
      {focus:null, dir:[0.9,0.5,0.9], zoom:[1.1,1.0], orbit:0.4, dur:6, cap:'Le compte-tours *redescend* à chaque passage', sub:'Sans pédale d\'embrayage !'},
    ]},
    {id:'stroke', t:'Les 4 temps du moteur', d:'Admission, compression, explosion, échappement', shots:()=>strokeShots()},
    {id:'tour', t:'Tout le chemin de la force', d:'La grande visite, du piston à la route', shots:()=>reelShots()},
  ],
  ev: [
    {id:'evtour', t:'Comment avance une voiture électrique', d:'De la batterie aux roues', shots:()=>[
      {focus:null, body:'ghost', dir:[1,0.42,0.85], zoom:[1.3,1.0], orbit:0.6, dur:5, cap:'Une voiture *électrique*, comment ça marche ?', sub:'Pas d\'essence, pas d\'explosions, pas de boîte de vitesses', act:()=>{ setupState({brake:1}); pressStart(); }},
      {focus:'hvbat', iso:['hvbat','hvcable'], dir:[0.6,-0.7,0.9], zoom:[1.2,0.95], orbit:0.4, dur:5, cap:'L\'énergie est dans la *batterie*', sub:'24 modules sous le plancher, 35,8 kWh'},
      {focus:'hvcable', iso:['hvbat','hvcable','inverter'], dir:[0.5,0.3,-1], zoom:[1.2,0.9], orbit:0.3, dur:5.5, cap:'Le courant part dans les câbles *orange*', sub:'On passe en D et on accélère : regarde les points', at:[[0.3,()=>selectAuto('D')],[1.2,()=>{ anim.brake={to:0,rate:3}; anim.gas={to:0.45,rate:1}; }]]},
      {focus:'inverter', iso:['hvcable','inverter','evstator','evcoil'], dir:[0.8,0.6,-0.8], zoom:[1.9,1.4], orbit:0.3, dur:5, cap:'L\'*onduleur* prépare le courant pour le moteur', sub:'Du courant continu vers 3 phases alternatives'},
      {focus:'evcoil', iso:['evstator','evcoil','evrotor'], dir:[0.25,0.3,-1], zoom:[1.1,0.8], orbit:0.3, dur:6, slow:0.0167, cap:'Les *bobines* s\'allument chacune leur tour', sub:'Elles créent un champ magnétique qui tourne'},
      {focus:'evrotor', iso:['evstator','evcoil','evrotor'], dir:[0.3,0.4,-1], zoom:[1.0,0.8], orbit:0.3, dur:6, slow:0.0167, cap:'Les *aimants* du rotor suivent le champ', sub:'Et le rotor se met à tourner'},
      {focus:'reducer', iso:['evrotor','reducer','diff'], dir:[0.6,0.6,0.9], zoom:[1.2,0.9], orbit:0.35, dur:5.5, cap:'Un seul *réducteur*, pas de boîte de vitesses', sub:'9,8 tours de moteur pour 1 tour de roue'},
      {focus:'cv', iso:['diff','cv','wheelF'], dir:[0.15,-0.9,0.55], zoom:[1.2,0.95], orbit:0.3, dur:4.5, cap:'Différentiel, cardans… et les *roues* !', sub:'Comme dans une voiture à essence'},
      {focus:null, body:'ghost', dir:[0.9,0.35,-0.9], zoom:[1.15,1.35], orbit:0.6, dur:5, cap:'*Silencieux*, et la force est là tout de suite', sub:'290 Nm dès l\'arrêt'},
    ]},
    {id:'regen', t:'Freiner en rechargeant', d:'Quand le moteur devient une dynamo', shots:()=>[
      {focus:null, body:'ghost', dir:[1,0.42,0.85], zoom:[1.2,1.0], orbit:0.4, dur:4.5, cap:'On roule à *50 km/h*…', sub:'La batterie envoie de l\'énergie au moteur', act:()=>{ setupState({engineOn:true, sel:'D', v:13.9, gas:0.25}); }},
      {focus:'hvcable', iso:['hvbat','hvcable','inverter','evstator','evcoil','evrotor'], dir:[0.6,0.25,-1], zoom:[1.3,1.0], orbit:0.3, dur:5, cap:'Points *orange* : l\'énergie va vers le moteur', sub:'La batterie se vide doucement'},
      {focus:'evcoil', iso:['evstator','evcoil','evrotor','inverter'], dir:[0.25,0.3,-1], zoom:[1.1,0.85], orbit:0.3, dur:6, cap:'On lève le pied : le moteur devient *dynamo*', sub:'Les aimants qui tournent créent du courant', at:[[0.4,()=>{ anim.gas={to:0,rate:3}; }]]},
      {focus:'hvcable', iso:['hvbat','hvcable','inverter'], dir:[0.6,0.25,-1], zoom:[1.3,1.0], orbit:0.3, dur:6, cap:'Points *verts* : l\'énergie revient !', sub:'Elle recharge la batterie en ralentissant la voiture', at:[[0.5,()=>{ anim.brake={to:0.35,rate:1}; }]]},
      {focus:'hvbat', iso:['hvbat','hvcable'], dir:[0.6,-0.7,0.9], zoom:[1.2,0.95], orbit:0.3, dur:5, cap:'C\'est le *freinage régénératif*', sub:'En ville, il récupère une bonne partie de l\'énergie'},
      {focus:'caliper', iso:['wheelF','brakedisc','caliper'], dir:[0.3,0.3,1], zoom:[1.3,1.0], orbit:0.3, dur:5, cap:'Les freins à disque servent *beaucoup moins*', sub:'Seulement pour les freinages forts', at:[[0.5,()=>{ anim.brake={to:1,rate:1}; }]]},
    ]},
    {id:'nogear', t:'Pourquoi pas de boîte de vitesses ?', d:'Le moteur électrique pousse à toutes les vitesses', shots:()=>[
      {focus:'evstator', iso:['evstator','evcoil','evrotor','reducer'], dir:[0.8,0.45,-0.8], zoom:[1.3,1.0], orbit:0.4, dur:5.5, cap:'Un moteur à essence a besoin de *vitesses*', sub:'Il ne pousse bien qu\'entre 1 500 et 6 000 tr/min, et il cale à l\'arrêt', act:()=>{ setupState({engineOn:true, sel:'D'}); }},
      {focus:'evrotor', iso:['evstator','evcoil','evrotor','reducer'], dir:[0.3,0.4,-1], zoom:[1.1,0.85], orbit:0.3, dur:6, cap:'Le moteur électrique pousse *dès 0* tr/min', sub:'Et il tourne jusqu\'à 12 000 tr/min', at:[[0.5,()=>{ anim.gas={to:1,rate:2}; }]]},
      {focus:'reducer', iso:['evrotor','reducer','diff','cv','wheelF'], dir:[0.6,0.6,0.9], zoom:[1.3,1.0], orbit:0.4, dur:7, cap:'Un *seul* rapport suffit de 0 à 150 km/h', sub:'Regarde le compteur monter sans aucune coupure'},
      {focus:null, body:'ghost', dir:[0.9,0.35,-0.9], zoom:[1.15,1.3], orbit:0.6, dur:5, cap:'Pas d\'embrayage, *pas de calage*', sub:'Et en marche arrière, le moteur tourne juste à l\'envers', act:()=>{ anim.gas={to:0,rate:2}; anim.brake={to:0.5,rate:1}; }},
    ]},
  ],
};
function strokeShots(){
  const iso1 = ['pistons','rods','crank','spark','valvein','valveex','camin','camex'];
  return [
    {focus:'pistons', iso:iso1, dir:[1,0.3,-0.6], zoom:[1.4,1.0], orbit:0.3, dur:5, slow:0.0167, cap:'Un moteur à *4 temps*', sub:'Chaque piston répète 4 étapes, encore et encore', act:()=>{ setupState({}); pressStart(); }},
    {focus:'valvein', iso:iso1, dir:[1,0.45,-0.8], zoom:[1.1,0.85], orbit:0.25, dur:5.5, slow:0.0167, cap:'1. *Admission* : le piston descend et aspire', sub:'La soupape d\'admission (devant) est ouverte'},
    {focus:'pistons', iso:iso1, dir:[0.9,0.4,-0.7], zoom:[1.1,0.85], orbit:0.25, dur:5.5, slow:0.0167, cap:'2. *Compression* : le piston remonte et serre', sub:'Toutes les soupapes sont fermées'},
    {focus:'spark', iso:iso1, dir:[0.8,0.55,-0.5], zoom:[1.0,0.75], orbit:0.25, dur:5.5, slow:0.0167, cap:'3. *Explosion* : l\'étincelle… BOUM !', sub:'Le seul temps qui pousse vraiment'},
    {focus:'valveex', iso:iso1, dir:[-0.3,0.5,-1], zoom:[1.1,0.85], orbit:0.25, dur:5.5, slow:0.0167, cap:'4. *Échappement* : le piston chasse les gaz', sub:'La soupape d\'échappement (derrière) s\'ouvre'},
    {focus:'crank', iso:iso1, dir:[0.9,0.25,-0.6], zoom:[1.3,1.0], orbit:0.4, dur:5, cap:'Les 4 pistons sont *décalés*', sub:'Il y a toujours un piston qui pousse : ordre 1-3-4-2'},
  ];
}
function renderScenarios(){
  $('scList').innerHTML = SCENARIOS[S.mode].map(sc=>`<button class="sc" data-sc="${sc.id}"><b>▶ ${sc.t}</b><span>${sc.d}</span></button>`).join('');
  document.querySelectorAll('#scList .sc').forEach(b=> b.onclick = ()=>{ const sc = SCENARIOS[S.mode].find(x=>x.id===b.dataset.sc); startTour(sc.shots(), sc.t); });
}

/* ======================================================================
   CADRANS
   ====================================================================== */
function pt(cx,cy,r,deg){ const a=deg*Math.PI/180; return [cx+r*Math.sin(a), cy-r*Math.cos(a)]; }
function arc(cx,cy,r,a1,a2){ const [x1,y1]=pt(cx,cy,r,a1),[x2,y2]=pt(cx,cy,r,a2); return `M${x1} ${y1} A${r} ${r} 0 ${a2-a1>180?1:0} 1 ${x2} ${y2}`; }
function makeDial(svg, max, major, every, red, unit){
  const cx=60, cy=60, Rr=50; let h=`<circle class="dial-face" cx="${cx}" cy="${cy}" r="${Rr+4}"/>`;
  if(red!=null) h+=`<path class="dial-red" stroke-width="5" d="${arc(cx,cy,Rr-4,-120+240*red/max,120)}"/>`;
  for(let v=0; v<=max+1e-6; v+=major/2){
    const a=-120+240*v/max, big=Math.abs(v/major-Math.round(v/major))<1e-6;
    const [x1,y1]=pt(cx,cy,Rr-1,a),[x2,y2]=pt(cx,cy,Rr-(big?9:5),a);
    h+=`<line class="dial-tick" stroke-width="${big?1.6:0.8}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    if(big && Math.round(v/major)%every===0){ const [tx,ty]=pt(cx,cy,Rr-17,a); h+=`<text class="dial-num" x="${tx}" y="${ty+3}">${Math.round(v)}</text>`; }
  }
  h+=`<line class="dial-needle" x1="${cx}" y1="${cy+8}" x2="${cx}" y2="${cy-Rr+8}"/><circle class="dial-hub" cx="${cx}" cy="${cy}" r="4"/>`;
  h+=`<text class="dial-read" x="${cx}" y="${cy+30}">0</text><text class="dial-unit" x="${cx}" y="${cy+41}">${unit}</text>`;
  svg.innerHTML=h; return {needle:svg.querySelector('.dial-needle'), read:svg.querySelector('.dial-read')};
}
let tach = makeDial($('tach'), 8, 1, 1, 6.5, 'TR/MIN'), tachMax = 8;
function setTach(){ tachMax = S.mode==='ev' ? 12 : 8; tach = makeDial($('tach'), tachMax, 1, S.mode==='ev'?2:1, S.mode==='ev'?11:6.5, S.mode==='ev'?'TR/MIN MOTEUR':'TR/MIN'); }
const speedo = makeDial($('speedo'), 240, 20, 2, null, 'KM/H');
let needleT=0, needleS=0;

/* ---- Fiche technique et tableau des éléments ---- */
function renderSpec(){
  const rm = ['1','2','3','4','5','6'].map(g=>fr(RATIO_M[g],2)).join(' · ');
  const ra = ['1','2','3','4','5','6'].map(g=>fr(RATIO_A[g],2)).join(' · ');
  const rows = [['Moteur','4 cylindres en ligne, 16 soupapes'],['Cylindrée','1 984 cm³'],['Alésage × course','82,5 × 92,8 mm'],['Puissance','150 ch à 6 000 tr/min'],
    ['Couple','200 Nm à 3 500 tr/min'],['Ordre d\'allumage','1-3-4-2'],['Boîte manuelle (1re→6e)',rm],['Boîte auto (1re→6e)',ra],['Marche arrière manu / auto',fr(-RATIO_M.R,2)+' / '+fr(-RATIO_A.R,2)],
    ['Pont (17 / 63 dents)',fr(FD,2)],['Pneus','205/55 R16'],['Longueur × largeur × hauteur','4,20 × 1,76 × 1,48 m'],['Empattement','2,58 m'],['Masse (avec conducteur)','≈ 1 350 kg']];
  const evRows = [['Moteur','Synchrone à aimants permanents, 8 pôles'],['Puissance','100 kW (136 ch)'],['Couple','290 Nm dès 0 tr/min'],['Régime maximal','12 000 tr/min'],
    ['Batterie','35,8 kWh, 24 modules sous le plancher'],['Réducteur (1 seul rapport)',`17/45 puis 17/63 = ${fr(EV_TOTAL,2)}`],['Vitesse maxi','150 km/h'],['Pneus','205/55 R16'],['Masse (avec conducteur)','≈ 1 615 kg']];
  $('spec').innerHTML = (S.mode==='ev'?evRows:rows).map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
  $('specNote').textContent = S.mode==='ev' ? 'Valeurs proches d\'une compacte électrique de 2017 (100 kW, 35,8 kWh). Les formes sont simplifiées.' : 'Moteur et dimensions : valeurs d\'une compacte 2.0 essence de 150 ch des années 2000. Boîte auto : vrai schéma à trains épicycloïdaux, dentures choisies pour retrouver ses rapports. Boîte manuelle : rapports approchés. Les formes sont simplifiées.';
  $('subTxt').textContent = S.mode==='ev' ? 'Voiture électrique : batterie sous le plancher, moteur électrique à l\'avant, un seul rapport. Démarre, roule, et regarde l\'énergie aller… et revenir quand tu freines.' : S.mode==='auto' ? 'Moteur 4 cylindres essence et boîte automatique 6 vitesses, traction avant. Pas de pédale d\'embrayage : la boîte fait tout.' : 'Moteur 4 cylindres essence et boîte manuelle 6 vitesses, traction avant. Démarre, passe les vitesses et suis la force jusqu\'aux roues.';

  const els=['K1','K2','K3','B1','B2'];
  $('elems').innerHTML = `<tr><th></th>${els.map(e=>`<th>${e}</th>`).join('')}<th>×</th></tr>` +
    ['1','2','3','4','5','6','R'].map(g=>`<tr data-g="${g}"><th>${g==='R'?'R':g}</th>${els.map(e=>`<td class="${SHIFT_EL[g].includes(e)?'on':''}">${SHIFT_EL[g].includes(e)?'●':''}</td>`).join('')}<td>${fr(Math.abs(RATIO_A[g]),2)}</td></tr>`).join('');
}
renderSpec();
