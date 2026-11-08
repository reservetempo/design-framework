# Gute Form 3D add-on: build plan (`gute-form-3d.js`)

Research for task G1c, 2026-11-08. The add-on is optional: `gute-form.css` and the demo work
without it. It enhances two elements that already work as plain HTML/CSS:

1. **Hero**: a stylised Braun SK 4 (1956) at the top of the demo page, slowly turning, drag to rotate.
2. **Keypad**: Braun ET 66 (1987) style round keys in 3D that sink when pressed, driving a small calculator.

All colour comes from the CSS tokens (`--gf-page`, `--gf-surface`, `--gf-line`, `--gf-ink`,
`--gf-muted`, `--gf-accent`, `--gf-accent-ink`, `--gf-second`, `--gf-trim`), so every palette and
dark mode recolour the scene. Key roles follow `research/components.md` (digits `--gf-ink`,
operators `--gf-second`, equals `--gf-accent`, plate `--gf-trim`).

## 1. three.js version and loading

| Item | Choice |
| --- | --- |
| Latest release | `0.187.0` (r187), on npm 2026-10-30: only 9 days old, too new |
| **Pinned version** | **`0.186.1`** (r186), on npm **2026-09-24** (0.186.0 was 2026-09-08) |
| Renderer | `WebGLRenderer` (WebGL 2 only since r163); WebGPU not needed |
| Licence | MIT, copyright 2010-2026 three.js authors (`LICENSE` in the package) |

r186 notes that matter: the **`.min.js` builds were removed** from the npm package (jsDelivr
still generates a `three.module.min.js`, but it imports the unminified `./three.core.js`); the
CommonJS build is deprecated; `WebGLRenderer.dispose()` is now async; `PCFSoftShadowMap` was
removed (we use no shadow maps anyway).

**Import map** (demo page `<head>`, before any module script), the pattern the three.js
installation page documents. Addons import the bare name `three`, so there is one copy only:

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.186.1/examples/jsm/"
  }
}
</script>
<script type="module" src="gute-form-3d.js"></script>
```

**Optional smaller variant** (decision 1): map `three` to jsDelivr's generated
`build/three.module.min.js` and add an entry remapping the full URL
`https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.core.js` to `.../build/three.core.min.js`
(import maps may remap absolute URLs, per MDN). jsDelivr advises against SRI on generated files.

**Addons**: `RoomEnvironment` (`three/addons/environments/RoomEnvironment.js`, studio reflections
via `PMREMGenerator.fromScene()`) and `RoundedBoxGeometry`
(`three/addons/geometries/RoundedBoxGeometry.js`, args `width, height, depth, segments, radius`).
Everything else is core: `CylinderGeometry`, `LatheGeometry`, `ExtrudeGeometry`, `InstancedMesh`,
`CanvasTexture`, `MeshStandardMaterial`, `MeshPhysicalMaterial`, `Timer`. No `OrbitControls`
(custom drag is smaller) and no `WebGL.js` helper (our own check runs before any download).

| Download (measured on jsDelivr, 0.186.1) | Brotli | Gzip | Uncompressed |
| --- | --- | --- | --- |
| `three.module.js` + `three.core.js` (default) | ~313 KB | ~420 KB | ~2.1 MB |
| generated `.min` pair (optional variant) | ~159 KB | ~196 KB | ~0.8 MB |
| `RoomEnvironment` + `RoundedBoxGeometry` | ~3 KB | ~3.6 KB | ~11 KB |
| `gute-form-3d.js` (estimate) | ~6 KB | ~7 KB | ~25 KB |

The library is fetched only when a `[data-gf-3d]` element exists and WebGL 2 works.

**Credit**: MIT asks that the notice travels with copies. CDN files keep their `@license`
header; if files are ever vendored, add three.js's `LICENSE` beside them. Add a visible line on
the demo page ("3D: three.js r186, MIT", linking to https://threejs.org) and a header comment in
`gute-form-3d.js` naming three.js, the version and the licence.

## 2. Hero model: SK 4

### 2.1 The real object

- **Size**: MoMA lists the SK 4/10 at 24.1 × 58.4 × 29.2 cm (H × W × D); SK 4/1 and SK 55
  listings agree (about 24 × 58 × 29 cm). So W : D : H ≈ 2.4 : 1.2 : 1.
- **Body**: one steel sheet bent into a U (front, bottom, back), lacquered white, stiffened by the
  two side walls (Funkschau 1957). Front and back look almost the same.
- **Side panels**: light wood veneer, elm on the SK 4/SK 5 (de.wikipedia, vintageradio.nl).
- **Lid**: clear Plexiglas hood between the side panels; it replaced a metal lid that rattled. A
  cut-out at the back lets an LP overhang (first rectangular, later a curved arc).
- **Top deck**: record player on the left (Wagenfeld's PC 3, 33/45/78 rpm), radio controls on the
  right, all on top rather than on the front: a narrow linear ("thermometer") tuning scale and
  light-grey knobs and buttons matching the player chassis.
- **Speaker slots**: rows of punched slots in the front and back sheet; an oval speaker inside.

Knob count and scale position vary by version (SK 4, 4/1, 4/10, SK 5, SK 55): check one top-down
photo and keep the model stylised, not a replica.

### 2.2 Parts from primitives (1 unit = 10 cm, origin at floor centre)

| Part | Size (units) | Geometry | Notes |
| --- | --- | --- | --- |
| Body | 5.54 × 2.0 × 2.92 | `RoundedBoxGeometry`, radius 0.05 | top face is the deck |
| Side panels ×2 | 0.15 × 2.41 × 2.92 | `RoundedBoxGeometry`, radius 0.02 | x = ±2.845, full height, framing the lid |
| Deck plate | 5.4 × 0.02 × 2.8 | box | light grey |
| Platter | r 1.1, h 0.08 | `CylinderGeometry`, 64 segments | centre about (-1.2, 2.05, 0.05); dark mat r 1.05; spindle r 0.03 |
| Tonearm | pivot r 0.12; arm r 0.025 × 2.0 | cylinders + small box headshell | pivot behind-right of the platter |
| Scale | 0.35 × 2.2 strip | `PlaneGeometry` + `CanvasTexture` | ticks in `--gf-ink`, pointer bar `--gf-accent` |
| Knobs ×3-4 | r 0.16, h 0.12 | `LatheGeometry` (flat top, fillet) | one shared geometry |
| Push buttons ×4-5 | 0.18 × 0.06 × 0.1 | `RoundedBoxGeometry` | row beside the scale |
| Lid | span 5.54, height 0.4 | `ExtrudeGeometry` of a thin inverted-U | or 3 thin boxes; optional back cut-out |
| Grille slots | 0.22 × 0.035 × 0.02 each | one `InstancedMesh` (e.g. 6 × 16) | front and back, set 0.005 into the face |
| Feet ×4 | r 0.08, h 0.05 | `CylinderGeometry` | `--gf-ink` |

About 25 draw calls, under 20k triangles; a theme change only updates materials and textures.

### 2.3 Materials (start values, tune by eye)

| Surface | Material | Settings |
| --- | --- | --- |
| Lacquered body | `MeshPhysicalMaterial` | `--gf-surface`, roughness 0.4, metalness 0, clearcoat 1, clearcoatRoughness 0.15 |
| Deck, knobs, buttons | `MeshStandardMaterial` | mix of `--gf-surface` and `--gf-line`, roughness 0.55 |
| Wood ends (`trim=wood`) | `MeshStandardMaterial` | `--gf-trim`, roughness 0.65, canvas wood-grain `map`, max anisotropy |
| Aluminium ends | `MeshPhysicalMaterial` | `--gf-trim`, metalness 1, roughness 0.3, anisotropy 0.6 (brushed) |
| Perspex lid | `MeshPhysicalMaterial` | white, roughness 0.05, transparent, opacity 0.15, depthWrite false, DoubleSide, late `renderOrder`; faint `EdgesGeometry` outline in `--gf-line` |
| Perspex (richer) | `MeshPhysicalMaterial` | transmission 1, thickness 0.03, ior 1.49 (PMMA); extra render pass, only if clearly better |
| Mat, slots, feet | `MeshStandardMaterial` | `--gf-ink`, roughness 0.9 |
| Platter rim, spindle | `MeshStandardMaterial` | light grey, metalness 1, roughness 0.35 |
| Tonearm | `MeshStandardMaterial` | `--gf-accent` (anthracite in the SK 4 palette), roughness 0.4 |

Every `CanvasTexture` needs `colorSpace = SRGBColorSpace`.

### 2.4 Lighting, shadow, camera

- Renderer: `antialias: true`, `alpha: true` (page colour shows through), `powerPreference:
  'low-power'`, `NeutralToneMapping` (keeps token colours close to CSS), exposure 1.
- Environment: `PMREMGenerator.fromScene(new RoomEnvironment(), 0.04)` into `scene.environment`,
  `environmentIntensity` about 0.8; dispose the generator and room scene right after.
- Key light: one `DirectionalLight` from upper front-left, intensity about 1.5, no shadow map.
- Contact shadow: a floor plane that is a **child of the model group** (it turns with the model),
  textured once with a soft rounded rectangle drawn on a canvas via `shadowBlur` (`ctx.filter`
  blur is not supported everywhere); `MeshBasicMaterial` in `--gf-ink`, opacity about 0.35,
  transparent, depthWrite false, toneMapped false.
- Camera: `PerspectiveCamera`, fov about 28, slightly above and in front; fit the bounding sphere
  against both horizontal and vertical fov so portrait phones show the full width.

### 2.5 Motion and drag

- Rotate the **model group**, not the camera, so the lights stay fixed like a studio turntable.
- Auto-turn "sway" (default): yaw = 0.7 × range × sin(2πt / 24 s), range 45°. Option "spin":
  360° at about 6°/s (front and back look alike).
- Drag: Pointer Events with `setPointerCapture`, about 0.4° per CSS px, clamped to ±range,
  optional pitch ±8°. Canvas `touch-action: pan-y` so vertical swipes still scroll; `cursor: grab`.
- Release: short decaying inertia; after 2.5 s idle, ease back into the sway.
- `prefers-reduced-motion: reduce`: no auto-turn or inertia, one fixed three-quarter view; drag
  still works and stops dead on release.

### 2.6 Colours from tokens

1. Read with `getComputedStyle(el).getPropertyValue('--gf-…').trim()`.
2. Tokens may use `oklch()`, `color-mix()` or `var()`, which `THREE.Color` cannot parse: resolve
   through a hidden probe (`probe.style.color = 'var(--gf-accent)'`), paint the computed colour
   into a 1×1 2D canvas and read the pixel back as sRGB bytes.
3. `color.setRGB(r / 255, g / 255, b / 255, SRGBColorSpace)`; three converts to linear.
4. Re-read on `matchMedia('(prefers-color-scheme: dark)')` changes and on a `MutationObserver`
   watching `<html>` attributes (`data-theme`, `data-gf-palette`, `class`).

## 3. Keypad: ET 66

### 3.1 The real object

- Rams and Lubs, Braun type 4776, 1987; about 137 × 78 × 11 mm; black plastic, LCD at the top,
  round convex keys (V&A, Powerhouse). Calculator.org lists 27 keys and 8 digits.
- Colours (V&A): black number keys, brown operator keys, yellow `=` at bottom right; some
  sources add a green group for other functions.
- No reliable key-by-key diagram was found online: **confirm the order from a photo**. Pitch
  about 15 mm, keys roughly 10 mm across (estimated from photos).

### 3.2 Proposed demo layout (24 keys, 4 × 6)

| Row | Col 1 | Col 2 | Col 3 | Col 4 |
| --- | --- | --- | --- | --- |
| 1 | `C` fn | `MRC` fn | `M−` fn | `M+` fn |
| 2 | `√` fn | `%` fn | `±` fn | `÷` op |
| 3 | `7` | `8` | `9` | `×` op |
| 4 | `4` | `5` | `6` | `−` op |
| 5 | `1` | `2` | `3` | `+` op |
| 6 | `0` | `.` | `CE` fn | `=` equals |

Digits `--gf-ink`, op `--gf-second`, equals `--gf-accent` (label `--gf-accent-ink`), fn
`--gf-second` or a muted mix. The CSS sets each button's fill as `--gf-key-fill`; the add-on reads
that per button, so the CSS stays the single source of colour.

### 3.3 Real buttons drive the 3D (recommended)

- The keypad is a grid of real `<button type="button">`s. The calculator logic works on those
  buttons and is **not** in the add-on, so it behaves the same with or without 3D.
- The add-on puts one canvas **behind** the grid (absolute, same box, `pointer-events: none`,
  `aria-hidden="true"`) and adds `.gf-3d-ready`; the CSS then makes button fills transparent
  but keeps labels, hit areas and focus rings on the buttons above the canvas. The browser
  already knows which button was hit, so **no raycasting**; keyboard, screen readers and
  forced colours keep working.
- Mapping: measure each button with `getBoundingClientRect()` relative to the keypad. A
  `PerspectiveCamera` (fov about 20°) looks straight at the plane z = 0 from distance
  (h / 2) / tan(fov / 2), so 1 unit = 1 CSS px on that plane. Model keys with their **top at
  z = 0**: resting tops line up exactly with the labels, and sinking keys move to negative z
  with real perspective. Re-measure on `ResizeObserver` and `document.fonts.ready`.
- Rejected: canvas on top with raycasting (two input paths, focus ring drawn in 3D).

### 3.4 Key geometry and the press

- One shared `LatheGeometry`: vertical side, small fillet, shallow dome (about 12% of the radius),
  scaled per button (40 px keys in the CSS spec). Under each key a short dark open cylinder
  (`BackSide`) as the hole; the plate itself stays CSS (`--gf-trim`).
- Material: `MeshPhysicalMaterial`, `--gf-key-fill`, roughness 0.35, clearcoat 0.6; lighting as
  the hero, key light from top-left to match the CSS shadows.
- Press: travel about 3 px, down in 60 ms, up in 120 ms ease-out. CSS moves the label 1 px on
  `.is-pressed` so text and key move together (instead of the CSS-only `scale(.96)`).
- Inputs: delegated `pointerdown` presses; `pointerup`, `pointercancel` or leaving releases;
  Space/Enter `keydown`/`keyup` on a focused key. Physical typing ("7", "+", Enter) is handled by
  the calculator, which dispatches `gf-key`; the add-on plays a 90 ms press for that button.
- Render only while a key moves, plus once after resize or a theme change. Reduced motion: keys
  jump down and up with no easing.

## 4. Robustness

- **Skip quietly before downloading** when there is no `[data-gf-3d]`, no
  `HTMLScriptElement.supports?.('importmap')`, no WebGL 2 (test context with
  `failIfMajorPerformanceCaveat: true` to skip software rendering), `forced-colors: active`,
  or `navigator.connection?.saveData`.
- **Lazy import**: `gute-form-3d.js` has no static imports; it runs `await import('three')` in
  try/catch when an element comes within 200 px of the viewport. On any failure the CSS version
  stays and one `console.info` is logged.
- **No flash**: the CSS/SVG version stays until the first frame is drawn (`compileAsync`, then
  render); then `.gf-3d-ready` fades the canvas in over 300 ms (instant under reduced motion).
  The container keeps its CSS `aspect-ratio`, so nothing shifts.
- **Pixel ratio** `Math.min(devicePixelRatio, 2)` (or `data-gf-3d-dpr`). **Render on demand**:
  `requestAnimationFrame` runs only while something moves and stops when it settles.
- **Off-screen, hidden tabs**: IntersectionObserver pauses the hero out of view;
  `visibilitychange` pauses both; `Timer.connect(document)` avoids a jump on return.
- **Resize**: `ResizeObserver`, `renderer.setSize(w, h, false)`, refit or re-map, render once.
  **Context loss**: on `webglcontextlost`, unmount and fall back to the CSS version.
- **Accessibility**: canvases `aria-hidden="true"`, never focusable. The hero's static drawing
  keeps its name (`role="img"` + `aria-label`, visually hidden once 3D shows).
- **Clean-up**: one `AbortController` per instance for all listeners; disconnect observers;
  dispose geometries, materials, canvas textures and the PMREM target; `renderer.dispose()`
  (async in r186); remove the canvas. Runs from `unmount(el)` and when a `MutationObserver` sees
  the element leave the document.
- **Two contexts**: hero and keypad each get their own renderer (far below browser limits);
  environment maps cannot be shared between contexts, so each builds its own.

## 5. API sketch for `gute-form-3d.js`

```html
<figure class="gf-product" data-gf-3d="hero" data-gf-3d-turn="sway" data-gf-3d-trim="wood">
  <div class="gf-product__stage">  <!-- canvas goes here; CSS-only: flat SVG elevation -->
    <svg class="gf-product__drawing" role="img" aria-label="Radio-phonograph: white body, wooden ends, clear lid">…</svg>
  </div>
  <figcaption>SK 4, 1956 …</figcaption>
</figure>

<div class="gf-calc" data-gf-3d="keypad">
  <output class="gf-calc__display" aria-live="polite">0</output>
  <div class="gf-calc__keys" role="group" aria-label="Keypad">
    <button type="button" class="gf-key gf-key--num" data-key="7">7</button>
    <button type="button" class="gf-key gf-key--op" data-key="/" aria-label="divide">÷</button>
    <button type="button" class="gf-key gf-key--equals" data-key="=">=</button>
  </div>
</div>
```

Class names should be reconciled with `research/components.md` when the CSS is written.

| Attribute | On | Values (default first) |
| --- | --- | --- |
| `data-gf-3d` | element | `hero`, `keypad` |
| `data-gf-3d-turn` | hero | `sway`, `spin`, `off` |
| `data-gf-3d-range` | hero | sway/drag yaw limit in degrees, `45` |
| `data-gf-3d-trim` | hero | `wood`, `aluminium` (tokens are colours; this picks the material) |
| `data-gf-3d-travel` | keypad | key travel in px, `3` |
| `data-gf-3d-dpr` | either | max pixel ratio, `2` |
| `data-gf-3d-auto="off"` | `<html>` | no auto-start; call `mount()` yourself |

- **Auto-start**: module scripts run after parsing; it finds `[data-gf-3d]` and mounts each lazily.
- **Exports**: `mount(el)`, `unmount(el)`, `refresh()` (re-read tokens after a palette switch).
- **State classes** on the element: `.gf-3d-loading`, `.gf-3d-ready`.
- **Events** (bubbling `CustomEvent` on the element): `gf3d:ready` `{type}`; `gf3d:fallback`
  `{type, reason}`, reason one of `no-webgl`, `import-failed`, `context-lost`, `save-data`,
  `forced-colors`.
- **Listens for** `gf-key` `{key, button}` from the calculator (physical keyboard presses).

## 6. Open-source examples worth borrowing ideas from

| Example | Licence | Idea to borrow |
| --- | --- | --- |
| [three.js `webgl_shadow_contact`](https://threejs.org/examples/#webgl_shadow_contact) | MIT | blurred contact shadow from a depth render |
| [three.js `webgl_loader_gltf_sheen`](https://threejs.org/examples/#webgl_loader_gltf_sheen) | MIT | product under `RoomEnvironment` studio light |
| [three.js `webgl_materials_physical_clearcoat`](https://threejs.org/examples/#webgl_materials_physical_clearcoat) | MIT | clearcoat for lacquer |
| [three.js `webgl_materials_physical_transmission`](https://threejs.org/examples/#webgl_materials_physical_transmission) | MIT | transmission and ior for the perspex option |
| [three.js `webgl_instancing_raycast`](https://threejs.org/examples/#webgl_instancing_raycast) | MIT | `InstancedMesh` setup for the slots |
| [three.js manual: align HTML elements to 3D](https://threejs.org/manual/#en/align-html-elements-to-3d) | MIT | keeping HTML and 3D positions in sync |
| [pmndrs/drei `PresentationControls`](https://github.com/pmndrs/drei/blob/master/src/web/PresentationControls.tsx) | MIT | drag within limited angles, spring back |
| [pmndrs/drei `ContactShadows`](https://github.com/pmndrs/drei/blob/master/src/core/ContactShadows.tsx) | MIT | contact shadow parameters (blur, opacity) |
| [google/model-viewer](https://github.com/google/model-viewer) | Apache-2.0 | auto-rotate delay after interaction; neutral studio look |
| [crsnbrt/keysim](https://github.com/crsnbrt/keysim) | MIT | three.js keycaps animating as you type |
| [felixtrz/xrkeys](https://github.com/felixtrz/xrkeys) | MIT | key press states and feedback (WebXR keyboard) |
| [muratlevent/keyboard](https://github.com/muratlevent/keyboard) | none stated | look only: physical keys animating 3D keycaps |
| [c-ehrlich/calculator](https://github.com/c-ehrlich/calculator) | none stated | look only: Braun ET 55 replica in React |

Repos with no licence are for looking only; nothing is copied from any source.

**Done means**: the demo works fully with the add-on blocked; every key works by mouse, touch,
keyboard and typing, identically with and without 3D; 3D keys sit under their labels at 320 px
and desktop widths; no console errors; `unmount()` leaves no listeners or contexts.

## 7. Decisions for the user

1. **Loading**: plain published files (~313 KB brotli, simplest, as in the three.js docs) or the
   jsDelivr-minified pair with the core remap (~159 KB brotli, one extra import-map line,
   generated files). Recommendation: plain files; switch if size matters.
2. **Auto-turn**: gentle sway within ±45° (recommended) or a slow full 360° spin.
3. **ET 66 layout**: confirm the real key order from a photo, or accept the 24-key layout above
   (the real calculator has 27 keys).
4. **Calculator logic**: inline script in the demo page (recommended, keeps the CSS library
   JS-free) or a small reusable `gute-form-calc.js`.

## Sources

- npm registry, `three` versions and dates: https://registry.npmjs.org/three
- three.js r186 release notes: https://github.com/mrdoob/three.js/releases/tag/r186
- jsDelivr file listing for 0.186.1: https://data.jsdelivr.com/v1/packages/npm/three@0.186.1
- jsDelivr on SRI and generated files: https://www.jsdelivr.com/using-sri-with-dynamic-files
- three.js licence: https://github.com/mrdoob/three.js/blob/r186/LICENSE
- three.js manual: [installation (import map)](https://threejs.org/manual/#en/installation),
  [rendering on demand](https://threejs.org/manual/#en/rendering-on-demand),
  [responsive](https://threejs.org/manual/#en/responsive),
  [disposing](https://threejs.org/manual/#en/how-to-dispose-of-objects),
  [colour management](https://threejs.org/manual/#en/color-management),
  [WebGL check](https://threejs.org/manual/#en/webgl-compatibility-check)
- Addon sources: [RoomEnvironment](https://github.com/mrdoob/three.js/blob/r186/examples/jsm/environments/RoomEnvironment.js),
  [RoundedBoxGeometry](https://github.com/mrdoob/three.js/blob/r186/examples/jsm/geometries/RoundedBoxGeometry.js)
- MDN, import maps: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap
- MoMA, Radio-Phonograph SK 4/10: https://www.moma.org/collection/works/2649
- V&A, SK 55 record player: https://collections.vam.ac.uk/item/O168285
- Wikipedia (de), Braun SK 4: https://de.wikipedia.org/wiki/Braun_SK_4
- Funkschau 1957 report on the SK 4 (PDF): https://radiomuseum.org/lf/dwl/346/D_FS_6_1957_Braun_Sk_4.pdf
- braunaudio.de, SK 4 history: https://braunaudio.de/en/snowwhitecoffin-sk4-dieter-rams-hans-gugelot-design-moma
- vintageradio.nl, SK 5: https://vintageradio.nl/radio%27s/braun_sk5_phonosuper_engels.htm
- V&A, ET 66 calculator: https://collections.vam.ac.uk/item/O1360553
- Powerhouse Collection, ET 66: https://collection.powerhouse.com.au/object/434214
- calculator.org, ET 66 specs: https://www.calculator.org/calculators/Braun_ET66.html
- Repository licences checked with the GitHub API on 2026-11-08.
