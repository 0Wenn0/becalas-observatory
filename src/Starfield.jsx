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

    let width = 0;
    let height = 0;
    let stars = [];
    let raf = 0;
    let visible = true;
    let pointer = { x: -9999, y: -9999, active: false };
    let shooting = null;
    let nextShot = performance.now() + 4000;

    function build() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 640 ? 45 : 110;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.4 + 0.4,
        depth: Math.random() * 0.8 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.002 + 0.0008,
        lilac: Math.random() < 0.18,
      }));
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
        const twinkle = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(time * p.s.speed + p.s.phase);
        ctx.fillStyle = p.s.lilac ? `rgba(201, 180, 247, ${twinkle})` : `rgba(240, 234, 225, ${twinkle})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) {
        if (!shooting && time > nextShot) {
          shooting = { x: Math.random() * width * 0.7 + width * 0.2, y: Math.random() * height * 0.35, life: 0 };
        }
        if (shooting) {
          shooting.life += 1;
          const t = shooting.life / 60;
          const sx = shooting.x - t * 260;
          const sy = shooting.y + t * 120;
          const grad = ctx.createLinearGradient(sx, sy, sx + 90, sy - 42);
          grad.addColorStop(0, `rgba(240, 234, 225, ${1 - t})`);
          grad.addColorStop(1, 'rgba(201, 180, 247, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + 90, sy - 42);
          ctx.stroke();
          if (shooting.life >= 60) {
            shooting = null;
            nextShot = time + 8000 + Math.random() * 3000;
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
