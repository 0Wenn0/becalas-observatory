# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable design decisions
- Use Atkinson Hyperlegible for all interface text; reserve Cormorant Garamond for H1 and H2 at 32px or larger.
- Keep visible text at 14px minimum and paragraph text at 17–18px.
- Use plain navigation labels: Próxima sesión, Mi misión, Sesiones, Mis herramientas, Recursos, Apoyo.
- The support section shows only Equipo de seguimiento BécALAS · contacto@becalasonline.mx and directs personal concerns to the mentor via the group.
- Do not display mentee personal data or coordinator personal details.
- Hero uses the observatory metaphor, supplied copy, lavender quote border and a decorative constellation image hidden from assistive technology.

- Voice: close, playful and experimental (tutear, frases cortas, verbos de juego, normalizar el error). Observatory metaphor only in titles/microcopy; every poetic title has a literal subtitle. Max one emoji per block.
- Misión 0 (presentarse con IA: infografía, video o cómic, con prompts copiables y tip de privacidad) is a requested feature: keep it.
- Decorative motion: hero starfield canvas, comet-trail cursor (pointer: fine only) and sparkles. All disabled with prefers-reduced-motion; native cursor is never replaced.
- Interactive helpers: "Lanza un cometa" icebreakers and a 3-star session progress constellation driven by the session dates.
- Header lockup: "Mentorías BécALAS 2026 · Grupo de Wen" with "un proyecto de Cognitive Observatory" secondary. Footer states the site is personal, non-official and part of Wen's UX/UI portfolio; /caso holds the case study.
- Session dates are "Por definir" until agreed; edit `dateLabel` and `done` in src/App.jsx. Never state how many mentees are in the group (it may grow).
- Breathing toggle is a ringed-planet button (brand: observatory), not a generic button.
- Comet cursor must be clearly visible and round: glowing circular head offset from the pointer tip, continuous circular light trail, and a star burst + ring on every button/link click.
- Navigation: desktop shows all 6 links; mobile (≤700px) shows Próxima sesión · Mi misión · Sesiones plus a "Más ✦" menu (Esc closes, focus returns). Active section is highlighted (aria-current="location"). On mobile the header hides on scroll down and reappears on scroll up. Footer repeats quick links and a "write me in the group" CTA.
- Tools pattern: each tool has a translucent "Cómo se usa" panel (numbered steps, privacy note) separated from a white "Tu hoja de trabajo" card that holds the inputs. On dark sections use the `.on-dark` variants.
- "Lanza un cometa" fires a star burst and a real comet (`launchComet`) that starts very bright and fades as it crosses the screen.
- Breathing guide: planet with three tilted orbit rings whose dashes flow around (spinning feel) and that grow on "Inhala" and shrink on "Exhala" (4 s each); text cue always visible. Reduced motion keeps rings static.
- Avoid the "AI-template" left accent border on cards/quotes. Use brand devices instead: large serif opening quote mark for quotes, a small constellation drawing inside highlighted cards, dashed "ticket" border for generated outputs.
- Comets from "Lanza un cometa" shoot in 3 different random directions around the button.
- Breathing rings scale .72 → 1.5 and shift from lavender to pink/blue at the top of the inhale.
- Information architecture: four hash views (#inicio, #sesiones, #herramientas, #nosotras) instead of one long page. Sub-anchors (#mision, #proxima, #meta, #constelacion, #bitacora, #respira, #acuerdos, #recursos, #apoyo) open their view. Keep total visible copy around 600 words; intros max two lines; one privacy seal in Herramientas.
- Inicio shows Wen's bio in a two-line short version with "Conóceme más".
- Prototype "libro ilustrado" (Inicio + Capítulo I): lilac background (#ECE4F6), plum text (#3B1F4A), plum chapter cards (#2F1C42) with single-ink fine-line engravings (src/Chapters.jsx), ornamental frame, star dividers, drop cap. Chapter cards morph into the chapter header with the View Transitions API (open = explosion + sparkles, close = faster implosion + converging stars); reduced motion = no transition.
- Chapter cards animate on hover/focus: 3D tilt following the mouse with a lilac glow, small sparkle on enter, and an engraving-specific motion (telescope tilts to the star, moon rocks and clouds drift, astrolabe spins, constellation lines draw themselves). Pure SVG/CSS; disabled with reduced motion.
- All four chapters (I Misión, II Sesiones, III Herramientas, IV Nosotras) use the book style: ChapterHero (roman numeral, engraving, kicker, title) + StarDivider + chapter body + ChapterNav (prev/next). Header is always lilac.
- Breathing planet (button and guide): metal-engraving style, gold gradient lines on a wine disk (GoldPlanet in src/Chapters.jsx). Moons orbit, the gold sheen rotates, orbits grow to 1.24x on inhale with a gold glow and shrink to .72x on exhale.

- Reglas del cielo (capítulo IV): tarjetas ciruela como las del índice, con iconos propios de línea fina en dorado (`RuleIcon` en Chapters.jsx) en lugar de emojis. La rejilla usa `align-items: start` para que abrir una tarjeta no estire a su vecina.
- Presentación en vivo de cada sesión en `/presentacion` (entrada aparte de Vite: `presentacion/index.html` + `src/presentacion/`). Cielo 3D en Three.js (solo en esa página), narrativa «Bitácora de una noche de observación» (la mentorada es la heroína, Wen la guía; pregunta abierta al inicio que se cierra en el epílogo). Navegación: ← → (los `.step` se revelan antes de pasar de escena), N notas, F pantalla completa, T temporizador. Movimiento lento por la compresión de Meet. En «La guía» los errores del video se revelan uno por uno como ejercicio de «encuentra las diferencias».
- Final de la presentación («La última luz»): partículas que se transforman con la flecha: puntos dispersos → red de IA → cerebro en estilo plexo (nodos que llenan la silueta unidos por líneas finas, referencia elegida por Wen) → corazón → cometa que vuela hacia la estrella de la próxima noche y enciende la segunda estrella de la constelación del HUD. Wen narra cada frase; no corre solo.
- Tarjetas de la presentación (exploradoras, código y epílogo, clase `.card`): entrada escalonada, inclinación y brillo que siguen al cursor con destellos, y clic (o Enter) para destacar una tarjeta y atenuar las demás; se limpia al cambiar de escena. Sin movimiento con «reducir movimiento».
- Portada de Inicio en cielo nocturno (misma identidad que la presentación en vivo): marco oscuro con Starfield (opacidad reducida en celular para no competir con el texto) y la constelación de las tres noches con la próxima pulsando.
- Herramientas visibles: acceso directo «Tus herramientas, a un toque» en Inicio (Mi meta, Mi constelación, Mi bitácora → #meta, #constelacion, #bitacora). En el capítulo III las tres herramientas van apiladas con encabezado propio y un menú fijo para saltar entre ellas (ya no hay pestañas que oculten herramientas).
- Índice: tarjetas-capítulo con entrada en cascada. «Copiar mi meta» desactivado se ve como contorno punteado («aún no»), no deslavado.
- Mi constelación (capítulo III) es interactiva: cuatro estrellas que titilan (Intereses, Fortalezas, Experiencias, Posibilidades); al responder su pregunta la estrella se enciende y se traza la línea hacia la siguiente. Con las respuestas se genera «Mi astrolabio» (canvas 1080×1350 para descargar como PNG): Norte = Posibilidades (hacia dónde voy), Sur = Experiencias (de dónde vengo), Este = Fortalezas (con lo que cuento), Oeste = Intereses (lo que me mueve); centro = la meta SMART. Nombre opcional. Todo en localStorage (`becalas-constelacion`).
