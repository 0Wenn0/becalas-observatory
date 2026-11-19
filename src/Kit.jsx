import { useEffect, useState } from 'react';
import { StarDivider, EngravingMoon, EngravingConstellation } from './Chapters.jsx';

/* Kits prácticos de las Noches 2 y 3: páginas aparte (#kit-desarrollo y #kit-cv), estilo libro.
   Todo lo que se escribe se guarda solo en el navegador (localStorage). */

function readSaved(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function saveLocal(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* opcional */ }
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}
function useFlash() {
  const [msg, setMsg] = useState('');
  return [msg, (m) => { setMsg(m); window.setTimeout(() => setMsg(''), 3200); }];
}
function useSaved(key, fallback) {
  const [value, setValue] = useState(() => readSaved(key, fallback));
  useEffect(() => { saveLocal(key, value); }, [key, value]);
  return [value, setValue];
}
function downloadText(name, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function HowTo({ steps, note }) {
  return (
    <div className="howto">
      <p className="howto-title"><span aria-hidden="true">🧭</span> Cómo se usa</p>
      <ol>{steps.map((s) => <li key={s}>{s}</li>)}</ol>
      {note && <p className="howto-note">{note}</p>}
    </div>
  );
}

function CopyCard({ title, text, hint }) {
  const [msg, flash] = useFlash();
  return (
    <div className="kit-copy">
      <p className="example-title">{title}</p>
      {hint && <p className="field-prompt">{hint}</p>}
      <pre className="kit-template">{text}</pre>
      <div className="prompt-actions">
        <button className="button button-primary" type="button" onClick={async () => flash((await copyText(text)) ? '¡Copiado! Pégalo y cambia lo que va entre corchetes.' : 'Selecciona el texto y cópialo.')}>Copiar</button>
        <p className="status-text" role="status" aria-live="polite">{msg}</p>
      </div>
    </div>
  );
}

function PageHead({ crumb, Art, kicker, title, sub, id }) {
  return (
    <>
      <nav className="crumb" aria-label="Ubicación">
        <a href="#inicio">← Índice</a><span aria-hidden="true"> / </span><a href="#herramientas">Herramientas</a><span aria-hidden="true"> / </span><span aria-current="page">{crumb}</span>
      </nav>
      <header className="chapter-hero">
        <span className="chapter-art"><Art /></span>
        <p className="book-kicker">{kicker}</p>
        <h1 id={id} tabIndex={-1}>{title}</h1>
        <p className="chapter-sub">{sub}</p>
      </header>
      <StarDivider />
    </>
  );
}

const SHRINK_WORDS = ['solo', 'sólo', 'pero', 'tuve suerte', 'suerte', 'ayudé', 'un poco', 'participé', 'nada más', 'apenas'];
function shrinkWordsIn(text) {
  const t = ` ${text.toLowerCase()} `;
  return SHRINK_WORDS.filter((w) => new RegExp(`[^a-záéíóúñ]${w}[^a-záéíóúñ]`).test(t));
}

/* ═════════════ NOCHE 2 · Kit de desarrollo profesional ═════════════ */

const curiosityMsg = `Hola, [nombre]. Soy [tu nombre], estudiante de [carrera] en [universidad]. Vi tu trabajo en [lugar o proyecto] y me interesa mucho [tema]. ¿Te puedo hacer 3 preguntas en una llamada de 15 minutos o por aquí, cuando te acomode? Gracias por leerme.`;
const mentorMsg = `Hola, [nombre]. Admiro cómo [algo concreto que hizo]. Estoy trabajando en [tu meta] y me ayudaría mucho tu guía. ¿Aceptarías platicar una vez al mes durante [tiempo]? Yo llevo preguntas concretas para aprovechar tu tiempo.`;
const thanksMsg = `Hola, [nombre]. Gracias por tu tiempo de [día]. Me quedo con [una idea concreta que te dio] y ya [algo que hiciste con ella]. Si te parece, te cuento cómo me va en unas semanas.`;
const curiosityQuestions = ['¿Cómo llegaste a donde estás hoy?', '¿Qué te hubiera gustado saber cuando estabas en la universidad?', '¿Qué me recomiendas hacer este semestre si quiero llegar a algo parecido?'];

const routeRows = [
  ['beca', 'Beca o apoyo', 'Ej. Convocatoria de movilidad', 'Fecha de cierre'],
  ['practica', 'Práctica o empleo', 'Ej. Alerta de «becario análisis de datos»', 'Fecha de revisión'],
  ['comunidad', 'Comunidad o voluntariado', 'Ej. Grupo de mujeres en ciencia', 'Primer evento'],
  ['curso', 'Curso', 'Ej. Curso gratuito de Excel', 'Fecha de inicio'],
  ['persona', 'Persona', 'Ej. Egresada que trabaja en investigación', 'Fecha del mensaje'],
];
const emptyRoute = { meta: '', rows: Object.fromEntries(routeRows.map(([id]) => [id, { what: '', date: '', done: false }])), review: '' };

function RutaSemestre() {
  const [route, setRoute] = useSaved('becalas-ruta', emptyRoute);
  const [msg, flash] = useFlash();
  const rows = { ...emptyRoute.rows, ...(route.rows ?? {}) };
  const setRow = (id, field, value) => setRoute((r) => ({ ...r, rows: { ...rows, [id]: { ...rows[id], [field]: value } } }));
  const text = [
    `MI RUTA DEL SEMESTRE`,
    route.meta && `Mi meta: ${route.meta}`,
    '',
    ...routeRows.map(([id, label]) => rows[id].what ? `${rows[id].done ? '✓' : '☐'} ${label}: ${rows[id].what}${rows[id].date ? ` · ${rows[id].date}` : ''}` : null),
    route.review && '', route.review && `Mi revisión semanal: ${route.review}`,
  ].filter((x) => x !== null && x !== false).join('\n');
  const hasContent = route.meta || routeRows.some(([id]) => rows[id].what);
  return (
    <div className="tool-grid">
      <HowTo steps={['Escribe tu meta en una frase.', 'Anota una oportunidad de cada tipo y su fecha.', 'Marca ✓ cuando la hagas. Revisa tu ruta 15 minutos cada semana.']} note="Se guarda sola en tu navegador. Descárgala o cópiala para tenerla a la mano." />
      <div className="worksheet">
        <div className="worksheet-head">
          <p className="worksheet-title"><span aria-hidden="true">✎</span> Mi ruta del semestre</p>
          <button className="quiet-button" type="button" onClick={() => { setRoute(emptyRoute); flash('Listo, ruta en blanco.'); }}>Borrar</button>
        </div>
        <div className="field">
          <label htmlFor="ruta-meta">Mi meta, en una frase</label>
          <input id="ruta-meta" value={route.meta ?? ''} onChange={(e) => setRoute((r) => ({ ...r, meta: e.target.value }))} placeholder="Ej. Conseguir prácticas en análisis de datos antes del 30 de abril" />
        </div>
        <div className="route-rows">
          {routeRows.map(([id, label, example, dateLabel]) => (
            <fieldset className="route-row" key={id}>
              <legend>{label}</legend>
              <label className="sr-only" htmlFor={`ruta-${id}`}>{label}: qué</label>
              <input id={`ruta-${id}`} value={rows[id].what} onChange={(e) => setRow(id, 'what', e.target.value)} placeholder={example} />
              <label className="sr-only" htmlFor={`ruta-${id}-fecha`}>{dateLabel}</label>
              <input id={`ruta-${id}-fecha`} type="date" value={rows[id].date} onChange={(e) => setRow(id, 'date', e.target.value)} aria-label={dateLabel} title={dateLabel} />
              <label className="route-done"><input type="checkbox" checked={rows[id].done} onChange={(e) => setRow(id, 'done', e.target.checked)} /> Hecho</label>
            </fieldset>
          ))}
        </div>
        <div className="field">
          <label htmlFor="ruta-review">Mi revisión semanal (día y hora)</label>
          <input id="ruta-review" value={route.review ?? ''} onChange={(e) => setRoute((r) => ({ ...r, review: e.target.value }))} placeholder="Ej. Domingos, 7:00 p. m., 15 minutos" />
        </div>
        <div className="prompt-actions">
          <button className="button button-primary" type="button" disabled={!hasContent} onClick={async () => flash((await copyText(text)) ? '¡Copiada!' : 'No pude copiarla.')}>Copiar mi ruta</button>
          <button className="button button-dark" type="button" disabled={!hasContent} onClick={() => { downloadText('mi-ruta-del-semestre.txt', text); flash('¡Descargada! Búscala en tus descargas.'); }}>Descargar</button>
          <p className="status-text" role="status" aria-live="polite">{msg}</p>
        </div>
      </div>
    </div>
  );
}

const emptyAchievement = { area: 'Escuela', what: '', result: '' };
function RegistroLogros() {
  const [list, setList] = useSaved('becalas-logros', []);
  const [draft, setDraft] = useState(emptyAchievement);
  const [msg, flash] = useFlash();
  const warn = shrinkWordsIn(`${draft.what} ${draft.result}`);
  const add = () => {
    if (!draft.what.trim()) return;
    setList((l) => [{ ...draft, id: Date.now() }, ...l]);
    setDraft({ ...emptyAchievement, area: draft.area });
    flash('¡Guardado! Un logro más en tu registro ✨');
  };
  const text = ['MI REGISTRO DE LOGROS', '', ...list.map((a) => `• [${a.area}] ${a.what}${a.result ? ` → ${a.result}` : ''}`)].join('\n');
  return (
    <div className="tool-grid">
      <HowTo steps={['Escribe qué hiciste, empezando con un verbo: organicé, diseñé, coordiné…', 'Anota el resultado: para cuántas personas, qué cambió, qué te reconocieron.', 'Junta al menos 4: en la Noche 3 se vuelven tu CV y tus historias STAR.']} note="Todo cuenta: escuela, trabajo, familia, comunidad, voluntariado." />
      <div className="worksheet">
        <div className="worksheet-head"><p className="worksheet-title"><span aria-hidden="true">✎</span> Mi registro de logros</p><span className="field-prompt">{list.length} {list.length === 1 ? 'logro' : 'logros'}</span></div>
        <div className="field">
          <label htmlFor="logro-area">Ámbito</label>
          <select id="logro-area" value={draft.area} onChange={(e) => setDraft((d) => ({ ...d, area: e.target.value }))}>
            {['Escuela', 'Trabajo', 'Voluntariado', 'Familia', 'Comunidad', 'Proyecto propio', 'Otro'].map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="logro-what">¿Qué hiciste?</label>
          <span className="field-prompt" id="logro-what-hint">Empieza con un verbo en pasado.</span>
          <textarea id="logro-what" rows="2" aria-describedby="logro-what-hint" value={draft.what} onChange={(e) => setDraft((d) => ({ ...d, what: e.target.value }))} placeholder="Ej. Organicé la feria de ciencias de mi facultad" />
        </div>
        <div className="field">
          <label htmlFor="logro-result">¿Qué resultado tuvo?</label>
          <textarea id="logro-result" rows="2" value={draft.result} onChange={(e) => setDraft((d) => ({ ...d, result: e.target.value }))} placeholder="Ej. 12 proyectos y 200 visitantes" />
        </div>
        {warn.length > 0 && <p className="kit-warn" role="status">Ojo: «{warn.join('», «')}» te hace ver más pequeña. ¿Lo puedes decir sin esa palabra?</p>}
        <div className="prompt-actions">
          <button className="button button-primary" type="button" onClick={add} disabled={!draft.what.trim()}>Guardar logro</button>
          <button className="button button-dark" type="button" disabled={!list.length} onClick={async () => flash((await copyText(text)) ? '¡Copiado tu registro!' : 'No pude copiarlo.')}>Copiar todo</button>
          <p className="status-text" role="status" aria-live="polite">{msg}</p>
        </div>
        {list.length > 0 && (
          <ul className="achievement-list">
            {list.map((a) => (
              <li key={a.id}>
                <span className="achievement-area">{a.area}</span>
                <span><b>{a.what}</b>{a.result && <> → {a.result}</>}</span>
                <button className="quiet-button" type="button" aria-label={`Borrar el logro: ${a.what}`} onClick={() => setList((l) => l.filter((x) => x.id !== a.id))}>Borrar</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function KitDesarrollo() {
  return (
    <div className="book">
      <article className="chapter chapter-wide section-wrap guia-smart kit-page" aria-labelledby="view-kit2-title">
        <PageHead crumb="Kit de la Noche 2" Art={EngravingMoon} kicker="Noche 2 · Herramientas" title="Tu kit de desarrollo profesional" sub="Mensajes listos, tu ruta del semestre y tu registro de logros" id="view-kit2-title" />
        <div className="chapter-body">
          <nav className="tool-jump" aria-label="Ir a una herramienta">
            <a href="#donde-buscar">Dónde buscar</a><a href="#mensajes">Mensajes</a><a href="#ruta">Mi ruta</a><a href="#logros">Mis logros</a>
          </nav>

          <section className="chapter-section" id="donde-buscar" aria-labelledby="kit2-buscar">
            <h2 id="kit2-buscar" className="block-title">Dónde buscar</h2>
            <p>Regla de oro: <strong>guarda la fecha de cierre, no solo el enlace.</strong> Y filtra todo con tu meta: ¿esto me acerca a ella?</p>
            <div className="example-grid">
              <div className="example-card"><p className="example-title"><span aria-hidden="true">🎓</span> Becas y apoyos</p><p>Becas de tu universidad, movilidad e intercambio, posgrado e idiomas, fundaciones y empresas. Revisa requisitos, fecha de cierre y qué piden escribir.</p></div>
              <div className="example-card"><p className="example-title"><span aria-hidden="true">💼</span> Prácticas y primer empleo</p><p>Bolsa de tu universidad, LinkedIn, OCC e Indeed. Busca «becario», «practicante» o «trainee» + tu área y crea una alerta.</p></div>
              <div className="example-card"><p className="example-title"><span aria-hidden="true">🤝</span> Voluntariado y comunidades</p><p>Grupos de mujeres en tu área, voluntariado presencial o en línea, capítulos estudiantiles. Unas horas al mes también cuentan.</p></div>
              <div className="example-card"><p className="example-title"><span aria-hidden="true">🛠️</span> Cursos gratuitos</p><p>Que den constancia, que sean gratis o con ayuda financiera y que se relacionen con tu meta. Uno a la vez.</p></div>
            </div>
            <p className="field-prompt">La lista con convocatorias verificadas y sus fechas te llega por el grupo.</p>
          </section>

          <section className="chapter-section" id="mensajes" aria-labelledby="kit2-mensajes">
            <h2 id="kit2-mensajes" className="block-title">Mensajes listos para personas reales</h2>
            <p>Una red se construye con preguntas, no con favores. Cambia lo que va entre [corchetes] y envíalo en las próximas 48 horas.</p>
            <div className="kit-copy-grid">
              <CopyCard title="Pedir una conversación de curiosidad" text={curiosityMsg} hint="15 minutos, por llamada o por mensaje." />
              <CopyCard title="Pedir mentoría" text={mentorMsg} hint="Para alguien a quien admiras y que ya conoces un poco." />
              <CopyCard title="Dar las gracias después" text={thanksMsg} hint="Lo que hace que te recuerden." />
            </div>
            <p className="example-title" style={{ marginTop: 20 }}>Tres preguntas para tu conversación</p>
            <ul className="if-then">{curiosityQuestions.map((q) => <li key={q}>{q}</li>)}</ul>
          </section>

          <section className="chapter-section" id="ruta" aria-labelledby="kit2-ruta">
            <h2 id="kit2-ruta" className="block-title">Mi ruta del semestre</h2>
            <RutaSemestre />
          </section>

          <section className="chapter-section" id="logros" aria-labelledby="kit2-logros">
            <h2 id="kit2-logros" className="block-title">Mi registro de logros</h2>
            <RegistroLogros />
          </section>
        </div>
        <StarDivider />
        <nav className="chapter-nav" aria-label="Siguiente">
          <a className="chapter-nav-next" href="#kit-cv">Siguiente: Tu kit para CV y entrevistas →</a>
        </nav>
      </article>
    </div>
  );
}

/* ═════════════ NOCHE 3 · Kit para CV y entrevistas ═════════════ */

const harvardChecks = [
  'Cabe en 1 página.',
  'Una sola columna, sin tablas, gráficos ni íconos.',
  'Sin foto, CURP, edad ni dirección completa.',
  'Orden: contacto → perfil → educación → experiencia, proyectos y voluntariado → habilidades → idiomas.',
  'Perfil de 2 o 3 líneas: quién eres, qué buscas, qué aportas.',
  'Cada viñeta empieza con un verbo en pasado y dice un resultado.',
  'Fechas en el mismo formato, a la derecha.',
  'Sin palabras que te hacen pequeña (ayudé, solo, participé en).',
];

const prompts = [
  ['1 · Convierte funciones en logros', `Esta es una experiencia de mi CV: [pega la viñeta o cuéntala como la dirías].
Reescríbela con la fórmula: verbo de acción en pasado + qué hice + resultado.
Antes de reescribir, hazme hasta 3 preguntas para encontrar el resultado.
No inventes cifras ni datos. Dame 2 versiones: una con cifra (si te la doy) y otra sin cifra.`],
  ['2 · Adapta mi CV a esta vacante', `Esta es la vacante: [pega el texto]. Este es mi CV: [pega el texto].
Dime las 5 palabras clave más importantes de la vacante, cuáles ya están en mi CV
y cuáles podría agregar solo si son verdad. Reescribe mi perfil de 3 líneas para esta vacante.
Termina con una línea honesta: qué tan bien encajo y qué me falta.`],
  ['3 · Encuentra dónde me hago pequeña', `Revisa mi CV: [pega el texto].
Señala las palabras o frases que minimizan lo que hice (por ejemplo: ayudé, solo, participé en, un poco)
y propón una versión más precisa de cada una, sin exagerar ni inventar.`],
  ['4 · Dime qué le falta (formato Harvard)', `Revisa mi CV contra el formato Harvard: 1 página, una columna, sin foto,
orden contacto → perfil → educación → experiencia, proyectos y voluntariado → habilidades → idiomas,
viñetas con verbo + qué hice + resultado.
Dime primero 2 cosas que ya funcionan y después las 3 mejoras más importantes, con el antes y el después.
No inventes información: si falta algo, pregúntame.`],
];

function HarvardCheck() {
  const [checked, setChecked] = useSaved('becalas-harvard', []);
  const done = harvardChecks.filter((c) => checked.includes(c)).length;
  return (
    <div className="tool-grid">
      <div>
        <HowTo steps={['Descarga la plantilla y llénala, o abre tu CV.', 'Revisa cada punto y márcalo.', 'Lo que falte, arréglalo con los prompts de abajo.']} />
        <p className="guia-link"><a href="/plantilla-cv-harvard.docx" download>Descargar la plantilla en Word ↓</a></p>
      </div>
      <div className="worksheet">
        <div className="worksheet-head"><p className="worksheet-title"><span aria-hidden="true">✎</span> Revisa tu CV</p><span className="field-prompt">{done} de {harvardChecks.length}</span></div>
        <ul className="kit-checklist">
          {harvardChecks.map((c) => (
            <li key={c}><label><input type="checkbox" checked={checked.includes(c)} onChange={(e) => setChecked((l) => e.target.checked ? [...l, c] : l.filter((x) => x !== c))} /> {c}</label></li>
          ))}
        </ul>
        {done === harvardChecks.length && <p className="status-text" role="status">¡Tu CV pasa la revisión Harvard! ✨</p>}
      </div>
    </div>
  );
}

const starFields = [
  ['headline', 'Titular', 'El resultado en una oración. Es lo primero que dices.', 'Ej. Organicé una feria de ciencias con 12 proyectos y 200 visitantes.'],
  ['situation', 'Situación', '¿Dónde y cuándo?', 'Ej. En 5.º semestre, mi facultad no tenía un espacio para mostrar proyectos.'],
  ['task', 'Tarea', '¿Qué te tocaba resolver?', 'Ej. Me pidieron coordinar la feria en un mes, sin presupuesto.'],
  ['action', 'Acción', '¿Qué hiciste tú? (lo más largo, en primera persona)', 'Ej. Armé un equipo de 4, conseguí el auditorio y convoqué por redes…'],
  ['result', 'Resultado', '¿Qué cambió?', 'Ej. Participaron 12 proyectos y la facultad la volvió anual.'],
  ['learning', 'Aprendizaje', 'Aprendí que…', 'Ej. Aprendí que pedir ayuda a tiempo multiplica lo que puedes lograr.'],
];
function StarBuilder() {
  const [star, setStar] = useSaved('becalas-star', {});
  const [msg, flash] = useFlash();
  const v = (k) => (star[k] ?? '').trim();
  const story = [v('headline'), v('situation'), v('task'), v('action'), v('result'), v('learning') && (v('learning').toLowerCase().startsWith('aprend') ? v('learning') : `Aprendí que ${v('learning')}`)].filter(Boolean).join(' ');
  const firstWords = v('action').split(/[,.;]/).map((x) => x.trim()).filter(Boolean).slice(0, 4);
  const cheat = story ? `ACORDEÓN\nEmpiezo: ${v('headline') || '…'}\nPalabras clave: ${firstWords.join(' · ') || '…'}\nCierro: ${v('learning') || v('result') || '…'}` : '';
  const warn = shrinkWordsIn(Object.values(star).join(' '));
  return (
    <div className="tool-grid">
      <HowTo steps={['Elige un logro de tu registro.', 'Llena cada parte con frases cortas, empezando por el titular.', 'Léela en voz alta: debe durar entre 1:30 y 2 minutos.']} note="Memoriza solo la primera frase, 4 palabras clave y el cierre. Lo demás sale solo." />
      <div className="worksheet">
        <div className="worksheet-head">
          <p className="worksheet-title"><span aria-hidden="true">✎</span> Mi historia STAR</p>
          <button className="quiet-button" type="button" onClick={() => { setStar({}); flash('Historia en blanco.'); }}>Borrar</button>
        </div>
        <div className="smart-fields">
          {starFields.map(([key, title, q, ex]) => (
            <div className="field" key={key}>
              <label htmlFor={`star-${key}`}>{title}</label>
              <span className="field-prompt" id={`star-${key}-hint`}>{q}</span>
              <textarea id={`star-${key}`} rows={key === 'action' ? 3 : 2} aria-describedby={`star-${key}-hint`} value={star[key] ?? ''} onChange={(e) => setStar((s) => ({ ...s, [key]: e.target.value }))} placeholder={ex} />
            </div>
          ))}
        </div>
        {warn.length > 0 && <p className="kit-warn" role="status">Ojo: «{warn.join('», «')}» te hace ver más pequeña.</p>}
        <div className={`goal-preview ${story ? 'is-complete' : ''}`}>
          <span className="goal-preview-label">{story ? 'Tu historia' : 'Tu historia se arma aquí'}</span>
          <p>{story || 'Empieza por el titular 👣'}</p>
          {cheat && <pre className="kit-template">{cheat}</pre>}
        </div>
        <div className="prompt-actions">
          <button className="button button-primary" type="button" disabled={!story} onClick={async () => flash((await copyText(`${story}\n\n${cheat}`)) ? '¡Copiada!' : 'No pude copiarla.')}>Copiar mi historia</button>
          <p className="status-text" role="status" aria-live="polite">{msg}</p>
        </div>
      </div>
    </div>
  );
}

const applyQs = [
  ['reqs', '¿Cumples buena parte de los requisitos, aunque no todos?'],
  ['goal', '¿Te acerca a tu meta o te emociona?'],
  ['story', '¿Puedes contar una historia que demuestre que puedes hacerlo?'],
];
function AplicoCheck() {
  const [ans, setAns] = useState({});
  const yes = applyQs.filter(([k]) => ans[k] === 'si').length;
  const answered = Object.keys(ans).length === applyQs.length;
  const verdict = !answered ? '' : yes >= 2 ? '¡Aplica! Un «no» es un dato, no un veredicto.' : ans.reqs === 'no' && ans.goal === 'si' ? 'Aplica de todos modos o pide una conversación de curiosidad con alguien de ese lugar: te emociona, y eso cuenta.' : 'Quizá esta no. Guarda la vacante: te dice qué aprender para la siguiente.';
  return (
    <div className="worksheet">
      <div className="worksheet-head"><p className="worksheet-title"><span aria-hidden="true">✎</span> ¿Aplico o no?</p></div>
      {applyQs.map(([k, q]) => (
        <fieldset className="apply-q" key={k}>
          <legend>{q}</legend>
          {[['si', 'Sí'], ['no', 'No']].map(([val, label]) => (
            <label key={val}><input type="radio" name={`aplico-${k}`} checked={ans[k] === val} onChange={() => setAns((a) => ({ ...a, [k]: val }))} /> {label}</label>
          ))}
        </fieldset>
      ))}
      <p className="status-text" role="status" aria-live="polite">{verdict}</p>
    </div>
  );
}

export function KitCv() {
  return (
    <div className="book">
      <article className="chapter chapter-wide section-wrap guia-smart kit-page" aria-labelledby="view-kit3-title">
        <PageHead crumb="Kit de la Noche 3" Art={EngravingConstellation} kicker="Noche 3 · Herramientas" title="Tu kit para CV y entrevistas" sub="Formato Harvard, prompts, tu historia STAR y cuándo aplicar" id="view-kit3-title" />
        <div className="chapter-body">
          <nav className="tool-jump" aria-label="Ir a una herramienta">
            <a href="#harvard">CV Harvard</a><a href="#prompts">Prompts</a><a href="#habla-claro">Habla claro</a><a href="#star">Mi STAR</a><a href="#aplico">¿Aplico?</a><a href="#asistente">Asistente</a>
          </nav>

          <section className="chapter-section" id="harvard" aria-labelledby="kit3-harvard">
            <h2 id="kit3-harvard" className="block-title">Tu CV en formato Harvard</h2>
            <HarvardCheck />
          </section>

          <section className="chapter-section" id="prompts" aria-labelledby="kit3-prompts">
            <h2 id="kit3-prompts" className="block-title">Mejora tu CV con IA: 4 prompts</h2>
            <p>Funcionan en Gemini, ChatGPT o Claude. Regla de oro: <strong>la IA no inventa nada. Si no pasó, se borra.</strong></p>
            <div className="kit-copy-grid">
              {prompts.map(([t, p]) => <CopyCard key={t} title={t} text={p} />)}
            </div>
          </section>

          <section className="chapter-section" id="habla-claro" aria-labelledby="kit3-claro">
            <h2 id="kit3-claro" className="block-title">Habla claro: conclusión primero</h2>
            <p>La primera oración <strong>responde la pregunta</strong>. Lo demás la sostiene.</p>
            <div className="example-grid">
              <div className="example-card"><p className="example-title">Titular de una respiración</p><p>Qué hiciste y qué lograste en una sola oración. Si no te alcanza el aire, es muy larga.</p></div>
              <div className="example-card"><p className="example-title">PREP para opinar</p><p><strong>P</strong>unto → <strong>R</strong>azón → <strong>E</strong>jemplo → <strong>P</strong>unto. Cuando sientas ganas de seguir explicando, ahí te detienes.</p></div>
              <div className="example-card"><p className="example-title">Qué · ¿y qué? · ¿y ahora qué?</p><p>Qué pasó, por qué importa, qué sigue. Para presentarte en 60 segundos y para cerrar una respuesta.</p></div>
              <div className="example-card"><p className="example-title">Si te bloqueas</p><p>«Déjame darte un ejemplo concreto…», haz una pausa, mira tus palabras clave y sigue.</p></div>
            </div>
            <p className="example-title" style={{ marginTop: 20 }}>Preguntas que te van a hacer</p>
            <ul className="if-then">
              <li><b>Háblame de ti:</b> quién eres (carrera y semestre) → 2 logros → qué buscas y por qué aquí.</li>
              <li><b>Tu área de oportunidad:</b> una real + qué estás haciendo para mejorarla.</li>
              <li><b>Expectativa de sueldo:</b> investiga antes y di un rango, no una cifra.</li>
              <li><b>¿Tienes preguntas?</b> Lleva 2: cómo es un día normal y cómo miden el éxito en el puesto.</li>
              <li><b>Formatos nuevos:</b> entrevistas grabadas sin entrevistador o solo con audio, a veces con 1 minuto para preparar y 3 para responder.</li>
            </ul>
          </section>

          <section className="chapter-section" id="star" aria-labelledby="kit3-star">
            <h2 id="kit3-star" className="block-title">Mi historia STAR</h2>
            <StarBuilder />
          </section>

          <section className="chapter-section" id="aplico" aria-labelledby="kit3-aplico">
            <h2 id="kit3-aplico" className="block-title">¿Aplico o no?</h2>
            <p>Si cumples buena parte de los requisitos y el puesto te emociona, aplica. Pruébalo con una vacante real:</p>
            <AplicoCheck />
          </section>

          <section className="chapter-section" id="asistente" aria-labelledby="kit3-asistente">
            <h2 id="kit3-asistente" className="block-title">Tu asistente de CV</h2>
            <div className="example-grid">
              <div className="example-card"><p className="example-title"><span aria-hidden="true">✨</span> Qué hace</p><p>Una skill de Gemini que revisa tu CV en formato Harvard, convierte experiencias en logros, prepara historias STAR y practica entrevistas contigo. No inventa datos ni te pide información personal.</p></div>
              <div className="example-card"><p className="example-title"><span aria-hidden="true">📩</span> Cómo la recibes</p><p>Te la comparto por correo. Abre el correo → <b>Open</b> → <b>Add skill</b>. Después, en un chat de Gemini escribe <b>/</b> y elígela. Necesitas cuenta de Google y 18 años o más; si no, usa los 4 prompts de arriba.</p></div>
            </div>
          </section>
        </div>
        <StarDivider />
        <nav className="chapter-nav" aria-label="Anterior">
          <a className="chapter-nav-prev" href="#kit-desarrollo">← Tu kit de desarrollo profesional</a>
        </nav>
      </article>
    </div>
  );
}
