import { useEffect, useRef } from 'react';

/**
 * Cielo vivo del hero: estrellas que titilan, parallax suave, conexiones cerca del cursor
 * y una estrella fugaz ocasional. Decorativo (aria-hidden). Con "reducir movimiento" se dibuja estático.
 */
export function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let small = false;
    let width = 0;
    let height = 0;
    let stars = [];
    let raf = 0;
    let visible = true;
    let pointer = { x: -9999, y: -9999, active: false };
    let shooting = null;
    let nextShot = performance.now() + 1500;

    function build() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      small = width < 640;
      const count = small ? 85 : 120;
      stars = Array.from({ length: count }, () => {
        const bright = Math.random() < (small ? 0.16 : 0.1);
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: bright ? Math.random() * 1.2 + (small ? 2 : 1.7) : Math.random() * 1.3 + (small ? 0.8 : 0.5),
          bright,
          depth: Math.random() * 0.8 + 0.2,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.0025 + (bright ? 0.0018 : 0.001),
          lilac: Math.random() < 0.2,
        };
      });
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      const px = pointer.active ? (pointer.x / width - 0.5) : 0;
      const py = pointer.active ? (pointer.y / height - 0.5) : 0;

      const positions = stars.map((s) => ({
        s,
        x: s.x - px * 12 * s.depth,
        y: s.y - py * 12 * s.depth,
      }));

      if (finePointer && pointer.active && !reduced) {
        const near = positions.filter((p) => Math.hypot(p.x - pointer.x, p.y - pointer.y) < 140);
        ctx.lineWidth = 0.7;
        for (let i = 0; i < near.length; i += 1) {
          for (let j = i + 1; j < near.length; j += 1) {
            const d = Math.hypot(near[i].x - near[j].x, near[i].y - near[j].y);
            if (d < 120) {
              ctx.strokeStyle = `rgba(201, 180, 247, ${0.32 * (1 - d / 120)})`;
              ctx.beginPath();
              ctx.moveTo(near[i].x, near[i].y);
              ctx.lineTo(near[j].x, near[j].y);
              ctx.stroke();
            }
          }
        }
      }

      for (const p of positions) {
        // Las estrellas brillantes titilan con más contraste para que se note también en pantallas chicas.
        const wave = Math.sin(time * p.s.speed + p.s.phase);
        const twinkle = reduced ? 0.85 : p.s.bright ? 0.35 + 0.65 * (wave * 0.5 + 0.5) : 0.45 + 0.5 * (wave * 0.5 + 0.5);
        const color = p.s.lilac ? '201, 180, 247' : '244, 238, 230';
        if (p.s.bright) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.s.r * 5);
          glow.addColorStop(0, `rgba(${color}, ${0.55 * twinkle})`);
          glow.addColorStop(1, `rgba(${color}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${color}, ${twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s.r * (p.s.bright ? 0.8 + 0.3 * twinkle : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        if (!shooting && time > nextShot) {
          shooting = { x: Math.random() * width * 0.5 + width * 0.45, y: Math.random() * height * 0.45, life: 0 };
        }
        if (shooting) {
          shooting.life += 1;
          const duration = 70;
          const t = shooting.life / duration;
          const travel = Math.max(width, 420) * 0.55;
          const hx = shooting.x - t * travel;
          const hy = shooting.y + t * travel * 0.45;
          const tail = small ? 130 : 160;
          const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;
          const grad = ctx.createLinearGradient(hx, hy, hx + tail, hy - tail * 0.45);
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          grad.addColorStop(0.3, `rgba(214, 196, 250, ${alpha * 0.7})`);
          grad.addColorStop(1, 'rgba(201, 180, 247, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = small ? 2.6 : 2.2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(hx + tail, hy - tail * 0.45);
          ctx.stroke();
          const headGlow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 9);
          headGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          headGlow.addColorStop(1, 'rgba(201, 180, 247, 0)');
          ctx.fillStyle = headGlow;
          ctx.beginPath();
          ctx.arc(hx, hy, 9, 0, Math.PI * 2);
          ctx.fill();
          if (shooting.life >= duration) {
            shooting = null;
            nextShot = time + (small ? 3500 + Math.random() * 2500 : 6000 + Math.random() * 3000);
          }
        }
      }
    }

    function loop(time) {
      draw(time);
      if (!reduced && visible && !document.hidden) raf = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    }

    build();
    start();

    const onResize = () => { build(); if (reduced) draw(0); };
    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top, active: true };
    };
    const onLeave = () => { pointer.active = false; };
    const onVisibility = () => { if (!document.hidden && visible && !reduced) start(); };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reduced) start();
    });
    observer.observe(canvas);

    const host = canvas.parentElement;
    window.addEventListener('resize', onResize);
    host.addEventListener('pointermove', onMove);
    host.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
