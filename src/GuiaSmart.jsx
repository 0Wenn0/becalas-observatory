import { StarDivider, EngravingTelescope } from './Chapters.jsx';

/* Guía SMART a fondo: página aparte (#guia-smart) para no inflar Herramientas. */

const letters = [
  {
    letter: 'S',
    name: 'Específica',
    question: '¿Qué quieres lograr, exactamente?',
    tip: 'Nombra el qué, el dónde y el para qué. Si alguien más la lee, debería entender lo mismo que tú.',
    trap: 'Metas tipo “quiero crecer profesionalmente”: suenan bien, pero no te dicen qué hacer mañana.',
    before: 'Quiero trabajar en tecnología.',
    after: 'Quiero conseguir mis prácticas profesionales en un área de análisis de datos.',
  },
  {
    letter: 'M',
    name: 'Medible',
    question: '¿Cómo sabrás que avanzaste?',
    tip: 'Mide lo que depende de ti (solicitudes enviadas, horas de práctica, proyectos terminados), no lo que decide alguien más.',
    trap: '“Que me acepten” no está en tus manos. “Enviar 10 solicitudes” sí.',
    before: 'Que me contraten pronto.',
    after: 'Enviar 10 solicitudes y pedir retroalimentación de cada “no”.',
  },
  {
    letter: 'A',
    name: 'Alcanzable',
    question: '¿Qué necesitas para lograrlo?',
    tip: 'Haz inventario: habilidades, documentos, personas que te pueden orientar, tiempo y dinero. Usa las fortalezas de tu constelación.',
    trap: 'Si te falta algo grande (por ejemplo, un CV), eso no te descalifica: se vuelve tu primera meta.',
    before: 'Postularme a todas las vacantes que vea.',
    after: 'Tener mi CV revisado y un perfil de LinkedIn completo antes de postularme.',
  },
  {
    letter: 'R',
    name: 'Realista',
    question: '¿Qué no vas a sacrificar?',
    tip: 'Considera tu escuela, tu trabajo, tu familia y tu descanso. Realista no es pequeña: es una meta que cabe en tu vida.',
    trap: 'Planes que solo funcionan si duermes cinco horas. Esos se caen en la segunda semana.',
    before: 'Estudiar inglés tres horas diarias.',
    after: 'Practicar inglés 30 minutos, cuatro días a la semana, sin quitarle horas al sueño.',
  },
  {
    letter: 'T',
    name: 'Con fecha',
    question: '¿Para cuándo?',
    tip: 'Pon una fecha final y puntos de revisión cada dos semanas para ajustar el rumbo.',
    trap: '“Algún día” no es una fecha. Sin fecha, lo urgente siempre le gana a lo importante.',
    before: 'Este año.',
    after: 'Antes del 31 de enero, con revisión el 1 y el 15 de cada mes.',
  },
];

const examples = [
  {
    icon: '🧪',
    title: 'Prácticas profesionales',
    goal: 'Conseguir prácticas en investigación o análisis de datos antes del 30 de abril, enviando 15 solicitudes, con mi CV revisado y sin dejar de lado mis materias.',
    step: 'Esta semana: hacer una lista de 5 lugares que me interesan.',
  },
  {
    icon: '🎓',
    title: 'Una beca o convocatoria',
    goal: 'Postularme a 3 becas o programas de formación antes del 28 de febrero, con mi carta de motivación revisada por dos personas.',
    step: 'Esta semana: buscar las fechas de cierre y anotarlas en mi calendario.',
  },
  {
    icon: '🛠️',
    title: 'Una habilidad nueva',
    goal: 'Terminar un curso introductorio de Excel o Python antes del 15 de marzo, practicando 3 horas a la semana, y hacer un mini proyecto con datos reales.',
    step: 'Esta semana: elegir el curso y completar la primera lección.',
  },
  {
    icon: '🤝',
    title: 'Tu red profesional',
    goal: 'Platicar con 4 personas que trabajen en el área que me interesa antes del 31 de marzo, para conocer cómo llegaron ahí.',
    step: 'Esta semana: escribirle a una persona con un mensaje corto y amable.',
  },
];

const checklist = [
  'Otra persona podría leerla y entender qué quieres lograr.',
  'Lo que vas a medir depende de ti.',
  'Sabes qué necesitas y qué te falta conseguir.',
  'Cabe en tu semana sin sacrificar tu descanso.',
  'Tiene fecha final y fechas para revisarla.',
  'Tiene un primer pasito que puedes hacer esta semana.',
  'Tiene un plan para cuando algo salga mal.',
];

export function GuiaSmart() {
  return (
    <div className="book">
      <article className="chapter section-wrap guia-smart" aria-labelledby="view-guia-title">
        <nav className="crumb" aria-label="Ubicación">
          <a href="#inicio">← Índice</a><span aria-hidden="true"> / </span><a href="#herramientas">Herramientas</a><span aria-hidden="true"> / </span><span aria-current="page">Guía SMART</span>
        </nav>
        <header className="chapter-hero">
          <span className="chapter-art"><EngravingTelescope /></span>
          <p className="book-kicker">Guía de exploradora</p>
          <h1 id="view-guia-title" tabIndex={-1}>El telescopio, a fondo</h1>
          <p className="chapter-sub">Cómo convertir una meta profesional en un plan SMART</p>
        </header>
        <StarDivider />

        <div className="chapter-body">
          <p className="drop-cap">Una estrella lejana se vuelve alcanzable cuando la enfocas. Esta guía te ayuda a pasar de “me gustaría” a “esto es lo que voy a hacer esta semana”. Léela con calma y después arma tu meta en <a href="#meta">Mi meta</a>.</p>

          <section className="chapter-section" aria-labelledby="guia-por-que">
            <h2 id="guia-por-que" className="block-title">Por qué funciona</h2>
            <p>Las metas específicas y retadoras suelen llevar a mejores resultados que el clásico “haz tu mejor esfuerzo”: le dicen a tu atención dónde enfocarse y te dejan ver tu avance (Locke y Latham, 2002). El formato SMART lo propuso George T. Doran en 1981 para escribir objetivos claros.</p>
            <p>SMART no es magia: es una lista de preguntas para que tu meta no se quede en buena intención.</p>
          </section>

          <section className="chapter-section" aria-labelledby="guia-niveles">
            <h2 id="guia-niveles" className="block-title">De la estrella al primer pasito</h2>
            <p>Una meta profesional se ve en tres distancias:</p>
            <ol className="mission-steps book-steps">
              <li><span className="step-num" aria-hidden="true">1</span><span><strong>Tu estrella</strong> (1 a 3 años): hacia dónde quieres ir. Ej. trabajar en ciencia de datos aplicada a la salud.</span></li>
              <li><span className="step-num" aria-hidden="true">2</span><span><strong>Tu meta SMART</strong> (3 a 6 meses): el tramo que sí puedes planear. Ej. conseguir prácticas en un área de datos.</span></li>
              <li><span className="step-num" aria-hidden="true">3</span><span><strong>Tu primer pasito</strong> (esta semana, 30 minutos o menos). Ej. pedir que revisen tu CV.</span></li>
            </ol>
          </section>

          <section className="chapter-section" aria-labelledby="guia-letras">
            <h2 id="guia-letras" className="block-title">Letra por letra</h2>
            <p>Toca cada letra para ver cómo se arma y en qué trampa es fácil caer.</p>
            <div className="smart-letters">
              {letters.map((l) => (
                <details className="letter-card" key={l.letter}>
                  <summary>
                    <span className="letter-mark" aria-hidden="true">{l.letter}</span>
                    <span><span className="letter-name">{l.name}</span><span className="letter-q">{l.question}</span></span>
                  </summary>
                  <div className="letter-body">
                    <p>{l.tip}</p>
                    <p><strong>Trampa común:</strong> {l.trap}</p>
                    <p className="before-after"><span className="ba-before"><b>Antes:</b> {l.before}</span><span className="ba-after"><b>Después:</b> {l.after}</span></p>
                  </div>
                </details>
              ))}
              <details className="letter-card">
                <summary>
                  <span className="letter-mark" aria-hidden="true">👣</span>
                  <span><span className="letter-name">Primer pasito</span><span className="letter-q">¿Qué puedes hacer esta semana?</span></span>
                </summary>
                <div className="letter-body">
                  <p>Una acción concreta, de 30 minutos o menos, que puedas hacer en los próximos siete días. Arrancar es lo más difícil; un pasito pequeño baja la barrera.</p>
                  <p className="before-after"><span className="ba-before"><b>Antes:</b> Ponerme a buscar prácticas.</span><span className="ba-after"><b>Después:</b> El martes en la tarde, guardar 5 convocatorias en una lista.</span></p>
                </div>
              </details>
            </div>
          </section>

          <section className="chapter-section" aria-labelledby="guia-planb">
            <h2 id="guia-planb" className="block-title">Tu plan para cuando algo salga mal</h2>
            <p>Los obstáculos van a llegar. Prepararte de antemano con una frase “si… entonces…” hace más probable que sigas actuando cuando aparezcan (Gollwitzer, 1999).</p>
            <ul className="if-then">
              <li><b>Si</b> me rechazan una solicitud, <b>entonces</b> pido retroalimentación y envío otra esa misma semana.</li>
              <li><b>Si</b> tengo semana de exámenes, <b>entonces</b> hago solo mi pasito de 15 minutos y retomo después.</li>
              <li><b>Si</b> no sé por dónde empezar, <b>entonces</b> le escribo a Wen por el grupo.</li>
            </ul>
          </section>

          <section className="chapter-section" aria-labelledby="guia-ejemplos">
            <h2 id="guia-ejemplos" className="block-title">Metas profesionales ya armadas</h2>
            <p>Úsalas de inspiración, no de molde: tu meta tiene que sonar a ti.</p>
            <div className="example-grid">
              {examples.map((e) => (
                <div className="example-card" key={e.title}>
                  <p className="example-title"><span aria-hidden="true">{e.icon}</span> {e.title}</p>
                  <p>{e.goal}</p>
                  <p className="example-step"><b>Primer pasito:</b> {e.step.replace('Esta semana: ', '')}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="chapter-section" aria-labelledby="guia-check">
            <h2 id="guia-check" className="block-title">Revisa tu meta</h2>
            <p>Antes de mandármela, revisa que cumpla con esto:</p>
            <ul className="smart-check">
              {checklist.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          <section className="chapter-section mission-box" aria-labelledby="guia-mision">
            <h2 id="guia-mision" className="block-title">Tu misión antes de la próxima noche</h2>
            <ol className="mission-steps book-steps">
              <li><span className="step-num" aria-hidden="true">1</span><span>Arma tu meta profesional en <a href="#meta">Mi meta</a>.</span></li>
              <li><span className="step-num" aria-hidden="true">2</span><span>Toca <strong>Descargar en Word</strong>.</span></li>
              <li><span className="step-num" aria-hidden="true">3</span><span>Mándamela por mensaje privado junto con tus respuestas a estas preguntas:</span></li>
            </ol>
            <ul className="explore-questions">
              <li>¿Qué área o tema te emociona explorar?</li>
              <li>¿Qué buscas: prácticas, beca, empleo, curso, voluntariado u otra cosa?</li>
              <li>¿Cuántas horas a la semana le puedes dedicar?</li>
              <li>¿Alguna condición? Ciudad, remoto, idioma, horario.</li>
            </ul>
            <p>Con eso te preparo una ruta con recursos, becas, prácticas y lugares dónde buscar, hecha para tu meta.</p>
            <p className="book-note"><span aria-hidden="true">🔒</span> Tu meta es tuya: solo la vemos tú y yo, y no la comparto en el grupo sin tu permiso.</p>
          </section>

          <p className="guia-refs">Fuentes: Doran, G. T. (1981). There’s a S.M.A.R.T. way to write management’s goals and objectives. <i>Management Review, 70</i>(11), 35–36. · Locke, E. A. y Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation. <i>American Psychologist, 57</i>(9), 705–717. · Gollwitzer, P. M. (1999). Implementation intentions: Strong effects of simple plans. <i>American Psychologist, 54</i>(7), 493–503.</p>
        </div>

        <StarDivider />
        <nav className="chapter-nav" aria-label="Capítulos">
          <a href="#herramientas">← Tu kit de exploradora</a>
          <a href="#inicio" className="chapter-nav-home"><span aria-hidden="true">✦</span> Índice</a>
          <a href="#meta" className="chapter-nav-next">Armar mi meta →</a>
        </nav>
      </article>
    </div>
  );
}
