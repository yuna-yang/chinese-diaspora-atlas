# Minimal Scattered Stars Implementation Plan

> **For agentic workers:** Use executing-plans inline and test-driven-development; one fresh whole-change review after verification. Development is authorized by the owner’s “continue dev”.

**Goal:** Implement Design Doc v0.7 as a borderless bilingual 散/聚 atlas with one star/link style and selection-only profiles.

**Architecture:** Existing reviewed records generate a compact untyped `map.json` snapshot. A shared client shell owns view/language/selection and transient location; lazy Leaflet geography and worker-laid-out graph canvases retain independent memory-only cameras. GitHub is the detailed-record/contributor destination.

**Stack:** Existing Next/React/TypeScript/Leaflet/Supercluster; pinned D3 force and types for bounded worker layout; Vitest and production Playwright/axe.

**Spec:** [Design Doc.md](../../../Design%20Doc.md), v0.7; [Implementation Doc.md](../../../Implementation%20Doc.md).

## Global constraints

- No search, filters, permanent directory, hero, navbar/footer, typed symbols, analytics or on-site forms.
- Floating title toggles 星星散/星星聚; About, icon-only location, visible EN/CN and quiet essential controls.
- One generic equal-size star and one generic neutral documented link. Only star activation opens a profile.
- Canvas tap/click closes; drag/pan/zoom does not. Escape and close restore sensible focus.
- Mode/locale changes preserve selection/camera; About dismisses profile and returns to the same viewport.
- Device position stays in memory; location from 聚 switches to 散; clear removes stored position and resets its remembered camera.
- Interview provenance is explicit, optional, publication-approved; never infer it from an organizational statement.
- EU-first undecided; canonical data empty; synthetic demo conspicuous; private contacts/real-data approvals gate launch.

## Review focus

1. Multiple nodes at one city stay selectable at zoom cap (Task 3).
2. Pointer drags, pinch and post-drag clicks do not open/dismiss profiles (Tasks 2/4).
3. Locale/view/back navigation retains current state without leaking coordinates (Tasks 2/3).
4. Worker failure, late responses and reduced motion preserve usable graph interaction (Task 4).
5. Missing translations, empty data, offline tiles and absent contacts retain accessible navigation (Tasks 2/5).

## Task 1: Compact snapshot and explicit provenance

**Files:** `scripts/lib/map-snapshot.ts`, `website/src/features/minimal/contracts.ts`, node/edge schemas, validation, generator, `tests/data/map-snapshot.test.ts`.
**Interfaces:** `buildMapSnapshot(dataset: Dataset, demo: boolean): MapSnapshot`; snapshot nodes have one shape (names/summary/locations/links/sources/provenance), links have IDs/endpoints/description/period/evidence, no classification fields.

- [x] Write/run RED tests: compact projection excludes kind/category/types/forms and raw/private interview extras; supports optional approved interview/both basis; unknown endpoints and unique-city inference remain valid; source snapshots are immutable.
- [x] Implement projection, optional provenance validation, optional editorial subtypes and atomic `map.json` output; full JSON/CSV tools retain provenance and legacy metadata.
- [x] Run data/unit/type checks; inspect real generated demo and canonical snapshot. Expected all pass, canonical nodes/links empty.

## Task 2: Minimal shell, state and panels

**Files:** `features/minimal/MinimalAtlas.tsx`, `state.ts`, `messages.ts`, `ProfilePanel.tsx`, `AboutPanel.tsx`, `minimal.css`; locale routes and compatibility landing routes.
**Interfaces:** `ViewState {view: scatter|gather, locale: en|zh-CN, selectedId:string|null, about:boolean}`; parser/serializer write only view/node/about, never coordinates/search. Canvas contract takes snapshot/locale/selection/select/dismiss and memory refs.

- [x] Write/run RED browser tests: full viewport/no search/nav/sidebar; star opens one panel, outside closes, profile controls do not close; EN/CN preserves mode/node; About clears selection; profile source links and explicit provenance.
- [x] Implement root state and readable floating controls, non-search accessible picker, icon-only location/clear, focus/Escape, compact About/GitHub and source fallbacks. Retire expanded website routes to minimal landing rather than exposing old UI.
- [x] Run focused production browser and state/provenance tests. Expected pass in both languages at 320px and desktop.

## Task 3: Borderless geography

**Files:** `features/minimal/GeoCanvas.tsx`, shared types and marker helpers; reuse validated map provider and visitor-location hook.
**Interfaces:** `GeoMemory` holds camera, last handled location revision and current node screen positions; no persistence/URL coordinates. Every physical branch is a city marker; one node profile per ID.

- [x] Write/run RED tests: clustered coincident nodes at cap12 selectable; no invented online/country-only coordinates; active-only device request; denial fallback; language switch does not recenter after manual pan.
- [x] Implement one star marker/cluster style, generic noninteractive relation lines at usable scales, click-only selection, outside dismissal without drag dismissal, attribution/tile fallback, retained camera and safe clear/reset.
- [x] Run geolocation/marker and production browser checks. Expected no coordinate URL/storage/export leak.

## Task 4: Gathered worker graph and motion

**Files:** `features/minimal/GraphCanvas.tsx`, `graph-layout.ts`, `graph.worker.ts`, `camera.ts`, layout/camera tests.
**Interfaces:** deterministic `layoutGraph(nodes, links): Point[]`; `GraphMemory` retains positions/camera/dragged IDs; worker receives IDs/endpoints only. Camera supports fit, pan, zoom around pointer and screen/world conversion.

- [x] Write/run RED tests: finite deterministic layout, isolated nodes survive, dangling links skipped, input untouched; pointer-anchor zoom invariance; dragged stars persist and never select until an actual click.
- [x] Implement lazy worker (120 stopped ticks, no continuous drift), fallback seeds, stale-response guards, node drag, pan, pinch/wheel/keyboard zoom, reset, same-size screen stars and generic edges. Gather/disperse transitions <=800ms; immediate reduced-motion switch.
- [x] Run worker/gesture production tests including failure/reduced-motion and root/subpath asset paths. Expected usable graph and no fabricated links.

## Task 5: Verification and handoff

**Files:** current browser tests/workflow/READMEs/verification report and this plan.

- [x] Replace superseded website tests with minimal-flow assertions; retain meaningful editorial/privacy unit tests. Add both-language axe/reflow, empty/error/blocked-storage and synthetic2000-node projection/graph smoke evidence.
- [x] Run type/lint/format/unit, root+subpath static demo/e2e, canonical clean build and audit sequentially where outputs/dependencies overlap.
- [x] Request one fresh review; fix Important/Critical findings with RED→GREEN checks; document measured limitations and unchanged human launch gates.
- [x] Commit reviewed source on the feature branch and refresh local preview. Source handoff can follow existing repository authorization; no public site deploy.

## Execution evidence — 2026-10-13

90 unit/data/component tests passed; type/lint/format/data/duplicate/audit checks passed. Final root production suite 23 passed; subpath 22 plus subsequent touch check passed. Canonical empty-data build and profile-route pruning passed. One fresh whole-change reviewer found six Important/no Critical; accepted fixes and regression checks are recorded in docs/verification.md. Desktop/mobile screenshots were inspected. Source handoff uses feat/minimal-atlas and a local static preview; public launch remains gated. The 2,000-node compact snapshot is 1.45 MiB, but constrained cold load/profile activation remain open performance work.
