import * as THREE from 'three';
import './presentacion.css';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────── Cielo 3D ───────── */
const canvas = document.getElementById('sky');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0B0D1F');
scene.fog = new THREE.FogExp2('#0B0D1F', 0.0018);
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2400);

function softDot(size = 64, inner = 'rgba(255,255,255,1)') {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const r = size / 2;
  const grd = g.createRadialGradient(r, r, 0, r, r, r);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.25, 'rgba(255,255,255,.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

const starTexture = softDot();
const palette = ['#F3EDF8', '#C9B4F7', '#D9B76A', '#9FB8E8'].map((c) => new THREE.Color(c));

function starLayer(count, spread, depth, size) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.6;
    positions[i * 3 + 2] = 260 - Math.random() * depth;
    const color = palette[Math.random() < 0.7 ? 0 : 1 + Math.floor(Math.random() * 3)];
    colors.set([color.r, color.g, color.b], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size, map: starTexture, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return points;
}
const farStars = starLayer(5200, 1800, 2200, 2.2);
const midStars = starLayer(2000, 1000, 1900, 3.4);
starLayer(380, 560, 1700, 6);

function glowSprite(color, size) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, color);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
  sprite.scale.set(size, size, 1);
  return sprite;
}
[
  ['rgba(120,70,160,.55)', 260, 60, -120, 700],
  ['rgba(184,137,146,.35)', -320, -80, -520, 800],
  ['rgba(80,110,200,.35)', 220, 120, -980, 900],
  ['rgba(120,70,160,.45)', -260, 40, -1380, 900],
  ['rgba(184,137,146,.3)', 240, -60, -1700, 900],
].forEach(([color, x, y, z, s]) => {
  const n = glowSprite(color, s);
  n.position.set(x, y, z);
  scene.add(n);
});

// Planeta dorado que respira (prólogo)
const planet = new THREE.Group();
planet.add(new THREE.Mesh(new THREE.SphereGeometry(16, 48, 48), new THREE.MeshBasicMaterial({ color: '#4A2338' })));
planet.add(glowSprite('rgba(217,183,106,.35)', 90));
const rings = [[26, 0.9], [33, 0.6], [40, 0.35]].map(([radius, opacity], i) => {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.35, 8, 160), new THREE.MeshBasicMaterial({ color: '#D9B76A', transparent: true, opacity }));
  ring.rotation.x = Math.PI / 2.35 + i * 0.08;
  ring.rotation.y = -0.25 + i * 0.12;
  planet.add(ring);
  return ring;
});
planet.position.set(150, -8, 40);
scene.add(planet);

// Estrella objetivo (telescopio)
const target = new THREE.Group();
const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128, 'rgba(255,240,200,1)'), color: '#F6DFA0', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
core.scale.set(22, 22, 1);
target.add(core);
const haloMat = new THREE.MeshBasicMaterial({ color: '#D9B76A', transparent: true, opacity: 0.6, side: THREE.DoubleSide });
const halo = new THREE.Mesh(new THREE.RingGeometry(13, 13.5, 96), haloMat);
const halo2 = new THREE.Mesh(new THREE.RingGeometry(13, 13.4, 96), haloMat.clone());
halo2.material.opacity = 0.25;
target.add(halo, halo2);
target.position.set(100, 18, -760);
scene.add(target);


/* ───────── Final: partículas que se transforman ───────── */
const N = 2200;
const SHAPE_SCALE = 40;
const SHAPE_X = 42;

function sampleDrawing(draw, count) {
  const size = 400;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.strokeStyle = g.fillStyle = '#fff';
  g.lineCap = g.lineJoin = 'round';
  draw(g);
  const data = g.getImageData(0, 0, size, size).data;
  const pixels = [];
  for (let y = 0; y < size; y += 2) for (let x = 0; x < size; x += 2) if (data[(y * size + x) * 4 + 3] > 120) pixels.push([x, y]);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const [x, y] = pixels[Math.floor(Math.random() * pixels.length)];
    out[i * 3] = ((x - 200) / 200) * SHAPE_SCALE + SHAPE_X + (Math.random() - 0.5) * 0.8;
    out[i * 3 + 1] = (-(y - 200) / 200) * SHAPE_SCALE + (Math.random() - 0.5) * 0.8;
    out[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  return out;
}

function scattered(count) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = (Math.random() - 0.5) * 230;
    out[i * 3 + 1] = (Math.random() - 0.5) * 130;
    out[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  return out;
}

function network(count) {
  const layers = [3, 5, 5, 2];
  const nodes = layers.map((n, li) => Array.from({ length: n }, (_, k) => [SHAPE_X - 39 + li * 26, (k - (n - 1) / 2) * (n > 3 ? 15 : 22)]));
  const edges = [];
  for (let li = 0; li < nodes.length - 1; li++) for (const a of nodes[li]) for (const b of nodes[li + 1]) edges.push([a, b]);
  const flat = nodes.flat();
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x, y;
    if (Math.random() < 0.5) {
      const [nx, ny] = flat[Math.floor(Math.random() * flat.length)];
      const r = Math.sqrt(Math.random()) * 3, a = Math.random() * Math.PI * 2;
      x = nx + Math.cos(a) * r; y = ny + Math.sin(a) * r;
    } else {
      const [[ax, ay], [bx, by]] = edges[Math.floor(Math.random() * edges.length)];
      const t = Math.random();
      x = ax + (bx - ax) * t; y = ay + (by - ay) * t;
    }
    out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  return out;
}

function brainOutline(g) {
  g.beginPath();
  g.moveTo(80, 248);
  g.bezierCurveTo(30, 190, 70, 72, 190, 64);
  g.bezierCurveTo(305, 56, 368, 128, 346, 206);
  g.bezierCurveTo(338, 240, 314, 256, 282, 256);
  g.bezierCurveTo(244, 262, 204, 262, 172, 272);
  g.bezierCurveTo(130, 284, 96, 274, 80, 248);
  g.closePath();
}
function brainParts(g, mode) {
  brainOutline(g);
  if (mode === 'fill') g.fill(); else g.stroke();
  g.beginPath(); g.ellipse(288, 282, 44, 27, -0.15, 0, Math.PI * 2);
  if (mode === 'fill') g.fill(); else g.stroke();
  g.beginPath(); g.moveTo(228, 258); g.quadraticCurveTo(238, 310, 228, 350); g.lineTo(256, 350); g.quadraticCurveTo(264, 308, 258, 262); g.closePath();
  if (mode === 'fill') g.fill(); else g.stroke();
}
const drawBrainEdge = (g) => {
  g.lineWidth = 5;
  brainParts(g, 'stroke');
  // surco lateral y central, sutiles
  g.lineWidth = 3;
  g.beginPath(); g.moveTo(112, 214); g.bezierCurveTo(160, 192, 212, 206, 262, 186); g.stroke();
  g.beginPath(); g.moveTo(206, 70); g.bezierCurveTo(214, 132, 182, 182, 196, 236); g.stroke();
};
const drawBrainFill = (g) => brainParts(g, 'fill');
const brainShape = (count) => {
  const edgeCount = Math.round(count * 0.38);
  const out = new Float32Array(count * 3);
  out.set(sampleDrawing(drawBrainFill, count - edgeCount), 0);
  out.set(sampleDrawing(drawBrainEdge, edgeCount), (count - edgeCount) * 3);
  return out;
};

const drawHeart = (g) => {
  [[11, 7], [7.6, 5]].forEach(([k, w]) => {
    g.lineWidth = w;
    g.beginPath();
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const px = 200 + x * k, py = 190 - y * k;
      if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.stroke();
  });
};

const drawComet = (g) => {
  g.beginPath(); g.arc(285, 120, 30, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 9; i++) {
    const spread = (i - 4) * 0.075;
    const len = 300 - Math.abs(i - 4) * 28;
    const ang = Math.atan2(210, -225) + spread;
    g.lineWidth = 7 - Math.abs(i - 4) * 1.2;
    g.beginPath(); g.moveTo(285, 120); g.lineTo(285 + Math.cos(ang) * len, 120 + Math.sin(ang) * len); g.stroke();
  }
};

const shapes = [scattered(N), network(N), brainShape(N), sampleDrawing(drawHeart, N), sampleDrawing(drawComet, N)];

const particleGeo = new THREE.BufferGeometry();
const particlePos = new Float32Array(shapes[0]);
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
const particleCol = new Float32Array(N * 3);
const finalPalette = ['#F6DFA0', '#D9B76A', '#C9B4F7', '#F3EDF8'].map((c) => new THREE.Color(c));
for (let i = 0; i < N; i++) { const c = finalPalette[i % 4]; particleCol.set([c.r, c.g, c.b], i * 3); }
particleGeo.setAttribute('color', new THREE.BufferAttribute(particleCol, 3));
const particleMat = new THREE.PointsMaterial({ size: 1.25, map: starTexture, vertexColors: true, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
const particles = new THREE.Points(particleGeo, particleMat);
particles.position.set(0, 0, -100);
particles.renderOrder = 10;
camera.add(particles);
scene.add(camera);

// Plexo del cerebro: líneas entre nodos cercanos
const brainTarget = shapes[2];
const NODE_COUNT = 520;
const nodeIdx = Array.from({ length: NODE_COUNT }, (_, k) => Math.floor((k / NODE_COUNT) * N));
const pairs = [];
for (let a = 0; a < NODE_COUNT; a++) {
  const ia = nodeIdx[a] * 3;
  const near = [];
  for (let b = 0; b < NODE_COUNT; b++) {
    if (a === b) continue;
    const ib = nodeIdx[b] * 3;
    const d = Math.hypot(brainTarget[ia] - brainTarget[ib], brainTarget[ia + 1] - brainTarget[ib + 1]);
    if (d < 7.5) near.push([d, b]);
  }
  near.sort((x, y) => x[0] - y[0]).slice(0, 4).forEach(([, b]) => { if (a < b) pairs.push([nodeIdx[a], nodeIdx[b]]); });
}
const plexusPos = new Float32Array(pairs.length * 6);
const plexusGeo = new THREE.BufferGeometry();
plexusGeo.setAttribute('position', new THREE.BufferAttribute(plexusPos, 3));
const plexusMat = new THREE.LineBasicMaterial({ color: '#B7C3F0', transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending });
const plexus = new THREE.LineSegments(plexusGeo, plexusMat);
plexus.position.copy(particles.position);
plexus.renderOrder = 9;
camera.add(plexus);
const speeds = Float32Array.from({ length: N }, () => 0.018 + Math.random() * 0.03);
const phases = Float32Array.from({ length: N }, () => Math.random() * Math.PI * 2);

const nextStar = new THREE.Sprite(new THREE.SpriteMaterial({ map: softDot(128, 'rgba(255,240,200,1)'), color: '#F6DFA0', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false }));
nextStar.scale.set(10, 10, 1);
nextStar.position.set(86, 42, -100);
nextStar.renderOrder = 11;
camera.add(nextStar);

let finalStage = 0;
let flightStart = 0;
const flight = new THREE.Vector3();

// Paradas de cámara: una por escena (la Noche 1 tiene su recorrido propio)
const NIGHT = Number(document.body.dataset.night || 1);
const sceneCount = document.querySelectorAll('.scene').length;
const night1Stops = [
  [[0, 0, 200], [30, 0, 0]],
  [[-40, 10, 40], [-30, 0, -300]],
  [[20, -10, -120], [0, 0, -420]],
  [[-30, 15, -280], [-10, 0, -560]],
  [[0, 0, -440], [0, 0, -760]],
  [[30, 20, -520], [60, 30, -900]],
  [[0, 0, -620], [-10, 5, -760]],
  [[10, 0, -640], [-30, 5, -760]],
  [[-20, -10, -940], [0, 0, -1300]],
  [[0, 0, -1360], [0, 10, -1700]],
  [[0, 0, -1560], [0, 0, -1900]],
];
const generatedStops = Array.from({ length: sceneCount }, (_, i) => {
  const z = 200 - i * (1700 / Math.max(1, sceneCount - 1));
  const x = Math.sin(i * 1.7) * 32, y = Math.cos(i * 1.3) * 14;
  return [[x, y, z], [x * 0.4 - 10, y * 0.3, z - 340]];
});
const stops = (NIGHT === 1 && sceneCount === night1Stops.length ? night1Stops : generatedStops)
  .map(([p, l]) => ({ pos: new THREE.Vector3(...p), look: new THREE.Vector3(...l) }));

/* ───────── Navegación ───────── */
const scenes = [...document.querySelectorAll('.scene')];
const track = document.getElementById('track');
const live = document.getElementById('live');
const notes = document.getElementById('notes');
const notesScene = document.getElementById('notes-scene');
const notesText = document.getElementById('notes-text');
const video = document.getElementById('wen-video');
const TOTAL_CHAPTERS = Math.max(...scenes.map((s) => Number(s.dataset.chapter) || 0)) + 1;

const fromHash = parseInt(location.hash.slice(1), 10);
let index = Number.isFinite(fromHash) ? Math.max(0, Math.min(scenes.length - 1, fromHash)) : 0;
camera.position.copy(stops[index].pos);
const look = stops[index].look.clone();

const wenVideo = document.getElementById('wen-video');
wenVideo?.addEventListener('ended', () => document.getElementById('wen-hunt')?.classList.add('is-shown'));

const stepsOf = (s) => [...s.querySelectorAll('.step')];
const shownCount = (s) => stepsOf(s).filter((el) => el.classList.contains('is-shown')).length;

const hud = document.querySelector('.hud');
function syncSky(s) {
  const map = s.querySelector('.sky-map');
  if (map) map.dataset.shown = String(shownCount(s));
  if (s.classList.contains('final')) {
    const stage = shownCount(s);
    if (stage === 5 && finalStage !== 5) flightStart = performance.now();
    finalStage = stage;
    s.dataset.stage = String(stage);
    hud.classList.toggle('next-lit', stage === 5);
  }
}

function show(i, { revealAll = false } = {}) {
  index = i;
  scenes.forEach((s, k) => {
    const on = k === i;
    s.classList.toggle('is-on', on);
    s.setAttribute('aria-hidden', String(!on));
    s.inert = !on;
    if (on) {
      stepsOf(s).forEach((el) => el.classList.toggle('is-shown', revealAll));
      syncSky(s);
    }
  });
  const current = scenes[i];
  const chapter = Number(current.dataset.chapter);
  track.innerHTML = Array.from({ length: TOTAL_CHAPTERS }, (_, k) => `<i class="${k < chapter ? 'done' : k === chapter ? 'now' : ''}"></i>`).join('');
  live.textContent = current.dataset.title;
  notesScene.textContent = current.dataset.title;
  notesText.textContent = current.dataset.notes;
  history.replaceState(null, '', `#${i}`);
  if (video && !current.contains(video)) video.pause();
  document.querySelectorAll('.has-spot').forEach((g) => g.classList.remove('has-spot'));
  document.querySelectorAll('.card.is-spot').forEach((c) => c.classList.remove('is-spot'));
  if (!current.classList.contains('final')) hud.classList.remove('next-lit');
  else if (!revealAll) particlePos.set(shapes[0]);
}

function next() {
  const s = scenes[index];
  const pending = stepsOf(s).find((el) => !el.classList.contains('is-shown'));
  if (pending) {
    pending.classList.add('is-shown');
    syncSky(s);
    return;
  }
  if (index < scenes.length - 1) show(index + 1);
}

function prev() {
  const s = scenes[index];
  const shown = stepsOf(s).filter((el) => el.classList.contains('is-shown'));
  if (shown.length) {
    shown.at(-1).classList.remove('is-shown');
    syncSky(s);
    return;
  }
  if (index > 0) show(index - 1, { revealAll: true });
}

addEventListener('keydown', (e) => {
  if (e.target.closest && e.target.closest('video, button, .card') && (e.key === ' ' || e.key === 'Enter')) return;
  if (['ArrowRight', 'PageDown', 'ArrowDown'].includes(e.key)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === 'n' || e.key === 'N') notes.hidden = !notes.hidden;
  else if (e.key === 'f' || e.key === 'F') {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  } else if (e.key === 't' || e.key === 'T') toggleTimer();
  else if (e.key === 'Home') show(0);
  hideHint();
});
document.getElementById('next').addEventListener('click', () => { next(); hideHint(); });
document.getElementById('prev').addEventListener('click', () => { prev(); hideHint(); });

const hint = document.getElementById('hint');
let hintTimer = setTimeout(hideHint, 6000);
function hideHint() { clearTimeout(hintTimer); hint.classList.add('is-gone'); }


/* ───────── Tarjetas vivas ───────── */
function sparkle(x, y, count = 10) {
  if (reduce) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('i');
    el.className = `spark${i % 3 === 0 ? ' lilac' : ''}`;
    const a = (i / count) * Math.PI * 2 + Math.random() * 0.4;
    const d = 30 + Math.random() * 45;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty('--dx', `${Math.cos(a) * d}px`);
    el.style.setProperty('--dy', `${Math.sin(a) * d}px`);
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}
document.querySelectorAll('.scene').forEach((sc) => sc.querySelectorAll('.card').forEach((card, i) => {
  card.style.setProperty('--i', String(i));
  card.tabIndex = 0;
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
    if (!reduce) {
      card.style.setProperty('--ry', `${(px - 0.5) * 10}deg`);
      card.style.setProperty('--rx', `${(0.5 - py) * 8}deg`);
    }
  });
  card.addEventListener('pointerenter', (e) => sparkle(e.clientX, e.clientY, 5));
  card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
  const spot = (x, y) => {
    const group = card.parentElement;
    const on = !card.classList.contains('is-spot');
    group.querySelectorAll('.card').forEach((c) => c.classList.remove('is-spot'));
    card.classList.toggle('is-spot', on);
    group.classList.toggle('has-spot', on);
    if (on) sparkle(x, y, 14);
  };
  card.addEventListener('click', (e) => spot(e.clientX, e.clientY));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const r = card.getBoundingClientRect();
      spot(r.left + r.width / 2, r.top + r.height / 2);
    }
  });
}));

/* ───────── Temporizadores (uno por escena, data-seconds) ───────── */
const CIRC = 2 * Math.PI * 100;
const timers = [...document.querySelectorAll('.timer')].map((el) => {
  const total = Number(el.dataset.seconds || 600);
  const ringEl = el.querySelector('.fill');
  const textEl = el.querySelector('p');
  const btn = el.querySelector('button');
  const t = { el, total, remaining: total, ticking: null };
  t.paint = () => {
    const m = Math.floor(t.remaining / 60);
    const sec = String(t.remaining % 60).padStart(2, '0');
    textEl.textContent = `${m}:${sec}`;
    ringEl.style.strokeDashoffset = String(CIRC * (1 - t.remaining / t.total));
  };
  t.toggle = () => {
    if (t.ticking) { clearInterval(t.ticking); t.ticking = null; btn.textContent = 'Seguir'; return; }
    if (t.remaining === 0) t.remaining = t.total;
    btn.textContent = 'Pausa';
    t.ticking = setInterval(() => {
      t.remaining = Math.max(0, t.remaining - 1);
      t.paint();
      if (t.remaining === 0) { clearInterval(t.ticking); t.ticking = null; btn.textContent = 'Otra vez'; textEl.textContent = '¡Listo!'; }
    }, 1000);
  };
  btn.addEventListener('click', t.toggle);
  t.paint();
  return t;
});
function toggleTimer() {
  const t = timers.find((x) => scenes[index].contains(x.el));
  if (t) t.toggle();
}

/* ───────── Respiración 4 · 4 · 6 (14 s) ───────── */
const breathWord = document.getElementById('breath-word');
function breathPhase(t) {
  const c = t % 14;
  if (c < 4) return ['Inhala', c / 4];
  if (c < 8) return ['Sostén', 1];
  return ['Exhala', 1 - (c - 8) / 6];
}
let lastWord = '';

/* ───────── Bucle ───────── */
function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
show(index);

const t0 = performance.now();
function frame() {
  const t = (performance.now() - t0) / 1000;
  const ease = reduce ? 1 : 0.022;
  camera.position.lerp(stops[index].pos, ease);
  look.lerp(stops[index].look, ease);
  camera.lookAt(look);
  const [word, amount] = breathPhase(t);
  if (breathWord && word !== lastWord) { breathWord.textContent = word; lastWord = word; }
  if (!reduce) {
    farStars.rotation.z = t * 0.004;
    midStars.rotation.z = -t * 0.006;
    rings.forEach((r, i) => { r.scale.setScalar(0.8 + amount * 0.42); r.rotation.z = t * 0.08 * (i % 2 ? -1 : 1); });
    halo.rotation.z = t * 0.2;
    halo2.scale.setScalar(1.5 + Math.sin(t * 1.4) * 0.12);
  }

  // Final: morph de partículas
  const finalOn = scenes[index].classList.contains('final');
  particleMat.opacity += ((finalOn ? 1 : 0) - particleMat.opacity) * 0.05;
  particles.visible = particleMat.opacity > 0.01;
  if (particles.visible) {
    const shapeIndex = Math.min(finalStage, 4);
    const goal = shapes[shapeIndex];
    if (finalStage === 5) {
      const k = Math.min(1, (performance.now() - flightStart) / 3200);
      const e = k * k * (3 - 2 * k);
      flight.set(e * 105, e * 62, 0);
    } else flight.set(0, 0, 0);
    const wobble = reduce ? 0 : 0.35;
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      const sp = reduce ? 1 : speeds[i];
      const tx = goal[j] + flight.x + Math.sin(t * 0.9 + phases[i]) * wobble;
      const ty = goal[j + 1] + flight.y + Math.cos(t * 0.8 + phases[i]) * wobble;
      particlePos[j] += (tx - particlePos[j]) * sp;
      particlePos[j + 1] += (ty - particlePos[j + 1]) * sp;
      particlePos[j + 2] += (goal[j + 2] - particlePos[j + 2]) * sp;
    }
    particleGeo.attributes.position.needsUpdate = true;
  }
  const plexusGoal = particles.visible && finalStage === 2 ? 0.45 : 0;
  plexusMat.opacity += (plexusGoal - plexusMat.opacity) * (plexusGoal ? 0.012 : 0.06);
  plexus.visible = plexusMat.opacity > 0.01;
  if (plexus.visible) {
    pairs.forEach(([a, b], k) => {
      plexusPos.set([particlePos[a * 3], particlePos[a * 3 + 1], particlePos[a * 3 + 2], particlePos[b * 3], particlePos[b * 3 + 1], particlePos[b * 3 + 2]], k * 6);
    });
    plexusGeo.attributes.position.needsUpdate = true;
  }
  const starGoal = finalOn && finalStage >= 4 ? (finalStage === 5 ? 1 : 0.55) : 0;
  nextStar.material.opacity += (starGoal - nextStar.material.opacity) * 0.03;
  nextStar.scale.setScalar(10 + Math.sin(t * 1.6) * 1.2 + (finalStage === 5 ? 4 : 0));
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
