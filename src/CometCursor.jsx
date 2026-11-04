import { useEffect, useRef } from 'react';

/*
 * Estela de cometa detrás del cursor nativo + destellos al hacer clic en botones.
 * Solo con mouse (pointer: fine) y sin "reducir movimiento". Decorativo: no intercepta clics.
 */

const particles = [];
let ensureLoop = () => {};

function motionAllowed() {
  return typeof window !== 'undefined'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Lanza un pequeño estallido de chispas desde un elemento (botones, metas completadas). */
export function sparkleAt(element, amount = 8) {
  if (!element || !motionAllowed()) return;
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < amount; i += 1) {
    const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.4;
    const speed = 1.6 + Math.random() * 1.8;
    particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, size: 2.2, decay: 0.03, star: true });
  }
  ensureLoop();
}

export function CometCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!motionAllowed()) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const fine = window.matchMedia('(pointer: fine)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let running = false;

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawStar(x, y, r, alpha) {
      ctx.fillStyle = `rgba(214, 196, 250, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const rad = i % 2 === 0 ? r * 2.2 : r * 0.6;
        const a = (Math.PI / 4) * i;
        ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
    }

    function frame() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        if (p.star) {
          drawStar(p.x, p.y, p.size * p.life, p.life);
        } else {
          ctx.fillStyle = `rgba(201, 180, 247, ${p.life * 0.85})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (particles.length) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    ensureLoop = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    let last = 0;
    function onMove(event) {
      const now = performance.now();
      if (now - last < 16) return;
      last = now;
      if (particles.length < 24) {
        particles.push({
          x: event.clientX,
          y: event.clientY,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 + 0.2,
          life: 1,
          size: Math.random() * 1.6 + 1.2,
          decay: 0.045,
          star: Math.random() < 0.15,
        });
      }
      ensureLoop();
    }

    resize();
    window.addEventListener('resize', resize);
    if (fine) window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      ensureLoop = () => {};
    };
  }, []);

  return <canvas ref={canvasRef} className="comet-cursor" aria-hidden="true" />;
}
