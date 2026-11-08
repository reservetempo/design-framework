/*
  Gute Form 3D: an optional add-on for gute-form.css (an ES module).

  It turns marked figures into small three.js scenes. It is optional: the CSS library
  works without it, and if anything is missing or fails (no import maps, no WebGL 2,
  forced colours, data saver, a failed download, a lost GPU context) the CSS-only look
  stays, here the flat SVG drawing. Nothing is downloaded unless a marked element exists
  and WebGL 2 works.

  Use: put an import map and this module in the page's <head>:

    <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.186.1/examples/jsm/"
      }
    }
    </script>
    <script type="module" src="gute-form-3d.js"></script>

  Attributes:
    data-gf-3d="hero"        on a .gf-product figure: the SK 4 radio-phonograph, built
                             from simple shapes, in the --gf-* colours
    data-gf-3d-turn          spin (default: a slow full turn, like a museum turntable),
                             sway (a gentle swing of 45 degrees each way) or off
    data-gf-3d-trim          wood (default: grained --gf-trim ends) or aluminium
    data-gf-3d-range         sway and drag limit in degrees for "sway" (default 45)
    data-gf-3d-dpr           maximum pixel ratio (default 2)
    data-gf-3d-auto="off"    on <html>: don't start by itself; call mount(el)
  Drag (mouse or touch) turns the model; the turn resumes gently afterwards. Under
  prefers-reduced-motion there is no auto-turn: a still three-quarter view you can drag.
  The canvas is aria-hidden; the SVG stays as the accessible image (faded out, not
  removed, once the first 3D frame is drawn). State classes on the element:
  .gf-3d-loading, .gf-3d-ready. Events (bubbling): gf3d:ready {type},
  gf3d:fallback {type, reason}. Exports: mount(el), unmount(el), refresh() (re-read
  the colour tokens), inspect(el) (debug state).

  3D: three.js 0.186.1 (r186), https://threejs.org, MIT License,
  copyright 2010-2026 three.js authors. Loaded from jsDelivr, not bundled here.
*/

const DEG = Math.PI / 180;

/* ---------- Effects: data-gf-3d value -> build(stage) ---------- */
/* A build returns { fit(), paint(colours), tick(dt) -> keep animating?, state() }.
   "keypad" (the ET 66 keys) is to be added here. */
const EFFECTS = { hero: buildHero };

const TOKENS = ['page', 'surface', 'line', 'ink', 'muted', 'accent', 'second', 'trim'];
const instances = new Map();
const attr = (el, name) => el.getAttribute(name ? `data-gf-3d-${name}` : 'data-gf-3d');

/* ---------- Shared loader (one copy of three.js for every effect) ---------- */

let libPromise;
function loadThree() {
  libPromise ??= Promise.all([
    import('three'),
    import('three/addons/environments/RoomEnvironment.js'),
    import('three/addons/geometries/RoundedBoxGeometry.js'),
  ]).then(([THREE, env, box]) => ({
    THREE,
    RoomEnvironment: env.RoomEnvironment,
    RoundedBoxGeometry: box.RoundedBoxGeometry,
  }));
  return libPromise;
}

let webgl2;
function skipReason() {
  if (!HTMLScriptElement.supports?.('importmap')) return 'no-importmap';
  if (matchMedia('(forced-colors: active)').matches) return 'forced-colors';
  if (navigator.connection?.saveData) return 'save-data';
  if (webgl2 === undefined) {
    try {
      const gl = document.createElement('canvas')
        .getContext('webgl2', { failIfMajorPerformanceCaveat: true });
      webgl2 = !!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { webgl2 = false; }
  }
  return webgl2 ? '' : 'no-webgl';
}

/* ---------- Colours from the tokens ---------- */
/* Tokens may be oklch(), color-mix() or var(): let the browser resolve them on a probe,
   paint the result into a 1x1 canvas and read back sRGB bytes. */

let pixel;
function readColours(el, THREE) {
  pixel ??= Object.assign(document.createElement('canvas'), { width: 1, height: 1 })
    .getContext('2d', { willReadFrequently: true });
  const probe = document.createElement('i');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  el.append(probe);
  const out = {};
  for (const name of TOKENS) {
    probe.style.color = `var(--gf-${name}, #808080)`;
    pixel.clearRect(0, 0, 1, 1);
    pixel.fillStyle = '#808080';
    pixel.fillStyle = getComputedStyle(probe).color;
    pixel.fillRect(0, 0, 1, 1);
    const [r, g, b] = pixel.getImageData(0, 0, 1, 1).data;
    out[name] = new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  }
  probe.remove();
  return out;
}

/* ---------- Stage: renderer, studio light, camera, loop, observers, clean-up ---------- */

function createStage(el, host, lib, build, rec, onLost) {
  const { THREE, RoomEnvironment } = lib;
  const ac = new AbortController();
  const { signal } = ac;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let renderer, envTarget, ro, io, mo, frame = 0, last = 0, live = false, inView = true;

  const stage = {
    el, host, lib, THREE, signal,
    reduced: reduce.matches,
    frames: 0,
    request() {
      if (live && !frame && inView && !document.hidden) frame = requestAnimationFrame(loop);
    },
    recolour() {
      stage.effect?.paint(readColours(el, THREE));
      stage.request();
    },
    dispose() {
      live = false;
      ac.abort();
      cancelAnimationFrame(frame);
      ro?.disconnect(); io?.disconnect(); mo?.disconnect();
      stage.scene?.traverse((o) => {
        o.geometry?.dispose();
        for (const m of [].concat(o.material || [])) { m.map?.dispose(); m.dispose(); }
        if (o.isInstancedMesh) o.dispose();
      });
      envTarget?.dispose();
      renderer?.dispose();
      stage.canvas?.remove();
    },
  };
  rec.stage = stage;   // so a failure part-way through still cleans up

  function loop(now) {
    frame = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    const more = stage.effect.tick(dt);
    renderer.render(stage.scene, stage.camera);
    stage.frames++;
    if (more) stage.request();
    if (!frame) last = 0;
  }

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    stage.camera.aspect = w / h;
    stage.effect.fit();
    stage.camera.updateProjectionMatrix();
    if (live && !frame) { renderer.render(stage.scene, stage.camera); stage.request(); }
  }

  const canvas = stage.canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  renderer = stage.renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, parseFloat(attr(el, 'dpr')) || 2));
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.85;   // white lacquer stays a shade below the page
  renderer.debug.checkShaderErrors = false;   // no driver log noise; faster compiles
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onLost(); }, { signal });

  const scene = stage.scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  envTarget = pmrem.fromScene(room, 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.6;
  room.dispose?.();
  pmrem.dispose();
  stage.camera = new THREE.PerspectiveCamera(28, 32 / 15, 0.1, 100);

  stage.effect = build(stage);
  stage.recolour();
  host.append(canvas);
  resize();

  ro = new ResizeObserver(resize);
  ro.observe(host);
  io = new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1].isIntersecting;
    last = 0;
    stage.request();
  });
  io.observe(host);
  document.addEventListener('visibilitychange', () => { last = 0; stage.request(); }, { signal });
  reduce.addEventListener('change', (e) => { stage.reduced = e.matches; stage.request(); }, { signal });
  mo = new MutationObserver(() => stage.recolour());
  mo.observe(document.documentElement, {
    attributes: true, attributeFilter: ['class', 'style', 'data-theme', 'data-gf-palette'],
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => stage.recolour(), { signal });

  /* First frame: compile off the main thread where possible, draw once, then go live. */
  stage.ready = renderer.compileAsync(scene, stage.camera).then(() => {
    if (signal.aborted) return;
    renderer.render(scene, stage.camera);
    stage.frames++;
    live = true;
    stage.request();
  });
  return stage;
}

/* ---------- Hero: the SK 4 radio-phonograph (1 unit = 10 cm, origin at floor centre) ---------- */

function buildHero(stage) {
  const { THREE, el, scene, camera, canvas, renderer, signal } = stage;
  const RBox = stage.lib.RoundedBoxGeometry;
  const turn = ['spin', 'sway', 'off'].includes(attr(el, 'turn')) ? attr(el, 'turn') : 'spin';
  const range = (parseFloat(attr(el, 'range')) || 45) * DEG;
  const aluminium = attr(el, 'trim') === 'aluminium';
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const W = 5.54, D = 2.92, SIDE = 0.15, H = 2.41, FOOT = 0.05;
  const BASE = 0.15, DECK = 2.05, LID = FOOT + H - DECK, TOP = DECK + 0.02;

  const tex = (cv) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    return t;
  };
  const canvas2d = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });

  /* Wood grain: grey streaks on white, multiplied by the --gf-trim colour. */
  const grain = canvas2d(256, 256);
  {
    const g = grain.getContext('2d');
    g.fillStyle = '#fff';
    g.fillRect(0, 0, 256, 256);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 46; i++) {
      const x = rnd() * 256, sway = 2 + rnd() * 6, phase = rnd() * 6;
      g.strokeStyle = `rgba(60, 35, 15, ${0.05 + rnd() * 0.14})`;
      g.lineWidth = 0.6 + rnd() * 2.2;
      g.beginPath();
      for (let y = 0; y <= 256; y += 16) g.lineTo(x + Math.sin(y / 40 + phase) * sway, y);
      g.stroke();
    }
  }

  /* Tuning scale: drawn from the tokens, redrawn on a palette change. */
  const scaleCv = canvas2d(512, 64);
  const scaleTex = tex(scaleCv);

  /* Soft contact shadow: a blurred rectangle (shadowBlur, drawn off-canvas). */
  const shadowCv = canvas2d(256, 148);
  {
    const g = shadowCv.getContext('2d');
    g.shadowColor = '#fff';
    g.shadowBlur = 20;
    g.shadowOffsetX = 512;
    g.fillStyle = '#fff';
    g.fillRect(42 - 512, 31, 172, 86);
  }

  const M = {
    lacquer: new THREE.MeshPhysicalMaterial({ roughness: 0.4, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15 }),
    plate: new THREE.MeshStandardMaterial({ roughness: 0.55 }),
    control: new THREE.MeshStandardMaterial({ roughness: 0.5 }),
    trim: aluminium
      ? new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.3, anisotropy: 0.6 })
      : new THREE.MeshStandardMaterial({ roughness: 0.65, map: tex(grain) }),
    perspex: new THREE.MeshPhysicalMaterial({
      color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.15,
      depthWrite: false, side: THREE.DoubleSide,
    }),
    edge: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5, depthWrite: false }),
    dark: new THREE.MeshStandardMaterial({ roughness: 0.9 }),
    metal: new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0.35 }),
    arm: new THREE.MeshStandardMaterial({ roughness: 0.4 }),
    scale: new THREE.MeshStandardMaterial({ roughness: 0.6, map: scaleTex }),
    shadow: new THREE.MeshBasicMaterial({
      map: tex(shadowCv), transparent: true, opacity: 0.4, depthWrite: false, toneMapped: false,
    }),
  };

  const model = new THREE.Group();
  scene.add(model);
  const add = (geo, mat, x, y, z, parent = model) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  /* Body (a white lacquered U of sheet steel), wooden ends, feet, deck. */
  add(new RBox(W, DECK - BASE, D, 3, 0.05), M.lacquer, 0, (DECK + BASE) / 2, 0);
  const sideGeo = new RBox(SIDE, H, D, 2, 0.02);
  const footGeo = new THREE.CylinderGeometry(0.08, 0.08, FOOT, 16);
  for (const s of [-1, 1]) {
    const x = s * (W + SIDE) / 2;
    add(sideGeo, M.trim, x, FOOT + H / 2, 0);
    for (const z of [-1, 1]) add(footGeo, M.dark, x, FOOT / 2, z * (D / 2 - 0.3));
  }
  add(new THREE.BoxGeometry(5.4, 0.02, 2.8), M.plate, 0, DECK + 0.01, 0);

  /* Record player on the left: platter, mat, spindle, tonearm. */
  const px = -1.2, pz = 0.05;
  add(new THREE.CylinderGeometry(1.1, 1.1, 0.08, 64), M.metal, px, TOP + 0.04, pz);
  add(new THREE.CylinderGeometry(1.05, 1.05, 0.012, 64), M.dark, px, TOP + 0.086, pz);
  add(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12), M.metal, px, TOP + 0.12, pz);
  const arm = new THREE.Group();
  arm.position.set(0.25, TOP, -0.85);
  arm.rotation.y = Math.atan2(-0.3, 1.8);
  model.add(arm);
  add(new THREE.CylinderGeometry(0.12, 0.14, 0.14, 24), M.arm, 0, 0.07, 0, arm);
  add(new THREE.CylinderGeometry(0.025, 0.025, 1.9, 12), M.arm, 0, 0.17, 0.95, arm).rotation.x = Math.PI / 2;
  add(new THREE.BoxGeometry(0.12, 0.04, 0.22), M.arm, 0, 0.15, 1.92, arm);

  /* Radio on the right: tuning scale at the back, push buttons, knobs at the front. */
  add(new THREE.PlaneGeometry(2.0, 0.25), M.scale, 1.55, TOP + 0.003, -0.85).rotation.x = -Math.PI / 2;
  const buttonGeo = new RBox(0.26, 0.06, 0.12, 2, 0.015);
  for (let i = 0; i < 5; i++) add(buttonGeo, M.control, 0.75 + i * 0.42, TOP + 0.03, -0.3);
  const knobGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.12, 32);
  for (let i = 0; i < 4; i++) add(knobGeo, M.control, 0.85 + i * 0.55, TOP + 0.06, 0.55);

  /* Speaker slots, front and back: one instanced mesh. */
  const cols = 32, rows = 5;
  const slots = new THREE.InstancedMesh(new THREE.BoxGeometry(0.04, 0.16, 0.012), M.dark, cols * rows * 2);
  const m4 = new THREE.Matrix4();
  let n = 0;
  for (const s of [1, -1]) for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    slots.setMatrixAt(n++, m4.makeTranslation(-2.45 + c * 0.095, 0.75 + r * 0.2, s * (D / 2 + 0.004)));
  }
  model.add(slots);

  /* Clear perspex lid between the wooden ends, with a faint outline. */
  const lid = new THREE.Group();
  lid.position.y = DECK;
  model.add(lid);
  const t = 0.02;
  add(new THREE.BoxGeometry(W, t, D), M.perspex, 0, LID - t / 2, 0, lid).renderOrder = 2;
  const wallGeo = new THREE.BoxGeometry(W, LID - t, t);
  for (const s of [-1, 1]) add(wallGeo, M.perspex, 0, (LID - t) / 2, s * (D - t) / 2, lid).renderOrder = 2;
  const box = new THREE.BoxGeometry(W, LID, D);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box), M.edge);
  box.dispose();
  edges.position.y = LID / 2;
  edges.renderOrder = 3;
  lid.add(edges);

  /* Contact shadow turns with the model; the key light stays put like a studio lamp. */
  add(new THREE.PlaneGeometry(8, 4.6), M.shadow, 0, 0.002, 0).rotation.x = -Math.PI / 2;
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(-4, 10, 5);
  scene.add(key);

  /* Camera: a little above the front. Fit the turning model's bounding cylinder (and
     its shadow) to both fields of view, aiming a little up or down so the frame is centred. */
  const target = new THREE.Vector3(0, 1.1, 0);
  const elev = 17 * DEG;
  const dir = new THREE.Vector3(0, Math.sin(elev), Math.cos(elev));
  const up = new THREE.Vector3(0, Math.cos(elev), -Math.sin(elev));
  const R = Math.hypot((W + 2 * SIDE) / 2, D / 2);
  const pts = [];
  for (let i = 0; i < 24; i++) {
    const a = i * 15 * DEG;
    for (const [r, y] of [[R + 0.25, 0], [R, FOOT + H]]) {
      const p = new THREE.Vector3(r * Math.cos(a), y, r * Math.sin(a)).sub(target);
      pts.push([p.dot(dir), Math.abs(p.x), p.dot(up)]);
    }
  }
  function fit() {
    const tanV = Math.tan(camera.fov * DEG / 2), tanH = tanV * camera.aspect;
    const dist = (o) => Math.max(...pts.map(([z, x, y]) => z + Math.max(x / tanH, Math.abs(y - o) / tanV)));
    let lo = -2, hi = 2;
    for (let i = 0; i < 40; i++) {
      const a = lo + (hi - lo) / 3, b = hi - (hi - lo) / 3;
      if (dist(a) < dist(b)) hi = b; else lo = a;
    }
    const o = (lo + hi) / 2, aim = up.clone().multiplyScalar(o).add(target);
    camera.position.copy(dir).multiplyScalar(dist(o) * 1.04).add(aim);
    camera.lookAt(aim);
  }

  function paint(c) {
    M.lacquer.color.copy(c.page);
    M.plate.color.copy(c.surface);
    M.control.color.copy(c.surface).lerp(c.line, 0.2);
    M.trim.color.copy(c.trim);
    M.edge.color.copy(c.line);
    M.dark.color.copy(c.ink);
    M.metal.color.copy(c.surface).lerp(c.line, 0.3);
    M.arm.color.copy(c.accent);
    M.shadow.color.copy(c.ink);
    const g = scaleCv.getContext('2d'), hex = (col) => `#${col.getHexString()}`;
    g.fillStyle = hex(c.page);
    g.fillRect(0, 0, 512, 64);
    g.strokeStyle = hex(c.line);
    g.lineWidth = 3;
    g.strokeRect(1.5, 1.5, 509, 61);
    g.fillStyle = hex(c.ink);
    for (let i = 0; i <= 40; i++) g.fillRect(24 + i * 11.6 - 1.5, 8, 3, i % 5 ? 16 : 30);
    g.fillStyle = hex(c.accent);
    g.fillRect(318, 4, 6, 56);
    scaleTex.needsUpdate = true;
  }

  /* Motion: a slow full turn (or a sway); drag turns it, then the turn eases back in. */
  const SPEED = 6 * DEG, REST = -30 * DEG, IDLE = 2.5, EASE_IN = 1.5;
  let yaw = REST, vel = 0, idle = IDLE, ease = 0, swayT = 0;
  let dragging = false, lastX = 0, lastT = 0;
  const clamp = () => { if (turn === 'sway') yaw = Math.min(range, Math.max(-range, yaw)); };
  model.rotation.y = yaw;

  function tick(dt) {
    if (dragging) return false;
    let moving = false;
    if (Math.abs(vel) > 0.02 && !stage.reduced) {
      yaw += vel * dt;
      vel *= Math.exp(-4 * dt);
      moving = true;
    } else vel = 0;
    if (turn !== 'off' && !stage.reduced) {
      idle += dt;
      if (idle >= IDLE) {
        ease = Math.min(1, ease + dt / EASE_IN);
        const k = ease * ease * (3 - 2 * ease);
        if (turn === 'spin') yaw = (yaw + SPEED * k * dt) % (2 * Math.PI);
        else {
          swayT += dt * k;
          const aim = 0.7 * range * Math.sin(2 * Math.PI * swayT / 24);
          yaw += (aim - yaw) * (1 - Math.exp(-2 * k * dt));
        }
      }
      moving = true;
    }
    clamp();
    model.rotation.y = yaw;
    return moving;
  }

  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    dragging = true;
    vel = 0;
    lastX = e.clientX;
    lastT = e.timeStamp;
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
  }, { signal });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const step = (e.clientX - lastX) * 0.4 * DEG;
    const dt = Math.max((e.timeStamp - lastT) / 1000, 1 / 240);
    lastX = e.clientX;
    lastT = e.timeStamp;
    yaw += step;
    clamp();
    vel = Math.max(-4, Math.min(4, 0.7 * vel + 0.3 * step / dt));
    model.rotation.y = yaw;
    stage.request();
  }, { signal });
  const release = (e) => {
    if (!dragging) return;
    dragging = false;
    idle = 0;
    ease = 0;
    if (stage.reduced || e.timeStamp - lastT > 80) vel = 0;
    stage.request();
  };
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) {
    canvas.addEventListener(type, release, { signal });
  }

  return { fit, paint, tick, state: () => ({ turn, yaw: yaw / DEG, dragging }) };
}

/* ---------- Mounting ---------- */

let leaving;
function watchRemovals() {
  leaving ??= new MutationObserver(() => {
    for (const el of instances.keys()) if (!el.isConnected) unmount(el);
  });
  leaving.observe(document.body || document.documentElement, { childList: true, subtree: true });
}

function fallback(el, type, reason, err) {
  if (err || reason === 'context-lost') console.info(`Gute Form 3D: keeping the flat ${type} (${reason}).`, err || '');
  el.dispatchEvent(new CustomEvent('gf3d:fallback', { bubbles: true, detail: { type, reason } }));
}

function fail(el, reason, err) {
  const type = instances.get(el)?.type || attr(el);
  unmount(el);
  fallback(el, type, reason, err);
}

async function start(el, rec, build) {
  el.classList.add('gf-3d-loading');
  let lib;
  try {
    lib = await loadThree();
    if (instances.get(el) !== rec) return;
    const host = el.querySelector('.gf-product__stage') || el;
    const stage = createStage(el, host, lib, build, rec, () => fail(el, 'context-lost'));
    await stage.ready;
    if (instances.get(el) !== rec) return;
    el.classList.add('gf-3d-ready');
    el.dispatchEvent(new CustomEvent('gf3d:ready', { bubbles: true, detail: { type: rec.type } }));
  } catch (err) {
    if (instances.get(el) === rec) fail(el, lib ? 'error' : 'import-failed', err);
  } finally {
    el.classList.remove('gf-3d-loading');
  }
}

/** Start the effect named by el's data-gf-3d, once el comes within 200px of the viewport. */
export function mount(el) {
  const type = el && attr(el);
  const build = EFFECTS[type];
  if (!build || instances.has(el)) return;
  const reason = skipReason();
  if (reason) { fallback(el, type, reason); return; }
  const rec = { type, stage: null, waiting: null };
  instances.set(el, rec);
  watchRemovals();
  rec.waiting = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    rec.waiting.disconnect();
    rec.waiting = null;
    start(el, rec, build);
  }, { rootMargin: '200px' });
  rec.waiting.observe(el);
}

/** Stop and remove the 3D version; the CSS-only look comes back. */
export function unmount(el) {
  const rec = instances.get(el);
  if (!rec) return;
  instances.delete(el);
  rec.waiting?.disconnect();
  rec.stage?.dispose();
  el.classList.remove('gf-3d-ready', 'gf-3d-loading');
}

/** Re-read the --gf-* tokens (after a palette switch that the observers can't see). */
export function refresh() {
  for (const rec of instances.values()) rec.stage?.recolour();
}

/** Debug: what an element's 3D version is doing. */
export function inspect(el) {
  const rec = instances.get(el);
  return rec ? {
    type: rec.type,
    ready: el.classList.contains('gf-3d-ready'),
    frames: rec.stage?.frames ?? 0,
    ...rec.stage?.effect?.state(),
  } : null;
}

if (document.documentElement.getAttribute('data-gf-3d-auto') !== 'off') {
  document.querySelectorAll('[data-gf-3d]').forEach(mount);
}
