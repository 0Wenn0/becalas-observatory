import { useEffect, useRef } from 'react';

/*
 * Cometa que acompaña al cursor nativo: una estrella brillante en la punta y una cola de chispas
 * que se desvanece. Cada clic en un botón o enlace lanza un destello de estrellas.
 * Solo con mouse (pointer: fine) y sin "reducir movimiento". Decorativo: no intercepta clics.
 */

const particles = [];
const bursts = [];
let ensureLoop = () => {};

function motionAllowed() {
  return typeof window !== 'undefined'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function burst(cx, cy, amount) {
  for (let i = 0; i < amount; i += 1) {
    const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.35;
    const speed = 3 + Math.random() * 3.5;
    particles.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, size: 3.4 + Math.random() * 2, decay: 0.018, star: true, gravity: 0.05 });
  }
  bursts.push({ x: cx, y: cy, r: 6, life: 1 });
  ensureLoop();
}

/** Destello de estrellas desde el centro de un elemento (metas completadas, botones especiales). */
export function sparkleAt(element, amount = 14) {
  if (!element || !motionAllowed()) return;
  const rect = element.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, amount);
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
    const head = { x: -100, y: -100, tx: -100, ty: -100, visible: false, idle: 0 };

    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawStar(x, y, r, alpha, color = '214, 196, 250') {
      ctx.save();
      ctx.shadowColor = `rgba(${color}, ${alpha})`;
      ctx.shadowBlur = r * 4;
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const rad = i % 2 === 0 ? r * 2.4 : r * 0.55;
        const a = (Math.PI / 4) * i - Math.PI / 2;
        ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function frame() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = bursts.length - 1; i >= 0; i -= 1) {
        const b = bursts[i];
        b.r += 3.2;
        b.life -= 0.04;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(201, 180, 247, ${b.life * 0.8})`;
        ctx.lineWidth = 2.5 * b.life;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy = p.vy * 0.95 + (p.gravity || 0);
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        if (p.star) {
          drawStar(p.x, p.y, p.size * p.life, Math.min(1, p.life * 1.2));
        } else {
          ctx.save();
          ctx.shadowColor = 'rgba(167, 133, 245, .9)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = `rgba(201, 180, 247, ${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      if (fine && head.visible) {
        head.x += (head.tx - head.x) * 0.35;
        head.y += (head.ty - head.y) * 0.35;
        head.idle += 1;
        const pulse = 1 + Math.sin(performance.now() / 260) * 0.12;
        // La estrella va un poco abajo a la derecha de la punta del cursor para no tapar dónde haces clic.
        drawStar(head.x + 14, head.y + 16, 3.6 * pulse, 0.95, '240, 228, 255');
      }

      const keepGoing = particles.length || bursts.length || (fine && head.visible && head.idle < 240);
      if (keepGoing) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
      head.tx = event.clientX;
      head.ty = event.clientY;
      if (!head.visible) { head.x = head.tx; head.y = head.ty; }
      head.visible = true;
      head.idle = 0;
      const now = performance.now();
      if (now - last > 14 && particles.length < 70) {
        last = now;
        for (let i = 0; i < 2; i += 1) {
          particles.push({
            x: event.clientX + 14 + (Math.random() - 0.5) * 6,
            y: event.clientY + 16 + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8 + 0.35,
            life: 1,
            size: Math.random() * 2.4 + 2.2,
            decay: 0.022,
            star: Math.random() < 0.3,
          });
        }
      }
      ensureLoop();
    }

    function onLeave() { head.visible = false; }

    function onClick(event) {
      const target = event.target.closest('button, a, [role="tab"]');
      if (!target) return;
      burst(event.clientX || head.tx, event.clientY || head.ty, 16);
    }

    resize();
    window.addEventListener('resize', resize);
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      document.addEventListener('click', onClick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('click', onClick);
      ensureLoop = () => {};
    };
  }, []);

  return <canvas ref={canvasRef} className="comet-cursor" aria-hidden="true" />;
}
