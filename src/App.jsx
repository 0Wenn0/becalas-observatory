import { useEffect, useRef, useState } from 'react';
import { Starfield } from './Starfield.jsx';
import { CometCursor, sparkleAt } from './CometCursor.jsx';

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
  ['Aquí cabemos todas', 'Cero discriminación, cero acoso. Cada voz cuenta y se escucha con respeto.'],
  ['Lo que se dice aquí, aquí se queda', 'Cuidamos lo que cada una comparte. No grabamos sin el acuerdo de todas.'],
  ['Equivocarse es parte del experimento', 'Preguntar y pedir ayuda no es debilidad: es como se aprende.'],
  ['Nos echamos porras, no competimos', 'Somos aliadas. Celebramos los logros de cada una, grandes o pequeños.'],
  ['Si algo pesa, lo hablamos', 'Si algo te supera, dímelo. Buscamos juntas el apoyo adecuado con el equipo del programa.'],
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


function SectionHeading({ id, label, title, intro, dark }) {
  return (
    <header className={`section-heading ${dark ? 'on-dark' : ''}`}>
      <p className="section-label">{label}</p>
      <h2 id={id}>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </header>
  );
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

function PlanetIcon() {
  return (
    <svg className="planet-icon" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="planet-body" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#E4D8FB" />
          <stop offset="55%" stopColor="#8A5CF0" />
          <stop offset="100%" stopColor="#4E3592" />
        </radialGradient>
      </defs>
      <ellipse className="planet-ring-back" cx="60" cy="62" rx="54" ry="15" fill="none" stroke="#C9B4F7" strokeWidth="5" transform="rotate(-18 60 62)" />
      <circle cx="60" cy="60" r="32" fill="url(#planet-body)" />
      <circle cx="49" cy="50" r="5" fill="#fff" opacity=".35" />
      <circle cx="70" cy="70" r="3.5" fill="#4E3592" opacity=".45" />
      <path d="M8 66 A54 15 0 0 0 112 58" fill="none" stroke="#C9B4F7" strokeWidth="5" strokeLinecap="round" transform="rotate(-18 60 62)" />
      <path className="planet-sparkle" d="M100 16 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#fff" />
    </svg>
  );
}

const navLinks = [
  { id: 'proxima', label: 'Próxima sesión', primary: true },
  { id: 'mision', label: 'Mi misión', primary: true },
  { id: 'sesiones', label: 'Sesiones', primary: true },
  { id: 'herramientas', label: 'Mis herramientas' },
  { id: 'recursos', label: 'Recursos' },
  { id: 'apoyo', label: 'Apoyo' },
];

/* Secciones que no están en el menú se asocian al enlace más cercano para indicar “estás aquí”. */
const sectionToLink = { inicio: '', proxima: 'proxima', mision: 'mision', sesiones: 'sesiones', pausa: 'sesiones', herramientas: 'herramientas', mapa: 'herramientas', bitacora: 'herramientas', recursos: 'recursos', acuerdos: 'apoyo', apoyo: 'apoyo' };

function SiteHeader() {
  const [active, setActive] = useState('');
  const [moreOpen, setMoreOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef(null);
  const moreButtonRef = useRef(null);
  const morePanelRef = useRef(null);

  // “Estás aquí”: resalta el enlace de la sección visible.
  useEffect(() => {
    const sections = Object.keys(sectionToLink).map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(sectionToLink[visible.target.id] ?? '');
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // En celular, el encabezado se esconde al bajar y reaparece al subir.
  useEffect(() => {
    let lastY = window.scrollY;
    const mobile = window.matchMedia('(max-width: 700px)');
    function onScroll() {
      const y = window.scrollY;
      const focusInside = headerRef.current?.contains(document.activeElement);
      if (!mobile.matches || moreOpen || focusInside || y < 120) setHidden(false);
      else if (y > lastY + 6) setHidden(true);
      else if (y < lastY - 6) setHidden(false);
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [moreOpen]);

  // Menú “Más”: se cierra con Esc, al hacer clic afuera o al elegir una opción, y devuelve el foco.
  useEffect(() => {
    if (!moreOpen) return undefined;
    morePanelRef.current?.querySelector('a')?.focus();
    function onKey(event) {
      if (event.key === 'Escape') { setMoreOpen(false); moreButtonRef.current?.focus(); }
    }
    function onClick(event) {
      if (!morePanelRef.current?.contains(event.target) && !moreButtonRef.current?.contains(event.target)) setMoreOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('click', onClick); };
  }, [moreOpen]);

  const link = (item, extra = '') => (
    <a key={item.id} href={`#${item.id}`} className={`nav-link ${extra} ${active === item.id ? 'is-active' : ''}`} aria-current={active === item.id ? 'location' : undefined} onClick={() => setMoreOpen(false)}>{item.label}</a>
  );

  return (
    <header className={`site-header ${hidden ? 'is-hidden' : ''}`} ref={headerRef} onFocus={() => setHidden(false)}>
      <BrandLockup href="#inicio" label="Mentorías BécALAS 2026, grupo de Wen. Ir al inicio" />
      <nav className="main-nav" aria-label="Navegación principal">
        {navLinks.map((item) => link(item, item.primary ? 'is-primary' : 'is-secondary'))}
        <div className="more-wrap">
          <button ref={moreButtonRef} className={`more-button ${navLinks.some((i) => !i.primary && i.id === active) ? 'is-active' : ''}`} type="button" aria-expanded={moreOpen} aria-controls="more-panel" onClick={() => setMoreOpen((v) => !v)}>
            Más <span aria-hidden="true">✦</span>
          </button>
          <div className="more-panel" id="more-panel" ref={morePanelRef} hidden={!moreOpen}>
            {navLinks.filter((i) => !i.primary).map((item) => link(item))}
          </div>
        </div>
      </nav>
    </header>
  );
}

/* ───────── Página principal ───────── */

function Microsite() {
  const [openSession, setOpenSession] = useState('metas');
  const [activeNode, setActiveNode] = useState('intereses');
  const [breathing, setBreathing] = useState(false);
  const [smart, setSmart] = useState(() => readSaved('becalas-smart', initialSmart));
  const [smartCopied, setSmartCopied] = useState('');
  const [activeLogSession, setActiveLogSession] = useState('metas');
  const [log, setLog] = useState(() => readSaved('becalas-log', { metas: {}, trayectoria: {}, empleo: {} }));
  const [savedMessage, setSavedMessage] = useState('');
  const celebrated = useRef(false);
  const previewRef = useRef(null);

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

  async function copySmart(event) {
    const ok = await copyText(smartSentence);
    flash(setSmartCopied, ok ? '¡Copiada! Tráela a la sesión ✨' : 'Selecciona el texto y cópialo manualmente.');
  }

  function openJournal(sessionId) {
    if (sessionId) setActiveLogSession(sessionId);
    document.getElementById('bitacora')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => document.getElementById('journal-discovery')?.focus({ preventScroll: true }), 450);
  }

  function updateCurrentLog(field, value) {
    setLog((previous) => ({ ...previous, [activeLogSession]: { ...(previous[activeLogSession] ?? {}), [field]: value } }));
  }

  function saveJournal(event) {
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
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <SiteHeader />

      <main id="contenido">
        {/* HERO */}
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <Starfield />
          <div className="hero-copy">
            <p className="kicker">Observatorio de mentoría · BécALAS 2026</p>
            <h1 id="hero-title">¡Exploremos juntas! <span aria-hidden="true">🔭</span></h1>
            <p className="hero-lede">Aquí está todo lo de nuestras mentorías: cuándo nos vemos, tu primera misión y herramientas para jugar con tus ideas.</p>
            <blockquote className="hero-quote">No necesitas tener todo resuelto para empezar a construir la trayectoria que deseas. La curiosidad, la constancia y las ganas de aprender abren caminos que hoy ni imaginas.</blockquote>
            <div className="hero-actions">
              <a className="button button-primary" href="#mision">Ver mi primera misión</a>
              <a className="button button-ghost" href="#proxima">Próxima sesión: {nextDefined ? nextSession.dateLabel : 'por definir'}</a>
            </div>
          </div>
        </section>

        {/* PRÓXIMA SESIÓN */}
        <section className="next-session" id="proxima" aria-labelledby="next-title">
          <div className="section-wrap next-grid">
            <div>
              <p className="section-label">Próxima sesión</p>
              <h2 id="next-title">{nextDefined ? nextSession.dateLabel : <>Fecha por definir <span aria-hidden="true">🗓️</span></>}</h2>
              <p className="next-sub">{nextSession.plain} · {nextSession.name}.</p>
              <p className="next-sub">{nextDefined ? 'Por videollamada: el enlace llega por el grupo de WhatsApp.' : 'La acordamos juntas en el grupo de WhatsApp. En cuanto la tengamos, aparece aquí.'}</p>
              <p className="next-sub">Duración: 1 hora · En grupo, con Wen.</p>
            </div>
            <SessionProgress />
          </div>
        </section>

        {/* WEN */}
        <section className="guide-section section-wrap" aria-labelledby="guide-title">
          <div className="guide-avatar" aria-hidden="true">🪐</div>
          <div>
            <SectionHeading id="guide-title" label="Tu guía en este observatorio" title={<>Hola, soy Wen <span aria-hidden="true">👋</span></>} />
            <p className="guide-bio">Soy psicóloga, maestrante en Neuropsicología Clínica y científica de datos. Trabajo donde se cruzan la mente, los datos, la inteligencia artificial y la educación, y me encanta llevar todo eso al impacto público. Por ejemplo, impartí talleres de alfabetización en IA en un programa nacional vinculado a OpenAI en México, con más de 3,000 personas de gobierno, el Congreso y universidades, para que la tecnología llegue a más gente y se use con criterio.</p>
            <p className="guide-bio">Lo que más me mueve es transformar la realidad con ciencia y tecnología: convertir en algo real esos mundos que parecían de ciencia ficción o demasiado lejanos. Soy una eterna aprendiz, fan de la ciencia, el arte, el deporte y las buenas conversaciones. 🪐</p>
            <p className="guide-bio guide-invite">Este es un espacio seguro para explorar juntas: para preguntar sin miedo, equivocarnos, reírnos y descubrir nuevos caminos, nuevas constelaciones y los sueños hacia los que quieres volar. Yo también vengo a aprender de ustedes. <span aria-hidden="true">✨</span></p>
            <ul className="guide-tags" aria-label="Lo que me apasiona"><li>Neurociencia</li><li>Ciencia de datos</li><li>IA</li><li>Educación</li><li>Política pública</li></ul>
          </div>
        </section>

        {/* MISIÓN 0 */}
        <section className="mission-section" id="mision" aria-labelledby="mission-title">
          <div className="section-wrap">
            <SectionHeading
              id="mission-title"
              dark
              label={<>Tu primera misión <span aria-hidden="true">🔭</span></>}
              title="Misión 0: preséntate con IA"
              intro="Antes de la sesión 1, elige un formato, copia el prompt, cambia lo que está entre [corchetes] por tus datos y pégalo en ChatGPT, Gemini o la IA que prefieras. No tiene que quedar perfecto: si sale raro, mejor, ¡de eso platicamos! En la sesión compartimos lo que hiciste y qué tuviste que corregirle a la IA."
            />
            <MissionTabs />
            <p className="privacy-tip">🔒 <strong>Cuida tus datos:</strong> no le compartas a la IA tu dirección, teléfono, CURP ni datos de otras personas. Si no quieres usar tu foto, un avatar ilustrado funciona perfecto.</p>
          </div>
        </section>

        {/* SESIONES */}
        <section className="route-section" id="sesiones" aria-labelledby="sessions-title">
          <div className="section-wrap">
            <SectionHeading id="sessions-title" label="Sesiones" title="Tres noches de observación" intro="Nuestras 3 sesiones de noviembre: nos vemos para platicar, probar cosas y armar planes. Las fechas las acordamos juntas." />
            <div className="session-list">
              {sessions.map((session) => {
                const expanded = openSession === session.id;
                return (
                  <article className={`session ${expanded ? 'is-open' : ''}`} key={session.id}>
                    <h3 className="session-heading">
                      <button className="session-trigger" type="button" aria-expanded={expanded} aria-controls={`session-${session.id}`} onClick={() => setOpenSession(expanded ? '' : session.id)}>
                        <span className="session-number" aria-hidden="true">{session.number}</span>
                        <span className="session-title-group">
                          <span className="session-eyebrow">{session.plain}{session.dateLabel === 'Por definir' ? '' : ` · ${session.dateLabel}`}</span>
                          <span className="session-title">{session.name}{session.emoji && <span aria-hidden="true"> {session.emoji}</span>}</span>
                        </span>
                        <span className="session-toggle" aria-hidden="true">{expanded ? '−' : '+'}</span>
                      </button>
                    </h3>
                    <div className="session-detail" id={`session-${session.id}`} hidden={!expanded}>
                      <p className="session-objective">{session.objective}</p>
                      <div className="session-detail-grid">
                        <div>
                          <h4>En esta sesión vamos a…</h4>
                          <ul className="plain-list">{session.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                          <h4>Trae contigo…</h4>
                          <ul className="plain-list">{session.bring.map((b) => <li key={b}>{b}</li>)}</ul>
                        </div>
                        <aside className="session-aside">
                          <h4>Preguntas para ir pensando</h4>
                          <ul className="plain-list">{session.questions.map((q) => <li key={q}>{q}</li>)}</ul>
                        </aside>
                      </div>
                      <button className="text-button" type="button" onClick={() => openJournal(session.id)}>Anotar en mi bitácora <span aria-hidden="true">↘</span></button>
                    </div>
                  </article>
                );
              })}
            </div>
            <CometButton />
          </div>
        </section>

        {/* RESPIRA */}
        <section className="breath-section" id="pausa" aria-labelledby="breath-title">
          <div className="breath-copy">
            <p className="section-label">Opcional, sin presión <span aria-hidden="true">🌬️</span></p>
            <h2 id="breath-title">Antes de despegar, respira</h2>
            <p>Un minuto para llegar de verdad. Puedes cerrar los ojos o mirar un punto fijo. No hay una forma correcta de sentirse.</p>
          </div>
          <div className="breath-control">
            <button className={`planet-button ${breathing ? 'is-breathing' : ''}`} type="button" aria-expanded={breathing} aria-controls="breath-guide" onClick={() => setBreathing((v) => !v)}>
              <PlanetIcon />
              <span className="planet-label">{breathing ? 'Cerrar la guía' : 'Toca el planeta para empezar'}</span>
            </button>
            <div className="breath-guide" id="breath-guide" hidden={!breathing}>
              <ol>
                <li>Ponte cómoda, con la espalda derecha.</li>
                <li>Inhala lento por la nariz… y suelta el aire despacito.</li>
                <li>Siente tus pies en el piso y el peso de tu cuerpo.</li>
                <li>¿Cómo llegas hoy? No tienes que decirlo en voz alta.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* HERRAMIENTAS */}
        <section className="smart-section section-wrap" id="herramientas" aria-labelledby="smart-title">
          <div className="smart-intro">
            <p className="section-label">Mis herramientas · Sesión 1</p>
            <h2 id="smart-title">Tu meta, pero aterrizada</h2>
            <p>Escríbela como te salga; abajo se va armando sola. Nadie más la ve: se guarda solo en tu celular o compu.</p>
            <button className="text-button" type="button" onClick={clearSmart}>Borrar mis respuestas <span aria-hidden="true">↺</span></button>
          </div>
          <div className="smart-builder">
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
              <p>{smartSentence || 'Empieza por “¿Qué quieres lograr?” y aquí va apareciendo 👣'}</p>
            </div>
            <div className="prompt-actions">
              <button className="button button-primary" type="button" onClick={copySmart} disabled={!smartSentence} aria-describedby="smart-copy-hint">Copiar mi meta</button>
              {!smartSentence && <p className="field-prompt" id="smart-copy-hint">Se activa cuando escribas qué quieres lograr.</p>}
              <p className="status-text" role="status" aria-live="polite">{smartCopied}</p>
            </div>
          </div>
        </section>

        <section className="constellation-section" id="mapa" aria-labelledby="map-title">
          <div className="section-wrap constellation-layout">
            <div className="constellation-copy">
              <SectionHeading id="map-title" dark label="Mis herramientas" title={<>Tu constelación <span aria-hidden="true">✨</span></>} intro="Conecta lo que te gusta, lo que sabes hacer y lo que quieres probar. Toca un punto y contesta en tu cabeza (o en tu bitácora). No hay respuestas correctas, solo pistas." />
              <div className="node-selector" role="group" aria-label="Elige un punto de tu constelación">
                {nodes.map((node) => <button type="button" key={node.id} className={activeNode === node.id ? 'node-tab is-selected' : 'node-tab'} aria-pressed={activeNode === node.id} onClick={() => setActiveNode(node.id)}>{node.label}</button>)}
        </div>
              <div className="node-prompt" aria-live="polite"><span>{currentNode.label}</span><p>{currentNode.prompt}</p></div>
            </div>
            <div className="constellation-map" aria-hidden="true">
              <img src="/observatory-map.webp" alt="" loading="lazy" decoding="async" width="1200" height="614" />
              {nodes.map((node) => <span key={node.id} className={`map-node ${node.position} ${activeNode === node.id ? 'is-active' : ''}`}>{node.label}</span>)}
            </div>
          </div>
        </section>

        {/* BITÁCORA */}
        <section className="journal-section" id="bitacora" aria-labelledby="journal-title">
          <div className="section-wrap journal-layout">
            <div className="journal-intro">
              <SectionHeading id="journal-title" label="Mis herramientas" title="Tu bitácora de exploradora" intro="Después de cada sesión: ¿qué descubriste?, ¿qué te llevas?, ¿qué vas a probar esta semana?" />
              <p className="privacy-note">🔒 Lo que escribas se queda en tu celular o compu. Ni yo lo veo.</p>
            </div>
            <div className="journal-form">
              <div className="field"><label htmlFor="journal-session">Sesión</label><select id="journal-session" value={activeLogSession} onChange={(e) => setActiveLogSession(e.target.value)}>{sessions.map((session) => <option value={session.id} key={session.id}>{session.plain}</option>)}</select></div>
              <div className="field"><label htmlFor="journal-discovery">¿Qué descubrí?</label><textarea id="journal-discovery" value={currentLog.discovery ?? ''} onChange={(e) => updateCurrentLog('discovery', e.target.value)} placeholder="Una idea, una fortaleza, algo que no había visto…" rows="3" /></div>
              <div className="field"><label htmlFor="journal-learning">¿Qué me llevo?</label><textarea id="journal-learning" value={currentLog.learning ?? ''} onChange={(e) => updateCurrentLog('learning', e.target.value)} placeholder="Algo que aprendí o una pregunta que sigue dando vueltas…" rows="3" /></div>
              <div className="field"><label htmlFor="journal-commitment">¿Qué voy a probar esta semana?</label><textarea id="journal-commitment" value={currentLog.commitment ?? ''} onChange={(e) => updateCurrentLog('commitment', e.target.value)} placeholder="Un pasito concreto y posible 👣" rows="2" /></div>
              <div className="journal-actions"><button className="button button-dark" type="button" onClick={saveJournal}>Guardar mis notas</button><button className="quiet-button" type="button" onClick={clearJournal}>Borrar esta sesión</button></div>
              <p className="status-text" role="status" aria-live="polite">{savedMessage}</p>
            </div>
          </div>
        </section>

        {/* RECURSOS */}
        <section className="resources-section section-wrap" id="recursos" aria-labelledby="resources-title">
          <SectionHeading id="resources-title" label="Recursos" title="Instrumentos del observatorio" intro="Cosas útiles para antes y después de cada sesión." />
          <div className="resource-rows">
            <article className="resource-row"><span className="resource-index" aria-hidden="true">A</span><div><h3>Respirar antes de empezar</h3><p>Un minuto para bajar revoluciones antes de una sesión, un examen o una entrevista.</p></div><a href="#pausa">Ir a la pausa</a></article>
            <article className="resource-row"><span className="resource-index" aria-hidden="true">B</span><div><h3>Metas que sí se cumplen</h3><p>Usa la herramienta SMART y pega tu meta donde la veas diario (fondo de pantalla, espejo, agenda).</p></div><a href="#herramientas">Abrir mi meta</a></article>
            <article className="resource-row"><span className="resource-index" aria-hidden="true">C</span><div><h3>Hablar en público sin temblar (tanto)</h3><p>Charla TED de Amy Cuddy sobre cómo el lenguaje corporal cambia cómo te sientes. Para la sesión 3.</p></div><a href="https://youtu.be/Ks-_Mh1QhMc" target="_blank" rel="noreferrer">Ver la charla<span className="sr-only"> (se abre en otra pestaña)</span></a></article>
            <article className="resource-row"><span className="resource-index" aria-hidden="true">D</span><div><h3>Metas a largo plazo</h3><p>Una guía corta para dividir un objetivo grande en pasos.</p></div><a href="https://asana.com/es/resources/long-term-goals" target="_blank" rel="noreferrer">Leer la guía<span className="sr-only"> (se abre en otra pestaña)</span></a></article>
          </div>
        </section>

        {/* ACUERDOS */}
        <section className="agreements-section" id="acuerdos" aria-labelledby="agreements-title">
          <div className="section-wrap">
            <SectionHeading id="agreements-title" label="Para cuidar el espacio" title="Nuestras reglas del cielo" intro="Lo que hace que este sea un lugar seguro para todas." />
            <div className="agreement-list">{agreements.map(([title, text], index) => <article className="agreement" key={title}><span className="agreement-index" aria-hidden="true">✦ 0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          </div>
        </section>

        {/* APOYO */}
        <section className="contact-section" id="apoyo" aria-labelledby="support-title">
          <div className="section-wrap">
            <SectionHeading id="support-title" label="Apoyo" title="¿Algo te está costando?" intro="Escríbeme por el grupo de WhatsApp y lo vemos juntas. Si hace falta, te ayudo a contactar al equipo del programa." />
            <p className="contact-line"><strong>Equipo de seguimiento BécALAS:</strong> contacto@becalasonline.mx</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-cta">
            <p className="footer-title">¿Te quedó alguna duda? <span aria-hidden="true">💬</span></p>
            <p>Escríbeme por el grupo de WhatsApp. No hay preguntas tontas, solo preguntas que todavía no hacemos.</p>
          </div>
          <nav className="footer-nav" aria-label="Enlaces rápidos">
            <p className="footer-title">Ir a…</p>
            <ul>
              {navLinks.map((link) => <li key={link.id}><a href={`#${link.id}`}>{link.label}</a></li>)}
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>Micrositio diseñado y desarrollado por Wen (Wendy Ramírez) para su grupo de mentoría BécALAS 2026‑2027. Es un sitio personal de apoyo, no un sitio oficial de BécALAS ni de Bécalos. Forma parte del portafolio de diseño UX/UI <strong>Cognitive Observatory</strong>.</p>
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
