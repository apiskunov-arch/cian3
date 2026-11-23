---
name: cian-design
description: Build and refine clickable Cian interface prototypes in this repository using its extracted design tokens, React UI kit, page components and site references. Use for screens, flows, states and visual review within this Cian workspace.
---

# Cian design

Build a complete, clickable version of the requested scenario using this repository’s existing Cian materials. Match the user's requested scope. The workshop starter is not the full production product.

## Find the right level of reuse

Paths below are relative to the repository root. Read `docs/prototyping.md` for routes, state and page-composition props. Inspect the relevant components before adding a new one:

- `src/ui/index.tsx` exports Button, Input, Select, Checkbox, Radio, Badge, Text, Icon, Modal, Tooltip, Spinner and Skeleton. API differences from the extracted package are documented in `docs/README.md`.
- `src/components/Layout.tsx` contains Header, Footer, AppShell, PageLayout and Breadcrumbs.
- `src/components/Realty.tsx` contains search, filters, sorting, listing cards, gallery and listing actions.
- `src/templates/PrototypePage.tsx` supplies a new-page composition. Register routes in `src/App.tsx` and connect them with React Router links.
- `src/data/listings.ts` owns the Listing type and fixtures. `src/hooks/PrototypeContext.tsx` provides shared favorites, demo dialogs and notifications; import `usePrototype` from `@/hooks/prototype-context`.

Open `/ui` for base variants and `/patterns` for compositions and states. Use the existing props before changing shared components; if a new scenario needs an additional prop, make the addition explicit and preserve existing callers.

## Preserve the Cian visual language

Consult `docs/references/README.md` and the screenshot matching the page and device. The 12 November token snapshot and the 16 November screenshots have different dates; document discrepancies instead of silently replacing the snapshot.

Use Lato from the repository and semantic CSS variables from `public/reference/tokens/`. The main action is `--control-main-primary-default`; body text is `--text-primary-default`; secondary backgrounds are `--background-secondary`. Choose tokens by role. The available spacing scale is `--unit_0` through `--unit_13`. Buttons use XS/M/L heights 36/44/56 px. Avoid importing another styled UI library for controls already available here.

Use CSS Modules for new compositions. Adapt layout for 390 px and desktop. The production mobile screenshots show a distinct mobile rendering; the starter is a responsive React approximation. Preserve control usability rather than squeezing a desktop arrangement into a narrow viewport.

## Make the scenario work

Reuse the shared prototype state where it applies. Keep filters shareable in URL search parameters. Use deterministic fixtures for new scenarios; this workspace has no production API or authentication. New forms should show a meaningful local result, provide labels and visible validation, and support keyboard use.

Treat loading, empty data and failures as part of the requested flow when those states can occur. Modal comes with Escape handling and focus restoration. When an action is outside the prototype’s scope, use the existing demo dialog or a clear disabled state instead of sending users into an unrelated live service.

Observe the site's concise labels and familiar real-estate vocabulary. These are workshop recommendations, not an official editorial policy. Keep verified source facts separate from adaptations and assumptions; see `references/evidence.md`.

## Verify the result

Run the relevant checks listed in `AGENTS.md`. Walk through the changed scenario in the browser, including its exit/back path and any important error state. Check 1440 px and 390 px, long labels, horizontal overflow and Tab/Enter/Escape. Use `/patterns` to inspect existing state examples. Add behavior tests for meaningful new logic rather than assertions about implementation wording.

Update the relevant document in `docs/` when adding routes, data or interaction behavior. Report what works and any intentional prototype limits; do not claim full production equivalence.
