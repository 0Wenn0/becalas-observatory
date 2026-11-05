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
- Comet cursor must be clearly visible: glowing star head offset from the pointer tip, star-trail particles, and a star burst + ring on every button/link click.
