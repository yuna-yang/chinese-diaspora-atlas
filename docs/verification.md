# Development verification — 2026-10-13

This is evidence for the v0.7 development interface, not approval to publish a real atlas. See [Design Doc.md](../Design%20Doc.md), [Implementation Doc.md](../Implementation%20Doc.md), the [current plan](superpowers/plans/2026-10-13-minimal-atlas.md) and [archived v0.5 verification](archive/verification-v0.5.md).

## Implemented

- Borderless geography and a gathered star graph; the 星星散/星星聚 title switches views. No search, type filters, persistent directory, hero/navigation/footer or website forms.
- Floating About, icon-only location/clear, EN/CN and compact keyboard-operable zoom/reset controls. Independent memory-only cameras and graph drags survive language/view changes.
- Selection-only profiles with public/interview/both provenance, approved fictional interview example, explicit translation fallback, dated cooperation, evidence and full-record GitHub links. Blank taps dismiss; pan, zoom, pinch and star dragging do not. About clears selection.
- Compact generic `map.json` projection, city stars, coincident-star picker at zoom12, wrapped-world/antimeridian discovery, generic neutral cooperation lines, online-only nodes in the graph and mandatory provider attribution.
- Bounded D3-force worker layout, deterministic seeds on worker failure, isolated nodes, ignored dangling links, stale-response guards, retained user drags and reduced-motion transitions.
- Existing editorial eligibility, source validation, atomic full JSON/CSV/statistics exports, recovery and privacy projection remain. Classification metadata is optional and unused by the current UI. CSV includes explicit interview provenance.
- Compatibility website routes open minimal About/profile destinations. Website contribution forms are deferred; GitHub remains the detailed-record/contributor destination.

## Observed checks

Windows, Node 24.21.0, pinned dependencies, Chromium and production static exports. External browser requests are mocked. Browser verification covers root and `/atlas-test/` exports; the canonical build was inspected separately.

| Check                            | Evidence                                                                                                                                                                                                                                                                                                                   |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit/data/component suite        | 90 tests passed across 29 files. Includes generic projection, interview consent, explicit fallback, relationship dates, wrapped longitude queries, deterministic layout, anchored camera zoom and existing editorial/recovery checks.                                                                                      |
| Source checks                    | TypeScript, ESLint, canonical validation and duplicate review passed. Dependency audit: zero vulnerabilities.                                                                                                                                                                                                              |
| Root production browser flows    | Final complete suite: 23 checks passed, including touch pinch/drag, location camera retention, wrapped discovery, navigation controls and the 2,000-node stress check.                                                                                                                                                     |
| Subpath production browser flows | 22 checks passed at `/atlas-test/`, plus the subsequent touch pinch/drag check. Includes worker asset loading, direct routes, wrapped geography and location camera preservation.                                                                                                                                          |
| Canonical recovery               | Clean empty-data build succeeded; snapshot has no demo flag/nodes/links. Fictional and reserved placeholder profile paths are absent; canonical locale/404 browser checks passed.                                                                                                                                          |
| Accessibility support            | Tested both languages at 320 px; axe found no serious/critical violations in the tested profile/About flows. Keyboard selection, Escape focus, blocked storage and reduced motion are covered. This is not complete WCAG certification.                                                                                    |
| Independent review               | One fresh read-only reviewer found six Important gaps and no Critical issues. Wrapped longitude discovery, historical dates, GitHub record destinations, labelled fallback, About interpretation/privacy and visible navigation controls were corrected with regression checks. Language-action labels were also expanded. |
| Visual inspection                | Desktop gathered profile and 320 px Chinese profile screenshots were inspected. Geographic screenshots use mock tiles and do not certify real-provider appearance.                                                                                                                                                         |

## Performance evidence and remaining work

A synthetic 2,000-node/100-link graph uses 4× CPU slowdown, cold cache, configured 1.6 Mbps download / 750 Kbps upload / 150 ms latency and locally intercepted JSON plus mocked external requests. All repeated nodes share limited fixture geography; this does not establish hosted transport/compression or geographic diversity.

The compact snapshot is 1,516,968 bytes (about 1.45 MiB), below the proposed 2 MiB target; local gzip is 24,772 bytes. Root/subpath observations including the final root run were about 35–41 seconds to render 2,000 stars, and 2.16–2.35 seconds to activate the last keyboard-picker entry. The latter includes Playwright scrolling/actionability and DOM work, not a pure handler timing. These are broad development smoke checks, not satisfaction of launch interaction/loading budgets. Initial transport/bundle costs, a scalable on-demand picker, browser paint/CLS metrics, varied geography and real hosting remain performance work. Raw current-run evidence is generated at `test-results/performance.json`.

## Launch gates still open

- Thirty human-approved primary organizations across five countries, or an explicit owner revision. Canonical records remain empty; every demo organization/interview/connection is fictional.
- Real private reporting contact and tested delivery. The configured dummy contact is nonfunctional. Website form delivery is no longer a first-release gate because forms are deferred.
- Owner license/provenance acceptance and human evidence, consent and safety review.
- Manual keyboard/contrast/text-zoom/reduced-motion review, performance budgets, provider/hosting verification and a removal-safe deployment drill.

`npm run release:check` continues to reject missing coverage, dummy private contacts, demo mode and missing license/review/private-delivery/quality confirmations. No public website has been deployed.
