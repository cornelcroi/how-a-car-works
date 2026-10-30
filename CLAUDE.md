# CLAUDE.md

Guide for AI coding agents (Claude Code, Codex…) working on this repository.

## What this is

**Garage & Route** (EN: Garage & Road): a single-page, dependency-free 3D car for teenagers and learner drivers, in French and English. Two halves: **Explore** (the car cut open, every part moves) and **Drive** (drive it in a street and park). Three cars share one scene:

- `manual`: petrol 4-cylinder with a clutch and a 6-speed manual gearbox.
- `auto`: the same engine with a torque converter and a 6-speed planetary automatic.
- `ev`: an electric car with a battery, inverter, permanent-magnet motor and single-speed reducer.

Live at https://cornelcroi.github.io/how-a-car-works/ (repo `cornelcroi/how-a-car-works`).

Features: click any part for an explanation, isolate it, explode the clutch, auto-directed « Montre-moi » videos (camera, pointer, captions, the car driving itself, including parallel and bay parking), a simple view, a guided lesson, and the street mode (steering, 5 views, mirrors, parking sensors, bumps, a green target space).

It was built through a conversation with Claude, as a showcase. Keep it **simple, honest and fun**; it is not a repair manual.

## Commands

```bash
npm run build     # assemble src/ → index.html (the file GitHub Pages serves)
npm test          # build + headless smoke test (needs: npm i && npx playwright install chromium)
npm run serve     # local server on http://localhost:8080
```

**Always edit `src/`, then run `npm run build`.** Commit both `src/` and the generated `index.html`, because Pages serves `index.html` directly.

## Layout

```
src/page.html                          CSS (design tokens, light/dark) + HTML of the panel and overlays
src/js/01-core.js                      three.js scene, camera, OrbitControls, part registry, materials, gear builders
src/js/02-thermal-car.js               engine (block, crank, pistons, valves, cams, belt), clutch, torque converter,
                                       manual and automatic gearboxes, final drive, driveshafts, wheels, chassis, cabin
src/js/03-electric-car.js              battery pack, HV cables + energy flow, inverter, stator/rotor, reducer
src/js/04-body-and-road.js             procedural hatchback body (lofted sections), lights, road
src/js/04-body-and-road.js             (also) the parking street: kerbs, bays, parked cars, PARK_OBST, buildings and trees
src/js/05-catalog-and-director.js      INFO catalog, visibility/isolation, labels, camera views,
                                       the « Montre-moi » director + SCENARIOS, gauges, spec table,
                                       parking plans (PARK_STEPS, PERP_STEPS), parkShots/bayShots, tyre tracks + guide lines
src/js/06-controls-and-simulation.js   zoom-to-cursor, pedals, keyboard, gear lever, mode switch, physics
src/js/06b-street-drive.js             street mode: steering, views, mirrors, sensors, collisions, target space
src/js/07-narration-animation.js       live narration, lessons, sound, per-frame animation, main loop
```

The files are concatenated in this order **inside one IIFE** (`01-core.js` opens it and `07` closes it), so they share scope. Order matters for `const` declarations used at load time. Function declarations are hoisted.

## Key concepts

- **Coordinates**: metres. x = forward, y = up, z = left. Front axle at x = 1.25. Gearbox shafts rotate about **z**.
- **Mirrored display (important)**: three.js draws +z on the *right*, so the canvas is flipped with CSS (`#c{transform:scaleX(-1)}`) to make z = left true on screen (French traffic on the right, driver on the left). Everything between screen and 3D is flipped too: OrbitControls gets a proxy element with mirrored mouse/touch (`controlsDom`, 01), clicks use `mirrorNdcX`, labels and the video pointer use `(1 - x)/2*w`, the in-car mirror quads swap sides. Any new screen↔3D code must do the same.
- **Part registry**: `put(object3d, partKey, category, mode?)` adds an object and tags every mesh with `userData.part / cat / mode`. All meshes are in `LEAVES`.
  - Visibility is decided only in `refreshVis()`, from the category toggles, the car type, the body mode, simple view and isolation.
  - `mode` is `'manual' | 'auto' | 'ev'` (undefined = all). Thermal-only parts are filtered by `iceOnly()`.
- **Catalog**: `INFO[partKey] = { t, p, a:[x,y,z] label anchor, l:1|2 label level, with:[keys shown with it], mode }`. The full list is in `docs/PARTS.md`.
- **Gears really mesh**: `gearZ(N, pitch, width, hole, mat)` builds a tooth profile whose tooth k is centred at angle k·2π/N. To keep two gears in phase, use `meshAng(θA, NA, ψ, NB)` (ψ = direction from A to B), and `ringFromPlanet(...)` for ring gears. Never animate a gear with a free-running angle if it touches another gear; derive it.
- **Power-flow glow**: materials made with `gm('setName', base)` light up via `setGlow('setName', intensity)`. Sets: `engine`, `input`, `output`, `collar`, `ev`, `pg1`, `rvc`, `s2`, `s3`.
- **Simulation** (`simulate(dt)`, substeps of ≈0.4 ms):
  - Manual: an engine torque curve plus an idle governor, a clutch modelled as a capped stiff spring, and stalling.
  - Auto: a torque converter (capacity factor and torque ratio), automatic shift logic, and the lock-up clutch.
  - EV: a constant-torque then constant-power motor, creep, regenerative braking, and state of charge.
  - Car: rolling resistance, aerodynamic drag, and brakes.
  - State lives in `S`. Visual speed is real speed × `S.slow` (slow motion).
- **Angles**: `A.*` accumulate visual angles each frame. Engine parts use `-A.e`. The diff and wheels use `-A.diff` / `-A.wheel`. Everything that touches them is derived through `meshAng`.

## The « Montre-moi » director (most common task)

New videos need **no 3D work**; read `docs/SCENARIOS.md`. A video is `{id, t, d, shots:()=>[...]}` in `SCENARIOS.manual | auto | ev`.

Each shot is `{focus, iso, body, explode, dir, zoom, orbit, dur, slow, cap, sub, act, at}`.

Actions: `setupState({...})`, `pressStart()`, `anim.clutch|gas|brake = {to, rate}`, `selectGear(g)`, `tourShift(g)`, `selectAuto('P'|'R'|'N'|'D')`.

When adding one:
1. Write the shots.
2. Check the mechanics are true in the simulation. For example, if a caption says the wheels are still, make sure `ratioNow()` is 0 at that moment.
3. Run `npm test` (add the new id to `tests/smoke.mjs` if it's important).
4. Watch it in a browser.

## Other common tasks

- **Add a part**:
  1. Build the mesh in the right car file and register it with `put(obj, key, category, mode)`.
  2. Add `INFO[key]` with an anchor `a` if it deserves a label.
  3. If it moves, animate it in `animate()` (07), deriving its angle from what drives it.
  4. Add it to `docs/PARTS.md`.
- **Parking and the moving car**: during parking videos and street mode, `PARK.on` is true, the whole car (`ROOT`) moves and turns over a fixed street (`PARKG`), and the scrolling road is hidden. `PARK.delta` is the bicycle-model steering angle (+ = left); `wheelSteer()` turns each front wheel (Ackermann), the steering wheel turns `STEER_RATIO` × more. A parking video is a plan of steps (`{g}` gear, `{steer}`, `{ds}` distance) replayed deterministically: a shot plays `park:k` (or `[k0,k1]`) or freezes `pose:k`. Camera: `cam:{p, t, p2?, car?}` (world, or car-mounted with `car:true`); `dir`/`zoom` shots follow the car.
- **Motorway videos** (`merge`, `lanechange`, 04/05): our car stays near x = 0 and the road scrolls (`HWY.movers`, the slip road group `INSG`). A shot sets `hwy:{v, rel | cars:[[z, x0, x1]…], lane:[z0,z1], insAt}`, `zones:true` paints mirror coverage (green) and blind spots (red), `mirrors:true` shows the 3 mirrors, `blink:'L'` the indicator. Lanes: right lane z = 0, middle 3.5, left 7; slip road z = -3.5.
- **Add a parking manoeuvre**: write its steps, compute the start backwards from the parked pose (see `PLAN_PERP`), check clearances (a small Python check is fine), add obstacles to `PARK_OBST` if you add cars.
- **Add a lesson step**: `buildLesson()` (07) holds the `[text, conditionFn]` pairs per car.
- **Change a camera preset**: `VIEWS` (05).

## Conventions

- **UI**: the panel opens with two big tabs (Explore / Drive). Rarely used settings live in `<details class="fold">`. The part toggles above the stage hide behind « 🧩 Pièces ».
- **UI text is French and English.** Every visible string goes through `tr('français','English')` (01-core). Static HTML in `src/page.html` carries `data-en` (innerHTML) or `data-en-label` (aria-label). Language: `?lang=` > saved choice > browser; switching reloads the page. Numbers go through `fr(x,d)`, which picks the decimal separator. French: friendly « tu ». English: plain, friendly « you ». Short sentences, real numbers (rpm, km/h, teeth). Code comments may be in French or English. Note: `EN` is the engine geometry object, not the language (`IS_EN` is).
- **No brand names, logos or copies of real car designs.** The body is a generic compact hatchback. Specs are described as « une compacte 2.0 essence de 150 ch » and « une compacte électrique 100 kW / 35,8 kWh ».
- **Single static file, no build-time dependencies.** three.js r128 (UMD) and OrbitControls come from a CDN. Don't introduce a bundler or framework unless there's a strong reason.
- **Colours**: CSS tokens in `src/page.html`. Light and dark themes are both supported, so don't hard-code colours in components. Video overlays deliberately use fixed white text.
- **Performance**: keep the mesh count reasonable (~900 today). Merge static geometry if you add a lot. Test on a phone.
- **Accuracy**:
  - The automatic gear ratios come from a real Lepelletier layout with chosen tooth counts.
  - The manual ratios are approximate.
  - EV values are typical for a 2017 compact EV.
  - Say « simplifié » when unsure. Never invent precise-sounding facts.

## Ideas / roadmap

0. More driving videos (stopping distance, cyclist overtaking, lorry blind spots, yield to the right). A crossroads in street mode: stop sign, yield to the right, pedestrian crossing, scored by simple rules on position and speed (no model).
0b. Engine from a spec sheet: move `EN`, `PH`, `FIRE` (02) and the torque curve (06) into one engine object (bore, stroke, cylinders, firing order, power, torque), so a real engine can be rebuilt from its published figures. A different cylinder count changes the crank, the firing order and the block layout. Brand names stay out unless the owner decides otherwise.
1. Move `SCENARIOS` to plain JSON files (`scenarios/*.json`) with the actions as named commands. AI agents could then write videos without touching JS.
2. Expose the director as a small command API (`focus`, `isolate`, `zoom`, `caption`, `action`), then as an **MCP server**, so an assistant can drive the page live (« montre-moi l'embrayage »).
3. More learner-driver videos: see the list at the end of `docs/SCENARIOS.md`.
4. A hybrid car and a short quiz after each video.
5. A « fault code » mode: type an OBD-II `P0xxx` code, highlight the part on the generic car (lookup table, no model). See README.
