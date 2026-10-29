# Catalogue des pièces

Chaque pièce 3D porte une **clé** (`userData.part`). C'est cette clé qu'on utilise dans les scripts « Montre-moi » (`focus`, `iso`) et dans les pannes du jeu (`parts`).
La fiche de chaque pièce (titre, texte, position de l'étiquette, pièces associées) est dans l'objet `INFO` de `src/js/05-catalog-and-director.js`.

| Clé | Nom affiché | Voiture(s) |
|---|---|---|
| `block` | Bloc moteur | thermique (manuelle + auto) |
| `head` | Culasse | thermique (manuelle + auto) |
| `valvecover` | Couvre-culasse | thermique (manuelle + auto) |
| `sump` | Carter d'huile | thermique (manuelle + auto) |
| `timingcover` | Cache de distribution | thermique (manuelle + auto) |
| `intake` | Collecteur d'admission | thermique (manuelle + auto) |
| `throttle` | Papillon des gaz | thermique (manuelle + auto) |
| `exhaustmani` | Collecteur d'échappement | thermique (manuelle + auto) |
| `catalyst` | Catalyseur | thermique (manuelle + auto) |
| `crank` | Vilebrequin | thermique (manuelle + auto) |
| `pistons` | Pistons | thermique (manuelle + auto) |
| `rods` | Bielles | thermique (manuelle + auto) |
| `spark` | Bougies d'allumage | thermique (manuelle + auto) |
| `coil` | Bobines d'allumage | thermique (manuelle + auto) |
| `camin` | Arbre à cames d'admission | thermique (manuelle + auto) |
| `camex` | Arbre à cames d'échappement | thermique (manuelle + auto) |
| `valvein` | Soupapes d'admission | thermique (manuelle + auto) |
| `valveex` | Soupapes d'échappement | thermique (manuelle + auto) |
| `belt` | Courroie de distribution | thermique (manuelle + auto) |
| `flywheel` | Volant moteur | thermique (manuelle + auto) |
| `starter` | Démarreur | thermique (manuelle + auto) |
| `disc` | Disque d'embrayage | thermique manuelle |
| `pressure` | Mécanisme d'embrayage | thermique manuelle |
| `diaphragm` | Diaphragme | thermique manuelle |
| `bearing` | Butée d'embrayage | thermique manuelle |
| `fork` | Fourchette d'embrayage | thermique manuelle |
| `tcimpeller` | Convertisseur : pompe | thermique auto |
| `tcturbine` | Convertisseur : turbine | thermique auto |
| `tcstator` | Convertisseur : réacteur | thermique auto |
| `tclockup` | Embrayage de pontage | thermique auto |
| `tcoil` | Huile du convertisseur | thermique auto |
| `gbcase` | Boîte de vitesses | thermique (manuelle + auto) |
| `mainshaft` | Arbre primaire | thermique manuelle |
| `outshaft` | Arbre secondaire | thermique manuelle |
| `synchro` | Baladeurs (synchros) | thermique manuelle |
| `gear1` | Pignons de 1re | thermique manuelle |
| `gear2` | Pignons de 2e | thermique manuelle |
| `gear3` | Pignons de 3e | thermique manuelle |
| `gear4` | Pignons de 4e | thermique manuelle |
| `gear5` | Pignons de 5e | thermique manuelle |
| `gear6` | Pignons de 6e | thermique manuelle |
| `gearR` | Marche arrière | thermique manuelle |
| `autoshaft` | Arbre d'entrée | thermique auto |
| `pg1` | Train épicycloïdal simple | thermique auto |
| `ravigneaux` | Train Ravigneaux | thermique auto |
| `elK1` | Embrayage K1 | thermique auto |
| `elK2` | Embrayage K2 | thermique auto |
| `elK3` | Embrayage K3 | thermique auto |
| `elB1` | Frein B1 | thermique auto |
| `elB2` | Frein B2 | thermique auto |
| `transfer` | Arbre de transfert | thermique auto |
| `diff` | Pont et différentiel | toutes |
| `cv` | Cardans | toutes |
| `wheelF` | Roues avant (motrices) | toutes |
| `wheelR` | Roues arrière | toutes |
| `brakedisc` | Disques de frein | toutes |
| `caliper` | Étriers et plaquettes | toutes |
| `strut` | Jambes de force | toutes |
| `arm` | Triangles de suspension | toutes |
| `rearaxle` | Essieu arrière multibras | toutes |
| `subframe` | Berceau | toutes |
| `exhaust` | Ligne d'échappement | thermique (manuelle + auto) |
| `tank` | Réservoir d'essence | thermique (manuelle + auto) |
| `radiator` | Radiateur | toutes |
| `battery` | Batterie | toutes |
| `seat` | Sièges | toutes |
| `dash` | Tableau de bord | toutes |
| `steering` | Volant | toutes |
| `pedalclutch` | Pédale d'embrayage | thermique manuelle |
| `pedalbrake` | Pédale de frein | toutes |
| `pedalgas` | Accélérateur | toutes |
| `lever` | Levier de vitesses | toutes |
| `body` | Carrosserie | toutes |
| `glass` | Vitres | toutes |
| `headlight` | Phares | toutes |
| `taillight` | Feux arrière | toutes |
| `evstator` | Moteur électrique | électrique |
| `evcoil` | Bobines du stator | électrique |
| `evrotor` | Rotor à aimants | électrique |
| `inverter` | Onduleur | électrique |
| `reducer` | Réducteur | électrique |
| `hvbat` | Batterie haute tension | électrique |
| `hvcable` | Câbles haute tension | électrique |
| `chargeport` | Prise de recharge | électrique |
| `gear1` | Pignons de 1re | thermique manuelle |
| `gear2` | Pignons de 2e | thermique manuelle |
| `gear3` | Pignons de 3e | thermique manuelle |
| `gear4` | Pignons de 4e | thermique manuelle |
| `gear5` | Pignons de 5e | thermique manuelle |
| `gear6` | Pignons de 6e | thermique manuelle |
| `gearR` | Marche arrière (pignon intermédiaire) | thermique manuelle |

## Groupes pratiques (constantes déjà définies)

| Constante | Contenu |
|---|---|
| `ENGINE_SHOT` | pistons, bielles, vilebrequin, bougies |
| `CLUTCH_SET` | volant moteur, disque, mécanisme, diaphragme, butée, fourchette |
| `TC_SET` | pompe, turbine, réacteur, embrayage de pontage, huile, volant moteur |
| `MBOX` | arbres, pignons 1 à 6 et R, baladeurs (boîte manuelle) |
| `ABOX` | arbre d'entrée, trains épicycloïdaux, K1 K2 K3 B1 B2, transfert (boîte auto) |

## Catégories (barre « Afficher »)

`casing` carter moteur · `internals` pistons et distribution · `clutch` embrayage / convertisseur · `gearbox` boîte · `drive` pont et cardans · `wheels` roues et freins · `chassis` suspension, échappement, réservoir, radiateur, batterie 12 V · `cabin` habitacle · `body` carrosserie · `road` route · `ev` organes électriques.
