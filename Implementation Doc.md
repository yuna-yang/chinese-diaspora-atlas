# Scattered Stars Implementation Specification

**Technical specification — v0.7**  
**Updated:** 2026-10-13  
**Authority:** [Design Doc.md](Design%20Doc.md). **Plan:** [minimal-atlas delivery](docs/superpowers/plans/2026-10-13-minimal-atlas.md).

## Release interface

The public website is a borderless full-viewport canvas, not a directory/dashboard. Minimal floating controls: 星星散/星星聚 title switch, About, icon-only device location, EN/CN; quiet zoom/reset controls and required attribution. No search/category filters, persistent list, type badges or on-site forms. Existing expanded routes become compatibility landings for the minimal experience. Detailed records, methods, downloads and contributions link to GitHub. A small keyboard-reachable node picker is navigation, not search.

## Reviewed data and public projection

Keep the existing version2 organization/version1 relationship storage and validation as editorial compatibility contracts, documented in the [v0.5 archive](docs/archive/implementation-v0.5.md). Eligibility `kind` remains editorial metadata, not a public node type. Category, institution subtype and cooperation-form assignments are optional; prior classifications are retained rather than deleted/invented. The current interface never uses them for colors, symbols, filters, size or ordering.

Generate compact `map.json` atomically beside the full atlas/node/edge JSON/CSV/statistics/license exports. `MapSnapshot` has version1, datasetVersion, generatedAt, demo, nodes and links. Nodes expose ID, bilingual name/summary, city/country scope, online flag, safe public links/contacts, evidence, verification and explicitly approved profile provenance. Links expose IDs/endpoints, optional branch anchors, bilingual explanation, period and evidence. They omit type/form/direction enums; factual descriptions retain meaning. One neutral line denotes documented cooperation, not reciprocal support or currentness.

Profile basis is optional `public_information`, `interview`, or `both`, default public information. Interview/both requires an `interview` object with bilingual excerpt, ISO date, safe organizational attribution, a public source URL in the evidence list, and literal `publication_permission: true`. Interview sources require shareable organization-statement evidence and source reuse permission. Validate dates/URLs/unknown properties; raw recordings, transcripts and consent files never enter the repository. Statements alone do not imply interviews. Full exports retain approved provenance.

City markers retain validated centroids; online/country-only nodes have no invented geographic positions. Explicit link anchors must belong to endpoints; infer only one unique referenced city. Country-only/ambiguous/coincident links remain described in profiles even when no line can be drawn. Institution eligibility still requires direct approved cooperation with a primary initiative.

## Shared state and navigation

One client shell owns locale, view (scatter/gather), selected ID and About state. URL writes only `view=gather`, valid `node`, and `about=1`; old search/typed parameters normalize away. Locale path is `/en/` or `/zh-CN/`. Back/forward restores safe state; language changes update language/metadata without a page reload, preserving camera/selection. No device or graph coordinates enter URLs/storage. Each canvas remembers its viewport in the current tab only.

Node activation opens one profile; another node replaces it. Empty-canvas clicks clear it; pan/drag/pinch do not. Escape and close restore focus to a node or a canvas control. Inside-panel interactions are not dismissal. About dismisses/clears the profile; return keeps mode/camera. No hover-open profiles or independent link inspectors. A profile prioritizes name, summary/provenance, approximate scope, approved interview excerpt when applicable, useful public links, concise cooperation evidence and a GitHub full-record link.

## Geography and location

Lazy Leaflet/Supercluster; stars and star-shaped aggregates, maximum zoom12; shared-city picker remains usable at the cap. Generic fixed-weight neutral lines at useful scales, no category palettes/arrows/classification legend. Tile errors do not remove stars or navigation. Provider configuration/attribution and HTTPS/localhost requirements remain in the archived contract.

Reuse the existing one-shot location hook: explicit activation only, highAccuracy false, timeout10000ms, maximumAge60000ms, finite/range-checked position, generation guards and denial/unavailable/timeout/insecure/unsupported errors. Location from gather switches to scatter. Its marker/accuracy circle are temporary navigation overlays, not dataset nodes. Locale changes/returning to scatter must not recenter on an old fix after manual panning. Clear removes the fix and remembered device-centered camera. Optional disclosure/status is contextual, not a permanent label beside the icon.

## Gathered graph and transitions

Use bounded deterministic D3-force layout in a worker: stopped simulation, 120 ticks, equal-sized stars, isolated nodes retained, approved endpoints only, no continuous timer. D3 mutates simulation objects, so create copies. Follow [D3’s static-layout worker guidance](https://d3js.org/d3-force/simulation). Worker failure retains deterministic seeded draggable positions; ignore late/stale results and preserve user-dragged nodes. Drag/camera are temporary; no exported geographic changes.

Graph supports pointer/touch node dragging, background pan, pinch/wheel zoom anchored at the pointer, keyboard zoom/pan and reset. Small gestures count as a click only below a6px movement threshold. Drag completion suppresses click selection/dismissal. Fit/reset uses available viewport and finite positions; preserve memory on mode/language changes and resize.

Gather/disperse transitions last at most800ms and use current geographic screen origins where available. Unknown anchors enter/leave without invented city coordinates. Approved lines fade with the layout; no decorative false edges. Reduced motion uses immediate changes. Controls remain active; repeated toggles cancel old transitions. DOM/canvas updates during gestures should not rerender the entire app on each frame.

## Mobile, accessibility and fallback

Use100dvh and mobile safe-area padding; full canvas remains borderless. Floating translucent controls use sufficiently opaque surfaces for contrast, visible focus and >=44px hit targets. Desktop profile floats along an edge; phone profile is a compact dismissible sheet with exposed background. EN/CN is visible, localized accessible labels identify icon actions, source fallbacks have correct lang labels. About scrolls within its overlay and has a close/back action. Empty canonical data and failed snapshot/worker/tiles have concise usable fallbacks.

Test both languages,320px reflow, keyboard/pointer/touch, reduced motion, blocked storage, permission denial, coincident nodes and online-only graph discovery. Automated axe is supporting evidence, not complete WCAG certification.

## Quality and release

Retain pinned Node24/npm11, unprivileged SHA-pinned CI and static Next export/base-path verification. New graph packages are pinned. Verify source/type/lint/format/unit and production browser flows at `/` and `/atlas-test/`, plus canonical empty-data build/removal safety. Measure a2000-node untyped projection and worker interaction; proposed snapshot budget<=2MiB and CLS<=0.1 remain targets. Record transport/hardware limits rather than silently relaxing them.

Canonical data is empty, demo is explicit, and EU-first is undecided. Real reviewed seeds, private reporting, owner licenses/provenance, manual quality/provider/hosting checks and a removal-safe deployment remain launch gates. Website form-delivery checks are no longer first-release gates because forms are deferred; public GitHub and a real private route replace them. No outreach or public site deployment is authorized by this implementation.

The minimal interface is implemented; legacy editorial helpers remain for compatibility. Current verification and unresolved launch budgets are recorded in [docs/verification.md](docs/verification.md).
