import { useEffect, useRef, useState } from 'react';
import { sparkleAt } from './CometCursor.jsx';

/* Mi constelación → Mi astrolabio.
 * Cuatro estrellas que se encienden al responder su pregunta y se unen en una constelación.
 * Con las respuestas se genera un astrolabio personal (imagen 1080×1350) para descargar.
 * Todo se guarda solo en el navegador. */

const STARS = [
  { id: 'intereses', label: 'Intereses', dir: 'Oeste', meaning: 'Lo que me mueve', prompt: '¿Qué te da curiosidad? ¿De qué podrías platicar horas sin aburrirte?', x: 18, y: 62 },
  { id: 'fortalezas', label: 'Fortalezas', dir: 'Este', meaning: 'Con lo que cuento', prompt: '¿Qué se te da bien? ¿Qué te dicen tus amigas que haces increíble?', x: 40, y: 30 },
  { id: 'experiencias', label: 'Experiencias', dir: 'Sur', meaning: 'De dónde vengo', prompt: '¿Qué momentos o decisiones te trajeron hasta aquí?', x: 66, y: 70 },
  { id: 'posibilidades', label: 'Posibilidades', dir: 'Norte', meaning: 'Hacia dónde voy', prompt: '¿Qué te gustaría probar, aunque sea un poquito, en los próximos meses?', x: 80, y: 24 },
];
const KEY = 'becalas-constelacion';
const MAX = 110;

function readAnswers() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? {}; } catch { return {}; }
}

export function Astrolabe({ goal = '' }) {
  const [answers, setAnswers] = useState(readAnswers);
  const [active, setActive] = useState(STARS[0].id);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const canvasRef = useRef(null);
  const starRefs = useRef({});

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(answers)); } catch { /* opcional */ } }, [answers]);

  const filled = STARS.filter((s) => (answers[s.id] ?? '').trim());
  const current = STARS.find((s) => s.id === active);
  const ready = filled.length >= 2;

  function update(value) {
    const wasEmpty = !(answers[active] ?? '').trim();
    setAnswers((prev) => ({ ...prev, [active]: value.slice(0, MAX) }));
    if (wasEmpty && value.trim() && starRefs.current[active]) sparkleAt(starRefs.current[active], 12);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    const draw = () => { if (!cancelled) drawAstrolabe(canvas, { answers, goal, name }); };
    if (document.fonts?.load) {
      Promise.all([
        document.fonts.load('600 40px "Cormorant Garamond"'),
        document.fonts.load('400 20px "Atkinson Hyperlegible"'),
        document.fonts.load('700 20px "Atkinson Hyperlegible"'),
      ]).finally(draw);
    } else draw();
    return () => { cancelled = true; };
  }, [answers, goal, name]);

  function download() {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (!blob) { setStatus('No se pudo crear la imagen. Intenta de nuevo.'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mi-astrolabio-becalas.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setStatus('¡Listo! Tu astrolabio quedó en tus descargas ✨');
    }, 'image/png');
  }

  // Líneas entre estrellas consecutivas ya encendidas
  const lines = [];
  for (let i = 0; i < STARS.length - 1; i++) {
    const a = STARS[i], b = STARS[i + 1];
    const on = (answers[a.id] ?? '').trim() && (answers[b.id] ?? '').trim();
    lines.push(<line key={a.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={on ? 'is-on' : ''} pathLength="1" />);
  }

  return (
    <div className="astro">
      <div className="astro-sky">
        <svg className="astro-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{lines}</svg>
        <div className="astro-stars" role="group" aria-label={`Tu constelación: ${filled.length} de 4 estrellas encendidas`}>
          {STARS.map((s, i) => {
            const lit = (answers[s.id] ?? '').trim();
            return (
              <button
                key={s.id}
                ref={(el) => { starRefs.current[s.id] = el; }}
                type="button"
                className={`astro-star${lit ? ' is-lit' : ''}${active === s.id ? ' is-active' : ''}`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, '--d': `${i * 0.7}s` }}
                aria-pressed={active === s.id}
                onClick={() => setActive(s.id)}
              >
                <span className="astro-dot" aria-hidden="true" />
                <span className="astro-label">{s.label}{lit ? <span className="sr-only"> (respondida)</span> : null}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="astro-work worksheet">
        <label htmlFor="astro-answer" className="astro-q">
          <span>{current.label} · {current.meaning}</span>
          {current.prompt}
        </label>
        <textarea id="astro-answer" rows="3" maxLength={MAX} value={answers[active] ?? ''} onChange={(e) => update(e.target.value)} placeholder="Escribe con tus palabras, en una o dos frases…" aria-describedby="astro-count" />
        <p className="astro-count" id="astro-count">{(answers[active] ?? '').length}/{MAX} · {filled.length} de 4 estrellas encendidas</p>
      </div>

      <div className="astro-result">
        <div className="astro-result-text">
          <h3 className="astro-result-title">Tu astrolabio</h3>
          <p>Con tus respuestas se arma una brújula personal: al norte, hacia dónde vas; al sur, de dónde vienes; al este, con lo que cuentas; al oeste, lo que te mueve. En el centro, tu meta.</p>
          <div className="field">
            <label htmlFor="astro-name">Tu nombre (opcional)</label>
            <input id="astro-name" value={name} maxLength={30} onChange={(e) => setName(e.target.value)} placeholder="Así aparecerá arriba" />
          </div>
          {!goal && <p className="astro-hint">Tip: cuando armes tu meta en «Mi meta» (justo abajo), aparece en el centro. Descárgalo al final.</p>}
          <button type="button" className="button button-primary" onClick={download} disabled={!ready} aria-describedby="astro-ready">Descargar mi astrolabio</button>
          <p className="astro-hint" id="astro-ready">{ready ? 'Se descarga como imagen para tu celular.' : 'Se activa cuando enciendas al menos 2 estrellas.'}</p>
          <p className="status-text" role="status" aria-live="polite">{status}</p>
        </div>
        <canvas ref={canvasRef} width="1080" height="1350" className="astro-canvas" role="img" aria-label="Vista previa de tu astrolabio" />
      </div>
    </div>
  );
}

/* ───────── Dibujo del astrolabio en canvas ───────── */
function wrap(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function clamp(ctx, lines, maxLines, maxWidth) {
  if (lines.length <= maxLines) return lines;
  const out = lines.slice(0, maxLines);
  let last = out[maxLines - 1];
  while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.split(' ').slice(0, -1).join(' ');
  out[maxLines - 1] = `${last}…`;
  return out;
}

function rand(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function drawAstrolabe(canvas, { answers, goal, name }) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const GOLD = '#D9B76A', LILAC = '#C9B4F7', IVORY = '#F3EDF8', MUTED = '#CFC5DD';
  const serif = '"Cormorant Garamond", Georgia, serif';
  const sans = '"Atkinson Hyperlegible", Arial, sans-serif';

  // Fondo
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0B0D1F'); bg.addColorStop(1, '#24173C');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const neb = ctx.createRadialGradient(W * 0.78, H * 0.18, 0, W * 0.78, H * 0.18, 520);
  neb.addColorStop(0, 'rgba(120,70,160,.45)'); neb.addColorStop(1, 'rgba(120,70,160,0)');
  ctx.fillStyle = neb; ctx.fillRect(0, 0, W, H);
  const r = rand(2026);
  for (let i = 0; i < 260; i++) {
    ctx.globalAlpha = 0.25 + r() * 0.6;
    ctx.fillStyle = r() < 0.8 ? IVORY : r() < 0.5 ? LILAC : GOLD;
    ctx.beginPath(); ctx.arc(r() * W, r() * H, r() * 1.8 + 0.3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Encabezado
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = `700 22px ${sans}`;
  ctx.fillText('M I   A S T R O L A B I O', W / 2, 92);
  ctx.fillStyle = IVORY;
  ctx.font = `600 54px ${serif}`;
  ctx.fillText(name.trim() ? name.trim() : 'Mi brújula de exploradora', W / 2, 152);

  // Astrolabio
  const cx = W / 2, cy = 700, R = 262;
  ctx.strokeStyle = GOLD; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 1.2; ctx.globalAlpha = 0.7;
  ctx.beginPath(); ctx.arc(cx, cy, R - 16, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R + 14, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2;
    const len = i % 6 === 0 ? 14 : 7;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (R - 16), cy + Math.sin(a) * (R - 16));
    ctx.lineTo(cx + Math.cos(a) * (R - 16 - len), cy + Math.sin(a) * (R - 16 - len));
    ctx.stroke();
  }
  // Red interior (rete)
  ctx.strokeStyle = LILAC; ctx.globalAlpha = 0.35;
  ctx.beginPath(); ctx.ellipse(cx, cy - 30, R - 60, R - 110, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(cx, cy + 30, R - 60, R - 110, 0, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 4;
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (R - 30), cy + Math.sin(a) * (R - 30)); ctx.lineTo(cx - Math.cos(a) * (R - 30), cy - Math.sin(a) * (R - 30)); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Rosa de los vientos (puntas)
  const dirs = [[0, -1, 'N'], [1, 0, 'E'], [0, 1, 'S'], [-1, 0, 'O']];
  ctx.fillStyle = GOLD;
  dirs.forEach(([dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(cx + dx * (R + 34), cy + dy * (R + 34));
    ctx.lineTo(cx + dy * 10 + dx * (R - 4), cy - dx * 10 + dy * (R - 4));
    ctx.lineTo(cx - dy * 10 + dx * (R - 4), cy + dx * 10 + dy * (R - 4));
    ctx.closePath(); ctx.fill();
  });
  ctx.font = `700 22px ${sans}`;
  ctx.fillStyle = '#0B0D1F';

  // Centro: la estrella (meta)
  const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
  glow.addColorStop(0, 'rgba(246,223,160,.35)'); glow.addColorStop(1, 'rgba(246,223,160,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(cx, cy, 150, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(11,13,31,.78)';
  ctx.beginPath(); ctx.arc(cx, cy, 128, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(cx, cy, 128, 0, Math.PI * 2); ctx.stroke();
  // estrella de 4 puntas
  ctx.fillStyle = '#F6DFA0';
  ctx.beginPath();
  const sy = cy - 96;
  ctx.moveTo(cx, sy - 18); ctx.lineTo(cx + 5, sy - 5); ctx.lineTo(cx + 18, sy); ctx.lineTo(cx + 5, sy + 5);
  ctx.lineTo(cx, sy + 18); ctx.lineTo(cx - 5, sy + 5); ctx.lineTo(cx - 18, sy); ctx.lineTo(cx - 5, sy - 5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = GOLD; ctx.font = `700 16px ${sans}`;
  ctx.fillText('MI ESTRELLA', cx, cy - 58);
  ctx.fillStyle = IVORY; ctx.font = `600 25px ${serif}`;
  const goalText = goal.trim() || 'Escribe tu meta en «Mi meta»';
  const gl = clamp(ctx, wrap(ctx, goalText, 206), 5, 206);
  gl.forEach((l, i) => ctx.fillText(l, cx, cy - 20 + i * 28));

  // Textos de los cuatro puntos
  const blocks = [
    { id: 'posibilidades', title: 'NORTE · HACIA DÓNDE VOY', x: cx, y: 250, w: 640, align: 'center' },
    { id: 'experiencias', title: 'SUR · DE DÓNDE VENGO', x: cx, y: cy + R + 72, w: 640, align: 'center' },
    { id: 'fortalezas', title: 'ESTE · CON LO QUE CUENTO', x: cx + R + 54, y: cy - 60, w: W - (cx + R + 54) - 40, align: 'left' },
    { id: 'intereses', title: 'OESTE · LO QUE ME MUEVE', x: cx - R - 54, y: cy - 60, w: cx - R - 54 - 40, align: 'right' },
  ];
  blocks.forEach((b) => {
    const text = (answers[b.id] ?? '').trim();
    ctx.textAlign = b.align;
    ctx.fillStyle = GOLD; ctx.font = `700 16px ${sans}`;
    const titleLines = b.align === 'center' ? [b.title] : b.title.split(' · ');
    titleLines.forEach((t, i) => ctx.fillText(t, b.x, b.y + i * 22));
    ctx.fillStyle = text ? IVORY : 'rgba(207,197,221,.55)';
    ctx.font = `${text ? 400 : 400} 23px ${sans}`;
    const lines = clamp(ctx, wrap(ctx, text || '…', b.w), b.align === 'center' ? 3 : 6, b.w);
    const top = b.y + titleLines.length * 22 + 14;
    lines.forEach((l, i) => ctx.fillText(l, b.x, top + i * 31));
  });

  // Pie
  ctx.textAlign = 'center';
  ctx.fillStyle = MUTED; ctx.font = `400 19px ${sans}`;
  ctx.fillText('Cuando dudes del camino, vuelve a mirar tu cielo.', W / 2, H - 100);
  ctx.fillStyle = 'rgba(207,197,221,.7)'; ctx.font = `700 15px ${sans}`;
  ctx.fillText('MENTORÍAS BÉCALAS 2026 · GRUPO DE WEN', W / 2, H - 60);
}
