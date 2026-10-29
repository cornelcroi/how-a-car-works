# Garage & Route 🚗

**Open a car up to see how it works. Then take the wheel and park it.**

👉 **[Open the page](https://cornelcroi.github.io/how-a-car-works/)**. Works on a phone. No account, nothing to install.

English and French. The page picks your browser language. Switch with the button at the top of the panel, or force it with `?lang=en` / `?lang=fr`.

![A « Show me » video: changing gear](docs/media/show-me-shift.gif)

## What is it?

A 3D car for teenagers, learner drivers and anyone curious. Two ways to use it:

- **🔍 Explore**: the car is cut open. Start the engine, press the clutch, shift gears, and watch every part move. Tap any part to learn what it does.
- **🚗 Drive**: take the same car into a street and park it, in parallel or in a bay, from the driver's seat or from outside.

Three cars share the scene:

- **Petrol, manual gearbox**: 4-cylinder engine, clutch, 6-speed manual.
- **Petrol, automatic**: same engine, torque converter, 6-speed planetary automatic.
- **Electric**: battery, inverter, permanent-magnet motor, single-speed reducer.

A small physics simulation drives everything. Press the clutch and the disc really lets go. Shift into 2nd and the selector collar really locks the gear. Release the clutch too fast and the engine stalls.

It's a **simplified model for learning**, not a repair manual.

## Explore

- **Drive the cut-open car.** Start, clutch, gears, brake. The rev counter, the sound and every part react.

  ![Start, clutch down, 1st, pull away](docs/media/drive.gif)

- **Look inside.** Every part is labelled. Turn the car, zoom in, hide the body, or show it as a wireframe.

  ![The engine with labels](docs/media/overview.png)

- **🎬 Show me.** Short videos that direct themselves: the camera moves, a pointer shows the part, captions explain. One idea per video:
  - Engine running but the car doesn't move: why?
  - Pulling away without stalling
  - Changing gear
  - Engine braking
  - The 4 strokes of the engine
  - P, R, N, D in an automatic
  - How an electric car moves
  - Braking while recharging
  - Why an electric car has no gearbox
  - **Parallel parking**, step by step, from every angle
  - **Bay parking**, nose-in, in two moves

  ![The selector collar slides: 1st lets go, 2nd locks](docs/media/show-me.png)

  The parking videos show each step from above, from behind, from the pavement and from the driver's seat. You see the steering wheel turn (about one and a half turns), the front wheels follow (the inner one turns more), the tyre tracks on the road, and the rear-camera guide lines when reversing.

  ![Parallel parking: the front wheels turn, the rear swings into the space](docs/media/parking.gif)

- **⚡ Electric.** Same scene, different car: battery, inverter, motor, one gear.

  ![The electric car: current flows from the battery](docs/media/electric.gif)

## Drive

Click **🚗 Drive** and the car goes into a street with parked cars, a kerb and buildings. Park in the green space.

![Driver's view, with the side mirrors and the interior mirror](docs/media/drive-street.png)

| Do this | Keys | Phone |
|---|---|---|
| Go forward | hold `↑` | hold **▲ Forward** |
| Reverse | hold `↓` | hold **▼ Reverse** |
| Brake | `Space` | hold **■ Brake** |
| Steer | hold `←` `→` (the wheel comes back to centre when you let go) | the **Wheel** slider |
| Change view | `V` | Driver · Behind · Front · Above · Free |

- **Simple gearbox** by default: forward, reverse, brake. You focus on the steering. Switch to **Manual gearbox** to practise with the clutch, stalls included.
- **Mirrors**: two side mirrors and the interior mirror in the driver's view.
- **Parking sensors**: beeps that speed up and green / orange / red bars as you get close to a car or the kerb.
- **Bumps**: touch a car or the kerb and the car stops.

![From above: tyre tracks and reversing guide lines](docs/media/drive-top.png)

## Explore controls

| Do this | How |
|---|---|
| Rotate | Drag |
| Zoom | Scroll or pinch (zooms where you point) |
| Pan | Right-click and drag |
| Centre on a part | Double-click |
| Learn about a part | Tap it |
| Start / stop | **Start** button or `K` |
| Clutch / brake / accelerator | Tap the pedals, or `C`, `F` / `↓`, `A` / `↑` |
| Gears (manual) | `1`–`6`, `R`, `N`. Clutch down first, or it grinds. |
| Selector (auto, electric) | `P`, `R`, `N`, `D`. Foot on the brake to leave P. |

Real engines spin far too fast to see, so the parts move in slow motion (÷5, ÷20, ÷60). The dials always show real speeds.

## Make more videos

A video is a **list of shots**: which part to aim at, where the camera is, what the car does, and which caption to show. No 3D work.

```js
{id:'enginebrake', t:tr('Le frein moteur','Engine braking'), d:tr('…','Lifting off in gear slows the car'), shots:()=>[
  {focus:'pistons', iso:ENGINE_SHOT, dir:[1,0.35,-0.75], zoom:[1.4,1.0], dur:5.5,
   cap:tr('On lève le pied…','You lift off: the wheels now *turn* the engine'),
   at:[[0.3,()=>{ anim.gas={to:0,rate:3}; }]]},
  // …
]},
```

Every caption is written in both languages with `tr(french, english)`. Parking videos add a planned path (`park:k` plays step k, `pose:k` holds it) and fixed cameras (`cam:{p, t}`, in the street or mounted on the car).

- Shot format and actions: [docs/SCENARIOS.md](docs/SCENARIOS.md)
- Part keys: [docs/PARTS.md](docs/PARTS.md)
- Guide for coding assistants (Claude Code, Codex…): [CLAUDE.md](CLAUDE.md)

The easy way: ask an assistant. *"Add a Show me video that explains why you press the clutch before stopping."* Then check the mechanics are true: if a caption says the wheels are still, they must be still in the simulation.

## Run it locally

```bash
npm install && npx playwright install chromium   # once, for the tests
npm run build    # src/ → index.html
npm test         # checks the page loads and videos play, in both languages
npm run serve    # http://localhost:8080
npm run capture  # regenerate the screenshots and GIFs in docs/media (needs ffmpeg)
```

Always edit `src/`, then build. `index.html` is generated and committed, because GitHub Pages serves it directly.

## How it's made

One static HTML file. [three.js](https://threejs.org/) for 3D, a small physics simulation for the rest (engine torque curve, clutch, torque converter, electric motor, regenerative braking, drag). No framework, no bundler.

- The gears really mesh, tooth against tooth.
- The automatic follows a real Lepelletier planetary layout with chosen tooth counts.
- The manual ratios are approximate. The electric values are typical for a 2017 compact EV.
- Steering follows the Ackermann geometry; parking paths use a simple bicycle model and are checked so the car never touches the parked cars.
- The body is a generic compact hatchback. No real brand or model.

It was built in conversation with **Claude** (Anthropic), starting from a parent's question: *"how do I explain to my son what happens when you start the car and shift gears?"*

## Roadmap

1. **A crossroads**: stop sign, yield to the right, pedestrian crossing. Simple rules on position and speed decide if you got it right.
2. A short route that chains situations, with lives and points.
3. More learner-driver videos: hill starts, why the engine screams in 1st at 50 km/h, eco-driving, dashboard warning lights.
4. Videos as plain JSON (`scenarios/*.json`), and a small command API, then an MCP server, so an assistant can drive the page live.

### Idea: fault codes for garages

Plug an OBD-II reader into a car, read the fault codes, and light up the faulty part in 3D. `P0301` (cylinder 1 misfire) → cylinder 1 and its spark plug glow, with an explanation the customer understands.

- **Cheap and honest:** the standard `P0xxx` codes map to parts with a lookup table, not a model. A "type or scan a code" mode on the generic car is a small step. Useful to explain a repair to a customer, or to a junior mechanic.
- **Hard:** real car models need real geometry and service data, which manufacturers license. Manufacturer-specific codes and real diagnosis are what professional scan tools already do.

## Licence

MIT. Free to reuse, change and share.

---

### En français

**Garage & Route** : ouvre une voiture en 3D pour comprendre comment elle marche, puis prends le volant et gare-toi dans la rue, en créneau ou en bataille. Thermique (boîte manuelle ou auto) et électrique, avec des vidéos « Montre-moi ». La page est en français et en anglais (bouton en haut du panneau, ou `?lang=fr`).
