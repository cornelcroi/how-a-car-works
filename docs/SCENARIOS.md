# Écrire une vidéo « Montre-moi »

Une vidéo « Montre-moi » est une **liste de plans** (« shots »). Le réalisateur (`startTour` / `tourTick` dans `src/js/05-catalog-and-director.js`) les joue un par un : il isole les pièces, place la caméra, pointe la pièce, affiche le sous-titre et fait conduire la voiture.

Écrire une nouvelle vidéo ne demande **aucune 3D** : seulement des clés de pièces (voir [PARTS.md](PARTS.md)) et des actions.

## Où l'ajouter

Dans `SCENARIOS` (fichier `src/js/05-catalog-and-director.js`), dans la liste de la bonne voiture : `manual`, `auto` ou `ev`.

```js
{ id:'enginebrake', t:'Le frein moteur', d:'Lever le pied en vitesse ralentit la voiture', shots:()=>[ /* plans */ ] },
```

- `id` : identifiant unique (sert aussi au test, `#scList .sc[data-sc="id"]`).
- `t` : titre de la carte, `d` : une ligne de description.
- `shots` : **une fonction** qui renvoie les plans (elle est appelée au lancement, l'état de la voiture est donc à jour).

## Un plan

```js
{
  focus: 'gear3',                 // pièce visée : cadrage + pointeur + étiquette. null = toute la voiture
  iso: MBOX,                      // pièces à montrer seules (tableau de clés). Absent = tout afficher
  body: 'ghost',                  // carrosserie : 'ghost' (transparente), 'solid', 'off'. Absent = inchangé
  explode: 1,                     // 1 = écarter les pièces (embrayage, convertisseur). 0 = rassembler
  dir: [0.75, 0.5, 0.85],         // direction de la caméra depuis la pièce (x avant, y haut, z gauche)
  zoom: [1.2, 0.95],              // distance au début → à la fin du plan (1 = cadrage serré de la pièce)
  orbit: 0.3,                     // rotation de la caméra autour de la pièce pendant le plan (radians)
  dur: 5,                         // durée en secondes
  slow: 0.0167,                   // ralenti des pièces (0.05 par défaut = ÷20, 0.0167 = ÷60)
  cap: 'La force fait le chemin *à l\'envers*',   // gros sous-titre ; *mot* = surligné
  sub: 'Des roues vers le moteur, à travers la boîte', // petite ligne sous le sous-titre
  act: ()=>{ ... },               // action jouée au début du plan
  at: [[0.3, ()=>{ ... }], [0.9, ()=>selectGear('2')]], // actions à t secondes dans le plan
}
```

## Actions disponibles

| Action | Effet |
|---|---|
| `setupState({...})` | Remet la voiture à zéro puis impose un état. Ex. `setupState({engineOn:true, gear:'3', v:15.3, we:15.3/WH.r*RATIO_M[3]*FD, gas:0.3})` pour « on roule en 3e à 55 km/h ». Champs : `engineOn`, `gear` (manuelle), `sel` (`'P'`,`'R'`,`'N'`,`'D'`), `agear` (rapport auto), `v` (m/s), `we` (rad/s moteur), `clutch`, `gas`, `brake` (0 à 1). |
| `pressStart()` | Tourner la clé / bouton Démarrer (respecte les règles : embrayage ou point mort, P pour l'auto, frein pour l'électrique). |
| `anim.clutch = {to:1, rate:5}` | Enfoncer l'embrayage (vers 1) ou le relâcher (vers 0) à `rate` unités par seconde. Pareil pour `anim.gas` et `anim.brake`. |
| `selectGear('2')` | Boîte manuelle : passer une vitesse (`'1'`…`'6'`, `'R'`, `'N'`). Le levier passe par le point mort. Il faut l'embrayage enfoncé si le moteur tourne. |
| `tourShift('2')` | Raccourci : débrayer, passer la vitesse, rembrayer avec un peu de gaz. |
| `selectAuto('D')` | Boîte auto et électrique : `'P'`, `'R'`, `'N'`, `'D'` (pour quitter P, le frein doit être appuyé). |
| `startEngineForTour()` | Démarre selon la voiture (frein en auto). |

Attention au temps : les actions ont besoin d'un peu de temps simulé (débrayer prend ~0,3 s avec `rate:5`). Espace les étapes d'au moins 0,5 s.

## Règles de style

- **Une idée par vidéo**, 4 à 10 plans, 4 à 7 secondes par plan.
- Sous-titres **courts** (8 mots environ), en français simple, au présent, tutoiement. Un seul mot surligné.
- Le premier plan pose la question ou la situation ; le dernier conclut (souvent `focus:null` sur toute la voiture).
- Montrer avant d'expliquer : faire bouger la pièce (`act`/`at`) pendant que le sous-titre en parle.
- Vérifier la vérité mécanique : si le sous-titre dit « immobile », la pièce doit l'être dans la simulation.

## Exemple complet

```js
{id:'enginebrake', t:'Le frein moteur', d:'Lever le pied en vitesse ralentit la voiture', shots:()=>[
  {focus:null, dir:[1,0.45,0.85], zoom:[1.25,1.0], orbit:0.4, dur:4.5,
   cap:'On roule en *3e* à 55 km/h', sub:'Le moteur pousse la voiture',
   act:()=>{ setupState({engineOn:true, gear:'3', v:15.3, we:15.3/WH.r*RATIO_M[3]*FD, gas:0.3}); }},
  {focus:'pistons', iso:ENGINE_SHOT.concat(['flywheel','disc']), dir:[1,0.35,-0.75], zoom:[1.4,1.0], orbit:0.3, dur:5.5,
   cap:'On lève le pied : ce sont les roues qui font *tourner* le moteur', sub:'Sans essence, le moteur résiste',
   at:[[0.3,()=>{ anim.gas={to:0,rate:3}; }]]},
  {focus:'synchro', iso:MBOX, dir:[0.75,0.5,0.85], zoom:[1.0,0.85], orbit:0.3, dur:6,
   cap:'En *rétrogradant*, ça freine plus fort', sub:'Le compte-tours remonte',
   at:[[0.3,()=>{ anim.clutch={to:1,rate:5}; }],[0.9,()=>selectGear('2')],[2.2,()=>{ anim.clutch={to:0,rate:0.8}; }]]},
]},
```

## Idées de vidéos à écrire

Pour l'auto-école : pourquoi on débraye avant de s'arrêter · le point mort en descente (et pourquoi c'est une mauvaise idée) · démarrer en côte · pourquoi le moteur « hurle » en 1re à 50 km/h · les voyants du tableau de bord · la marche arrière · l'éco-conduite (passer les vitesses tôt) · électrique : recharger, autonomie et froid.
