# Cian prototype workspace

This repository is a designer workspace for clickable Cian prototypes. Read `docs/README.md` for setup and `docs/prototyping.md` for routes and data flow.

For interface design or prototype changes, use the project skill `.agents/skills/cian-design/SKILL.md`. Keep changes within the requested scenario. Reuse the available UI kit and page components; record meaningful new behavior in `docs/`.

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before delivering code changes. Inspect changed layouts in a browser. Preserve the original snapshot in `public/reference/`; adaptations belong in `src/`.

No production API or external deployment is configured. Data is synthetic and actions remain local. Do not describe inferred site patterns as official Cian policy. Do not add unrelated workshop solutions.
