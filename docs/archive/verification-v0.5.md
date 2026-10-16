# Development verification — 2026-10-12

This records development evidence, not public-launch approval. Product purpose is in [Design Doc.md](../Design%20Doc.md); contracts are in [Implementation Doc.md](../Implementation%20Doc.md).

## Implemented

- Bilingual directory, search, filters, pagination, shareable node/relationship selections, browser history and locale switching.
- Schema-v2 organizations/institutions, schema-v1 relationships, checked references, evidence/period/anchor rules and duplicate review.
- Integrated clustered map with distinct equal-size node symbols, one-hop partner context, zoom-aware relationship patterns, direction and evidence panels. Coincident and non-geographical cooperation remains available in lists.
- Optional browser device location with explicit activation, denial/error fallback, clear control and temporary in-memory coordinates.
- Bilingual node profiles, partner evidence, period explanations, verification dates, founding/reach/public organizational contact context and labelled language fallback.
- Atomic joined atlas/node/edge JSON, both CSVs, coverage counts and data-license download.
- Add-node/add-edge/correction/translation/questionnaire drafts, previews and local JSON downloads. Typed relationship corrections work. Confidential and hidden-mode fields stay out of public Issue handoffs; placeholder email/removal channels remain disabled. No form claims delivery.
- Contributor policies, proposed open licenses, public templates and read-only SHA-pinned CI. No deployment job.

## Checks observed locally

Windows, Node 24.21.0, pinned npm workspace dependencies, headless Playwright Chromium. The initial [Linux CI run](https://github.com/yuna-yang/chinese-diaspora-atlas/actions/runs/38306716718) also passed installation, data/types/lint/format/unit tests, both production browser paths and the canonical build:

| Check                                          | Evidence                                                                                                                                                                                                                           |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean dependency installation                  | `npm ci` succeeded; dependency audit reported zero vulnerabilities. Install/build must run sequentially on Windows to avoid native-module locks.                                                                                   |
| Data/schema/reference and unit/component tests | 78 tests passed, including canonical-schema synchronization, private proposal projection, period/fallback rendering and invalid-input recovery.                                                                                    |
| TypeScript / lint / formatting                 | Checked with the repository scripts. Generated Next.js declarations are excluded from formatting/source.                                                                                                                           |
| Root static demo                               | 19 production browser checks passed.                                                                                                                                                                                               |
| `/atlas-test/` static demo                     | The same 19 browser checks passed, including direct routes/downloads and locale/selection preservation.                                                                                                                            |
| Accessibility support                          | Axe found no serious/critical issues in tested bilingual atlas, contribution and institution-profile pages; tested 320 px reflow. This does not establish complete WCAG conformance.                                               |
| Resilience                                     | Device permission denial and blocked storage preserve manual search; rapid locale switching flushes pending search; coincident map nodes remain selectable.                                                                        |
| Data recovery                                  | Invalid inputs leave prior exports intact; removing a fixture node regenerates empty JSON/CSV. Canonical rebuild removed demo profile paths and pruned the reserved empty-collection route.                                        |
| Code review                                    | Fresh reviewer found four Important gaps; safe links, typed relationship corrections, period/verification context and crowded-scale edges were corrected. Characteristic patterns and selection normalization were also corrected. |

GitHub draft handoff selects the supplied Markdown template explicitly because blank issues are disabled. This follows [GitHub’s documented template/body query parameters](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue). No Issue or outreach message was posted during testing.

## Performance evidence and limits

The synthetic test uses 2,000 nodes (including multiple locations), 100 sparse relationships, cold browser cache, 4× CPU slowdown, configured 1.6 Mbps down / 750 Kbps up / 150 ms latency, and mocked external tiles. The dataset response is intercepted locally; this is a rendering stress test, not proof of hosted transport/compression. Geographic diversity is limited to two demo cities.

Root repeat and subpath observations: LCP approximately 1.14–1.19 s; CLS 0.0142; browser-observed search render 394–428 ms including the 200 ms debounce. The full compact synthetic JSON is 2,388,193 bytes (about 2.28 MiB), versus the proposed 2 MiB target; gzip is 34,830 bytes, but hosted compression was not verified. Search after debounce was near the proposed 200 ms target and exceeded it on one repeat. These budgets remain open, rather than being silently relaxed. Initial route JS size, more varied geography, real hosting/network behavior and manual quality checks still need release evidence.

The automated development smoke threshold is broader than the proposed launch budget. A passing stress test therefore does not certify the launch budgets. Raw local observations are generated in `test-results/performance.json`.

## Launch gates still open

- Thirty human-approved primary organizations across five countries, or an explicit owner revision; real connections require evidence rather than an edge quota. Canonical data is intentionally empty.
- Owner license/provenance acceptance, editorial capacity and independent review decisions.
- Working private removal/reporting channel and tested non-GitHub editorial delivery. The authorized dummy contact cannot receive reports.
- Full manual keyboard/focus/contrast, 200% text zoom and reduced-motion review, completed performance budgets and real provider/hosting verification.
- Removal-safe deployment/rollback drill, repository review protections, exact tested artifact deployment and actual-host smoke checks.

`npm run release:check` rejects missing coverage, demo mode, dummy channels and absent review/license/delivery/quality confirmations. Development source publication and public atlas deployment are separate milestones. No public site has been deployed.
