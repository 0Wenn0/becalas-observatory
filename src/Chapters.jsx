/*
 * Libro ilustrado: grabados de línea fina en una sola tinta (lila sobre ciruela).
 * Todas las ilustraciones son decorativas: aria-hidden y sin información que no esté en texto.
 */

const ink = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };

function Star({ x, y, r = 4, className = 'tw' }) {
  return <path className={className} style={{ transformOrigin: `${x}px ${y}px` }} d={`M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z`} {...ink} strokeWidth={1.1} />;
}

/* I · Telescopio sobre su trípode, apuntando a una estrella. */
export function EngravingTelescope() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true" focusable="false" className="engraving">
      <g {...ink}>
        <g className="tel-tube">
          <path d="M44 70 L116 38" strokeWidth={9} strokeOpacity=".18" />
          <path d="M46 75 L112 46 M42 66 L108 37" />
          <path d="M42 66 L46 75 M108 37 L112 46" />
          <path d="M108 37 L122 31 L126 40 L112 46" />
          <path d="M60 64 L62 69 M76 57 L78 62 M92 50 L94 55" strokeOpacity=".6" />
          <path d="M36 70 L42 68" />
        </g>
        <path d="M78 62 L66 104 M78 62 L82 104 M78 62 L96 102" />
        <path d="M70 90 L92 92" strokeOpacity=".6" />
        <path d="M20 108 Q80 100 140 108" strokeOpacity=".5" />
      </g>
      <Star x={140} y={18} r={6} />
      <Star x={20} y={26} r={3} />
      <Star x={118} y={80} r={2.5} />
      <circle cx="48" cy="16" r="1.2" fill="currentColor" />
      <circle cx="100" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

/* II · Luna creciente entre nubes, tres noches. */
export function EngravingMoon() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true" focusable="false" className="engraving">
      <g {...ink}>
        <g className="moon-body">
          <path d="M92 22 A36 36 0 1 0 108 86 A30 30 0 1 1 92 22 Z" />
          <path d="M84 40 A3 3 0 1 0 84.1 40 M74 64 A2 2 0 1 0 74.1 64" strokeOpacity=".6" />
        </g>
        <path className="cloud cloud-a" d="M30 96 Q40 86 52 92 Q58 82 72 88 Q84 84 88 96 Z" />
        <path className="cloud cloud-b" d="M100 104 Q108 96 118 100 Q126 92 138 100 Q146 100 146 108 L100 108" strokeOpacity=".7" />
      </g>
      <Star x={124} y={28} r={5} />
      <Star x={138} y={52} r={3} />
      <Star x={30} y={30} r={3.5} />
      <circle cx="120" cy="70" r="1.2" fill="currentColor" />
      <circle cx="22" cy="60" r="1" fill="currentColor" />
    </svg>
  );
}

/* III · Astrolabio: anillos, retícula y alidada. */
export function EngravingAstrolabe() {
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true" focusable="false" className="engraving">
      <g {...ink}>
        <circle cx="80" cy="62" r="40" />
        <circle className="astro-ring" cx="80" cy="62" r="32" strokeOpacity=".7" strokeDasharray="4 3" />
        <circle cx="80" cy="62" r="14" strokeOpacity=".6" />
        <path d="M80 22 L80 102 M40 62 L120 62" strokeOpacity=".5" />
        <path className="alidade" d="M52 34 L108 90" />
        <path d="M80 14 A4 4 0 1 1 80.1 14 M80 18 L80 22" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 40;
          const r2 = i % 2 === 0 ? 35 : 37.5;
          return <path key={i} d={`M${80 + Math.cos(a) * r1} ${62 + Math.sin(a) * r1} L${80 + Math.cos(a) * r2} ${62 + Math.sin(a) * r2}`} strokeOpacity=".7" strokeWidth={1} />;
        })}
      </g>
      <Star x={80} y={62} r={4} />
      <Star x={136} y={24} r={3} />
      <Star x={24} y={100} r={3} />
    </svg>
  );
}

/* IV · Constelación que une varias estrellas en un círculo. */
export function EngravingConstellation() {
  const pts = [[40, 70], [58, 40], [92, 30], [122, 50], [118, 84], [82, 96], [52, 92]];
  return (
    <svg viewBox="0 0 160 120" aria-hidden="true" focusable="false" className="engraving">
      <g {...ink} strokeOpacity=".75">
        <path className="const-line" pathLength="100" d={`M${pts.map((p) => p.join(' ')).join(' L')} Z`} strokeDasharray="3 4" />
        <path d="M58 40 L82 96 M92 30 L52 92" strokeOpacity=".35" />
      </g>
      {pts.map(([x, y], i) => <Star key={i} x={x} y={y} r={i % 2 ? 3.5 : 4.5} />)}
      <circle cx="84" cy="64" r="1.4" fill="currentColor" />
    </svg>
  );
}

/* Esquina ornamental (se rota con CSS para las cuatro esquinas). */
export function CornerOrnament({ className = '' }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={`corner ${className}`}>
      <g {...ink} strokeWidth={1.1}>
        <path d="M4 44 L4 10 Q4 4 10 4 L44 4" />
        <path d="M10 44 L10 16 Q10 10 16 10 L44 10" strokeOpacity=".5" />
        <path d="M4 22 Q14 22 14 12 Q14 6 20 6" strokeOpacity=".7" />
        <circle cx="22" cy="22" r="2" />
      </g>
    </svg>
  );
}

export function StarDivider() {
  return <p className="star-divider" aria-hidden="true">✦ <span>✦</span> ✦</p>;
}

/*
 * Planeta de metal: líneas doradas sobre un disco vino, como una pieza de metal grabada.
 * Las lunas orbitan, el dorado brilla al girar su reflejo y las órbitas crecen al inhalar.
 */
export function GoldPlanet({ idPrefix = 'gp', animate = true, className = '' }) {
  const g = `${idPrefix}-gold`;
  const w = `${idPrefix}-wine`;
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className={`gold-planet ${className}`}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8C6A2A" />
          <stop offset="35%" stopColor="#E9C977" />
          <stop offset="50%" stopColor="#FFF1C9" />
          <stop offset="65%" stopColor="#C99A3E" />
          <stop offset="100%" stopColor="#8C6A2A" />
          {animate && <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="9s" repeatCount="indefinite" />}
        </linearGradient>
        <radialGradient id={w} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#8E2A4B" />
          <stop offset="60%" stopColor="#5E1530" />
          <stop offset="100%" stopColor="#3A0B1D" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="96" fill="#3A0B1D" />
      <circle cx="100" cy="100" r="92" fill="none" stroke={`url(#${g})`} strokeWidth="2.4" />
      <g className="gp-orbits" fill="none" stroke={`url(#${g})`}>
        <circle cx="100" cy="100" r="74" strokeWidth="1.4" strokeDasharray="2 5" />
        <circle cx="100" cy="100" r="56" strokeWidth="1.6" />
        <g className="gp-moon gp-moon-1"><circle cx="100" cy="26" r="7" fill="#3A0B1D" strokeWidth="2" /></g>
        <g className="gp-moon gp-moon-2"><circle cx="156" cy="100" r="5" fill="#3A0B1D" strokeWidth="1.8" /></g>
        <g className="gp-moon gp-moon-3"><circle cx="48" cy="139" r="3.5" fill={`url(#${g})`} stroke="none" /></g>
      </g>
      <g className="gp-body">
        <ellipse cx="100" cy="102" rx="48" ry="12" fill="none" stroke={`url(#${g})`} strokeWidth="2.6" transform="rotate(-16 100 102)" />
        <circle cx="100" cy="100" r="28" fill={`url(#${w})`} stroke={`url(#${g})`} strokeWidth="2.6" />
        <path d="M76 92 Q100 84 124 92 M74 104 Q100 98 126 104" fill="none" stroke={`url(#${g})`} strokeWidth="1.1" strokeOpacity=".7" />
        <path d="M52 108 A48 12 0 0 0 148 96" fill="none" stroke={`url(#${g})`} strokeWidth="2.6" strokeLinecap="round" transform="rotate(-16 100 102)" />
      </g>
      <path className="gp-spark" d="M150 40 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#FFF1C9" />
    </svg>
  );
}
