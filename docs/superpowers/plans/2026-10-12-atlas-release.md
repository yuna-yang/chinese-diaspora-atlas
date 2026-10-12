# Scattered Stars Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for the primary-worker implementation, or superpowers:subagent-driven-development only when that method is selected. Check off steps using actual verification evidence. Development is authorized; a public site release still requires the specified launch gates.

**Goal:** Build 星散 · Scattered Stars as one bilingual geographical and civic-relationship atlas, with reviewed data, device location, accessible participation, and reusable exports.

**Architecture:** Reviewed node/edge JSON and city/taxonomy references feed an offline validated snapshot. Next.js static pages and client-side Leaflet/Supercluster provide directory/map/network exploration. Static web forms prepare proposals for editor review; GitHub supports public contributions, while private channels handle sensitive material.

**Tech Stack:** Node 24/npm 11, pinned React/Next.js/TypeScript, Leaflet/Supercluster, Ajv/schema-derived types, Vitest/Testing Library, Playwright/axe, GitHub Actions/Pages.

**Product authority:** [Design Doc.md](../../../Design%20Doc.md), v0.5.  
**Technical authority:** [Implementation Doc.md](../../../Implementation%20Doc.md), v0.5. Read both; this plan defines execution, not a second product specification.

## Baseline and scope changes

The earlier documentation baseline is preserved locally on `feat/atlas` (commit `23276f4`). The v0.5 development implementation now includes the node/relationship migration, integrated atlas, profiles/exports and private-safe static participation flow. See [verification evidence](../../verification.md) for observed checks and remaining launch gates. The detailed steps below distinguish implemented code from broader acceptance/launch work.

The public repository [yuna-yang/chinese-diaspora-atlas](https://github.com/yuna-yang/chinese-diaspora-atlas) was created. Canonical reviewed nodes are empty; demo fixtures are opt-in and visibly synthetic. This plan adds network/schema migration, form transport, expanded QA, and release work. No milestone is complete merely because earlier legacy code exists.

## Global constraints

- Code and curated datasets are open source; development tools need not be.
- Working name is 星散 · Scattered Stars. Civic relationships are now core; this supersedes their previous deferral.
- Automated discovery, Hong Kong, event calendar, researcher API, history browser/time slider, organizational depth, impact scores, and advanced graph analytics remain deferred.
- One map integrates geographic/network exploration. Equal baseline node size and fixed edge weight; no degree-driven importance.
- Primary nodes are eligible diaspora initiatives; institutions require an approved direct primary relationship. No recursive unrelated-institution inventory.
- Coordinates are city references. Visitor device coordinates remain temporary memory and never enter data, URLs, storage, logs, or exports.
- Route locales `en`/`zh-CN` map to text keys `en`/`zh`; UI and evidence fallbacks are labelled.
- Defaults: primary kind, active/unknown, 20 results/page, 200 ms search debounce, query max 200; all relationship characteristics and period statuses.
- Stale is >180 days at release time; ages 180/181 are fresh/stale. Past edges remain labelled, not silently current.
- Unknown founding/reach stay unknown; governance/funding/relationship characteristics are distinct claims.
- Proposed forms/testimony remain unpublished until evidence, permission, and safety review. Confidential fields cannot enter public GitHub handoff.
- Dummy contact `placeholder@example.invalid` is visibly nonfunctional; real delivery/private contact and owner license/capacity decisions gate launch.
- Tests/builds do not contact live organization sites, tiles, or geocoders. Synthetic artifacts cannot be released as real data.

## Review focus

1. Multi-location endpoints must not create invented city/country matches or all-branch relationship lines: Tasks 2, 5, 6.
2. Unconnected primaries and coincident city nodes/edges remain discoverable without importance ranking: Tasks 5–7.
3. Removing a node/edge/contact must remove joined outputs and survive rollback: Tasks 3, 4, 7, 11.
4. Permission denial, blocked storage, and missing Chinese translations preserve usable manual exploration: Tasks 1, 5–7.
5. Private questionnaire material must never enter an Issue, share link, export, or fake delivery confirmation: Task 8.

## Shared contracts

Derive `Organization` (version 2) and `Relationship` (version 1) from canonical JSON Schema; re-export them for the website. `Dataset` is the complete version-2 `atlas.json` snapshot. `ReferenceData`, `ValidationIssue`, `ReviewReport`, and `Statistics` retain focused shared modules; statistics separate primary/institution/edge coverage.

Exact implementation interfaces:

- `validateRecords(nodes: unknown[], refs: ReferenceData, today: string): ValidationIssue[]`.
- `validateRelationships(edges: unknown[], nodes: Organization[], refs: ReferenceData, today: string): ValidationIssue[]` includes anchor/eligibility/orphan checks.
- `reviewRecords(nodes: Organization[], refs: ReferenceData, today: string, decisions: DuplicateDecision[]): ReviewReport` plus equivalent edge duplicate review.
- `buildDataset(nodes: Organization[], refs: ReferenceData, generatedAt: string, edges?: Relationship[], metadata?: {license:string, attribution:string}): Dataset` hashes all content/declarations, never timestamp.
- `serializeCsv(dataset: Dataset): string` for nodes; `serializeRelationshipsCsv(dataset: Dataset): string` for edges.
- `computeStatistics(dataset: Dataset, today: string): Statistics` counts primary nodes separately from institutions/edges.
- `parseAtlasState(params: URLSearchParams, refs: ReferenceData): AtlasState` and `serializeAtlasState(state: AtlasState): URLSearchParams`, extended with kind/institution/relationship/period/selection state.
- `filterOrganizations(dataset: Dataset, state: AtlasState): Organization[]`; `filterRelationships(dataset: Dataset, state: AtlasState): Relationship[]` keeps primary visibility independent.
- `buildMarkers(nodes: Organization[], refs: ReferenceData): AtlasMarker[]`; `resolveRelationshipAnchors(edge: Relationship, nodes: Organization[], refs: ReferenceData): {sourceCityId:string,targetCityId:string}|null` never fabricates geography.
- `useVisitorLocation(onLocated?: () => void)` exposes the existing idle/locating/located/error state, one-time request, temporary position, error, clear.
- `publicProposal(form: ProposalDraft): PublicProposal | null` includes only permitted public fields; private/download draft remains separate.

The implementation document owns full field/enums and URL rules. A consuming task must read producer types rather than inventing a second shape.

## Task 1: Foundation, UTF-8, and trustworthy test harness

**Files:** root npm/TypeScript/ESLint/Prettier/Playwright configs, `scripts/serve-static.ts`, `website/next.config.ts`, locale layouts/dictionaries, `tests/e2e/test.ts`, `tests/e2e/foundation.spec.ts`, `tests/unit/i18n.test.ts`.

**Produces:** reproducible static root/subpath build, offline browser fixtures, intact Chinese resources.

- [x] Initialize `feat/atlas`, commit the documentation baseline, pin packages/lockfile, and verify Node/npm using Windows `.cmd` wrappers.
- [x] Establish bilingual routes; root refresh/not-found browser tests passed (2/2) before scope changes.
- [x] Fix browser JSON imports through explicit Node JSON import attributes or filesystem fixture loading. Re-run the suite and compare each error to actual app behavior.
- [x] Add a meaningful locale regression rejecting corrupted question-mark resources; restore UTF-8 and change working-name copy to Scattered Stars. Verify dictionary key parity and Chinese browser headings/controls.
- [x] Build/test at `/` and `/atlas-test/`; check direct assets/download routes, not an SPA fallback. Run root `typecheck`, `lint`, unit suite, and foundation e2e; commit after verified results.

## Task 2: Version-2 nodes and references

**Files:** node schema, generated schema/types, `scripts/lib/contracts.ts`, `validation.ts`, `input.ts`, reference JSON, fixture nodes, `tests/data/validation.test.ts`.

**Consumes:** legacy version-1 schema and technical section 3. **Produces:** version-2 nodes, checked references, supported primary/institution fields.

- [ ] Write failing cases for kind/type mismatches, founded year/evidence, reach/source mismatch, role contacts without evidence, unknown properties, malformed reference coordinates/provenance, and legacy schema rejection. Retain existing unsafe URL/date/location/source cases.
- [x] Explicitly migrate fixtures with only structural defaults; add synthetic primary/institution/fallback/country-only/online/multi-city cases. Never insert them into canonical data.
- [x] Implement schema-derived types and semantic/reference validation; primary scope and institution identity are distinct checks. Reject personal contact/private invitation content editorially and impossible dates/fields automatically.
- [x] Run full unit/type checks and CLI data validation; inspect file/field errors and source compatibility rules. Commit the node migration.

## Task 3: Relationship schema, evidence, periods, eligibility

**Files:** `data/schema/relationship.schema.json`, `data/relationships/`, `data/relationship-duplicate-decisions.json`, `scripts/lib/relationships.ts`, shared loader/review/validation, `tests/data/relationships.test.ts`.

**Consumes:** version-2 nodes/reference IDs. **Produces:** validated `Relationship` and cross-record consistency.

- [ ] Write failing tests: dangling/self endpoints, no primary endpoint, orphan institution, unsupported direction/classification, malformed/reversed partial periods, future start, nonmember anchors, and unclassified/multitype distinctions. Valid reciprocal/directed/past/unknown examples pass.
- [x] Implement period precision/order and evidence requirements. Canonical undirected reordering includes anchors; directed provider/recipient order is preserved. Report likely duplicate collaborations without deleting distinct periods/forms.
- [ ] Test deletion effects and documented duplicate exceptions. Confirm a bare mention/shared identity cannot automatically establish an edge or characteristic.
- [x] Run node/edge/CLI review and complete unit/type checks; commit graph contracts.

## Task 4: Joined snapshots, safe exports, coverage counts

**Files:** generator/export/statistics modules, `scripts/build-data.ts`, export tests, dataset loader.

**Consumes:** validated nodes/edges/references. **Produces:** atomic atlas/node/edge JSON/CSV/statistics with a shared release hash.

- [ ] Extend failing tests for edge/reference/license changes affecting hashes, timestamp-only stability, primary vs institution counts, multi-type overlap, all-status exports, Chinese quoting/formula injection, and self-contained IDs/references.
- [x] Generate `atlas.json`, both principal JSON/CSV datasets, statistics, and license/attribution. Stage/swap only after every validation/write succeeds; old output survives invalid input.
- [x] Add integration deletion test proving stale profiles/data are not left by clean rebuild; fixtures and private material stay absent from canonical output.
- [x] Run complete tests, `data:validate`, `data:review`, `data:build`, and static build; inspect both principal downloads. Commit generator changes.

## Task 5: Directory and independent node/edge URL filters

**Files:** atlas search/state/filters/directory/components/dictionaries, corresponding unit/e2e tests.

**Consumes:** joined Dataset. **Produces:** kind/type/characteristic/period controls and consistent URL/back/locale state.

- [ ] Write failing tests for primary/institution/all, characteristic OR/unclassified, period filters, same-location matching, pagination, invalid parameters, and unconnected primary survival.
- [x] Extend parser/serializer and search helpers; allow explicit published node selection outside filters with labelled context; selected edge must be incident and match edge filters. Test a Copenhagen-filtered primary selecting its Berlin primary partner without changing country or directory count. Keep 20/page, token AND/category OR, 200 ms debounce, all-language search, and labelled fallback.
- [x] Implement accessible controls and banners distinguishing context institution nodes from primary result counts. Clicking an edge never silently ranks/restricts organizations by degree.
- [ ] Run unit/component and bilingual directory/browser-back/locale tests, including blocked storage/no-results/data failure. Commit directory behavior.

## Task 6: Integrated network map and device location

**Files:** atlas map/client/markers/config/location files, `website/src/features/network/network.ts`, `edge-presentation.ts`, `RelationshipList.tsx`; marker/location/anchor tests, map/geolocation/network e2e.

**Consumes:** filtered nodes/edges, shared selections, refs. **Produces:** one integrated geographical/relational map and accessible evidence selection.

- [ ] Retain existing location tests; add insecure/unsupported/invalid/repeated/late-callback cases. Fake device latitude 55.6761/longitude 12.5683; accuracy 5,000 vs 5,001 selects zoom 10 vs 6. No automatic page-load request or coordinate persistence.
- [ ] Write failing network cases for directional/multitype/past edges, equal-size node symbols, coincident nodes/loop or relation-list access, and ambiguous multi-city/online endpoints with no invented line.
- [x] Implement reviewed one-hop context for both primary and institution partners, clustering through cap 12, fixed-weight accessible edges, provider arrows/text, evidence panel/list selection and focus restoration. Test successive cross-filter partner selection changes the one-hop center while filters/counts remain intact. Preserve directory and map outage fallback.
- [ ] Run unit and production browser tests at desktop/mobile with all external requests mocked. Confirm tile attribution, denial fallback, map/list preservation, no live geocoder, and no currentness/importance inference. Commit map/network changes.

## Task 7: Profiles and methodological context

**Files:** profile/data/about/privacy routes/components, bilingual dictionaries, profile/data-page e2e.

**Consumes:** same release Dataset/Statistics. **Produces:** shareable node profiles, evidenced relationship lists, secondary context, all data downloads.

- [ ] Write failing tests for kind labels, sourced founded/reach/role contacts, partner links, direction/period/provenance, unknown secondary omissions, and missing-language fallback.
- [x] Generate both locales for every published node; retain direct subpath refresh and static unknown/deleted-ID behavior. Add relationship/profile anchors and correction/removal links.
- [x] Update methodology to explain bonding/bridging/linking/missing-network bias; counts remain descriptive and do not form a separate impact dashboard.
- [ ] Rebuild after node/edge/contact deletion and assert all profiles/joins/counts are safe. Run profile/data/privacy e2e; commit pages.

## Task 8: Web proposals and voluntary questionnaire

**Files:** `website/src/features/contribute/ProposalForm.tsx`, `proposal.ts`, contribution route/project configuration; proposal unit/e2e.

**Consumes:** known IDs/criteria, six questionnaire prompts, owner-configured channels. **Produces:** validated preview/download, public-safe GitHub handoff, and truthful email-draft flow without a GitHub account.

- [ ] Write failing tests for missing evidence, unsafe links, unknown candidate endpoints, field-level publication choices, confidential answers excluded from public Issue links, and no “sent” claim without delivery.
- [x] Implement add-node/add-edge/correct/translate/questionnaire forms, readable preview, JSON download, and optional mail draft. Mail attachment/send happens in the user's client; no backend or automated outreach.
- [x] Configure real repository URL and explicitly dummy contact. Keep send/private reporting actions disabled for placeholders; local preview/download remains usable. Validate real channels before release.
- [ ] Run bilingual/keyboard/mobile tests and inspect public/private payload separation. Commit the participation flow.

## Task 9: Governance, licenses, contributor tooling, CI

**Files:** bilingual README/CONTRIBUTING, policy documents, licenses, `.github/ISSUE_TEMPLATE/` (including relationship proposal), CODEOWNERS/PR template, unprivileged checks workflow, environment example.

**Consumes:** authoritative design/technical rules and actual repo owner. **Produces:** documented review/governance, meaningful npm checks, secure PR CI.

- [x] Create reviewed contributor templates and documentation for nodes/edges/translation/privacy/appeals. Do not publish confidential submissions or invent maintainer contact identities.
- [x] Package proposed MIT code and CC BY 4.0 original dataset licenses with third-party provenance boundaries; record owner acceptance as a launch setting.
- [x] Implement read-only/no-secret PR checks with SHA-pinned Actions. Run data/types/lint/format/unit/build/offline e2e, including demo-mode testing then canonical-production verification. No privileged contributor execution.
- [ ] Verify clean Windows installation and CI Linux results, all script names, no tracked generated artifacts/secrets, and dependency audit applicability. Commit documentation/CI.

## Task 10: Editorial seeds, accessibility, performance, review

**Files:** reviewed canonical nodes/edges/references, synthetic performance fixtures, accessibility tests, release checklist/evidence.

**Consumes:** credible manually collected public sources and human editorial decisions. **Produces:** reviewed launch collection and measured quality evidence.

- [ ] Prepare at least 30 approved primary groups across 5 countries, or an explicit owner revision to that target. Connections are included only where genuine evidence exists; no quota-driven fabricated edges. Second review contested/sensitive claims.
- [ ] Check every node/edge/link/source/permission/context. Resolve duplicate suggestions; verify organization-origin claims and removal routes. Until approval, keep real candidates outside published directories.
- [ ] Run axe plus manual keyboard/focus/contrast, 200% text zoom, 320 px reflow, reduced motion, and both-language flows. Correct issues with regression tests.
- [ ] Measure 2,000 synthetic nodes plus sparse edges under the technical budgets; record tool/device/network settings and fix demonstrated bottlenecks. Restore canonical output and confirm no demo artifacts.
- [x] Run full verification and the executing-plans whole-branch reviewer. Record/fix important findings with failing regression tests before claiming readiness.

## Task 11: Repository handoff, verified artifact, safe release

**Files:** trusted manual deployment workflow, hosting/removal-recovery tests, release runbook.

**Consumes:** tested code/artifact, owner release settings, reviewed data. **Produces:** versioned repository handoff and, when launch gates are satisfied, a tested public site.

- [x] Create the authorized public repository and local `origin` remote; no token/credential is stored in project files.
- [ ] Commit/push the reviewed implementation and document actual checks/remaining gates. Protect review boundaries; do not mark a draft branch as a published atlas.
- [ ] Build/test once and deploy the exact artifact through least-privilege Pages/OIDC. Reject demo mode, dummy delivery/private contacts, missing license decisions, insufficient/unapproved coverage, and failing checks.
- [ ] Verify `/` and actual repository-subpath direct routes, exports, network panels, HTTPS geolocation, both locales, and attribution. Record commit/dataset hash/time/URL.
- [ ] Exercise safe rollback retaining node/edge/contact removals and pruning invalid context. A deployment failure retains current safe output. Tag/changelog only a real accepted release; leave public-deploy steps pending otherwise.

## Handoff discipline

Continue task-by-task without redoing proven legacy work; migrate it with targeted failing tests. Maintain `.superpowers/sdd/2026-10-12-atlas-release/progress.md` with evidence and rulings. When scope changes, update product design, technical specification, and owning tests/steps together. Outstanding human editorial or launch decisions do not justify stopping independent local implementation or claiming an unreviewed dataset is production-ready.
