import { useEffect, useState } from 'react';

const sessions = [
  {
    id: 'metas',
    number: '01',
    name: 'Definición de metas',
    eyebrow: 'Primera mentoría',
    length: '1 hora',
    objective: 'Generar confianza, conocerse y construir un espacio seguro. Cada mentee define metas a corto y mediano plazo, expectativas, fortalezas y áreas de oportunidad.',
    activities: [
      ['Respiración o mindfulness', '5 min', 'Unos minutos de respiración profunda o escaneo corporal para llegar con calma. Mantén los ojos cerrados solo si se siente cómodo; también puedes mirar un punto fijo.'],
      ['Presentación y rompehielos', '15–20 min', 'Elijan una o dos dinámicas: una palabra o frase sobre una anécdota importante, preguntas “¿Quién…?”, imágenes para representar emociones, un quiz digital o una autopresentación.'],
      ['Metas SMART', '20 min', 'Definan 2 o 3 metas y pasos concretos. Pueden apoyarse en un calendario, una hoja, una matriz o un mapa visual.'],
      ['Expectativas, fortalezas y áreas de oportunidad', '15–20 min', 'Reconozcan qué esperan del proceso, qué capacidades quieren poner en juego y qué habilidades desean desarrollar. Compartan ejemplos desde la experiencia propia.'],
    ],
    questions: ['¿Qué esperamos de esta mentoría y de nosotras mismas?', '¿Qué fortalezas queremos aplicar y con qué valores se conectan?', '¿Qué hábito concreto nos ayudaría a trabajar un área de oportunidad?'],
    resources: ['Ejercicio de respiración o escaneo corporal del manual', 'Constructor de metas SMART en esta página'],
  },
  {
    id: 'trayectoria',
    number: '02',
    name: 'Trayectoria académica',
    eyebrow: 'Segunda mentoría',
    length: '1 hora',
    objective: 'Reflexionar sobre la trayectoria académica y aprovechar mejor la experiencia universitaria para tomar decisiones informadas sobre opciones educativas, carrera y futuro profesional.',
    activities: [
      ['Mapa de trayectorias educativas', '25–30 min', 'Recorran momentos y decisiones desde la infancia hasta la universidad. Identifiquen recuerdos, materias favoritas, personas influyentes y aspiraciones.'],
      ['Aprovechamiento de la etapa universitaria', '25–30 min', 'Conversen sobre estudio consciente, networking, buscar mentoría y ofrecerla, voluntariado, organización del tiempo y metas académicas realistas.'],
    ],
    questions: ['¿Qué recuerdos destacan de cada etapa?', '¿Qué querías ser cuando eras niña?, ¿han cambiado tus aspiraciones?', '¿Te gustaría continuar estudiando?', '¿Qué oportunidades profesionales visualizas relacionadas con tu carrera?'],
    resources: ['Mapa personal de trayectoria académica', 'Ejemplos y aprendizajes de la experiencia universitaria de la mentora'],
  },
  {
    id: 'empleo',
    number: '03',
    name: 'Preparación para el primer empleo',
    eyebrow: 'Tercera mentoría',
    length: '1 hora',
    objective: 'Explorar el panorama laboral, reconocer opciones profesionales afines a los intereses de cada mentee y preparar estrategias para enfrentar obstáculos.',
    activities: [
      ['Opciones laborales y búsqueda de empleo', '30–40 min', 'Conecten intereses y fortalezas con opciones profesionales; revisen CV y carta de presentación, investigación de empresas, networking y perfiles en plataformas como LinkedIn Jobs o Indeed.'],
      ['Obstáculos en la vida profesional', '15–20 min', 'Hablen sobre resiliencia, discriminación y estereotipos. Practiquen respaldar logros con hechos, reconocer el mérito propio y pedir ayuda.'],
      ['Primer empleo y entrevista', '15–20 min', 'Compartan experiencias, preparen respuestas para preguntas frecuentes y conversen sobre constancia, rechazo y estrategias que ayuden a reducir la ansiedad.'],
    ],
    questions: ['¿Qué intereses y fortalezas quiero llevar a mi búsqueda?', '¿Tú qué hubieras hecho ante este desafío?', '¿Qué hechos muestran lo que he logrado?', '¿Qué me ayudaría a sentir más confianza en una entrevista?'],
    resources: ['Recomendaciones para hablar en público incluidas en el manual', 'Video TED de Amy Cuddy citado en el manual'],
  },
];

const nodes = [
  { id: 'intereses', label: 'Intereses', position: 'node-a', prompt: '¿Qué temas o actividades despiertan tu curiosidad y te dan ganas de seguir explorando?' },
  { id: 'fortalezas', label: 'Fortalezas', position: 'node-b', prompt: '¿Qué capacidades reconoces en ti? ¿Qué suelen destacar de ti las personas cercanas?' },
  { id: 'experiencias', label: 'Experiencias', position: 'node-c', prompt: '¿Qué momentos, decisiones o aprendizajes han influido en el camino que llevas?' },
  { id: 'posibilidades', label: 'Posibilidades', position: 'node-d', prompt: '¿Qué paso pequeño te acercaría a una meta académica o profesional que te importa?' },
];

const agreements = [
  ['No discriminación', 'Construimos un entorno inclusivo, con cero tolerancia a la discriminación, el acoso y el hostigamiento.'],
  ['Bienestar', 'La seguridad de las estudiantes guía el espacio. Las interacciones sexuales o violentas, y el consumo o fomento de sustancias, están prohibidos.'],
  ['Confidencialidad', 'Cuidamos la privacidad de las estudiantes y la información compartida por ellas y por el equipo de BécALAS.'],
  ['Derivación adecuada', 'Si una necesidad rebasa el alcance de la mentoría, contactamos al equipo de BécALAS para que oriente la derivación.'],
];

const initialSmart = { goal: '', measure: '', achievable: '', realistic: '', deadline: '', firstStep: '' };
const smartLabels = [
  ['goal', 'Específica', '¿Qué quieres lograr?'],
  ['measure', 'Medible', '¿Cómo sabrás que avanzaste?'],
  ['achievable', 'Alcanzable', '¿Qué necesitas para lograrlo?'],
  ['realistic', 'Realista', '¿Qué no vas a sacrificar?'],
  ['deadline', 'Con límite de tiempo', '¿Para cuándo?'],
  ['firstStep', 'Primer paso', '¿Qué puedes hacer esta semana?'],
];

function readSaved(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function SectionHeading({ label, title, intro }) {
  return (
    <header className="section-heading">
      <p className="section-label">{label}</p>
      <h2>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </header>
  );
}

export function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/caso' ? <CaseStudy /> : <Microsite />;
}

function CaseStudy() {
  return (
    <>
      <a className="skip-link" href="#case-content">Saltar al contenido</a>
      <header className="site-header">
        <a className="brand-lockup" href="/" aria-label="Volver al micrositio de mentoría">
          <span className="brand-primary">Cognitive Observatory</span>
          <span className="brand-divider" aria-hidden="true">/</span>
          <span className="brand-program">BécALAS Conectadas</span>
        </a>
        <a className="case-back-link" href="/">Volver al observatorio</a>
      </header>
      <main className="case-page section-wrap" id="case-content">
        <p className="section-label">Caso de diseño · 2026</p>
        <h1>Un espacio digital para acompañar la mentoría</h1>
        <p className="case-lede">Un micrositio para que un grupo de BécALAS encuentre el calendario, las actividades y las herramientas de sus conversaciones de noviembre.</p>
        <section>
          <h2>El reto</h2>
          <p>La experiencia debía unir una estructura sencilla de recorrido con una identidad editorial de observación y conexión. El contenido del manual de mentoría marcó qué información y actividades podían incluirse.</p>
        </section>
        <section>
          <h2>Decisiones de experiencia</h2>
          <ul>
            <li>Mostrar primero la próxima sesión y ofrecer una ruta clara a la primera misión.</li>
            <li>Organizar las tres sesiones en una secuencia expandible, con objetivos, actividades, tiempos sugeridos, preguntas y recursos.</li>
            <li>Convertir SMART, la constelación y la bitácora en herramientas que cada participante puede explorar a su ritmo.</li>
            <li>Usar el mapa de conexiones como una ilustración de ideas, con controles accesibles para explorar intereses, fortalezas, experiencias y posibilidades.</li>
          </ul>
        </section>
        <section>
          <h2>Privacidad y confianza</h2>
          <p>Las notas de la bitácora se guardan solo en el navegador de quien las escribe. El micrositio no recopila nombres ni datos de las mentoradas y dirige las necesidades de apoyo al equipo de seguimiento de BécALAS.</p>
        </section>
        <section>
          <h2>Una decisión importante</h2>
          <p>La propuesta visual de Claude aportó una estructura útil. Las actividades y el calendario del sitio se ajustaron al manual y a la información confirmada por la mentora; los recursos no descritos quedan señalados para compartir después.</p>
        </section>
      </main>
      <footer className="site-footer case-footer">
        <p>Micrositio diseñado y desarrollado por Wen (Wendy Ramírez) para su grupo de mentoría BécALAS 2026‑2027. Es un sitio personal de apoyo, no un sitio oficial de BécALAS ni de Bécalos. Forma parte del portafolio de diseño UX/UI Cognitive Observatory.</p>
        <a href="/">Volver al observatorio</a>
      </footer>
    </>
  );
}

function Microsite() {
  const [openSession, setOpenSession] = useState('metas');
  const [activeNode, setActiveNode] = useState('intereses');
  const [breathing, setBreathing] = useState(false);
  const [smart, setSmart] = useState(() => readSaved('becalas-smart', initialSmart));
  const [activeLogSession, setActiveLogSession] = useState('metas');
  const [log, setLog] = useState(() => readSaved('becalas-log', { metas: {}, trayectoria: {}, empleo: {} }));
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    try { localStorage.setItem('becalas-smart', JSON.stringify(smart)); } catch { /* local save is optional */ }
  }, [smart]);

  const currentNode = nodes.find((node) => node.id === activeNode) ?? nodes[0];
  const currentLog = log[activeLogSession] ?? {};

  function openJournal(sessionId) {
    if (sessionId) setActiveLogSession(sessionId);
    document.getElementById('bitacora')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => document.getElementById('journal-discovery')?.focus(), 450);
  }

  function saveJournal() {
    const next = { ...log, [activeLogSession]: currentLog };
    setLog(next);
    try { localStorage.setItem('becalas-log', JSON.stringify(next)); } catch { /* local save is optional */ }
    setSavedMessage('Tu reflexión quedó guardada en este navegador.');
    window.setTimeout(() => setSavedMessage(''), 3600);
  }

  function updateCurrentLog(field, value) {
    setLog((previous) => ({ ...previous, [activeLogSession]: { ...(previous[activeLogSession] ?? {}), [field]: value } }));
  }

  function clearJournal() {
    const next = { ...log, [activeLogSession]: {} };
    setLog(next);
    try { localStorage.setItem('becalas-log', JSON.stringify(next)); } catch { /* local save is optional */ }
    setSavedMessage('La reflexión de esta sesión se borró de este navegador.');
    window.setTimeout(() => setSavedMessage(''), 3600);
  }

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header">
        <a className="brand-lockup" href="#inicio" aria-label="Cognitive Observatory y BécALAS Conectadas, inicio">
          <span className="brand-primary">Cognitive Observatory</span>
          <span className="brand-divider" aria-hidden="true">/</span>
          <span className="brand-program">BécALAS Conectadas</span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a href="#proxima">Próxima sesión</a>
          <a href="#mision">Mi misión</a>
          <a href="#recorrido">Sesiones</a>
          <a href="#instrumentos">Mis herramientas</a>
          <a href="#recursos">Recursos</a>
          <a href="#contacto">Apoyo</a>
        </nav>
      </header>

      <main id="contenido">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="kicker">Observatorio de mentoría · BécALAS 2026</p>
            <h1 id="hero-title">¡Exploremos juntas!</h1>
            <p className="hero-lede">Este es nuestro espacio para las mentorías de noviembre: aquí encuentras las fechas, tu primera misión y herramientas para cada sesión.</p>
            <p className="hero-quote">“No necesitas tener todo resuelto para empezar a construir la trayectoria que deseas. La curiosidad, la constancia y las ganas de aprender abren caminos que hoy ni imaginas.”</p>
            <div className="hero-actions"><a className="button button-primary" href="#mision">Ver mi primera misión</a><a className="button button-outline" href="#proxima">Próxima sesión: sáb 7 nov · 17:00</a></div>
          </div>
          <figure className="hero-art" aria-hidden="true">
            <img src="/observatory-map.png" alt="" />
          </figure>
        </section>

        <section className="guide-section section-wrap" aria-labelledby="guide-title">
          <SectionHeading label="Tu guía en este observatorio" title="Hola, soy Wen 👋" />
          <p className="guide-bio">Soy psicóloga con formación en neuropsicología y trabajo en la intersección entre inteligencia artificial, ciencia de datos, tecnología y educación. Me apasiona usar la tecnología para resolver problemas reales y encontrar conexiones entre disciplinas que parecen no tener nada que ver. Soy una eterna aprendiz, amante de la ciencia, el arte, el deporte y las buenas conversaciones. 🪐<br /><br />Este espacio es suyo: un lugar para preguntar, experimentar, equivocarse y reconocer todo lo que son capaces de construir. Yo también vengo a aprender de ustedes.</p>
          <ul className="guide-tags" aria-label="Áreas de interés"><li>Neurociencia</li><li>Datos</li><li>IA</li><li>Educación</li></ul>
        </section>

        <section className="next-session section-wrap" id="proxima">
          <p className="section-label">Próxima sesión</p><h2>Sábado 7 de noviembre · 17:00</h2>
          <p>Nos encontramos para iniciar la mentoría y conocernos. La plataforma y el enlace se comparten por el grupo.</p>
        </section>

        <section className="mission-section section-wrap" id="mision">
          <SectionHeading label="Tu primera misión" title="Llega con curiosidad" intro="La primera sesión es flexible y la construimos juntas. Si te sirve, puedes traer algunas ideas; no necesitas preparar una tarea obligatoria." />
          <ul className="mission-list"><li>Piensa qué esperas de esta mentoría y de ti.</li><li>Reconoce una fortaleza que quieras poner en juego y algo que te gustaría desarrollar.</li><li>Imagina dos o tres metas académicas o profesionales; las podremos trabajar juntas con pasos concretos.</li></ul>
        </section>

        <section className="purpose section-wrap" id="proposito">
          <div className="purpose-mark" aria-hidden="true">01</div>
          <div className="purpose-content">
            <SectionHeading label="El propósito" title="Un espacio para pensar en compañía" />
            <div className="purpose-columns">
              <p>BécALAS fortalece el desarrollo personal, académico y profesional de mujeres universitarias y acompaña la construcción de una red de aprendizaje con perspectiva de género.</p>
              <p>La mentoría abre un espacio seguro para compartir experiencia, escuchar y orientar. La mentora acompaña a cada mentee a encontrar una ruta propia; sus decisiones siguen siendo suyas.</p>
            </div>
            <div className="program-facts" aria-label="Datos del programa">
              <div><strong>3</strong><span>sesiones grupales</span></div>
              <div><strong>1 h</strong><span>por sesión</span></div>
              <div><strong>Nov.</strong><span>una vez por semana</span></div>
            </div>
            <div className="expectations">
              <p>En estas conversaciones puedes:</p>
              <ul>
                <li>Preguntar, proponer y explorar con confianza.</li>
                <li>Reconocer y fortalecer tus habilidades.</li>
                <li>Ampliar tu red y tus posibilidades junto a otras mujeres.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="route-section" id="recorrido">
          <div className="section-wrap">
          <SectionHeading label="Sesiones" title="Tres noches de observación" intro="Nuestras 3 sesiones de noviembre" />
            <div className="route-meta"><span>3 encuentros</span><span>Noviembre de 2026</span><span>1 sesión por semana</span></div>
            <div className="session-list">
              {sessions.map((session) => {
                const expanded = openSession === session.id;
                return (
                  <article className={`session ${expanded ? 'is-open' : ''}`} key={session.id}>
                    <button className="session-trigger" type="button" aria-expanded={expanded} aria-controls={`session-${session.id}`} onClick={() => setOpenSession(expanded ? '' : session.id)}>
                      <span className="session-number">{session.number}</span>
                      <span className="session-title-group"><span className="session-eyebrow">{session.eyebrow}</span><span className="session-title">{session.name}</span></span>
                      <span className="session-duration">{session.length}</span>
                      <span className="session-toggle" aria-hidden="true">{expanded ? '−' : '+'}</span>
                    </button>
                    {expanded && (
                      <div className="session-detail" id={`session-${session.id}`}>
                        <div className="session-summary"><h3>Para qué nos reunimos</h3><p>{session.objective}</p></div>
                        <div className="session-detail-grid">
                          <div>
                            <h3>Actividades sugeridas</h3>
                            <ol className="activity-list">{session.activities.map(([name, time, description]) => <li key={name}><div className="activity-head"><strong>{name}</strong><span>{time}</span></div><p>{description}</p></li>)}</ol>
                            <p className="timing-note">Los tiempos de las actividades son sugerencias del manual. Ajusten el contenido al encuentro de una hora.</p>
                          </div>
                          <aside className="session-aside">
                            <h3>Preguntas para conversar</h3>
                            <ul className="plain-list">{session.questions.map((question) => <li key={question}>{question}</li>)}</ul>
                            <h3>Para tener a la mano</h3>
                            <ul className="plain-list resource-list">{session.resources.map((resource) => <li key={resource}>{resource}</li>)}</ul>
                          </aside>
                        </div>
                        <button className="text-button" type="button" onClick={() => openJournal(session.id)}>Registrar aprendizaje o compromiso <span aria-hidden="true">↘</span></button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
            <p className="route-footnote">La primera sesión es el sábado 7 de noviembre a las 17:00. Las fechas y la plataforma de las siguientes sesiones se acuerdan en grupo; el manual recomienda concluir idealmente en la semana del 16 al 20.</p>
          </div>
        </section>

        <section className="breath-section" id="pausa" aria-labelledby="breath-title">
          <div className="breath-copy">
            <p className="section-label">Una pausa, si te sirve</p>
            <h2 id="breath-title">Tómate un momento para llegar</h2>
            <p>La respiración es una sugerencia del manual para abrir la primera sesión. Puedes bajar la mirada, atender a los sonidos o simplemente quedarte en silencio. No hay una forma correcta de sentirse.</p>
          </div>
          <div className="breath-control">
            {!breathing && <p className="breath-instruction">Empieza cuando te sientas lista.</p>}
            <button className="button button-dark" type="button" aria-expanded={breathing} aria-controls="breath-guide" onClick={() => setBreathing((value) => !value)}>{breathing ? 'Cerrar la guía' : 'Abrir la guía'}</button>
            {breathing && <div className="breath-guide" id="breath-guide" aria-live="polite"><p>Colócate en una posición cómoda. Si cerrar los ojos te incomoda, baja la mirada y observa un punto fijo.</p><p>Nota el contacto de tus pies con el piso y el peso de tu cuerpo. Atiende a tu respiración o a los sonidos que te rodean.</p><p>¿Cómo te sientes ahora? No hay una respuesta correcta. Cuando estés lista, vuelve a centrarte en el espacio a tu alrededor.</p></div>}
          </div>
        </section>

        <section className="smart-section section-wrap" id="instrumentos">
          <div className="smart-intro">
            <p className="section-label">Herramienta de la primera mentoría</p>
            <h2>Una meta que puedas mirar de cerca</h2>
            <p>El manual sugiere definir de dos a tres metas. Prueba con una aquí y ajústala en conversación con tu mentora. Se guarda solo en este navegador.</p>
            <button className="text-button" type="button" onClick={() => setSmart(initialSmart)}>Limpiar los campos <span aria-hidden="true">↺</span></button>
          </div>
          <div className="smart-builder">
            <div className="smart-letters" aria-label="Criterios SMART"><span>S · Específica</span><span>M · Medible</span><span>A · Alcanzable</span><span>R · Realista</span><span>T · Con plazo</span></div>
            <div className="smart-fields">
              {smartLabels.map(([key, title, question]) => <label className="field" key={key}><span>{title}</span><span className="field-prompt">{question}</span><input value={smart[key] ?? ''} onChange={(event) => setSmart((previous) => ({ ...previous, [key]: event.target.value }))} placeholder="Escribe una idea" /></label>)}
            </div>
            <div className="goal-preview"><span>Tu primer paso</span><p>{smart.firstStep || 'Aquí aparecerá el paso pequeño que quieras intentar esta semana.'}</p></div>
          </div>
        </section>

        <section className="constellation-section" id="mapa">
          <div className="section-wrap constellation-layout">
            <div className="constellation-copy">
              <SectionHeading label="Mapa de posibilidades" title="Tu constelación" intro="Mapa de intereses, fortalezas y posibilidades" />
              <div className="node-selector" role="group" aria-label="Explora una dimensión de tu mapa">
                {nodes.map((node) => <button type="button" key={node.id} className={activeNode === node.id ? 'node-tab is-selected' : 'node-tab'} aria-pressed={activeNode === node.id} onClick={() => setActiveNode(node.id)}>{node.label}</button>)}
              </div>
              <div className="node-prompt" aria-live="polite"><span>{currentNode.label}</span><p>{currentNode.prompt}</p></div>
            </div>
            <div className="constellation-map" aria-label="Mapa visual de ideas conectadas">
              <img src="/observatory-map.png" alt="Conexiones de un mapa de pensamiento" />
              {nodes.map((node) => <button key={node.id} type="button" className={`map-node ${node.position} ${activeNode === node.id ? 'is-active' : ''}`} aria-label={`Explorar ${node.label}`} aria-pressed={activeNode === node.id} onClick={() => setActiveNode(node.id)}><span>{node.label}</span></button>)}
              <p className="map-caption">Tu mapa puede cambiar. Empieza por el punto que hoy te llame.</p>
            </div>
          </div>
        </section>

        <section className="resources-section section-wrap" id="recursos">
          <SectionHeading label="Recursos" title="Instrumentos" intro="Recursos para antes y después de cada sesión" />
          <div className="resource-rows">
            <article className="resource-row"><span className="resource-index">A</span><div><h3>Respiración y mindfulness</h3><p>El manual incluye ejercicios de respiración para relajarse, hacer un escaneo corporal y llegar al momento presente. Puedes elegir el que te resulte cómodo.</p></div><a href="#pausa">Ir a la pausa <span aria-hidden="true">↗</span></a></article>
            <article className="resource-row"><span className="resource-index">B</span><div><h3>Definir metas</h3><p>El manual recomienda metas SMART y propone apoyarse en un calendario, una hoja, una matriz o un mapa visual para seguir los pasos.</p></div><a href="#instrumentos">Abrir herramienta <span aria-hidden="true">↗</span></a></article>
            <article className="resource-row"><span className="resource-index">C</span><div><h3>Hablar en público</h3><p>El manual reúne recomendaciones para preparar una presentación, practicar, usar apoyos visuales sencillos y respirar antes de hablar.</p></div><a href="https://youtu.be/Ks-_Mh1QhMc?si=Z2_xBWz8gSVyqWf5" target="_blank" rel="noreferrer">Ver charla TED <span aria-hidden="true">↗</span></a></article>
            <article className="resource-row"><span className="resource-index">D</span><div><h3>Lectura complementaria sobre metas</h3><p>Referencia de Asana incluida en la bibliografía del manual para explorar cómo establecer objetivos a largo plazo.</p></div><a href="https://asana.com/es/resources/long-term-goals" target="_blank" rel="noreferrer">Leer en Asana <span aria-hidden="true">↗</span></a></article>
            <article className="resource-row"><span className="resource-index">E</span><div><h3>Otros materiales de la mentoría</h3><p>Agrega aquí lecturas, hojas de trabajo o herramientas acordadas por el grupo. Este espacio queda listo para recursos que comparta BécALAS.</p></div><span className="resource-status">Por compartir</span></article>
          </div>
        </section>

        <section className="journal-section" id="bitacora">
          <div className="section-wrap journal-layout">
            <div className="journal-intro">
              <SectionHeading label="Bitácora" title="Tu bitácora de observación" intro="Notas de cada sesión" />
              <p className="privacy-note">Tus notas se quedan en este navegador. No se envían a BécALAS ni se sincronizan con otros dispositivos.</p>
            </div>
            <div className="journal-form">
              <label className="field"><span>Sesión</span><select value={activeLogSession} onChange={(event) => setActiveLogSession(event.target.value)}>{sessions.map((session) => <option value={session.id} key={session.id}>{session.number} · {session.name}</option>)}</select></label>
              <label className="field"><span>¿Qué descubrí?</span><textarea id="journal-discovery" value={currentLog.discovery ?? ''} onChange={(event) => updateCurrentLog('discovery', event.target.value)} placeholder="Una idea, fortaleza o posibilidad que hoy pude ver…" rows="3" /></label>
              <label className="field"><span>¿Qué me llevo de esta conversación?</span><textarea value={currentLog.learning ?? ''} onChange={(event) => updateCurrentLog('learning', event.target.value)} placeholder="Algo que aprendí, una pregunta que sigue conmigo…" rows="3" /></label>
              <label className="field"><span>¿Qué pequeño paso quiero intentar?</span><textarea value={currentLog.commitment ?? ''} onChange={(event) => updateCurrentLog('commitment', event.target.value)} placeholder="Un paso concreto y posible para los próximos días…" rows="2" /></label>
              <div className="journal-actions"><button className="button button-dark" type="button" onClick={saveJournal}>Guardar en este navegador</button><button className="quiet-button" type="button" onClick={clearJournal}>Borrar esta sesión</button></div>
              <p className="save-message" role="status" aria-live="polite">{savedMessage}</p>
            </div>
          </div>
        </section>

        <section className="agreements-section section-wrap" id="acuerdos">
          <SectionHeading label="Para cuidar el espacio" title="Nuestros acuerdos" intro="El código de conducta del programa orienta estas conversaciones y el cuidado de todas las personas participantes." />
          <div className="agreement-list">{agreements.map(([title, text], index) => <article className="agreement" key={title}><span className="agreement-index">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          <p className="agreement-note">Si una situación rebasa el alcance de la mentoría, contacta directamente al equipo de BécALAS para recibir orientación.</p>
        </section>

        <section className="contact-section" id="contacto">
          <div className="section-wrap">
            <SectionHeading label="Acompañamiento del programa" title="¿Necesitas apoyo?" intro="Si algo te preocupa o te supera, escríbeme por el grupo y buscamos juntas el apoyo adecuado con el programa." />
            <div className="contact-grid">
              <article><h3>Equipo de seguimiento BécALAS</h3><a href="mailto:contacto@becalasonline.mx">contacto@becalasonline.mx</a></article>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>Micrositio diseñado y desarrollado por Wen (Wendy Ramírez) para su grupo de mentoría BécALAS 2026‑2027. Es un sitio personal de apoyo, no un sitio oficial de BécALAS ni de Bécalos. Forma parte del portafolio de diseño UX/UI Cognitive Observatory.</p>
        <a href="/caso">Cómo diseñé este sitio</a>
      </footer>
    </>
  );
}
