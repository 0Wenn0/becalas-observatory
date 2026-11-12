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

// Paradas de cámara: una por escena
const stops = [
  [[0, 0, 200], [30, 0, 0]],
  [[-40, 10, 40], [-30, 0, -300]],
  [[20, -10, -120], [0, 0, -420]],
  [[-30, 15, -280], [-10, 0, -560]],
  [[0, 0, -440], [0, 0, -760]],
  [[0, 0, -620], [-10, 5, -760]],
  [[10, 0, -640], [-30, 5, -760]],
  [[-20, -10, -940], [0, 0, -1300]],
  [[30, 20, -1140], [0, 0, -1500]],
  [[0, 0, -1360], [0, 10, -1700]],
].map(([p, l]) => ({ pos: new THREE.Vector3(...p), look: new THREE.Vector3(...l) }));

/* ───────── Navegación ───────── */
const scenes = [...document.querySelectorAll('.scene')];
const track = document.getElementById('track');
const live = document.getElementById('live');
const notes = document.getElementById('notes');
const notesScene = document.getElementById('notes-scene');
const notesText = document.getElementById('notes-text');
const video = document.getElementById('wen-video');
const TOTAL_CHAPTERS = 9;

const fromHash = parseInt(location.hash.slice(1), 10);
let index = Number.isFinite(fromHash) ? Math.max(0, Math.min(scenes.length - 1, fromHash)) : 0;
camera.position.copy(stops[index].pos);
const look = stops[index].look.clone();

const stepsOf = (s) => [...s.querySelectorAll('.step')];
const shownCount = (s) => stepsOf(s).filter((el) => el.classList.contains('is-shown')).length;

function syncSky(s) {
  const map = s.querySelector('.sky-map');
  if (map) map.dataset.shown = String(shownCount(s));
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
  if (video && i !== 1) video.pause();
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
  if (e.target.closest && e.target.closest('video, button') && (e.key === ' ' || e.key === 'Enter')) return;
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

/* ───────── Temporizador de 10 minutos ───────── */
const TIMER_SECONDS = 600;
const ring = document.getElementById('timer-ring');
const timerText = document.getElementById('timer-text');
const timerBtn = document.getElementById('timer-btn');
const CIRC = 2 * Math.PI * 100;
let remaining = TIMER_SECONDS;
let ticking = null;

function paintTimer() {
  const m = Math.floor(remaining / 60);
  const s = String(remaining % 60).padStart(2, '0');
  timerText.textContent = `${m}:${s}`;
  ring.style.strokeDashoffset = String(CIRC * (1 - remaining / TIMER_SECONDS));
}
function toggleTimer() {
  if (ticking) {
    clearInterval(ticking);
    ticking = null;
    timerBtn.textContent = 'Seguir';
    return;
  }
  if (remaining === 0) remaining = TIMER_SECONDS;
  timerBtn.textContent = 'Pausa';
  ticking = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    paintTimer();
    if (remaining === 0) {
      clearInterval(ticking);
      ticking = null;
      timerBtn.textContent = 'Otra vez';
      timerText.textContent = '¡Listo!';
    }
  }, 1000);
}
timerBtn.addEventListener('click', toggleTimer);
paintTimer();

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
  if (word !== lastWord) { breathWord.textContent = word; lastWord = word; }
  if (!reduce) {
    farStars.rotation.z = t * 0.004;
    midStars.rotation.z = -t * 0.006;
    rings.forEach((r, i) => { r.scale.setScalar(0.8 + amount * 0.42); r.rotation.z = t * 0.08 * (i % 2 ? -1 : 1); });
    halo.rotation.z = t * 0.2;
    halo2.scale.setScalar(1.5 + Math.sin(t * 1.4) * 0.12);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
