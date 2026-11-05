import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { EngravingTelescope, EngravingMoon, EngravingAstrolabe, EngravingConstellation, CornerOrnament, StarDivider, GoldPlanet } from './Chapters.jsx';
import { CometCursor, sparkleAt, launchComet, implodeAt } from './CometCursor.jsx';

/* ───────── Contenido ───────── */

const sessions = [
  {
    id: 'metas',
    number: '01',
    // Cuando se acuerde la fecha, cámbiala aquí (ej. 'Sáb 8 de noviembre · 17:00') y marca done: true al terminar.
    dateLabel: 'Por definir',
    done: false,
    name: 'Conocernos y soñar en grande',
    plain: 'Sesión 1 · Definir metas',
    objective: 'Nos presentamos, nos reímos un poco y aterrizamos 2 o 3 metas que de verdad te emocionen (con pasos pequeñitos).',
    bullets: ['Un minuto para llegar y respirar', 'Compartimos nuestra Misión 0 ✨', 'Armamos tus metas SMART', 'Tus fortalezas y lo que quieres desarrollar'],
    bring: ['Tu presentación de la Misión 0 (como haya quedado)', 'Una idea de algo que te gustaría lograr este año'],
    questions: ['¿Qué esperas de estas mentorías… y de ti?', '¿Qué fortaleza tuya quieres poner a jugar?', '¿Qué hábito pequeño te ayudaría a avanzar?'],
  },
  {
    id: 'trayectoria',
    number: '02',
    // Cuando se acuerde la fecha, cámbiala aquí (ej. 'Sáb 8 de noviembre · 17:00') y marca done: true al terminar.
    dateLabel: 'Por definir',
    done: false,
    name: 'El mapa de tu camino',
    plain: 'Sesión 2 · Trayectoria académica',
    objective: 'Miramos hacia atrás para ver todo lo que ya recorriste, y hacia adelante para sacarle jugo a la uni.',
    bullets: ['Tu mapa: de la infancia a hoy', 'Estudiar con propósito (y sin morir en el intento)', 'Networking, mentoras y voluntariado'],
    bring: ['Un recuerdo de la escuela que te marcó', '¿Qué querías ser de niña?'],
    questions: ['¿Qué querías ser de niña? ¿Sigue ahí ese sueño?', '¿Qué materia o persona cambió tu rumbo?', '¿Te imaginas seguir estudiando?'],
  },
  {
    id: 'empleo',
    number: '03',
    // Cuando se acuerde la fecha, cámbiala aquí (ej. 'Sáb 8 de noviembre · 17:00') y marca done: true al terminar.
    dateLabel: 'Por definir',
    done: false,
    name: 'Despegue al mundo laboral',
    emoji: '🚀',
    plain: 'Sesión 3 · Primer empleo',
    objective: 'CV, LinkedIn, entrevistas y cómo no tomarte el “no” como algo personal.',
    bullets: ['Tu CV y LinkedIn, con tus logros a la vista', 'Practicamos una entrevista (en modo amable)', 'Resiliencia: el rechazo también enseña'],
    bring: ['Tu CV (aunque esté en borrador)', 'Una vacante o lugar donde te encantaría trabajar'],
    questions: ['¿Qué logros tuyos merecen estar en tu CV?', 'Ante este reto… ¿tú qué hubieras hecho?', '¿Qué te daría más confianza en una entrevista?'],
  },
];

const prompts = [
  {
    id: 'infografia',
    label: '🖼️ Infografía',
    text: `Crea una infografía horizontal ilustrada para presentarme en mi grupo de mentoría de mujeres universitarias.

Estilo: [ej. ilustración acogedora, colores pastel / estética espacial / acuarela / pizarrón con gis].
Título: "¡Hola! Soy [nombre]".

Incluye estas secciones con íconos:
- Lo que estudio: [carrera, semestre, universidad]
- Lo que me apasiona: [2-3 temas]
- Mis superpoderes: [2-3 habilidades o cualidades]
- También soy: [hobbies, mascotas, música, deporte]
- Lo que quiero lograr en esta mentoría: [1-2 metas]
- Una frase que me representa: "[frase]"

Agrega elementos visuales que me representen: [objetos, lugares o símbolos].
Texto en español, legible y sin errores ortográficos.`,
  },
  {
    id: 'video',
    label: '🎬 Video corto',
    text: `Ayúdame a crear un video corto (30-60 segundos) para presentarme en mi grupo de mentoría.

Sobre mí:
- Nombre: [nombre]
- Estudio: [carrera y semestre]
- Me apasiona: [temas]
- Algo curioso de mí: [dato divertido]
- Lo que quiero lograr: [meta]

Dame:
1. Un guion breve, en primera persona, con tono [cálido / divertido / inspirador].
2. Una división en 4-6 escenas con lo que se ve en cada una y el texto en pantalla.
3. Sugerencias de música, transiciones y emojis.
4. Instrucciones paso a paso para editarlo en [CapCut / Canva / la app que tenga].`,
  },
  {
    id: 'comic',
    label: '📚 Cómic',
    text: `Quiero presentarme como la protagonista de un cómic de 4 a 6 viñetas.

Personaje: una versión ilustrada de mí, [descripción: cabello, estilo, accesorios], en estilo [anime / Pixar / cómic / pixel art / acuarela]. Mantén al personaje idéntico en todas las viñetas.

Historia:
- Viñeta 1: Quién soy: [nombre y lo que estudio]
- Viñeta 2: Lo que me apasiona: [tema], en una escena visual
- Viñeta 3: Un reto que he superado o estoy enfrentando: [reto]
- Viñeta 4: Mi superpoder: [habilidad]
- Viñeta 5: A dónde quiero llegar: [sueño o meta]
- Viñeta 6: Una frase mía: "[frase]"

Diálogos breves, en español y sin errores.
Tip: genera una viñeta a la vez y pon los textos tú misma en Canva para que no salgan con errores.`,
  },
];

const icebreakers = [
  '¿Qué querías ser cuando tenías 8 años?',
  'Si tu carrera fuera una canción, ¿cuál sería?',
  '¿Qué superpoder elegirías para tu vida profesional?',
  '¿Cuál es el mejor consejo que te han dado?',
  '¿Qué tres cosas llevarías a una isla desierta?',
  '¿Qué tema podrías explicar durante 10 minutos sin preparar nada?',
  '¿Qué animal serías y por qué?',
  '¿A qué mujer (real o ficticia) invitarías a cenar?',
  '¿Qué es algo que aprendiste sola y te enorgullece?',
  '¿Qué harías si supieras que no puedes fallar?',
  '¿Cuál ha sido tu mayor “me atreví”?',
  '¿Qué te hace perder la noción del tiempo?',
  'Si pudieras dominar una habilidad mañana, ¿cuál sería?',
  '¿Qué lugar del mundo te gustaría conocer y qué harías ahí?',
  '¿Qué app, libro o serie le recomendarías a todo el grupo?',
  '¿Cuál es tu ritual para concentrarte?',
  '¿Qué pequeño logro de esta semana merece celebrarse?',
  '¿Qué te gustaría que dijeran de ti en tu primer trabajo?',
  '¿Qué pregunta te encantaría que te hicieran más seguido?',
  'Si tu vida fuera una película, ¿cómo se llamaría este capítulo?',
];

const nodes = [
  { id: 'intereses', label: 'Intereses', position: 'node-a', prompt: '¿Qué te da curiosidad? ¿De qué podrías platicar horas sin aburrirte?' },
  { id: 'fortalezas', label: 'Fortalezas', position: 'node-b', prompt: '¿Qué se te da bien? ¿Qué te dicen tus amigas que haces increíble?' },
  { id: 'experiencias', label: 'Experiencias', position: 'node-c', prompt: '¿Qué momentos o decisiones te trajeron hasta aquí?' },
  { id: 'posibilidades', label: 'Posibilidades', position: 'node-d', prompt: '¿Qué te gustaría probar, aunque sea un poquito, en los próximos meses?' },
];

const agreements = [
  ['🤝', 'Aquí cabemos todas', 'Cero discriminación, cero acoso. Cada voz cuenta y se escucha con respeto.'],
  ['🔒', 'Lo que se dice aquí, aquí se queda', 'Cuidamos lo que cada una comparte. No grabamos sin el acuerdo de todas.'],
  ['🧪', 'Equivocarse es parte del experimento', 'Preguntar y pedir ayuda no es debilidad: es como se aprende.'],
  ['📣', 'Nos echamos porras, no competimos', 'Somos aliadas. Celebramos los logros de cada una, grandes o pequeños.'],
  ['💬', 'Si algo pesa, lo hablamos', 'Si algo te supera, dímelo. Buscamos juntas el apoyo adecuado con el equipo del programa.'],
];

const initialSmart = { goal: '', measure: '', achievable: '', realistic: '', deadline: '', firstStep: '' };
const smartFields = [
  ['goal', 'S · Específica', '¿Qué quieres lograr?', 'Ej. Mis primeras prácticas'],
  ['measure', 'M · Medible', '¿Cómo sabrás que avanzaste?', 'Ej. 10 solicitudes enviadas'],
  ['achievable', 'A · Alcanzable', '¿Qué necesitas para lograrlo?', 'Ej. CV actualizado'],
  ['realistic', 'R · Realista', '¿Qué no vas a sacrificar?', 'Ej. Mis horas de sueño'],
  ['deadline', 'T · Con fecha', '¿Para cuándo?', 'Ej. 31 de enero'],
  ['firstStep', 'Primer pasito 👣', '¿Qué puedes hacer esta semana?', 'Ej. Pedir que revisen mi CV'],
];

/* ───────── Utilidades ───────── */

function readSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* opcional */ }
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}


function BrandLockup({ href, label }) {
  return (
    <a className="brand-lockup" href={href} aria-label={label}>
      <span className="brand-program">Mentorías BécALAS 2026 · Grupo de Wen</span>
      <span className="brand-primary">un proyecto de Cognitive Observatory</span>
    </a>
  );
}

/* ───────── App ───────── */

export function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return (
    <>
      <CometCursor />
      {path === '/caso' ? <CaseStudy /> : <Microsite />}
    </>
  );
}

/* ───────── Componentes interactivos ───────── */

function MissionTabs() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState('');
  const [expanded, setExpanded] = useState(false);
  const tabRefs = useRef([]);

  function onKey(event) {
    const last = prompts.length - 1;
    let next = null;
    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = last;
    if (next !== null) {
      event.preventDefault();
      setActive(next);
      tabRefs.current[next]?.focus();
    }
  }

  async function onCopy(event) {
    const ok = await copyText(prompts[active].text);
    setCopied(ok ? '¡Listo, copiado! Ahora pégalo en tu IA favorita ✨' : 'No pude copiarlo automáticamente: selecciona el texto y cópialo.');
    window.setTimeout(() => setCopied(''), 3200);
  }

  return (
    <div className="mission-tabs">
      <div className="tablist" role="tablist" aria-label="Elige un formato para tu presentación">
        {prompts.map((prompt, index) => (
          <button
            key={prompt.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            id={`tab-${prompt.id}`}
            aria-selected={active === index}
            aria-controls={`panel-${prompt.id}`}
            tabIndex={active === index ? 0 : -1}
            className="tab"
            type="button"
            onClick={() => setActive(index)}
            onKeyDown={onKey}
          >
            {prompt.label}
          </button>
        ))}
      </div>
      <div className="prompt-panel" role="tabpanel" id={`panel-${prompts[active].id}`} aria-labelledby={`tab-${prompts[active].id}`}>
        <pre className={`prompt-text ${expanded ? 'is-expanded' : ''}`} id="prompt-text" tabIndex={0}>{prompts[active].text}</pre>
        <button className="text-button prompt-toggle" type="button" aria-expanded={expanded} aria-controls="prompt-text" onClick={() => setExpanded((v) => !v)}>{expanded ? 'Ver menos' : 'Ver el prompt completo'}</button>
        <div className="prompt-actions">
          <button className="button button-primary" type="button" onClick={onCopy}>Copiar prompt <span aria-hidden="true">✨</span></button>
          <p className="status-text" role="status" aria-live="polite">{copied}</p>
        </div>
      </div>
    </div>
  );
}

function CometButton() {
  const [question, setQuestion] = useState('');
  const pool = useRef([]);

  function launch(event) {
    if (pool.current.length === 0) pool.current = [...icebreakers].sort(() => Math.random() - 0.5);
    setQuestion(pool.current.pop());
    launchComet(event.currentTarget);
  }

  return (
    <div className="comet-box">
      <button className="button button-primary" type="button" onClick={launch}>☄️ Lanza un cometa</button>
      <p className="comet-question" aria-live="polite">{question || 'Aprieta el botón y te cae una pregunta para romper el hielo.'}</p>
    </div>
  );
}

function SessionProgress() {
  return (
    <ol className="progress-constellation" aria-label="Avance de nuestras sesiones">
      {sessions.map((session, index) => {
        const { done } = session;
        const isToday = false;
        return (
          <li key={session.id} className={`progress-star ${done ? 'is-done' : ''} ${isToday ? 'is-today' : ''}`}>
            <span className="star-dot" aria-hidden="true">{done ? '★' : '☆'}</span>
            <span className="star-label">Sesión {index + 1}{done ? ' ✓ completada' : isToday ? ' · ¡hoy!' : ''}</span>
            {index < sessions.length - 1 && <span className="star-line" aria-hidden="true" />}
          </li>
        );
      })}
    </ol>
  );
}

function HowTo({ steps, note, dark }) {
  return (
    <div className={`howto ${dark ? 'on-dark' : ''}`}>
      <p className="howto-title"><span aria-hidden="true">🧭</span> Cómo se usa</p>
      <ol>{steps.map((step) => <li key={step}>{step}</li>)}</ol>
      {note && <p className="howto-note">{note}</p>}
    </div>
  );
}

function BreathingPlanet() {
  const [phase, setPhase] = useState('inhala');
  useEffect(() => {
    const id = window.setInterval(() => setPhase((p) => (p === 'inhala' ? 'exhala' : 'inhala')), 4000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className={`breathing-planet is-${phase}`}>
      <GoldPlanet idPrefix="bp" animate={!reducedMotion()} />
      <p className="breath-cue">
        {phase === 'inhala' ? 'Inhala… los anillos crecen' : 'Exhala… los anillos se encogen'}
      </p>
    </div>
  );
}

function PlanetIcon() {
  return <GoldPlanet idPrefix="pi" animate={!reducedMotion()} className="planet-icon" />;
}


/* ───────── Navegación por vistas ───────── */

const views = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'sesiones', label: 'Sesiones' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'nosotras', label: 'Nosotras' },
];

/* Anclas internas → vista que las contiene (y pestaña de herramienta, si aplica). */
const anchorToView = {
  inicio: 'inicio', proxima: 'inicio', wen: 'inicio', mision: 'mision',
  sesiones: 'sesiones',
  herramientas: 'herramientas', meta: 'herramientas', constelacion: 'herramientas', bitacora: 'herramientas',
  nosotras: 'nosotras', respira: 'nosotras', acuerdos: 'nosotras', recursos: 'nosotras', apoyo: 'nosotras',
};
const toolTabs = [
  { id: 'meta', label: 'Mi meta' },
  { id: 'constelacion', label: 'Mi constelación' },
  { id: 'bitacora', label: 'Mi bitácora' },
];

const chapters = [
  { id: 'mision', roman: 'I', title: 'Tu primera misión', teaser: 'Preséntate con IA antes de la sesión 1', Art: EngravingTelescope },
  { id: 'sesiones', roman: 'II', title: 'Tres noches de observación', teaser: 'Qué haremos en cada sesión y qué traer', Art: EngravingMoon },
  { id: 'herramientas', roman: 'III', title: 'Tu kit de exploradora', teaser: 'Tu meta, tu constelación y tu bitácora', Art: EngravingAstrolabe },
  { id: 'nosotras', roman: 'IV', title: 'Nosotras', teaser: 'Cómo nos cuidamos, respirar y pedir apoyo', Art: EngravingConstellation },
];

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Tarjetas-capítulo: se inclinan siguiendo el cursor y sueltan un destello pequeño al llegar. */
function tiltCard(event) {
  if (event.pointerType !== 'mouse' || reducedMotion()) return;
  const card = event.currentTarget;
  const r = card.getBoundingClientRect();
  const x = (event.clientX - r.left) / r.width - 0.5;
  const y = (event.clientY - r.top) / r.height - 0.5;
  card.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
  card.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
  card.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(0)}%`);
  card.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(0)}%`);
}
function resetTilt(event) {
  const card = event.currentTarget;
  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
}
let lastHoverSparkle = 0;
function hoverSparkle(event) {
  const now = performance.now();
  if (now - lastHoverSparkle < 500) return;
  lastHoverSparkle = now;
  const art = event.currentTarget.querySelector('.chapter-art');
  sparkleAt(art, 6);
}

function readHash() {
  return window.location.hash.replace('#', '');
}

function SiteHeader({ view }) {
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef(null);

  // En celular, el encabezado se esconde al bajar y reaparece al subir.
  useEffect(() => {
    let lastY = window.scrollY;
    const mobile = window.matchMedia('(max-width: 700px)');
    function onScroll() {
      const y = window.scrollY;
      const focusInside = headerRef.current?.contains(document.activeElement);
      if (!mobile.matches || focusInside || y < 120) setHidden(false);
      else if (y > lastY + 6) setHidden(true);
      else if (y < lastY - 6) setHidden(false);
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${hidden ? 'is-hidden' : ''} is-book`} ref={headerRef} onFocus={() => setHidden(false)}>
      <BrandLockup href="#inicio" label="Mentorías BécALAS 2026, grupo de Wen. Ir al inicio" />
      <nav className="main-nav" aria-label="Secciones del sitio">
        {views.map((item) => (
          <a key={item.id} href={`#${item.id}`} className={`nav-link ${(view === item.id || (item.id === 'inicio' && view === 'mision')) ? 'is-active' : ''}`} aria-current={(view === item.id || (item.id === 'inicio' && view === 'mision')) ? 'page' : undefined}>{item.label}</a>
        ))}
      </nav>
    </header>
  );
}

function ToolTabs({ active, onChange }) {
  const refs = useRef([]);
  function onKey(event) {
    const index = toolTabs.findIndex((t) => t.id === active);
    let next = null;
    if (event.key === 'ArrowRight') next = (index + 1) % toolTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + toolTabs.length) % toolTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = toolTabs.length - 1;
    if (next !== null) {
      event.preventDefault();
      onChange(toolTabs[next].id);
      refs.current[next]?.focus();
    }
  }
  return (
    <div className="tool-tabs" role="tablist" aria-label="Elige una herramienta">
      {toolTabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => { refs.current[index] = el; }}
          type="button"
          role="tab"
          id={`tooltab-${tab.id}`}
          aria-selected={active === tab.id}
          aria-controls={`toolpanel-${tab.id}`}
          tabIndex={active === tab.id ? 0 : -1}
          className="tool-tab"
          onClick={() => onChange(tab.id)}
          onKeyDown={onKey}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ChapterHero({ id, roman, Art, title, sub }) {
  return (
    <header className="chapter-hero" style={{ viewTransitionName: `ch-${id}` }}>
      <span className="chapter-roman" aria-hidden="true">{roman}</span>
      <span className="chapter-art"><Art /></span>
      <p className="book-kicker">Capítulo {roman}</p>
      <h1 id={`view-${id}-title`} tabIndex={-1}>{title}</h1>
      {sub && <p className="chapter-sub">{sub}</p>}
    </header>
  );
}

function ChapterNav({ prev, next }) {
  return (
    <nav className="chapter-nav" aria-label="Capítulos">
      <a href={`#${prev[0]}`}>← {prev[1]}</a>
      <a href={`#${next[0]}`}>{next[1]} →</a>
    </nav>
  );
}

/* ───────── Página principal ───────── */

function Microsite() {
  const [view, setView] = useState(() => anchorToView[readHash()] ?? 'inicio');
  const [tool, setTool] = useState(() => (toolTabs.some((t) => t.id === readHash()) ? readHash() : 'meta'));
  const [openSession, setOpenSession] = useState('');
  const [showBio, setShowBio] = useState(false);
  const [activeNode, setActiveNode] = useState('intereses');
  const [breathing, setBreathing] = useState(false);
  const [smart, setSmart] = useState(() => readSaved('becalas-smart', initialSmart));
  const [smartCopied, setSmartCopied] = useState('');
  const [activeLogSession, setActiveLogSession] = useState('metas');
  const [log, setLog] = useState(() => readSaved('becalas-log', { metas: {}, trayectoria: {}, empleo: {} }));
  const [savedMessage, setSavedMessage] = useState('');
  const celebrated = useRef(false);
  const previewRef = useRef(null);
  const firstRender = useRef(true);
  const viewRef = useRef(view);

  // Enrutamiento por #hash: cada vista tiene su enlace para compartir por WhatsApp.
  useEffect(() => {
    function onHash() {
      const hash = readHash();
      const target = anchorToView[hash];
      if (!target) return;
      const from = viewRef.current;
      const closing = target === 'inicio' && from !== 'inicio';
      const apply = () => {
        flushSync(() => {
          setView(target);
          if (toolTabs.some((t) => t.id === hash)) setTool(hash);
        });
        viewRef.current = target;
        const el = document.getElementById(hash);
        const isView = views.some((v) => v.id === hash) || hash === 'mision';
        if (isView || !el) {
          window.scrollTo({ top: 0 });
          document.getElementById(`view-${target}-title`)?.focus({ preventScroll: true });
        } else {
          el.scrollIntoView();
        }
      };
      // Abrir un capítulo = la tarjeta crece hasta ser la página (explosión); cerrar = regresa a su lugar (implosión).
      if (document.startViewTransition && !reducedMotion() && from !== target) {
        document.documentElement.classList.toggle('vt-close', closing);
        const transition = document.startViewTransition(apply);
        transition.finished.finally(() => {
          document.documentElement.classList.remove('vt-close');
          if (closing) implodeAt(document.querySelector(`[data-chapter="${from}"]`));
        });
      } else {
        apply();
      }
    }
    window.addEventListener('hashchange', onHash);
    if (firstRender.current && readHash() && anchorToView[readHash()]) onHash();
    firstRender.current = false;
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const nextSession = sessions.find((session) => !session.done) ?? sessions[sessions.length - 1];
  const nextDefined = nextSession.dateLabel !== 'Por definir';

  useEffect(() => { saveLocal('becalas-smart', smart); }, [smart]);

  const smartComplete = ['goal', 'measure', 'achievable', 'realistic', 'deadline'].every((key) => (smart[key] ?? '').trim());
  useEffect(() => {
    if (smartComplete && !celebrated.current) {
      celebrated.current = true;
      if (previewRef.current) sparkleAt(previewRef.current, 18);
    }
    if (!smartComplete) celebrated.current = false;
  }, [smartComplete]);

  const s = Object.fromEntries(Object.entries(smart).map(([k, v]) => [k, (v ?? '').trim()]));
  const smartSentence = s.goal
    ? [
        `🎯 Mi meta: ${s.goal}${s.deadline ? `, a más tardar el ${s.deadline}` : ''}.`,
        s.measure && `📏 Sabré que avancé cuando: ${s.measure}.`,
        s.achievable && `🧰 Necesito: ${s.achievable}.`,
        s.realistic && `⚖️ Sin sacrificar: ${s.realistic}.`,
        s.firstStep && `👣 Mi primer pasito esta semana: ${s.firstStep}.`,
      ].filter(Boolean).join('\n')
    : '';

  const currentNode = nodes.find((node) => node.id === activeNode) ?? nodes[0];
  const currentLog = log[activeLogSession] ?? {};

  function flash(setter, message) {
    setter(message);
    window.setTimeout(() => setter(''), 3200);
  }

  async function copySmart() {
    const ok = await copyText(smartSentence);
    flash(setSmartCopied, ok ? '¡Copiada! Tráela a la sesión ✨' : 'Selecciona el texto y cópialo manualmente.');
  }

  function updateCurrentLog(field, value) {
    setLog((previous) => ({ ...previous, [activeLogSession]: { ...(previous[activeLogSession] ?? {}), [field]: value } }));
  }

  function saveJournal() {
    const next = { ...log, [activeLogSession]: currentLog };
    setLog(next);
    saveLocal('becalas-log', next);
    flash(setSavedMessage, '¡Guardado en tu celular! 🔒');
  }

  function clearJournal() {
    const next = { ...log, [activeLogSession]: {} };
    setLog(next);
    saveLocal('becalas-log', next);
    flash(setSavedMessage, 'Listo, borré tus notas de esta sesión.');
  }

  function clearSmart() {
    setSmart(initialSmart);
    flash(setSmartCopied, 'Campos en blanco. ¡A empezar de nuevo!');
  }

  return (
    <>
      <a className="skip-link" href="#contenido" onClick={(e) => { e.preventDefault(); document.getElementById('contenido')?.focus(); }}>Saltar al contenido</a>
      <SiteHeader view={view} />

      <main id="contenido" tabIndex={-1}>
        {/* ═════ INICIO ═════ */}
        {view === 'inicio' && (
          <div className="book">
            <section className="frontispiece section-wrap" aria-labelledby="view-inicio-title">
              <div className="frame">
                <CornerOrnament className="c-tl" /><CornerOrnament className="c-tr" /><CornerOrnament className="c-bl" /><CornerOrnament className="c-br" />
                <p className="book-kicker">Observatorio de mentoría · BécALAS 2026</p>
                <h1 id="view-inicio-title" tabIndex={-1}>¡Exploremos juntas!</h1>
                <StarDivider />
                <p className="book-lede">Un pequeño libro para nuestras mentorías: cuatro capítulos para mirar el cielo, hacer preguntas y armar caminos.</p>
              </div>
              <p className="next-note" id="proxima"><span aria-hidden="true">☾</span> <strong>Próxima sesión:</strong> {nextDefined ? nextSession.dateLabel : 'por definir, la acordamos juntas en el grupo'}.</p>
            </section>

            <section className="section-wrap chapter-index" aria-labelledby="index-title">
              <h2 id="index-title" className="index-title">Índice</h2>
              <ol className="chapter-grid">
                {chapters.map(({ id, roman, title, teaser, Art }) => (
                  <li key={id}>
                    <a className="chapter-card" href={`#${id}`} data-chapter={id} style={{ viewTransitionName: `ch-${id}` }} onClick={(e) => sparkleAt(e.currentTarget, 16)} onPointerMove={tiltCard} onPointerLeave={resetTilt} onPointerEnter={hoverSparkle} onFocus={hoverSparkle}>
                      <span className="chapter-roman" aria-hidden="true">{roman}</span>
                      <span className="chapter-art"><Art /></span>
                      <span className="chapter-title"><span className="sr-only">Capítulo {roman}: </span>{title}</span>
                      <span className="chapter-teaser">{teaser}</span>
                      <span className="chapter-open" aria-hidden="true">Abrir capítulo →</span>
                    </a>
                  </li>
                ))}
              </ol>
            </section>

            <section className="guide-section section-wrap book-guide" id="wen" aria-labelledby="guide-title">
              <div className="guide-avatar" aria-hidden="true">🪐</div>
              <div>
                <p className="book-kicker">Tu guía</p>
                <h2 id="guide-title" className="guide-title">Hola, soy Wen</h2>
                <p className="guide-short">Psicóloga, maestrante en Neuropsicología Clínica y científica de datos. Me mueve transformar la realidad con ciencia y tecnología.</p>
                <div id="bio-more" hidden={!showBio}>
                  <p className="guide-bio">Trabajo donde se cruzan la mente, los datos, la inteligencia artificial y la educación, y me encanta llevarlo al impacto público: impartí talleres de alfabetización en IA en un programa nacional vinculado a OpenAI en México, con más de 3,000 personas de gobierno, el Congreso y universidades.</p>
                  <p className="guide-bio">Soy una eterna aprendiz, fan de la ciencia, el arte, el deporte y las buenas conversaciones. Este es un espacio seguro para explorar juntas y descubrir nuevos caminos, constelaciones y sueños.</p>
                </div>
                <button className="text-button" type="button" aria-expanded={showBio} aria-controls="bio-more" onClick={() => setShowBio((v) => !v)}>{showBio ? 'Ver menos' : 'Conóceme más'}</button>
              </div>
            </section>
          </div>
        )}

        {view === 'mision' && (
          <div className="book">
            <article className="chapter section-wrap" aria-labelledby="view-mision-title">
              <header className="chapter-hero" style={{ viewTransitionName: 'ch-mision' }}>
                <span className="chapter-roman" aria-hidden="true">I</span>
                <span className="chapter-art"><EngravingTelescope /></span>
                <p className="book-kicker">Capítulo I</p>
                <h1 id="view-mision-title" tabIndex={-1}>Tu primera misión</h1>
                <p className="chapter-sub">Preséntate con IA antes de la sesión 1</p>
              </header>
              <StarDivider />
              <div className="chapter-body">
                <p className="drop-cap">Antes de conocernos en vivo, te invito a presentarte de una forma creativa: con una infografía, un video corto o un cómic hecho con ayuda de la IA. No tiene que quedar perfecto. Si algo sale raro, mejor: de eso vamos a platicar.</p>
                <ol className="mission-steps book-steps">
                  <li><span className="step-num" aria-hidden="true">1</span><span>Elige un formato.</span></li>
                  <li><span className="step-num" aria-hidden="true">2</span><span>Copia el prompt y cambia lo que está entre [corchetes] por tus datos.</span></li>
                  <li><span className="step-num" aria-hidden="true">3</span><span>Compártelo en la sesión y cuéntanos qué le corregiste a la IA.</span></li>
                </ol>
                <MissionTabs />
                <p className="book-note"><span aria-hidden="true">🔒</span> No le compartas a la IA tu dirección, teléfono, CURP ni datos de otras personas. Si no quieres usar tu foto, un avatar funciona perfecto.</p>
              </div>
              <StarDivider />
              <nav className="chapter-nav" aria-label="Capítulos">
                <a href="#inicio">← Volver al índice</a>
                <a href="#sesiones">Siguiente: Tres noches de observación →</a>
              </nav>
            </article>
          </div>
        )}

        {/* ═════ SESIONES ═════ */}
        {view === 'sesiones' && (
          <div className="book">
          <article className="chapter section-wrap" aria-labelledby="view-sesiones-title">
            <ChapterHero id="sesiones" roman="II" Art={EngravingMoon} title="Tres noches de observación" sub="Toca una sesión para ver qué haremos y qué traer" />
            <StarDivider />
            <div className="chapter-body">
              <div className="session-list">
                {sessions.map((session) => {
                  const expanded = openSession === session.id;
                  return (
                    <article className={`session ${expanded ? 'is-open' : ''}`} key={session.id}>
                      <h2 className="session-heading">
                        <button className="session-trigger" type="button" aria-expanded={expanded} aria-controls={`session-${session.id}`} onClick={() => setOpenSession(expanded ? '' : session.id)}>
                          <span className="session-number" aria-hidden="true">{session.number}</span>
                          <span className="session-title-group">
                            <span className="session-eyebrow">{session.plain}{session.dateLabel === 'Por definir' ? '' : ` · ${session.dateLabel}`}</span>
                            <span className="session-title">{session.name}{session.emoji && <span aria-hidden="true"> {session.emoji}</span>}</span>
                          </span>
                          <span className="session-toggle" aria-hidden="true">{expanded ? '−' : '+'}</span>
                        </button>
                      </h2>
                      <div className="session-detail" id={`session-${session.id}`} hidden={!expanded}>
                        <p className="session-objective">{session.objective}</p>
                        <div className="session-detail-grid">
                          <div>
                            <h3 className="mini-title">Vamos a…</h3>
                            <ul className="plain-list">{session.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                          </div>
                          <div className="session-aside">
                            <h3 className="mini-title">Trae contigo</h3>
                            <ul className="plain-list">{session.bring.map((b) => <li key={b}>{b}</li>)}</ul>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <CometButton />
            </div>
            <StarDivider />
            <ChapterNav prev={['mision', 'Tu primera misión']} next={['herramientas', 'Tu kit de exploradora']} />
          </article>
          </div>
        )}

        {/* ═════ HERRAMIENTAS ═════ */}
        {view === 'herramientas' && (
          <div className="book">
          <article className="chapter chapter-wide section-wrap" aria-labelledby="view-herramientas-title">
            <ChapterHero id="herramientas" roman="III" Art={EngravingAstrolabe} title="Tu kit de exploradora" sub="Tu meta, tu constelación y tu bitácora" />
            <StarDivider />
            <div className="chapter-body">
              <p className="privacy-seal"><span aria-hidden="true">🔒</span> Todo lo que escribas se queda en tu celular. Ni yo lo veo.</p>
              <ToolTabs active={tool} onChange={setTool} />

              <div className="tool-panel" role="tabpanel" id={`toolpanel-${tool}`} aria-labelledby={`tooltab-${tool}`}>
                {tool === 'meta' && (
                  <div className="tool-grid" id="meta">
                    <HowTo steps={['Escribe qué quieres lograr, como te salga.', 'Completa las demás letras; no tienen que quedar perfectas.', 'Copia tu meta y tráela a la sesión 1.']} />
                    <div className="smart-builder worksheet">
                      <div className="worksheet-head">
                        <p className="worksheet-title"><span aria-hidden="true">✎</span> Tu meta SMART</p>
                        <button className="quiet-button" type="button" onClick={clearSmart}>Borrar</button>
                      </div>
                      <div className="smart-fields">
                        {smartFields.map(([key, title, question, example]) => (
                          <div className="field" key={key}>
                            <label htmlFor={`smart-${key}`}>{title}</label>
                            <span className="field-prompt" id={`smart-${key}-hint`}>{question}</span>
                            <input id={`smart-${key}`} aria-describedby={`smart-${key}-hint`} value={smart[key] ?? ''} onChange={(e) => setSmart((p) => ({ ...p, [key]: e.target.value }))} placeholder={example} />
                          </div>
                        ))}
                      </div>
                      <div className={`goal-preview ${smartComplete ? 'is-complete' : ''}`} ref={previewRef}>
                        <span className="goal-preview-label">{smartComplete ? '¡Meta lista! ✨' : 'Tu meta se arma aquí'}</span>
                        <p>{smartSentence || 'Empieza por “¿Qué quieres lograr?” 👣'}</p>
                      </div>
                      <div className="prompt-actions">
                        <button className="button button-primary" type="button" onClick={copySmart} disabled={!smartSentence} aria-describedby="smart-copy-hint">Copiar mi meta</button>
                        {!smartSentence && <p className="field-prompt" id="smart-copy-hint">Se activa cuando escribas qué quieres lograr.</p>}
                        <p className="status-text" role="status" aria-live="polite">{smartCopied}</p>
                      </div>
                    </div>
                  </div>
                )}

                {tool === 'constelacion' && (
                  <div className="tool-grid constellation-card" id="constelacion">
                    <HowTo dark steps={['Elige un punto.', 'Lee la pregunta.', 'Contéstala en tu cabeza o en tu bitácora.']} />
                    <div>
                      <div className="node-selector" role="group" aria-label="Puntos de tu constelación">
                        {nodes.map((node) => <button type="button" key={node.id} className={activeNode === node.id ? 'node-tab is-selected' : 'node-tab'} aria-pressed={activeNode === node.id} onClick={() => setActiveNode(node.id)}>{node.label}</button>)}
                      </div>
                      <div className="node-prompt worksheet on-dark" aria-live="polite"><span>Tu pregunta · {currentNode.label}</span><p>{currentNode.prompt}</p></div>
                    </div>
                  </div>
                )}

                {tool === 'bitacora' && (
                  <div className="tool-grid" id="bitacora">
                    <HowTo steps={['Elige la sesión.', 'Responde con frases cortas.', 'Guarda. Puedes volver a editar.']} />
                    <div className="journal-form worksheet">
                      <div className="worksheet-head"><p className="worksheet-title"><span aria-hidden="true">✎</span> Tu bitácora</p></div>
                      <div className="field"><label htmlFor="journal-session">Sesión</label><select id="journal-session" value={activeLogSession} onChange={(e) => setActiveLogSession(e.target.value)}>{sessions.map((session) => <option value={session.id} key={session.id}>{session.plain}</option>)}</select></div>
                      <div className="field"><label htmlFor="journal-discovery">¿Qué descubrí?</label><textarea id="journal-discovery" value={currentLog.discovery ?? ''} onChange={(e) => updateCurrentLog('discovery', e.target.value)} placeholder="Una idea o fortaleza que no había visto…" rows="3" /></div>
                      <div className="field"><label htmlFor="journal-learning">¿Qué me llevo?</label><textarea id="journal-learning" value={currentLog.learning ?? ''} onChange={(e) => updateCurrentLog('learning', e.target.value)} placeholder="Algo que aprendí…" rows="3" /></div>
                      <div className="field"><label htmlFor="journal-commitment">¿Qué voy a probar esta semana?</label><textarea id="journal-commitment" value={currentLog.commitment ?? ''} onChange={(e) => updateCurrentLog('commitment', e.target.value)} placeholder="Un pasito concreto 👣" rows="2" /></div>
                      <div className="journal-actions"><button className="button button-dark" type="button" onClick={saveJournal}>Guardar mis notas</button><button className="quiet-button" type="button" onClick={clearJournal}>Borrar esta sesión</button></div>
                      <p className="status-text" role="status" aria-live="polite">{savedMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <StarDivider />
            <ChapterNav prev={['sesiones', 'Tres noches de observación']} next={['nosotras', 'Nosotras']} />
          </article>
          </div>
        )}

        {/* ═════ NOSOTRAS ═════ */}
        {view === 'nosotras' && (
          <div className="book">
          <article className="chapter section-wrap" aria-labelledby="view-nosotras-title">
            <ChapterHero id="nosotras" roman="IV" Art={EngravingConstellation} title="Nosotras" sub="Cómo nos cuidamos, respirar y pedir apoyo" />
            <StarDivider />
            <div className="chapter-body">
              <section className="chapter-section" id="acuerdos" aria-labelledby="agreements-title">
                <h2 id="agreements-title" className="block-title">Nuestras reglas del cielo</h2>
                <div className="agreement-grid">
                  {agreements.map(([icon, title, text]) => (
                    <details className="agreement-tile" key={title}>
                      <summary><span className="tile-icon" aria-hidden="true">{icon}</span><span className="tile-title">{title}</span></summary>
                      <p>{text}</p>
                    </details>
                  ))}
                </div>
              </section>

              <section className="chapter-section breath-card" id="respira" aria-labelledby="breath-title">
                <div className="breath-copy">
                  <p className="book-kicker">Opcional, sin presión</p>
                  <h2 id="breath-title" className="block-title">Antes de despegar, respira</h2>
                  <p>Un minuto para llegar de verdad.</p>
                </div>
                <div className="breath-control">
                  <button className={`planet-button ${breathing ? 'is-breathing' : ''}`} type="button" aria-expanded={breathing} aria-controls="breath-guide" onClick={() => setBreathing((v) => !v)}>
                    <PlanetIcon />
                    <span className="planet-label">{breathing ? 'Cerrar la guía' : 'Toca el planeta para empezar'}</span>
                  </button>
                  <div className="breath-guide" id="breath-guide" hidden={!breathing}>
                    {breathing && <BreathingPlanet />}
                    <p className="breath-tip">Ponte cómoda. Sigue al planeta: inhala cuando los anillos crecen y suelta el aire cuando se encogen.</p>
                  </div>
                </div>
              </section>

              <section className="chapter-section" id="recursos" aria-labelledby="resources-title">
                <h2 id="resources-title" className="block-title">Instrumentos</h2>
                <ul className="resource-tiles">
                  <li><a href="#respira"><span className="tile-icon" aria-hidden="true">🌬️</span><span className="tile-title">Respirar</span><span className="tile-sub">Antes de un examen o entrevista</span></a></li>
                  <li><a href="#meta"><span className="tile-icon" aria-hidden="true">🎯</span><span className="tile-title">Mi meta</span><span className="tile-sub">Pégala donde la veas diario</span></a></li>
                  <li><a href="https://youtu.be/Ks-_Mh1QhMc" target="_blank" rel="noreferrer"><span className="tile-icon" aria-hidden="true">🎤</span><span className="tile-title">Hablar en público</span><span className="tile-sub">Charla TED de Amy Cuddy<span className="sr-only"> (se abre en otra pestaña)</span></span></a></li>
                  <li><a href="https://asana.com/es/resources/long-term-goals" target="_blank" rel="noreferrer"><span className="tile-icon" aria-hidden="true">🪜</span><span className="tile-title">Metas grandes</span><span className="tile-sub">Divídelas en pasos<span className="sr-only"> (se abre en otra pestaña)</span></span></a></li>
                </ul>
              </section>

              <section className="chapter-section support-card" id="apoyo" aria-labelledby="support-title">
                <h2 id="support-title" className="block-title">¿Algo te está costando?</h2>
                <p>Escríbeme por el grupo y lo vemos juntas.</p>
                <p className="contact-line"><strong>Equipo BécALAS:</strong> contacto@becalasonline.mx</p>
              </section>
            </div>
            <StarDivider />
            <ChapterNav prev={['herramientas', 'Tu kit de exploradora']} next={['inicio', 'Volver al índice']} />
          </article>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-cta">
            <p className="footer-title">¿Dudas? <span aria-hidden="true">💬</span></p>
            <p>Escríbeme por el grupo. No hay preguntas tontas.</p>
          </div>
          <nav className="footer-nav" aria-label="Enlaces rápidos">
            <ul>
              {views.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>Micrositio diseñado y desarrollado por Wen (Wendy Ramírez) para su grupo de mentoría BécALAS 2026‑2027. Sitio personal de apoyo, no oficial de BécALAS ni de Bécalos. Parte del portafolio UX/UI <strong>Cognitive Observatory</strong>.</p>
          <a className="footer-case-link" href="/caso">Cómo diseñé este sitio →</a>
        </div>
      </footer>
    </>
  );
}

/* ───────── Estudio de caso ───────── */

function CaseStudy() {
  return (
    <>
      <a className="skip-link" href="#case-content">Saltar al contenido</a>
      <header className="site-header">
        <BrandLockup href="/" label="Volver al micrositio de mentoría" />
        <nav className="main-nav case-nav" aria-label="Navegación"><a className="nav-link" href="/">← Volver al observatorio</a></nav>
      </header>
      <main className="case-page section-wrap" id="case-content">
        <p className="section-label">Caso de diseño UX/UI · Cognitive Observatory · 2026</p>
        <h1>Un observatorio para acompañar una mentoría</h1>
        <p className="case-lede">Micrositio que diseñé y desarrollé para mi grupo de mentoradas del programa BécALAS 2026‑2027: un solo lugar con fechas, la primera misión y herramientas para cada sesión.</p>

        <section aria-labelledby="c1"><h2 id="c1">El reto</h2>
          <p>Un grupo de estudiantes universitarias, tres sesiones en noviembre y toda la comunicación por WhatsApp. Necesitaban saber en segundos cuándo nos vemos, qué hacer antes y dónde encontrar las herramientas, casi siempre desde el celular.</p>
        </section>

        <section aria-labelledby="c2"><h2 id="c2">Usuarias y necesidades</h2>
          <ul>
            <li>Acceso móvil desde un enlace de WhatsApp.</li>
            <li>Claridad inmediata: próxima sesión, tarea y propósito del sitio.</li>
            <li>Un tono cercano y de juego que invite a experimentar sin miedo a equivocarse.</li>
            <li>Privacidad: nada de datos personales expuestos.</li>
          </ul>
        </section>

        <section aria-labelledby="c3"><h2 id="c3">Decisiones de diseño</h2>
          <ul>
            <li><strong>Prioridades explícitas:</strong> accesibilidad, luego comprensión, y mi marca personal de fondo.</li>
            <li><strong>Co‑branding:</strong> el sistema visual de Cognitive Observatory (azul noche, marfil, constelaciones) como base, con lavanda como color del proyecto BécALAS.</li>
            <li><strong>Metáfora del observatorio como juego:</strong> misiones, constelación, bitácora. Cada título poético lleva un subtítulo literal.</li>
            <li><strong>Misión 0 con IA:</strong> presentarse con una infografía, video o cómic generados con IA, y reflexionar sobre qué hubo que corregir. Alfabetización en IA desde la primera actividad.</li>
            <li><strong>Interacción con propósito:</strong> “Lanza un cometa” da preguntas rompehielos para usar en vivo; la constelación de avance muestra el progreso de las sesiones.</li>
          </ul>
        </section>

        <section aria-labelledby="c4"><h2 id="c4">Accesibilidad</h2>
          <ul>
            <li>Atkinson Hyperlegible, diseñada por el Braille Institute para baja visión, en todo el texto de interfaz. La serif Cormorant Garamond solo en títulos de 32 px o más.</li>
            <li>Texto mínimo de 14 px y párrafos de 17–18 px; contraste AA verificado.</li>
            <li>Pestañas y acordeones operables con teclado, foco visible y enlace para saltar al contenido.</li>
            <li>Todas las animaciones (cielo, cursor de cometa, destellos) son decorativas y se apagan con “reducir movimiento”.</li>
          </ul>
        </section>

        <section aria-labelledby="c5"><h2 id="c5">Privacidad</h2>
          <p>El sitio no muestra nombres ni datos de las mentoradas ni de la coordinación del programa. Las metas y la bitácora se guardan solo en el navegador de cada persona.</p>
        </section>

        <section aria-labelledby="c6"><h2 id="c6">Resultados</h2>
          <p className="pending">Pendiente: al cierre de las mentorías (finales de noviembre) agregaré la retroalimentación anónima del grupo.</p>
        </section>

        <section aria-labelledby="c7"><h2 id="c7">Aprendizajes</h2>
          <p className="pending">Pendiente.</p>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-bottom">
          <p>Micrositio diseñado y desarrollado por Wen (Wendy Ramírez) para su grupo de mentoría BécALAS 2026‑2027. Sitio personal de apoyo, no oficial de BécALAS ni de Bécalos. Parte del portafolio UX/UI <strong>Cognitive Observatory</strong>.</p>
          <a href="/">Volver al observatorio →</a>
        </div>
      </footer>
    </>
  );
}
