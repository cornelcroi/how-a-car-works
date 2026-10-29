
/* ======================================================================
   FICHES DES PIÈCES
   ====================================================================== */
const ENG_IN = ['pistons','rods','crank','spark','coil','valvein','valveex','camin','camex','belt','flywheel'];
const CLUTCH_SET = ['flywheel','disc','pressure','diaphragm','bearing','fork'];
const TC_SET = ['tcimpeller','tcturbine','tcstator','tclockup','tcoil','flywheel'];
const MBOX = ['mainshaft','outshaft','gear1','gear2','gear3','gear4','gear5','gear6','gearR','synchro'];
const ABOX = ['autoshaft','pg1','ravigneaux','elK1','elK2','elK3','elB1','elB2','transfer'];
const INFO = {
  block:{t:tr('Bloc moteur','Engine block'), a:[EN.xc+0.09,0.45,-0.33], l:1, p:tr('La grosse pièce en fonte qui contient les 4 cylindres, où les pistons montent et descendent. De l\'eau circule tout autour pour le refroidir.','The big cast-iron part that holds the 4 cylinders, where the pistons go up and down. Water flows all around it to cool it.')},
  head:{t:tr('Culasse','Cylinder head'), a:[EN.xc+0.09,0.68,-0.33], l:2, p:tr('Le « couvercle » des cylindres. Elle contient les soupapes, les bougies et les arbres à cames. C\'est là que l\'essence explose.','The "lid" of the cylinders. It holds the valves, the spark plugs and the camshafts. This is where the petrol explodes.')},
  valvecover:{t:tr('Couvre-culasse','Valve cover'), a:[EN.xc,0.78,0.06], l:2, p:tr('Le capot en plastique sur le dessus du moteur. Il garde l\'huile à l\'intérieur, autour des arbres à cames.','The plastic cover on top of the engine. It keeps the oil inside, around the camshafts.')},
  sump:{t:tr('Carter d\'huile','Oil sump'), a:[EN.xc+0.08,0.22,-0.1], l:2, p:tr('Le réservoir d\'huile sous le moteur. Une pompe envoie cette huile partout pour que les pièces glissent sans s\'user.','The oil tank under the engine. A pump sends this oil everywhere so the parts slide without wearing out.')},
  timingcover:{t:tr('Cache de distribution','Timing cover'), a:[EN.xc+0.12,0.75,-0.36], l:2, p:tr('Un cache en plastique qui protège la courroie de distribution. Touche « Carter moteur » pour l\'enlever.','A plastic cover that protects the timing belt. Tap "Engine casing" to remove it.')},
  intake:{t:tr('Collecteur d\'admission','Intake manifold'), a:[EN.xc+0.25,0.62,-0.3], l:2, p:tr('Les tuyaux qui amènent l\'air jusqu\'aux cylindres. Chaque cylindre a son propre tuyau.','The pipes that bring air to the cylinders. Each cylinder has its own pipe.')},
  throttle:{t:tr('Papillon des gaz','Throttle'), a:[EN.xc+0.2,0.6,0.15], l:2, p:tr('Une petite porte ronde qui s\'ouvre quand tu appuies sur l\'accélérateur. Plus elle est ouverte, plus d\'air entre, plus le moteur pousse fort. Regarde-la tourner quand tu accélères !','A small round door that opens when you press the accelerator. The more it opens, the more air gets in, and the harder the engine pushes. Watch it turn when you accelerate!')},
  exhaustmani:{t:tr('Collecteur d\'échappement','Exhaust manifold'), a:[EN.xc-0.18,0.62,0.02], l:2, p:tr('Les 4 tuyaux qui récupèrent les gaz brûlés de chaque cylindre et les rassemblent en un seul.','The 4 pipes that collect the burnt gases from each cylinder and join them into one.')},
  catalyst:{t:tr('Catalyseur','Catalytic converter'), a:[EN.xc-0.24,0.38,-0.13], l:2, p:tr('Une boîte remplie d\'une sorte d\'éponge en céramique avec des métaux précieux. Elle rend les gaz d\'échappement beaucoup moins polluants.','A box filled with a kind of ceramic sponge coated with precious metals. It makes the exhaust gases much less polluting.')},
  crank:{t:tr('Vilebrequin','Crankshaft'), a:[EN.xc+0.02,EN.yc-0.08,-0.33], l:2, with:['pistons','rods','flywheel'], p:tr('Il transforme le mouvement de haut en bas des pistons en rotation, comme tes jambes font tourner les pédales d\'un vélo. Les masses rondes (contrepoids) l\'équilibrent.','It turns the up-and-down movement of the pistons into rotation, like your legs turning the pedals of a bike. The round weights (counterweights) balance it.')},
  pistons:{t:tr('Pistons','Pistons'), a:[EN.xc,0.6,-0.3], l:1, with:['rods','crank','spark'], p:tr('4 pistons de 82,5 mm de diamètre qui montent et descendent de 92,8 mm. Chacun fait 4 temps : il aspire l\'air et l\'essence, il comprime, BOUM ça explose et le pousse vers le bas, puis il chasse les gaz brûlés.','4 pistons, 82.5 mm wide, that go up and down by 92.8 mm. Each one does 4 strokes: it sucks in air and petrol, it squeezes, BOOM it explodes and pushes it down, then it pushes out the burnt gases.')},
  rods:{t:tr('Bielles','Connecting rods'), a:[EN.xc+0.03,0.5,-0.176], l:2, with:['pistons','crank'], p:tr('Les « bras » qui relient chaque piston au vilebrequin. Elles poussent et tirent des milliers de fois par minute.','The "arms" that link each piston to the crankshaft. They push and pull thousands of times a minute.')},
  spark:{t:tr('Bougies d\'allumage','Spark plugs'), a:[EN.xc,0.72,-0.088], l:1, with:['coil','pistons'], p:tr('Au centre de chaque cylindre, une bougie fait une étincelle juste quand le piston est tout en haut. L\'ordre est 1-3-4-2 : un cylindre s\'allume à chaque demi-tour du vilebrequin. Regarde la petite flamme orange !','In the middle of each cylinder, a spark plug makes a spark just when the piston is at the very top. The order is 1-3-4-2: one cylinder fires every half-turn of the crankshaft. Look at the little orange flame!')},
  coil:{t:tr('Bobines d\'allumage','Ignition coils'), a:[EN.xc,0.83,0.0], l:2, with:['spark'], p:tr('Une bobine posée sur chaque bougie. Elle transforme les 12 volts de la batterie en plus de 20 000 volts pour faire jaillir l\'étincelle.','A coil sits on each spark plug. It turns the battery\'s 12 volts into more than 20,000 volts to make the spark jump.')},
  camin:{t:tr('Arbre à cames d\'admission','Intake camshaft'), a:[EN.xc+VX,0.74,-0.2], l:2, with:['camex','valvein','valveex','belt'], p:tr('Ses bosses (les cames) appuient sur les soupapes pour les ouvrir au bon moment. Il tourne 2 fois moins vite que le vilebrequin, grâce à la courroie.','Its bumps (the cams) press on the valves to open them at the right moment. It turns half as fast as the crankshaft, thanks to the belt.')},
  camex:{t:tr('Arbre à cames d\'échappement','Exhaust camshaft'), a:[EN.xc-VX,0.74,-0.2], l:2, with:['camin','valvein','valveex','belt'], p:tr('Il ouvre les soupapes d\'échappement. Les deux arbres à cames sont reliés par deux petits engrenages, c\'est pour ça qu\'ils tournent en sens inverse.','It opens the exhaust valves. The two camshafts are linked by two small gears, which is why they turn in opposite directions.')},
  valvein:{t:tr('Soupapes d\'admission','Intake valves'), a:[EN.xc+VX+0.02,0.64,-0.25], l:2, with:['camin','pistons'], p:tr('2 par cylindre, côté avant. Elles s\'ouvrent pour laisser entrer l\'air pendant que le piston descend. Un ressort les referme.','2 per cylinder, on the front side. They open to let air in while the piston goes down. A spring closes them again.')},
  valveex:{t:tr('Soupapes d\'échappement','Exhaust valves'), a:[EN.xc-VX-0.02,0.64,-0.25], l:2, with:['camex','pistons'], p:tr('2 par cylindre, côté arrière. Elles s\'ouvrent pour laisser sortir les gaz brûlés pendant que le piston remonte.','2 per cylinder, on the back side. They open to let the burnt gases out while the piston goes back up.')},
  belt:{t:tr('Courroie de distribution','Timing belt'), a:[EN.xc+0.07,0.45,-0.35], l:1, with:['crank','camin','camex','valvein','valveex','pistons'], p:tr('Une courroie crantée qui relie le vilebrequin à l\'arbre à cames. Le pignon du haut a 2 fois plus de dents : les soupapes s\'ouvrent une fois tous les 2 tours. Si elle casse, le moteur s\'arrête net.','A toothed belt that links the crankshaft to the camshaft. The top pulley has twice as many teeth: the valves open once every 2 turns. If it breaks, the engine stops dead.')},
  flywheel:{t:tr('Volant moteur','Flywheel'), a:[EN.xc,EN.yc+0.16,0.07], l:1, with:['starter','crank'], p:tr('Un disque lourd au bout du vilebrequin. Il aide le moteur à tourner régulièrement entre deux explosions. Sa couronne dentée sert au démarreur.','A heavy disc at the end of the crankshaft. It helps the engine turn smoothly between two explosions. Its toothed ring is used by the starter.')},
  starter:{t:tr('Démarreur','Starter motor'), a:[STX,STY+0.05,0.25], l:2, with:['flywheel','battery'], p:tr('Un moteur électrique alimenté par la batterie. Quand tu tournes la clé, son petit pignon avance, s\'engrène sur la couronne du volant moteur et le fait tourner, puis il recule.','An electric motor powered by the battery. When you turn the key, its small gear moves forward, meshes with the flywheel\'s toothed ring and turns it, then moves back.')},
  disc:{t:tr('Disque d\'embrayage','Clutch disc'), mode:'manual', a:[EN.xc,EN.yc+0.135,0.084], l:1, with:CLUTCH_SET, p:tr('Un disque recouvert d\'une garniture qui accroche, fixé sur l\'arbre de la boîte. Serré contre le volant moteur, il tourne avec le moteur. Ses petits ressorts amortissent les à-coups.','A disc covered with a grippy lining, fixed on the gearbox shaft. Squeezed against the flywheel, it turns with the engine. Its small springs soften the jolts.')},
  pressure:{t:tr('Mécanisme d\'embrayage','Clutch pressure plate'), mode:'manual', a:[EN.xc+0.1,EN.yc+0.08,0.1], l:2, with:CLUTCH_SET, p:tr('Le plateau de pression et son couvercle, vissés sur le volant moteur. Le plateau serre le disque très fort contre le volant moteur.','The pressure plate and its cover, bolted to the flywheel. The plate squeezes the disc very hard against the flywheel.')},
  diaphragm:{t:tr('Diaphragme','Diaphragm spring'), mode:'manual', a:[EN.xc-0.05,EN.yc+0.07,0.114], l:2, with:CLUTCH_SET, p:tr('Un grand ressort en forme d\'assiette, avec des doigts. Au repos, il pousse le plateau pour serrer le disque. Quand la butée appuie sur ses doigts, il se retourne et libère le disque.','A big plate-shaped spring with fingers. At rest, it pushes the plate to squeeze the disc. When the release bearing presses on its fingers, it flips and frees the disc.')},
  bearing:{t:tr('Butée d\'embrayage','Release bearing'), mode:'manual', a:[EN.xc,EN.yc-0.05,0.125], l:2, with:CLUTCH_SET, p:tr('Un roulement qui avance contre les doigts du diaphragme quand tu appuies sur la pédale.','A bearing that moves against the diaphragm\'s fingers when you press the pedal.')},
  fork:{t:tr('Fourchette d\'embrayage','Clutch fork'), mode:'manual', a:[EN.xc-0.12,EN.yc+0.03,0.135], l:2, with:CLUTCH_SET, p:tr('Le levier que la pédale fait bouger (par un tuyau d\'huile). Il pousse la butée.','The lever that the pedal moves (through an oil pipe). It pushes the release bearing.')},
  tcimpeller:{t:tr('Convertisseur : pompe','Converter: pump'), mode:'auto', a:[EN.xc,EN.yc+0.15,0.13], l:1, with:TC_SET, p:tr('Le convertisseur de couple remplace l\'embrayage. La pompe tourne avec le moteur et projette de l\'huile, comme un ventilateur qui soufflerait de l\'huile.','The torque converter replaces the clutch. The pump turns with the engine and throws oil, like a fan that would blow oil.')},
  tcturbine:{t:tr('Convertisseur : turbine','Converter: turbine'), mode:'auto', a:[EN.xc+0.08,EN.yc+0.1,0.09], l:2, with:TC_SET, p:tr('L\'huile projetée par la pompe vient frapper ses aubes et la fait tourner. Elle est reliée à la boîte. À l\'arrêt, elle peut rester immobile pendant que le moteur tourne : c\'est pour ça qu\'une auto ne cale pas.','The oil thrown by the pump hits its blades and makes it turn. It is linked to the gearbox. When stopped, it can stay still while the engine runs: that\'s why an automatic doesn\'t stall.')},
  tcstator:{t:tr('Convertisseur : réacteur','Converter: stator'), mode:'auto', a:[EN.xc-0.07,EN.yc-0.02,0.12], l:2, with:TC_SET, p:tr('La petite roue du milieu. Elle redresse l\'huile qui revient vers la pompe. Au démarrage, cela double presque la force !','The small wheel in the middle. It redirects the oil flowing back to the pump. When pulling away, this almost doubles the force!')},
  tclockup:{t:tr('Embrayage de pontage','Lock-up clutch'), mode:'auto', a:[EN.xc-0.08,EN.yc+0.08,0.06], l:2, with:TC_SET, p:tr('À vitesse stable, ce disque se colle et relie directement le moteur à la boîte, pour ne plus perdre d\'énergie dans l\'huile.','At a steady speed, this disc locks and links the engine straight to the gearbox, so no more energy is lost in the oil.')},
  tcoil:{t:tr('Huile du convertisseur','Converter oil'), mode:'auto', l:2, with:TC_SET, p:tr('Les points orange montrent l\'huile qui tourne en rond entre la pompe, la turbine et le réacteur.','The orange dots show the oil going round between the pump, the turbine and the stator.')},
  gbcase:{t:tr('Boîte de vitesses','Gearbox'), a:[1.29,0.53,0.32], l:1, p:tr('Elle contient les engrenages qui changent la vitesse de rotation entre le moteur et les roues, et le différentiel. Touche les engrenages à l\'intérieur pour les découvrir.','It holds the gears that change the turning speed between the engine and the wheels, and the differential. Tap the gears inside to learn about them.')},
  mainshaft:{t:tr('Arbre primaire','Input shaft'), mode:'manual', a:[IX,IY+0.06,0.42], l:2, with:MBOX, p:tr('L\'arbre qui sort de l\'embrayage. Ses 6 pignons font tourner en permanence les 6 pignons de l\'arbre secondaire.','The shaft coming out of the clutch. Its 6 gears always turn the 6 gears on the output shaft.')},
  outshaft:{t:tr('Arbre secondaire','Output shaft'), mode:'manual', a:[OX,OY-0.06,0.43], l:2, with:MBOX.concat(['diff']), p:tr('Ses pignons tournent fou, sauf celui qui est verrouillé par un baladeur. Au bout, un petit pignon (le pignon d\'attaque) entraîne la couronne du différentiel.','Its gears spin freely, except the one locked by a selector collar. At the end, a small gear (the pinion) drives the differential\'s ring gear.')},
  synchro:{t:tr('Baladeurs (synchros)','Selector collars (synchros)'), mode:'manual', a:[OX,OY+0.07,0.3], l:2, with:MBOX, p:tr('Les anneaux bleus. Quand tu bouges le levier, une fourchette fait glisser un anneau qui verrouille un pignon sur l\'arbre. Un petit cône (le synchro) égalise d\'abord les vitesses pour que ça ne craque pas.','The blue rings. When you move the lever, a fork slides a ring that locks a gear onto the shaft. A small cone (the synchro) first matches the speeds so it doesn\'t grind.')},
  gear1:{t:tr('Pignons de 1re','1st gear pair'), mode:'manual', with:MBOX, p:tr('13 dents font tourner 49 dents : les roues tournent 3,8 fois moins vite que le moteur mais avec beaucoup de force. Pour démarrer.','13 teeth turn 49 teeth: the wheels turn 3.8 times slower than the engine but with lots of force. For pulling away.')},
  gear2:{t:tr('Pignons de 2e','2nd gear pair'), mode:'manual', with:MBOX, p:tr('20 dents pour 42 dents : rapport 2,1.','20 teeth to 42 teeth: ratio 2.1.')},
  gear3:{t:tr('Pignons de 3e','3rd gear pair'), mode:'manual', with:MBOX, p:tr('26 dents pour 36 dents : rapport 1,38.','26 teeth to 36 teeth: ratio 1.38.')},
  gear4:{t:tr('Pignons de 4e','4th gear pair'), mode:'manual', with:MBOX, p:tr('30 dents pour 32 dents : presque la même vitesse que le moteur.','30 teeth to 32 teeth: almost the same speed as the engine.')},
  gear5:{t:tr('Pignons de 5e','5th gear pair'), mode:'manual', with:MBOX, p:tr('33 dents pour 29 dents : la sortie tourne plus vite que le moteur.','33 teeth to 29 teeth: the output turns faster than the engine.')},
  gear6:{t:tr('Pignons de 6e','6th gear pair'), mode:'manual', with:MBOX, p:tr('36 dents pour 26 dents : pour l\'autoroute, le moteur tourne lentement et consomme peu.','36 teeth to 26 teeth: for the motorway, the engine turns slowly and uses little fuel.')},
  gearR:{t:tr('Marche arrière','Reverse gear'), mode:'manual', with:MBOX, p:tr('Un pignon en plus (le doré) se glisse entre les deux arbres et inverse le sens de rotation.','An extra gear (the golden one) slides between the two shafts and reverses the direction of rotation.')},
  autoshaft:{t:tr('Arbre d\'entrée','Input shaft'), mode:'auto', a:[IX,IY+0.05,0.4], l:2, with:ABOX, p:tr('Il sort de la turbine du convertisseur et entraîne les trains épicycloïdaux.','It comes out of the converter\'s turbine and drives the planetary gearsets.')},
  pg1:{t:tr('Train épicycloïdal simple','Simple planetary gearset'), mode:'auto', a:[IX,IY+0.1,0.175], l:2, with:ABOX, p:tr('Un soleil au centre (bloqué), 3 satellites autour, et une couronne dentée à l\'intérieur. La couronne, entraînée par le moteur, fait tourner le porte-satellites 1,55 fois moins vite.','A sun gear in the middle (held), 3 planet gears around it, and a ring gear with teeth on the inside. The ring, driven by the engine, turns the planet carrier 1.55 times slower.')},
  ravigneaux:{t:tr('Train Ravigneaux','Ravigneaux gearset'), mode:'auto', a:[IX,IY-0.1,0.3], l:2, with:ABOX, p:tr('Deux soleils, des satellites courts et longs, une seule couronne qui sort vers les roues. Selon ce qu\'on bloque ou qu\'on relie, il donne 6 vitesses et la marche arrière. Pas besoin de déplacer d\'engrenages !','Two sun gears, short and long planet gears, and one ring gear going out to the wheels. Depending on what is held or linked, it gives 6 gears and reverse. No need to move any gears!')},
  elK1:{t:tr('Embrayage K1','Clutch K1'), mode:'auto', with:ABOX, p:tr('Relie le train simple au petit soleil du Ravigneaux. Serré en 1re, 2e, 3e et 4e.','Links the simple gearset to the Ravigneaux\'s small sun gear. Applied in 1st, 2nd, 3rd and 4th.')},
  elK2:{t:tr('Embrayage K2','Clutch K2'), mode:'auto', with:ABOX, p:tr('Relie l\'arbre d\'entrée au porte-satellites du Ravigneaux. Serré en 4e, 5e et 6e.','Links the input shaft to the Ravigneaux\'s planet carrier. Applied in 4th, 5th and 6th.')},
  elK3:{t:tr('Embrayage K3','Clutch K3'), mode:'auto', with:ABOX, p:tr('Relie le train simple au grand soleil. Serré en 3e, 5e et marche arrière.','Links the simple gearset to the large sun gear. Applied in 3rd, 5th and reverse.')},
  elB1:{t:tr('Frein B1','Brake B1'), mode:'auto', with:ABOX, p:tr('Bloque le grand soleil. Serré en 2e et 6e.','Holds the large sun gear. Applied in 2nd and 6th.')},
  elB2:{t:tr('Frein B2','Brake B2'), mode:'auto', with:ABOX, p:tr('Bloque le porte-satellites. Serré en 1re et marche arrière.','Holds the planet carrier. Applied in 1st and reverse.')},
  transfer:{t:tr('Arbre de transfert','Transfer shaft'), mode:'auto', a:[OX,OY-0.06,0.4], l:2, with:ABOX.concat(['diff']), p:tr('La couronne du Ravigneaux entraîne cet arbre, qui porte le pignon d\'attaque du différentiel.','The Ravigneaux\'s ring gear drives this shaft, which carries the differential\'s pinion.')},
  diff:{t:tr('Pont et différentiel','Final drive and differential'), a:[DX,DY+0.12,0.44], l:1, with:['cv','outshaft','transfer'], p:tr('Le petit pignon d\'attaque (17 dents) fait tourner la grande couronne (63 dents) : encore 3,7 fois moins vite. À l\'intérieur, des petits engrenages laissent les roues gauche et droite tourner à des vitesses différentes dans les virages.','The small pinion (17 teeth) turns the big ring gear (63 teeth): another 3.7 times slower. Inside, small gears let the left and right wheels turn at different speeds in corners.')},
  cv:{t:tr('Cardans','Driveshafts'), a:[1.24,0.33,-0.35], l:1, with:['diff','wheelF'], p:tr('Les arbres qui vont du différentiel aux roues avant. Leurs joints homocinétiques (sous les soufflets en caoutchouc) laissent les roues tourner et monter-descendre tout en transmettant la force.','The shafts that go from the differential to the front wheels. Their CV joints (under the rubber boots) let the wheels steer and move up and down while still passing on the force.')},
  wheelF:{t:tr('Roues avant (motrices)','Front wheels (driven)'), a:[WH.xF,0.67,WH.zF+0.05], l:1, with:['cv','brakedisc','caliper'], p:tr('Sur cette voiture, ce sont les roues avant qui tirent la voiture, et ce sont aussi elles qui tournent pour diriger. Pneus 205/55 R16 : 63 cm de diamètre.','On this car, the front wheels pull the car, and they are also the ones that turn to steer. 205/55 R16 tyres: 63 cm across.')},
  wheelR:{t:tr('Roues arrière','Rear wheels'), a:[WH.xR,0.67,WH.zR+0.05], l:2, with:['brakedisc','caliper'], p:tr('Elles ne sont pas reliées au moteur : elles roulent simplement et portent l\'arrière de la voiture.','They are not linked to the engine: they just roll and carry the back of the car.')},
  brakedisc:{t:tr('Disques de frein','Brake discs'), a:[WH.xF+0.05,WH.r+0.17,WH.zF-0.09], l:2, with:['caliper','wheelF'], p:tr('Des disques en acier qui tournent avec les roues (28,8 cm à l\'avant). Ils ont des trous et sont creux pour refroidir.','Steel discs that turn with the wheels (28.8 cm at the front). They have holes and are hollow to cool down.')},
  caliper:{t:tr('Étriers et plaquettes','Calipers and pads'), a:[WH.xF-0.15,WH.r+0.08,WH.zF-0.09], l:2, with:['brakedisc','wheelF'], p:tr('Quand tu freines, l\'huile pousse les plaquettes contre le disque. Le frottement transforme la vitesse en chaleur.','When you brake, oil pushes the pads against the disc. The rubbing turns speed into heat.')},
  strut:{t:tr('Jambes de force','Struts'), a:[WH.xF-0.05,0.8,WH.zF-0.2], l:2, p:tr('Le ressort rouge et l\'amortisseur. Ils absorbent les bosses de la route.','The red spring and the shock absorber. They soak up the bumps in the road.')},
  arm:{t:tr('Triangles de suspension','Wishbones'), p:tr('Ils tiennent le bas de la roue avant et la laissent monter et descendre.','They hold the bottom of the front wheel and let it move up and down.')},
  rearaxle:{t:tr('Essieu arrière multibras','Multi-link rear axle'), a:[WH.xR+0.1,0.45,0.5], l:2, p:tr('Plusieurs bras qui guident chaque roue arrière, avec un ressort et un amortisseur.','Several arms that guide each rear wheel, with a spring and a shock absorber.')},
  subframe:{t:tr('Berceau','Subframe'), p:tr('Le cadre qui porte le moteur et la suspension avant.','The frame that carries the engine and the front suspension.')},
  exhaust:{t:tr('Ligne d\'échappement','Exhaust system'), a:[-1.82,0.4,0.38], l:2, p:tr('Les gaz passent par le catalyseur puis le silencieux, qui calme le bruit des explosions, avant de sortir à l\'arrière.','The gases go through the catalytic converter, then the silencer, which quietens the noise of the explosions, before leaving at the back.')},
  tank:{t:tr('Réservoir d\'essence','Fuel tank'), a:[-0.9,0.42,-0.05], l:2, p:tr('Environ 55 litres d\'essence, sous la banquette arrière. Une pompe l\'envoie au moteur.','About 55 litres of petrol, under the rear seat. A pump sends it to the engine.')},
  radiator:{t:tr('Radiateur','Radiator'), a:[1.88,0.75,0.2], l:2, p:tr('L\'eau chaude du moteur passe dans ses fines lamelles et l\'air qui entre par la calandre la refroidit.','Hot water from the engine flows through its thin fins, and the air coming in through the grille cools it.')},
  battery:{t:tr('Batterie','Battery'), a:[1.45,0.9,0.45], l:1, with:['starter'], p:tr('12 volts. Elle fait tourner le démarreur et allume les phares. Quand le moteur tourne, l\'alternateur la recharge.','12 volts. It turns the starter and powers the headlights. When the engine runs, the alternator recharges it.')},
  seat:{t:tr('Sièges','Seats'), p:tr('5 places : deux à l\'avant, une banquette à l\'arrière.','5 seats: two at the front, a bench at the back.')},
  dash:{t:tr('Tableau de bord','Dashboard'), p:tr('Avec le compte-tours, le compteur de vitesse et les voyants.','With the rev counter, the speedometer and the warning lights.')},
  steering:{t:tr('Volant','Steering wheel'), p:tr('Il fait tourner les roues avant par une crémaillère.','It turns the front wheels through a steering rack.')},
  pedalclutch:{t:tr('Pédale d\'embrayage','Clutch pedal'), mode:'manual', a:[0.8,0.42,0.47], l:2, p:tr('Elle bouge quand tu appuies sur la pédale d\'embrayage à droite de l\'écran.','It moves when you press the clutch pedal on the right of the screen.')},
  pedalbrake:{t:tr('Pédale de frein','Brake pedal'), a:[0.8,0.42,0.37], l:2, p:tr('La pédale du milieu (ou de gauche en boîte auto).','The middle pedal (or the left one in an automatic).')},
  pedalgas:{t:tr('Accélérateur','Accelerator'), a:[0.8,0.42,0.27], l:2, p:tr('Il ouvre le papillon des gaz dans le moteur.','It opens the throttle in the engine.')},
  lever:{t:tr('Levier de vitesses','Gear lever'), a:[0.42,0.8,0], l:2, p:tr('Il bouge comme le levier de l\'écran.','It moves like the lever on the screen.')},
  body:{t:tr('Carrosserie','Body'), p:tr('La coque en acier : 4,20 m de long, 1,76 m de large et 1,48 m de haut. Choisis « Pleine », « Transparente » ou « Masquée » dans Affichage.','The steel shell: 4.20 m long, 1.76 m wide and 1.48 m high. Choose "Solid", "See-through" or "Hidden" in Display.')},
  glass:{t:tr('Vitres','Windows'), p:tr('Pare-brise, vitres latérales et lunette arrière.','Windscreen, side windows and rear window.')},
  headlight:{t:tr('Phares','Headlights'), a:[2.06,0.75,0.57], l:2, p:tr('Allume-les avec « Phares » dans Affichage.','Turn them on with "Headlights" in Display.')},
  taillight:{t:tr('Feux arrière','Rear lights'), a:[-2.04,0.98,0.6], l:2, p:tr('Ils s\'allument plus fort quand tu freines, et le feu blanc de recul s\'allume en marche arrière.','They light up brighter when you brake, and the white reversing light comes on in reverse.')},
  road:{t:tr('Route','Road'), p:tr('Elle défile quand la voiture roule.','It scrolls by when the car moves.')},
  evstator:{t:tr('Moteur électrique','Electric motor'), mode:'ev', a:[IX+0.05,IY+0.17,-0.24], l:1, with:['evcoil','evrotor','inverter'], p:tr('Il remplace tout le moteur à essence : pas de pistons, pas d\'explosions, presque pas de bruit. 100 kW et 290 Nm, disponibles dès l\'arrêt. Il tourne jusqu\'à 12 000 tours par minute.','It replaces the whole petrol engine: no pistons, no explosions, almost no noise. 100 kW and 290 Nm, available from a standstill. It spins up to 12,000 revolutions per minute.')},
  evcoil:{t:tr('Bobines du stator','Stator coils'), mode:'ev', a:[IX-0.1,IY+0.1,-0.03], l:2, with:['evstator','evrotor','inverter'], p:tr('9 bobines de cuivre fixes. L\'onduleur les alimente chacune à leur tour (3 couleurs = 3 phases) : cela crée un champ magnétique qui tourne en rond, comme un aimant invisible qui tournerait.','9 fixed copper coils. The inverter powers each one in turn (3 colours = 3 phases): this creates a magnetic field that goes round in a circle, like an invisible spinning magnet.')},
  evrotor:{t:tr('Rotor à aimants','Magnet rotor'), mode:'ev', a:[IX,IY-0.05,0.0], l:2, with:['evstator','evcoil','reducer'], p:tr('La partie qui tourne. Ses aimants (rouges = nord, bleus = sud) sont attirés par le champ qui tourne et le suivent. Quand on freine, c\'est l\'inverse : les aimants qui tournent créent du courant dans les bobines.','The part that spins. Its magnets (red = north, blue = south) are pulled by the rotating field and follow it. When you brake, it\'s the other way round: the spinning magnets create current in the coils.')},
  inverter:{t:tr('Onduleur','Inverter'), mode:'ev', a:[IX,0.72,-0.14], l:1, with:['hvcable','evcoil','evstator'], p:tr('Le « cerveau » électrique. La batterie donne du courant continu ; l\'onduleur le découpe en courant alternatif à 3 phases pour le moteur. Plus tu appuies sur l\'accélérateur, plus il envoie de courant.','The electric "brain". The battery gives direct current; the inverter chops it into 3-phase alternating current for the motor. The more you press the accelerator, the more current it sends.')},
  reducer:{t:tr('Réducteur','Reducer'), mode:'ev', a:[1.29,0.53,0.28], l:1, with:['evrotor','diff','cv'], p:tr('Pas de boîte de vitesses ! Un seul rapport : le petit pignon du moteur (17 dents) entraîne une grande roue (45 dents), puis le pignon d\'attaque fait tourner le différentiel. Au total, le moteur fait 9,8 tours pour 1 tour de roue.','No gearbox! A single ratio: the motor\'s small gear (17 teeth) drives a big wheel (45 teeth), then the pinion turns the differential. In total, the motor makes 9.8 turns for 1 turn of the wheel.')},
  hvbat:{t:tr('Batterie haute tension','High-voltage battery'), mode:'ev', a:[-0.08,0.33,0.62], l:1, with:['hvcable'], p:tr('24 modules remplis de cellules lithium-ion, environ 320 volts. Elle stocke 35,8 kWh, de quoi rouler environ 200 km. Elle est sous le plancher : le poids est bas, la voiture tient mieux la route.','24 modules full of lithium-ion cells, about 320 volts. It stores 35.8 kWh, enough for about 200 km. It sits under the floor: the weight is low, so the car holds the road better.')},
  hvcable:{t:tr('Câbles haute tension','High-voltage cables'), mode:'ev', a:[1.1,0.36,-0.32], l:2, with:['hvbat','inverter'], p:tr('Toujours orange : c\'est la couleur des câbles haute tension, dangereux à toucher. Les points montrent l\'énergie : orange quand elle va vers le moteur, vert quand elle revient recharger la batterie.','Always orange: that\'s the colour of high-voltage cables, dangerous to touch. The dots show the energy: orange when it goes to the motor, green when it comes back to recharge the battery.')},
  chargeport:{t:tr('Prise de recharge','Charging port'), mode:'ev', a:[-1.62,1.0,-0.9], l:2, p:tr('On y branche le câble pour recharger la batterie, à la maison ou sur une borne.','You plug the cable in here to recharge the battery, at home or at a charging station.')},
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
  $('explodeBtn').hidden = !canExplode; explodeTarget = 0; $('explodeBtn').textContent = tr('Écarter les pièces','Spread the parts');
  refreshVis(); frameVisible();
}
function unIsolate(){ iso=null; isoKey=null; $('isobar').hidden=true; explodeTarget=0; refreshVis(); goView('car'); }
$('isoAll').onclick = unIsolate;
$('explodeBtn').onclick = ()=>{ explodeTarget = explodeTarget ? 0 : 1; $('explodeBtn').textContent = explodeTarget ? tr('Rassembler','Put back together') : tr('Écarter les pièces','Spread the parts'); };
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
  if(simple){ flyTo(new THREE.Vector3(2.9,1.7,2.3), new THREE.Vector3(0.95,0.4,0)); say(tr('Vue simple : seulement le moteur et ses cylindres, l\'embrayage, la boîte, les cardans et les roues. Démarre et passe une vitesse pour voir tout bouger !','Simple view: just the engine and its cylinders, the clutch, the gearbox, the driveshafts and the wheels. Start the engine and select a gear to see everything move!'),6); }
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
    {focus:null, body:'ghost', dir:[1,0.42,0.85], zoom:[1.3,1.0], orbit:0.6, dur:5, cap:tr('Comment une voiture *avance* ?','How does a car *move*?'), sub:tr('On suit la force, du moteur jusqu\'aux roues','Let\'s follow the force, from the engine to the wheels'), act:resetForTour},
    {focus:'block', body:'ghost', dir:[0.9,0.65,-0.7], zoom:[1.7,1.05], orbit:0.35, dur:4.5, cap:tr('Sous le capot : le *moteur*','Under the bonnet: the *engine*'), sub:tr('4 cylindres en ligne, posé en travers','4 cylinders in a row, mounted sideways')},
    {focus:'pistons', iso:['pistons','rods','crank','spark','coil'], dir:[1,0.35,-0.75], zoom:[1.5,0.95], orbit:0.4, dur:5, cap:tr('4 *pistons* montent et descendent','4 *pistons* go up and down'), sub:tr('Course : 9,3 cm à chaque passage','Stroke: 9.3 cm each time'), act:startEngineForTour},
    {focus:'spark', iso:['pistons','rods','crank','spark','coil'], dir:[0.8,0.55,-0.5], zoom:[1.1,0.7], orbit:0.25, dur:5.5, slow:0.0167, cap:tr('L\'*étincelle* enflamme l\'essence… BOUM !','The *spark* lights the petrol… BOOM!'), sub:tr('L\'explosion pousse le piston vers le bas','The explosion pushes the piston down')},
    {focus:'valvein', iso:['camin','camex','valvein','valveex','pistons'], dir:[1,0.5,-0.9], zoom:[1.2,0.85], orbit:0.3, dur:5, slow:0.0167, cap:tr('Les *soupapes* laissent respirer le moteur','The *valves* let the engine breathe'), sub:tr('Les cames les poussent au bon moment','The cams push them at the right moment')},
    {focus:'belt', iso:['belt','crank','camin','camex'], dir:[0.5,0.35,-1], zoom:[1.4,1.0], orbit:0.35, dur:4.5, cap:tr('La *courroie* fait tourner les cames','The *belt* turns the cams'), sub:tr('2 fois moins vite que le vilebrequin','Half as fast as the crankshaft')},
    {focus:'crank', iso:['crank','pistons','rods','flywheel'], dir:[0.9,0.2,-0.6], zoom:[1.3,0.9], orbit:0.5, dur:4.5, cap:tr('Le *vilebrequin* transforme tout en rotation','The *crankshaft* turns it all into rotation'), sub:tr('Comme tes jambes sur les pédales d\'un vélo','Like your legs on a bike\'s pedals')},
  ];
  const manualMid = [
    {focus:'disc', iso:CLUTCH_SET, explode:1, dir:[0.55,0.35,1], zoom:[1.3,0.95], orbit:0.5, dur:5.5, cap:tr('L\'*embrayage* : des pièces serrées ensemble','The *clutch*: parts squeezed together'), sub:tr('Volant moteur, disque, plateau, diaphragme','Flywheel, disc, pressure plate, diaphragm spring')},
    {focus:'disc', iso:CLUTCH_SET, explode:0, dir:[0.7,0.3,1], zoom:[1.1,0.85], orbit:0.3, dur:5, cap:tr('Pédale enfoncée : le disque est *libéré*','Pedal down: the disc is *released*'), sub:tr('Le moteur ne touche plus la boîte','The engine no longer touches the gearbox'), act:()=>{ anim.clutch={to:1,rate:2.5}; }},
    {focus:'synchro', iso:MBOX, dir:[0.6,0.6,0.9], zoom:[1.3,0.95], orbit:0.35, dur:5, cap:tr('On passe la *1re* : le baladeur bleu glisse','We select *1st*: the blue collar slides'), sub:tr('Il verrouille un pignon sur l\'arbre','It locks a gear onto the shaft'), act:()=>{ const tok=tour; setTimeout(()=>{ if(tour===tok) selectGear('1'); }, 900); }},
    {focus:'gear1', iso:MBOX.concat(['disc','flywheel']), dir:[0.75,0.5,0.85], zoom:[1.2,0.9], orbit:0.3, dur:6, cap:tr('On relâche la pédale : la force *passe* !','We release the pedal: the force *flows*!'), sub:tr('Petit pignon → grand pignon = beaucoup de force','Small gear → big gear = lots of force'), act:()=>{ anim.gas={to:0.3,rate:1}; anim.clutch={to:0,rate:0.35}; }},
  ];
  const autoMid = [
    {focus:'tcimpeller', iso:TC_SET, explode:1, dir:[0.55,0.35,1], zoom:[1.3,0.95], orbit:0.5, dur:5.5, cap:tr('Le *convertisseur* : de l\'huile à la place de l\'embrayage','The *converter*: oil instead of a clutch'), sub:tr('Pompe, réacteur et turbine','Pump, stator and turbine')},
    {focus:'tcturbine', iso:TC_SET, explode:0, dir:[0.7,0.3,1], zoom:[1.1,0.85], orbit:0.3, dur:5, cap:tr('En *D*, l\'huile pousse la turbine','In *D*, the oil pushes the turbine'), sub:tr('Pied sur le frein, la voiture veut déjà avancer','Foot on the brake, the car already wants to move'), act:()=>{ anim.brake={to:1,rate:4}; const tok=tour; setTimeout(()=>{ if(tour===tok) selectAuto('D'); }, 700); }},
    {focus:'ravigneaux', iso:ABOX, dir:[0.6,0.5,1], zoom:[1.3,0.9], orbit:0.4, dur:5.5, cap:tr('Les *trains épicycloïdaux* changent la vitesse','The *planetary* gearsets change the speed'), sub:tr('Soleils, satellites et couronne','Sun gears, planet gears and ring gear'), act:()=>{ anim.brake={to:0,rate:3}; anim.gas={to:0.35,rate:1}; }},
    {focus:'elK1', iso:ABOX, dir:[0.8,0.6,0.7], zoom:[1.1,0.85], orbit:0.3, dur:5, cap:tr('Les embrayages *K* et freins *B* se serrent','The *K* clutches and B brakes apply'), sub:tr('2 éléments serrés = 1 vitesse (en vert)','2 applied elements = 1 gear (in green)')},
  ];
  const common2 = [
    {focus:'diff', iso:['diff','cv', auto?'transfer':'outshaft'], dir:[-0.5,0.55,1], zoom:[1.4,1.0], orbit:0.4, dur:4.5, cap:tr('Le *différentiel* partage la force','The *differential* shares the force'), sub:tr('Entre la roue gauche et la roue droite','Between the left wheel and the right wheel')},
    {focus:'cv', iso:['diff','cv','wheelF'], dir:[0.15,-0.9,0.55], zoom:[1.2,0.95], orbit:0.3, dur:4.5, cap:tr('Les *cardans* l\'emmènent jusqu\'aux roues','The *driveshafts* carry it to the wheels'), sub:tr('Celui de droite passe derrière le moteur','The right one runs behind the engine')},
    {focus:'wheelF', body:'ghost', dir:[0.35,0.25,1], zoom:[1.6,1.1], orbit:0.4, dur:4.5, cap:tr('Et la roue *pousse* sur la route !','And the wheel *pushes* on the road!'), sub:tr('Pneu 205/55 R16','205/55 R16 tyre')},
    auto ? {focus:'ravigneaux', iso:ABOX, dir:[0.6,0.5,1], zoom:[1.2,0.95], orbit:0.3, dur:6, cap:tr('La boîte change de vitesse *toute seule*','The gearbox changes gear by *itself*'), sub:tr('Regarde le compte-tours redescendre','Watch the rev counter drop'), act:()=>{ anim.gas={to:0.6,rate:1}; }}
         : {focus:'gear2', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.2,0.95], orbit:0.3, dur:6, cap:tr('On passe la *2e* : le moteur tourne moins vite','We select *2nd*: the engine turns slower'), sub:tr('Regarde le compte-tours redescendre','Watch the rev counter drop'), act:()=>tourShift('2')},
    {focus:null, body:'ghost', dir:[0.9,0.35,-0.9], zoom:[1.15,1.35], orbit:0.6, dur:5, cap:tr('Du moteur *aux roues* !','From the engine to the *wheels*!'), sub:tr('À toi de jouer maintenant','Now it\'s your turn'), act:()=>{ anim.gas={to:0.2,rate:1}; }},
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
    {id:'neutral', t:tr('Moteur allumé, voiture à l\'arrêt','Engine on, car not moving'), d:tr('Pourquoi les roues ne tournent pas au point mort','Why the wheels don\'t turn in neutral'), shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.5, dur:5, cap:tr('Le moteur tourne… mais la voiture ne bouge *pas* !','The engine runs… but the car does *not* move!'), sub:tr('Levier au point mort, pied levé de l\'embrayage','Lever in neutral, foot off the clutch'), act:()=>{ setupState({}); pressStart(); }},
      {focus:'pistons', iso:ENGINE_SHOT, dir:[1,0.35,-0.75], zoom:[1.4,0.95], orbit:0.4, dur:5, cap:tr('Dans le moteur, tout *tourne*','Inside the engine, everything *turns*'), sub:tr('Environ 760 tours par minute au ralenti','About 760 revolutions per minute at idle')},
      {focus:'disc', iso:CLUTCH_SET.concat(['mainshaft']), dir:[0.6,0.35,1], zoom:[1.3,0.95], orbit:0.4, dur:5, cap:tr('L\'embrayage est *serré* : la boîte tourne aussi','The clutch is *engaged*: the gearbox turns too'), sub:tr('Le disque tourne avec le volant moteur','The disc turns with the flywheel')},
      {focus:'mainshaft', iso:MBOX, dir:[0.6,0.6,0.9], zoom:[1.25,0.95], orbit:0.35, dur:5.5, cap:tr('L\'arbre primaire fait tourner *tous* les pignons','The input shaft turns *all* the gears'), sub:tr('Les 6 pignons de l\'arbre du bas tournent… mais dans le vide','The 6 gears on the lower shaft turn… but freely')},
      {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.8], orbit:0.3, dur:5, cap:tr('Les baladeurs bleus sont au *milieu*','The blue collars are in the *middle*'), sub:tr('Aucun pignon n\'est accroché à l\'arbre de sortie','No gear is locked to the output shaft')},
      {focus:'outshaft', iso:MBOX.concat(['diff']), dir:[0.4,0.3,1], zoom:[1.2,0.9], orbit:0.3, dur:5, cap:tr('L\'arbre de sortie reste *immobile*','The output shaft stays *still*'), sub:tr('Rien ne part vers le différentiel','Nothing goes to the differential')},
      {focus:'wheelF', iso:['diff','cv','wheelF','brakedisc'], dir:[0.35,0.4,1], zoom:[1.4,1.0], orbit:0.3, dur:4.5, cap:tr('Les roues ne reçoivent *rien*','The wheels get *nothing*'), sub:tr('C\'est ça, le point mort','That\'s what neutral is')},
      {focus:'disc', iso:CLUTCH_SET.concat(MBOX), dir:[0.7,0.4,0.9], zoom:[1.3,1.0], orbit:0.3, dur:6, cap:tr('On appuie sur l\'*embrayage*…','We press the *clutch*…'), sub:tr('Le disque se libère : la boîte ralentit et s\'arrête','The disc is released: the gearbox slows down and stops'), at:[[0.8,()=>{ anim.clutch={to:1,rate:2}; }]]},
      {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.8], orbit:0.3, dur:5, cap:tr('…on passe la *1re*','…we select *1st*'), sub:tr('Le baladeur accroche le pignon : la boîte est prête','The collar locks the gear: the gearbox is ready'), at:[[0.8,()=>selectGear('1')]]},
      {focus:null, dir:[0.9,0.5,0.9], zoom:[1.2,1.0], orbit:0.5, dur:7, cap:tr('On relâche : *tout* tourne ensemble !','We let go: *everything* turns together!'), sub:tr('Moteur → embrayage → boîte → roues','Engine → clutch → gearbox → wheels'), at:[[0.3,()=>{ anim.gas={to:0.3,rate:1}; anim.clutch={to:0,rate:0.35}; }]]},
    ]},
    {id:'start', t:tr('Démarrer sans caler','Pulling away without stalling'), d:tr('Le point de patinage de l\'embrayage','The clutch biting point'), shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:tr('Comment démarrer *sans caler* ?','How do you pull away without *stalling*?'), sub:tr('Moteur allumé, 1re passée, embrayage enfoncé','Engine on, 1st selected, clutch down'), act:()=>{ setupState({engineOn:true, we:W_IDLE, clutch:1, gear:'1'}); }},
      {focus:'disc', iso:CLUTCH_SET.concat(MBOX), dir:[0.6,0.35,1], zoom:[1.2,0.9], orbit:0.3, dur:5, cap:tr('Pédale enfoncée : le disque ne touche *rien*','Pedal down: the disc touches *nothing*'), sub:tr('Le moteur tourne, la boîte est immobile','The engine turns, the gearbox is still')},
      {focus:'disc', iso:CLUTCH_SET.concat(MBOX), dir:[0.7,0.3,0.9], zoom:[1.0,0.8], orbit:0.3, dur:7, cap:tr('On relâche *doucement* : le disque frotte','We let go *gently*: the disc rubs'), sub:tr('C\'est le point de patinage : la force passe petit à petit','This is the biting point: the force passes little by little'), at:[[0.2,()=>{ anim.gas={to:0.25,rate:1}; anim.clutch={to:0.45,rate:0.25}; }]]},
      {focus:'wheelF', iso:['diff','cv','wheelF','disc','flywheel'].concat(MBOX), dir:[0.6,0.5,1], zoom:[1.4,1.1], orbit:0.4, dur:6, cap:tr('Les roues commencent à *tourner*','The wheels start to *turn*'), sub:tr('On finit de relâcher la pédale','We finish releasing the pedal'), at:[[0.2,()=>{ anim.clutch={to:0,rate:0.3}; }]]},
      {focus:null, dir:[0.9,0.4,-0.8], zoom:[1.2,1.0], orbit:0.5, dur:5, cap:tr('Et si on lâche *d\'un coup* ?','And if we let go *suddenly*?'), sub:tr('Regarde le compte-tours…','Watch the rev counter…'), act:()=>{ setupState({engineOn:true, we:W_IDLE, clutch:1, gear:'1'}); }, at:[[2.0,()=>{ anim.clutch={to:0,rate:20}; }]]},
      {focus:'pistons', iso:ENGINE_SHOT.concat(['flywheel','disc']), dir:[1,0.35,-0.75], zoom:[1.3,1.0], orbit:0.3, dur:5, cap:tr('Le moteur *cale* !','The engine *stalls*!'), sub:tr('Les roues l\'ont arrêté d\'un coup. Il faut doser.','The wheels stopped it all at once. You have to be gentle.')},
    ]},
    {id:'shift', t:tr('Changer de vitesse','Changing gear'), d:tr('Le levier, les baladeurs et le compte-tours','The lever, the collars and the rev counter'), shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:tr('On roule en *1re*…','We\'re driving in *1st*…'), sub:tr('Le moteur tourne vite','The engine turns fast'), act:()=>{ setupState({engineOn:true, gear:'1', v:5, we:5/WH.r*RATIO_M[1]*FD, gas:0.35}); }},
      {focus:'lever', iso:['lever','pedalclutch','pedalbrake','pedalgas','steering'], dir:[0.2,1,0.6], zoom:[1.3,1.0], orbit:0.3, dur:6, cap:tr('Embrayage enfoncé, le levier passe par le *point mort*…','Clutch down, the lever goes through *neutral*…'), sub:tr('…puis entre dans la 2e','…then into 2nd'), at:[[0.3,()=>{ anim.gas={to:0,rate:3}; anim.clutch={to:1,rate:5}; }],[1.0,()=>selectGear('2')],[3.5,()=>{ anim.clutch={to:0,rate:0.6}; anim.gas={to:0.35,rate:1}; }]]},
      {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.8], orbit:0.3, dur:6, cap:tr('Dans la boîte, le baladeur *glisse*','In the gearbox, the collar *slides*'), sub:tr('Il lâche la 1re et accroche la 2e','It lets go of 1st and locks 2nd'), at:[[0.5,()=>{ anim.gas={to:0,rate:3}; anim.clutch={to:1,rate:5}; }],[1.2,()=>selectGear('3')],[3.5,()=>{ anim.clutch={to:0,rate:0.6}; anim.gas={to:0.35,rate:1}; }]]},
      {focus:null, dir:[0.9,0.5,0.9], zoom:[1.1,1.0], orbit:0.4, dur:6, cap:tr('Le compte-tours *redescend* à chaque vitesse','The rev counter *drops* with each gear'), sub:tr('Même vitesse de roue, moteur plus lent : il consomme moins','Same wheel speed, slower engine: it uses less fuel')},
    ]},
    {id:'enginebrake', t:tr('Le frein moteur','Engine braking'), d:tr('Lever le pied en vitesse ralentit la voiture','Lifting your foot in gear slows the car down'), shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:tr('On roule en *3e* à 55 km/h','We\'re driving in *3rd* at 55 km/h'), sub:tr('Le moteur pousse la voiture','The engine pushes the car'), act:()=>{ setupState({engineOn:true, gear:'3', v:15.3, we:15.3/WH.r*RATIO_M[3]*FD, gas:0.3}); }},
      {focus:'pistons', iso:ENGINE_SHOT.concat(['flywheel','disc']), dir:[1,0.35,-0.75], zoom:[1.4,1.0], orbit:0.3, dur:5.5, cap:tr('On lève le pied : ce sont les roues qui font *tourner* le moteur','We lift our foot: now the wheels *turn* the engine'), sub:tr('Sans essence, le moteur résiste : il freine la voiture','With no petrol, the engine resists: it slows the car'), at:[[0.3,()=>{ anim.gas={to:0,rate:3}; }]]},
      {focus:'gear3', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.2,0.95], orbit:0.3, dur:5, cap:tr('La force fait le chemin *à l\'envers*','The force travels *backwards*'), sub:tr('Des roues vers le moteur, à travers la boîte','From the wheels to the engine, through the gearbox')},
      {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.85], orbit:0.3, dur:6, cap:tr('En *rétrogradant*, ça freine plus fort','*Changing* down brakes harder'), sub:tr('Le compte-tours remonte : le moteur résiste davantage','The rev counter climbs: the engine resists more'), at:[[0.3,()=>{ anim.clutch={to:1,rate:5}; }],[0.9,()=>selectGear('2')],[2.2,()=>{ anim.clutch={to:0,rate:0.8}; }]]},
      {focus:null, dir:[0.9,0.4,-0.8], zoom:[1.2,1.0], orbit:0.5, dur:5, cap:tr('Utile dans les *descentes*','Useful on *downhills*'), sub:tr('Les freins ne chauffent pas. Au point mort, il n\'y a plus de frein moteur.','The brakes don\'t overheat. In neutral, there is no engine braking.')},
    ]},
    {id:'stroke', t:tr('Les 4 temps du moteur','The engine\'s 4 strokes'), d:tr('Admission, compression, explosion, échappement','Intake, compression, power, exhaust'), shots:()=>strokeShots()},
    {id:'tour', t:tr('Tout le chemin de la force','The whole path of the force'), d:tr('La grande visite, du piston à la route','The big tour, from piston to road'), shots:()=>reelShots()},
  ],
  auto: [
    {id:'prnd', t:'P, R, N, D', d:tr('Moteur allumé, que se passe-t-il dans la boîte ?','Engine on: what happens in the gearbox?'), shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:tr('Moteur allumé sur *P*','Engine on in *P*'), sub:tr('Un cliquet bloque la sortie de la boîte','A pawl locks the gearbox output'), act:()=>{ setupState({brake:1}); pressStart(); }},
      {focus:'tcimpeller', iso:TC_SET, dir:[0.6,0.35,1], zoom:[1.3,0.95], orbit:0.4, dur:5.5, cap:tr('La *pompe* tourne avec le moteur','The *pump* turns with the engine'), sub:tr('Elle projette de l\'huile sur la turbine','It throws oil onto the turbine')},
      {focus:'tcturbine', iso:TC_SET.concat(ABOX), dir:[0.7,0.35,0.9], zoom:[1.3,1.0], orbit:0.3, dur:6, cap:tr('En *N*, la turbine tourne… dans le vide','In *N*, the turbine turns… freely'), sub:tr('Aucun embrayage K ni frein B n\'est serré','No K clutch or B brake is applied'), at:[[0.6,()=>selectAuto('N')]]},
      {focus:'tcturbine', iso:TC_SET.concat(ABOX), dir:[0.6,0.4,1], zoom:[1.2,0.95], orbit:0.3, dur:6, cap:tr('En *D*, frein appuyé : la turbine s\'arrête','In *D*, brake pressed: the turbine stops'), sub:tr('L\'huile glisse, le moteur ne cale pas','The oil slips, the engine doesn\'t stall'), at:[[0.6,()=>selectAuto('D')]]},
      {focus:'wheelF', iso:['diff','cv','wheelF','brakedisc','caliper'], dir:[0.35,0.4,1], zoom:[1.4,1.0], orbit:0.4, dur:6, cap:tr('On lâche le frein : la voiture *avance seule*','We release the brake: the car *creeps* forward'), sub:tr('C\'est le « rampage » d\'une boîte auto','That\'s the "creep" of an automatic'), at:[[0.4,()=>{ anim.brake={to:0,rate:2}; }]]},
    ]},
    {id:'autoshift', t:tr('La boîte change toute seule','The gearbox shifts by itself'), d:tr('Embrayages K et freins B','K clutches and B brakes'), shots:()=>[
      {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5, cap:tr('En *D*, on accélère…','In *D*, we accelerate…'), sub:tr('Regarde le tableau des éléments','Watch the elements table'), act:()=>{ setupState({engineOn:true, we:W_IDLE, sel:'D', agear:1}); anim.gas={to:0.5,rate:1}; }},
      {focus:'ravigneaux', iso:ABOX, dir:[0.6,0.5,1], zoom:[1.3,0.95], orbit:0.4, dur:7, cap:tr('Selon ce qui est *serré*, la vitesse change','Depending on what is *applied*, the gear changes'), sub:tr('Soleils, satellites et couronne tournent différemment','Sun gears, planet gears and ring gear turn differently')},
      {focus:'elK1', iso:ABOX, dir:[0.8,0.6,0.7], zoom:[1.1,0.85], orbit:0.3, dur:7, cap:tr('Les éléments en *vert* sont serrés','The elements in *green* are applied'), sub:tr('Deux éléments serrés = une vitesse','Two applied elements = one gear')},
      {focus:null, dir:[0.9,0.5,0.9], zoom:[1.1,1.0], orbit:0.4, dur:6, cap:tr('Le compte-tours *redescend* à chaque passage','The rev counter *drops* with each shift'), sub:tr('Sans pédale d\'embrayage !','With no clutch pedal!')},
    ]},
    {id:'stroke', t:tr('Les 4 temps du moteur','The engine\'s 4 strokes'), d:tr('Admission, compression, explosion, échappement','Intake, compression, power, exhaust'), shots:()=>strokeShots()},
    {id:'tour', t:tr('Tout le chemin de la force','The whole path of the force'), d:tr('La grande visite, du piston à la route','The big tour, from piston to road'), shots:()=>reelShots()},
  ],
  ev: [
    {id:'evtour', t:tr('Comment avance une voiture électrique','How an electric car moves'), d:tr('De la batterie aux roues','From the battery to the wheels'), shots:()=>[
      {focus:null, body:'ghost', dir:[1,0.42,0.85], zoom:[1.3,1.0], orbit:0.6, dur:5, cap:tr('Une voiture *électrique*, comment ça marche ?','An *electric* car: how does it work?'), sub:tr('Pas d\'essence, pas d\'explosions, pas de boîte de vitesses','No petrol, no explosions, no gearbox'), act:()=>{ setupState({brake:1}); pressStart(); }},
      {focus:'hvbat', iso:['hvbat','hvcable'], dir:[0.6,-0.7,0.9], zoom:[1.2,0.95], orbit:0.4, dur:5, cap:tr('L\'énergie est dans la *batterie*','The energy is in the *battery*'), sub:tr('24 modules sous le plancher, 35,8 kWh','24 modules under the floor, 35.8 kWh')},
      {focus:'hvcable', iso:['hvbat','hvcable','inverter'], dir:[0.5,0.3,-1], zoom:[1.2,0.9], orbit:0.3, dur:5.5, cap:tr('Le courant part dans les câbles *orange*','The current flows into the *orange* cables'), sub:tr('On passe en D et on accélère : regarde les points','We select D and accelerate: watch the dots'), at:[[0.3,()=>selectAuto('D')],[1.2,()=>{ anim.brake={to:0,rate:3}; anim.gas={to:0.45,rate:1}; }]]},
      {focus:'inverter', iso:['hvcable','inverter','evstator','evcoil'], dir:[0.8,0.6,-0.8], zoom:[1.9,1.4], orbit:0.3, dur:5, cap:tr('L\'*onduleur* prépare le courant pour le moteur','The *inverter* prepares the current for the motor'), sub:tr('Du courant continu vers 3 phases alternatives','From direct current to 3-phase alternating current')},
      {focus:'evcoil', iso:['evstator','evcoil','evrotor'], dir:[0.25,0.3,-1], zoom:[1.1,0.8], orbit:0.3, dur:6, slow:0.0167, cap:tr('Les *bobines* s\'allument chacune leur tour','The *coils* switch on one after another'), sub:tr('Elles créent un champ magnétique qui tourne','They create a rotating magnetic field')},
      {focus:'evrotor', iso:['evstator','evcoil','evrotor'], dir:[0.3,0.4,-1], zoom:[1.0,0.8], orbit:0.3, dur:6, slow:0.0167, cap:tr('Les *aimants* du rotor suivent le champ','The rotor\'s *magnets* follow the field'), sub:tr('Et le rotor se met à tourner','And the rotor starts to spin')},
      {focus:'reducer', iso:['evrotor','reducer','diff'], dir:[0.6,0.6,0.9], zoom:[1.2,0.9], orbit:0.35, dur:5.5, cap:tr('Un seul *réducteur*, pas de boîte de vitesses','A single *reducer*, no gearbox'), sub:tr('9,8 tours de moteur pour 1 tour de roue','9.8 motor turns for 1 wheel turn')},
      {focus:'cv', iso:['diff','cv','wheelF'], dir:[0.15,-0.9,0.55], zoom:[1.2,0.95], orbit:0.3, dur:4.5, cap:tr('Différentiel, cardans… et les *roues* !','Differential, driveshafts… and the *wheels*!'), sub:tr('Comme dans une voiture à essence','Just like in a petrol car')},
      {focus:null, body:'ghost', dir:[0.9,0.35,-0.9], zoom:[1.15,1.35], orbit:0.6, dur:5, cap:tr('*Silencieux*, et la force est là tout de suite','*Silent*, and the force is there straight away'), sub:tr('290 Nm dès l\'arrêt','290 Nm from a standstill')},
    ]},
    {id:'regen', t:tr('Freiner en rechargeant','Braking while recharging'), d:tr('Quand le moteur devient une dynamo','When the motor becomes a generator'), shots:()=>[
      {focus:null, body:'ghost', dir:[1,0.42,0.85], zoom:[1.2,1.0], orbit:0.4, dur:4.5, cap:tr('On roule à *50 km/h*…','We\'re driving at *50* km/h…'), sub:tr('La batterie envoie de l\'énergie au moteur','The battery sends energy to the motor'), act:()=>{ setupState({engineOn:true, sel:'D', v:13.9, gas:0.25}); }},
      {focus:'hvcable', iso:['hvbat','hvcable','inverter','evstator','evcoil','evrotor'], dir:[0.6,0.25,-1], zoom:[1.3,1.0], orbit:0.3, dur:5, cap:tr('Points *orange* : l\'énergie va vers le moteur','*Orange* dots: the energy goes to the motor'), sub:tr('La batterie se vide doucement','The battery slowly drains')},
      {focus:'evcoil', iso:['evstator','evcoil','evrotor','inverter'], dir:[0.25,0.3,-1], zoom:[1.1,0.85], orbit:0.3, dur:6, cap:tr('On lève le pied : le moteur devient *dynamo*','We lift our foot: the motor becomes a *generator*'), sub:tr('Les aimants qui tournent créent du courant','The spinning magnets create current'), at:[[0.4,()=>{ anim.gas={to:0,rate:3}; }]]},
      {focus:'hvcable', iso:['hvbat','hvcable','inverter'], dir:[0.6,0.25,-1], zoom:[1.3,1.0], orbit:0.3, dur:6, cap:tr('Points *verts* : l\'énergie revient !','*Green* dots: the energy comes back!'), sub:tr('Elle recharge la batterie en ralentissant la voiture','It recharges the battery while slowing the car'), at:[[0.5,()=>{ anim.brake={to:0.35,rate:1}; }]]},
      {focus:'hvbat', iso:['hvbat','hvcable'], dir:[0.6,-0.7,0.9], zoom:[1.2,0.95], orbit:0.3, dur:5, cap:tr('C\'est le *freinage régénératif*','This is *regenerative* braking'), sub:tr('En ville, il récupère une bonne partie de l\'énergie','In town, it recovers a good part of the energy')},
      {focus:'caliper', iso:['wheelF','brakedisc','caliper'], dir:[0.3,0.3,1], zoom:[1.3,1.0], orbit:0.3, dur:5, cap:tr('Les freins à disque servent *beaucoup moins*','The disc brakes are used much *less*'), sub:tr('Seulement pour les freinages forts','Only for hard braking'), at:[[0.5,()=>{ anim.brake={to:1,rate:1}; }]]},
    ]},
    {id:'nogear', t:tr('Pourquoi pas de boîte de vitesses ?','Why no gearbox?'), d:tr('Le moteur électrique pousse à toutes les vitesses','The electric motor pushes at every speed'), shots:()=>[
      {focus:'evstator', iso:['evstator','evcoil','evrotor','reducer'], dir:[0.8,0.45,-0.8], zoom:[1.3,1.0], orbit:0.4, dur:5.5, cap:tr('Un moteur à essence a besoin de *vitesses*','A petrol engine needs *gears*'), sub:tr('Il ne pousse bien qu\'entre 1 500 et 6 000 tr/min, et il cale à l\'arrêt','It only pushes well between 1,500 and 6,000 rpm, and it stalls at a standstill'), act:()=>{ setupState({engineOn:true, sel:'D'}); }},
      {focus:'evrotor', iso:['evstator','evcoil','evrotor','reducer'], dir:[0.3,0.4,-1], zoom:[1.1,0.85], orbit:0.3, dur:6, cap:tr('Le moteur électrique pousse *dès 0* tr/min','The electric motor pushes from *0* rpm'), sub:tr('Et il tourne jusqu\'à 12 000 tr/min','And it spins up to 12,000 rpm'), at:[[0.5,()=>{ anim.gas={to:1,rate:2}; }]]},
      {focus:'reducer', iso:['evrotor','reducer','diff','cv','wheelF'], dir:[0.6,0.6,0.9], zoom:[1.3,1.0], orbit:0.4, dur:7, cap:tr('Un *seul* rapport suffit de 0 à 150 km/h','A *single* ratio is enough from 0 to 150 km/h'), sub:tr('Regarde le compteur monter sans aucune coupure','Watch the speedometer climb without a single break')},
      {focus:null, body:'ghost', dir:[0.9,0.35,-0.9], zoom:[1.15,1.3], orbit:0.6, dur:5, cap:tr('Pas d\'embrayage, *pas de calage*','No clutch, no *stalling*'), sub:tr('Et en marche arrière, le moteur tourne juste à l\'envers','And in reverse, the motor just spins backwards'), act:()=>{ anim.gas={to:0,rate:2}; anim.brake={to:0.5,rate:1}; }},
    ]},
  ],
};
function strokeShots(){
  const iso1 = ['pistons','rods','crank','spark','valvein','valveex','camin','camex'];
  return [
    {focus:'pistons', iso:iso1, dir:[1,0.3,-0.6], zoom:[1.4,1.0], orbit:0.3, dur:5, slow:0.0167, cap:tr('Un moteur à *4 temps*','A *four-stroke* engine'), sub:tr('Chaque piston répète 4 étapes, encore et encore','Each piston repeats 4 steps, again and again'), act:()=>{ setupState({}); pressStart(); }},
    {focus:'valvein', iso:iso1, dir:[1,0.45,-0.8], zoom:[1.1,0.85], orbit:0.25, dur:5.5, slow:0.0167, cap:tr('1. *Admission* : le piston descend et aspire','1. *Intake*: the piston goes down and sucks in'), sub:tr('La soupape d\'admission (devant) est ouverte','The intake valve (front) is open')},
    {focus:'pistons', iso:iso1, dir:[0.9,0.4,-0.7], zoom:[1.1,0.85], orbit:0.25, dur:5.5, slow:0.0167, cap:tr('2. *Compression* : le piston remonte et serre','2. *Compression*: the piston goes up and squeezes'), sub:tr('Toutes les soupapes sont fermées','All the valves are closed')},
    {focus:'spark', iso:iso1, dir:[0.8,0.55,-0.5], zoom:[1.0,0.75], orbit:0.25, dur:5.5, slow:0.0167, cap:tr('3. *Explosion* : l\'étincelle… BOUM !','3. *Power*: the spark… BOOM!'), sub:tr('Le seul temps qui pousse vraiment','The only stroke that really pushes')},
    {focus:'valveex', iso:iso1, dir:[-0.3,0.5,-1], zoom:[1.1,0.85], orbit:0.25, dur:5.5, slow:0.0167, cap:tr('4. *Échappement* : le piston chasse les gaz','4. *Exhaust*: the piston pushes out the gases'), sub:tr('La soupape d\'échappement (derrière) s\'ouvre','The exhaust valve (back) opens')},
    {focus:'crank', iso:iso1, dir:[0.9,0.25,-0.6], zoom:[1.3,1.0], orbit:0.4, dur:5, cap:tr('Les 4 pistons sont *décalés*','The 4 pistons are *staggered*'), sub:tr('Il y a toujours un piston qui pousse : ordre 1-3-4-2','There\'s always one piston pushing: order 1-3-4-2')},
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
let tach = makeDial($('tach'), 8, 1, 1, 6.5, tr('TR/MIN','RPM')), tachMax = 8;
function setTach(){ tachMax = S.mode==='ev' ? 12 : 8; tach = makeDial($('tach'), tachMax, 1, S.mode==='ev'?2:1, S.mode==='ev'?11:6.5, S.mode==='ev'?tr('TR/MIN MOTEUR','MOTOR RPM'):tr('TR/MIN','RPM')); }
const speedo = makeDial($('speedo'), 240, 20, 2, null, 'KM/H');
let needleT=0, needleS=0;

/* ---- Fiche technique et tableau des éléments ---- */
function renderSpec(){
  const rm = ['1','2','3','4','5','6'].map(g=>fr(RATIO_M[g],2)).join(' · ');
  const ra = ['1','2','3','4','5','6'].map(g=>fr(RATIO_A[g],2)).join(' · ');
  const rows = [[tr('Moteur','Engine'),tr('4 cylindres en ligne, 16 soupapes','Inline 4-cylinder, 16 valves')],[tr('Cylindrée','Displacement'),tr('1 984 cm³','1,984 cc')],[tr('Alésage × course','Bore × stroke'),tr('82,5 × 92,8 mm','82.5 × 92.8 mm')],[tr('Puissance','Power'),tr('150 ch à 6 000 tr/min','150 hp at 6,000 rpm')],
    [tr('Couple','Torque'),tr('200 Nm à 3 500 tr/min','200 Nm at 3,500 rpm')],[tr('Ordre d\'allumage','Firing order'),'1-3-4-2'],[tr('Boîte manuelle (1re→6e)','Manual gearbox (1st→6th)'),rm],[tr('Boîte auto (1re→6e)','Automatic (1st→6th)'),ra],[tr('Marche arrière manu / auto','Reverse manual / auto'),fr(-RATIO_M.R,2)+' / '+fr(-RATIO_A.R,2)],
    [tr('Pont (17 / 63 dents)','Final drive (17 / 63 teeth)'),fr(FD,2)],[tr('Pneus','Tyres'),'205/55 R16'],[tr('Longueur × largeur × hauteur','Length × width × height'),tr('4,20 × 1,76 × 1,48 m','4.20 × 1.76 × 1.48 m')],[tr('Empattement','Wheelbase'),tr('2,58 m','2.58 m')],[tr('Masse (avec conducteur)','Mass (with driver)'),tr('≈ 1 350 kg','≈ 1,350 kg')]];
  const evRows = [[tr('Moteur','Engine'),tr('Synchrone à aimants permanents, 8 pôles','Permanent-magnet synchronous, 8 poles')],[tr('Puissance','Power'),tr('100 kW (136 ch)','100 kW (136 hp)')],[tr('Couple','Torque'),tr('290 Nm dès 0 tr/min','290 Nm from 0 rpm')],[tr('Régime maximal','Maximum speed'),tr('12 000 tr/min','12,000 rpm')],
    [tr('Batterie','Battery'),tr('35,8 kWh, 24 modules sous le plancher','35.8 kWh, 24 modules under the floor')],[tr('Réducteur (1 seul rapport)','Reducer (single ratio)'),tr(`17/45 puis 17/63 = ${fr(EV_TOTAL,2)}`, `17/45 then 17/63 = ${fr(EV_TOTAL,2)}`)],[tr('Vitesse maxi','Top speed'),'150 km/h'],[tr('Pneus','Tyres'),'205/55 R16'],[tr('Masse (avec conducteur)','Mass (with driver)'),tr('≈ 1 615 kg','≈ 1,615 kg')]];
  $('spec').innerHTML = (S.mode==='ev'?evRows:rows).map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
  $('specNote').textContent = S.mode==='ev' ? tr('Valeurs proches d\'une compacte électrique de 2017 (100 kW, 35,8 kWh). Les formes sont simplifiées.','Values close to a 2017 compact electric car (100 kW, 35.8 kWh). The shapes are simplified.') : tr('Moteur et dimensions : valeurs d\'une compacte 2.0 essence de 150 ch des années 2000. Boîte auto : vrai schéma à trains épicycloïdaux, dentures choisies pour retrouver ses rapports. Boîte manuelle : rapports approchés. Les formes sont simplifiées.','Engine and dimensions: values of a 2000s compact 2.0 petrol with 150 hp. Automatic: a real planetary gearset layout, with tooth counts chosen to match its ratios. Manual gearbox: approximate ratios. The shapes are simplified.');
  $('subTxt').textContent = S.mode==='ev' ? tr('Voiture électrique : batterie sous le plancher, moteur électrique à l\'avant, un seul rapport. Démarre, roule, et regarde l\'énergie aller… et revenir quand tu freines.','Electric car: battery under the floor, electric motor at the front, a single ratio. Switch on, drive, and watch the energy go… and come back when you brake.') : S.mode==='auto' ? tr('Moteur 4 cylindres essence et boîte automatique 6 vitesses, traction avant. Pas de pédale d\'embrayage : la boîte fait tout.','4-cylinder petrol engine and 6-speed automatic gearbox, front-wheel drive. No clutch pedal: the gearbox does it all.') : tr('Moteur 4 cylindres essence et boîte manuelle 6 vitesses, traction avant. Démarre, passe les vitesses et suis la force jusqu\'aux roues.','4-cylinder petrol engine and 6-speed manual gearbox, front-wheel drive. Start the engine, change gear and follow the force to the wheels.');

  const els=['K1','K2','K3','B1','B2'];
  $('elems').innerHTML = `<tr><th></th>${els.map(e=>`<th>${e}</th>`).join('')}<th>×</th></tr>` +
    ['1','2','3','4','5','6','R'].map(g=>`<tr data-g="${g}"><th>${g==='R'?'R':g}</th>${els.map(e=>`<td class="${SHIFT_EL[g].includes(e)?'on':''}">${SHIFT_EL[g].includes(e)?'●':''}</td>`).join('')}<td>${fr(Math.abs(RATIO_A[g]),2)}</td></tr>`).join('');
}
renderSpec();
