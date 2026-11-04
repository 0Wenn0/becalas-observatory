# Design QA · BécALAS Conectadas × Cognitive Observatory

**Final result: passed**

## Comparison target

- Source visual: user-provided recording, `C:\Users\warb-\Downloads\Grabación 2026-11-04 161235.mp4`.
- Source frame used for the route review: `C:\Users\warb-\Documents\Codex\2026-11-04\files-mentioned-by-the-user-manual\work\claude-frame-01.jpg` (1400 × 1242 px).
- Rendered implementation: `http://127.0.0.1:4173/#recorrido`.
- Implementation capture: Codex in-app browser, 855 × 656 px. The browser capture was reviewed side by side with the source frame in a temporary comparison view; no separate screenshot file was exported.
- The source is being used as a structural reference, as requested. The source and implementation captures have different pixel dimensions, so this review compares information hierarchy and interaction structure, not pixel-level fidelity. No device frame or density normalization was applied; CSS viewport and device scale factor were not exposed by the capture surface.

## Visible comparison

- Full view: both pages lead with a welcome, explain the mentor relationship, provide a three-session route, and continue into practical support sections. The implementation makes sessions expandable so participants can move directly to the meeting they need.
- Focused route region: the source shows three parallel session cards. The implementation presents the same three sessions as a numbered editorial sequence, with the first session expanded to show its objective, suggested activities, questions, resources, and a link to the reflection log. This layout change is intentional: it preserves the content while making the long session details easier to scan on narrow screens.
- Brand: the implementation follows the Cognitive Observatory palette and type direction in the brief. A restrained lilac accent comes from the supplied BécALAS welcome graphic. The source recording's purple panels, prompt generator, and fixed Saturday dates were not carried forward because the mentoring manual does not require the AI activity or specific Saturdays.

## Fidelity surfaces

- Typography: Cormorant Garamond carries editorial headings; Inter carries navigation, controls, and body copy. The hierarchy remains legible in the 855 px browser view.
- Spacing and layout: generous section spacing, a split hero, and row-based session details distinguish the content without repeating the source's card grid. The mobile layout stacks content and keeps navigation horizontally scrollable.
- Colors: deep navy, warm ivory, rose, dawn, signal blue, and a small lilac accent connect the two supplied identity references.
- Imagery: one original, restrained cognitive-map illustration supports the hero and interactive constellation. It avoids literal galaxy and AI imagery.
- Copy: objectives, activity timings, contacts, code of conduct, and linked references are taken from the manual or the supplied welcome material. Suggested activity times are labeled as suggestions; the page retains the one-hour session length and notes that timing should be adapted.

## Interaction review

- Session accordions open and expose the corresponding session details.
- Constellation controls change the selected dimension and its reflection prompt.
- The breathing guide opens and closes, follows the manual's self-paced exercise, and does not prescribe a timing cadence absent from the source.
- The SMART planner updates its preview and saves locally.
- The bitácora saves to local browser storage, survives a reload, and clears the selected session.
- The browser console was checked after a fresh load; no current errors were reported.
- Production build completed successfully with `npm run build`.

## Findings

- No actionable P0, P1, or P2 visual or usability findings remain.
- P3 follow-up: if BécALAS shares a standalone logo or brand-token file, replace the text-only program lockup and confirm the lilac accent against that source.

## Comparison history

- First interaction pass found the initial breathing control added a fixed four-second rhythm not specified by the manual. The timer was removed and replaced with a self-paced guide based on the manual's breathing instructions.
- The initial preview load surfaced an export issue in the app entry point. The export was corrected; the page then loaded and the fresh browser capture reported no current errors.

## Implementation checklist

- [x] Preserve the real three-session structure and one-hour session length.
- [x] Keep the manual's optional and suggested content clearly labeled.
- [x] Make the session sequence, map, SMART planner, and bitácora interactive.
- [x] Respect reduced-motion preferences and keyboard focus visibility.
- [x] Build the site and review it in the in-app browser.
