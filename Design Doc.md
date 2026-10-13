# 星散 · Scattered Stars

### An Open Atlas of Chinese Diaspora Communities and Civic Connections

**Product Design — v0.7**  
**Updated:** 2026-10-13  
**Project:** Open source · Bilingual (中文 / English) · Participatory mapping  
**Companion documents:** [Implementation Doc.md](Implementation%20Doc.md) defines technical contracts; the [implementation plan](docs/superpowers/plans/2026-10-12-atlas-release.md) tracks delivery. This document defines what the product is for, what it includes, and how it should feel.

## 1. Vision

**星散** is an open, collaborative atlas documenting independent mainland Chinese diaspora organizations, community initiatives, and their connections with wider society.

Rather than treating diaspora communities as isolated ethnic enclaves, it explores how they organize collective life, develop relationships, and become embedded in local and transnational civic ecosystems. It does not assume a unified Chinese diaspora: communities identify, organize, collaborate, and participate in different ways.

The atlas has four objectives:

- **Visibility:** Make dispersed communities discoverable, including small and informal initiatives.
- **Connectivity:** Document relationships among diaspora communities and with cultural organizations, local institutions, and civil society.
- **Participation:** Let organizations and readers contribute information, correct records, and introduce other initiatives.
- **Investigation:** Support careful questions about how organizational networks form, operate, and contribute to civic life.

The end product's application code and curated datasets must be open source. Development tools may be proprietary. The owner has authorized a new public repository at [yuna-yang/chinese-diaspora-atlas](https://github.com/yuna-yang/chinese-diaspora-atlas). A dummy contact is acceptable during development; it must be labelled as a placeholder and must not appear to be a working private reporting channel.

## 2. Scope and release boundary

### Primary diaspora entities

The primary collection prioritizes publicly identifiable, self-organized initiatives associated with the contemporary mainland Chinese diaspora:

- Cultural, literary, artistic, and intellectual collectives.
- Civic, political, feminist, LGBTQ+, environmental, and social initiatives.
- Mutual-aid groups and community support networks.
- Independent media and publishing initiatives.
- Reading groups, student/alumni/professional initiatives, and informal communities.
- Religious groups and other independent organizations contributing to collective life.

Coverage is global and grows incrementally from credible public information and community contributions. A primary listing needs evidence of mainland Chinese diaspora service abroad or online; names alone do not establish identity, nationality, audience, or political affiliation.

Government-operated groups, individual people, and purely commercial businesses are excluded from the primary collection. Taiwan diaspora organizations are outside this project's community scope because of their distinct political and civic context. This is not a rule about individuals or host geography: an eligible mainland diaspora initiative located in Taiwan is not automatically excluded. Mixed-audience initiatives can qualify when their mainland diaspora activity is documented.

Hong Kong-only organizations and a separate Hong Kong layer remain deferred.

### Connected institutions

Organizations beyond the diaspora enter through documented relationships with primary initiatives, rather than through a comprehensive local-institution inventory:

- Cultural centers, libraries, museums, and bookstores.
- Universities, research centers, and schools.
- NGOs and civic associations.
- Municipalities and other public institutions.
- Migrant organizations and other diaspora communities.
- Independent media, foundations, and funding bodies.
- Relevant commercial or state-affiliated institutions, clearly identified as such.

Editors must distinguish eligible diaspora initiatives from connected institutions when reviewing inclusion. The first release presents both through one generic organizational node and one star style; a profile’s factual summary must make its subject clear without a node-type badge. An institution does not become a diaspora community merely because it appears on the same map. Separate node types, symbols, type filters, and type-based counts are future work. A connected institution must participate in at least one approved relationship with a primary organization; there is no unlimited recursive expansion into unrelated institutions.

### Independence

Independence concerns governance and autonomy, not whether a group has received public funding or collaborated with public institutions. Prioritize independent civic life without presuming independence from silence or restricting inclusion to organizations that respond to outreach.

A publicly documented, self-organized initiative can be listed while its wider affiliations remain unclear. Government operation excludes it as a primary organization; evidenced sponsorship can be described without equating sponsorship with operation. Ambiguous or contested claims stay explicitly uncertain. Political orientation alone is not an exclusion criterion.

### Geographic starting point — open proposal

**EU first?** Consider beginning editorial coverage in the European Union, then expanding through regional collections. This is a proposed sequencing choice, not an agreed restriction on eligibility or a claim of comprehensive EU coverage. Distinguish “EU” from “Europe”: inclusion of the UK, Norway, Switzerland, and other non-EU European countries in the initial collection remains a scope decision. Online and transnational initiatives need explicit treatment rather than an arbitrary national assignment.

The owner raised Thailand as a possible example of a community ecosystem that might merit a dedicated regional project. Its scale and needs have not been established here. Before deciding, assess local editorial capacity, languages, community diversity, source availability, and safety needs. A regional project could share the atlas's open schemas and evidence principles while having its own editorial stewardship; it should not be treated as a less important remainder of an EU collection.

**Decisions still open:** EU-only versus broader European starting coverage; how online/transnational initiatives enter that collection; and when a regional collection should become a separately maintained project. The existing launch coverage target is not changed by this proposal. Explain the initial geographic emphasis and gaps publicly while retaining the longer-term global vision.

### First release

The first release is a minimal bilingual, map-first website: a borderless canvas, linked 散/聚 views, one generic star node, one generic documented link, optional device location, a profile panel opened by node selection, and an About destination containing essential project information and the GitHub repository link.

The public website does not require a persistent directory, search/filter sidebar, category legend, dashboard, separate full-profile pages, export/download page, or web contribution/questionnaire flow. These earlier website requirements are deferred. Full records, data downloads, methodology, contribution instructions, schemas, review procedures, and development details live in GitHub. The repository retains the reviewed maintenance and open-data workflow.

One node type and one link type are sufficient for this release. Do not require visitors or contributors to choose categories, institutional subtypes, bonding/bridging/linking classes, or cooperation-form enums. Factual cooperation descriptions, evidence, dates, uncertainty, and privacy review remain necessary. Typed nodes/links and classification controls can be introduced later.

The newly supplied civic-network design supersedes the earlier decision to defer organizational relationships. It also permits documented past relationships to appear with their periods; a time slider, archived dataset browser, and comprehensive organizational history remain future extensions.

Automated discovery/addition of new sources, Hong Kong, an events calendar, a researcher API, organizational rankings, advanced graph analysis, and separate durability/depth/reach maps are deferred. The interactive 聚 layout below is a core exploration view, not an advanced graph-analysis feature. The development tools remain unrestricted.

## 3. Future relationship classification: Bonding · Bridging · Linking

These categories are retained as a future research framework, not first-release node/link types or interface controls. When introduced, they describe **relationships**, not the organizations themselves. Initial links simply mean documented organizational cooperation; an absent classification is not a separate visible “unclassified” type.

| Characteristic | Meaning | Illustrative example |
| --- | --- | --- |
| **Bonding** | Connections within a shared community or closely related networks | Two Chinese-language reading groups jointly organize a discussion |
| **Bridging** | Meaningful interaction across social, cultural, or community boundaries | A Chinese feminist collective collaborates with a local feminist association |
| **Linking** | Connections involving institutional authority, resources, or decision-making asymmetry | A municipality provides support to a diaspora initiative |
| **Unclassified** | A documented relationship with insufficient evidence for these characteristics | A joint project is confirmed, but its social/institutional context is unclear |

Classification is evidence-based. A shared Chinese background does not automatically establish bonding; a partner's location or label does not automatically establish bridging or linking. Multiple characteristics may coexist. The relationship's concrete form—such as funding or co-organization—is distinct from these analytical characteristics.

**Connectivity does not imply success, importance, scope, or impact.** A locally rooted initiative with few recorded partners may play a substantial role; a long partner list may say little about durable activity. Missing connections may be informal, private, undocumented, or deliberately undisclosed. No recorded connection must never be presented as social isolation.

One research proposition is that connections across community and institutional boundaries may provide resources, knowledge, legitimacy, and opportunities. It remains a question, not a predetermined conclusion: organizational success can attract partners, and partnerships can also introduce dependencies or constraints.

## 4. One atlas, two linked views: 散 / 聚

**聚是一团火，散是满天星。** The atlas expresses both dispersed community life and the possibility of gathering. Geography and relationships belong to one product and one reviewed dataset, explored through two linked views. They are not separate inventories, rankings, or impact dashboards. Keyboard-operable stars, accessible node names, and selected-profile evidence provide access without pointer dragging. An unobtrusive, on-demand node picker may support keyboard or assistive navigation; it is not a permanently visible directory.

### Minimal, borderless interface

**Visual reference:** [Queering the Map](https://www.queeringthemap.com/). Adopt the owner's requested direction: the map fills the viewport edge to edge, without a surrounding card, border, hero section, persistent sidebar, navigation bar, footer panel, or dashboard. Use minimal floating controls with translucent or semi-transparent surfaces. Maintain readable contrast over every map background; transparency must not make text, focus, or touch targets difficult to see. Use original assets and the atlas's own star identity.

The default surface contains only the interactive website title, a small **About / 关于** control, an **icon-only device-location button**, and a visible **EN/CN language button**, plus unobtrusive essential zoom/reset controls and required map-provider attribution. The interactive **星星散 ↔ 星星聚** title is the main view switch; an icon can be incorporated into that control rather than requiring another toolbar. No profile panel appears until a star is activated.

**No search feature in this release.** Discovery happens by zooming in/out and moving the map, then activating a star. Do not add a search box, search icon, command palette, category filters, or a searchable directory. Pointer/touch gestures and equivalent keyboard or small map controls support zooming and panning. The 聚 view additionally retains its specified node dragging; it does not introduce search.

The location control uses a recognizable location/crosshair icon with **no permanent visible text label**. Give it a localized accessible name such as “Use my location / 使用我的位置,” a generous touch target, and clear locating/success/error states. Request location only when activated; do not prompt automatically. In 散 it centers the map after permission; when activated from 聚, switch to 散 before showing the device position. Permission denial or an unavailable position leaves manual map exploration usable. Temporary location disclosure/status can appear when needed without becoming a permanent text-heavy toolbar.

Keep the **EN/CN** button visible on the main canvas rather than hiding language selection in About. It switches English and Simplified Chinese, clearly indicates the current language, and has an accessible name describing the action. “CN” is the compact display label for Simplified Chinese, not an organizational geographic filter. Switching language preserves the current 散/聚 view, viewport, selected star, and open profile panel; it must not introduce persistent storage of device coordinates. About and profile content switch language too, with explicit fallback for source text that has no translation.

About is the single informational destination on the website. It brings together the project introduction, 散/聚 explanation, current geographic emphasis and coverage gaps, public-information/interview distinction, privacy/location disclosure, attribution, correction/private-reporting route, and a prominent GitHub repository link. Detailed records, methodology, data exports, contribution/questionnaire procedures, technical documentation, and the roadmap are available through the repository. Do not direct sensitive reports into public GitHub Issues.

About can be a floating sheet/overlay or a simple dedicated page, with an obvious close/back-to-map action. Opening About dismisses any organization profile and clears its selection. Returning restores the current 散/聚 view and viewport with no profile open; activating a star opens a profile again. Its exact implementation belongs in the technical document; the product requirement is one clear information destination rather than a collection of website pages.

### 散 — geographical view

The default view is the normal geographical map with one consistent star marker for every published organizational node. Preserve city-level approximation, clustering, documented relationship lines, and optional device location. This view answers “where are these communities?” without implying that pins identify meeting places.

### 聚 — gathered constellation

Stars gather toward the center and settle into an interactive graph, inspired by the draggable exploration of Obsidian's graph view. Visitors can drag individual nodes, pan the canvas, zoom, select a community, and follow documented relationships. Include a reset/recenter control.

Positions express an exploratory layout, not geographic coordinates, shared identity, influence, or civic success. Only approved relationships create edges. Unconnected communities remain visible and selectable; the gathering animation must not fabricate ties between them. Keep baseline star sizes consistent, use the same generic node style, and preserve access to online-only and country-only organizations that have no geographic pin. Dragged positions are temporary view state and do not change organization locations or exported records.

### Switching and title interaction

Use the interactive website title as the main toggle. A compact icon affordance may be integrated into the title; if a separate icon toggle is used, it operates the same view state and must preserve the minimal surface:

| Current view | Title display | Action | Result |
| --- | --- | --- | --- |
| 散 | 星星**散** | Activate **散**, or the gather-view icon | 星星**聚**; enter 聚 |
| 聚 | 星星**聚** | Activate **聚**, or the geographical-view icon | 星星**散**; return to 散 |

Use a geographical/star icon for 散 and a gathered-constellation icon for 聚, with accessible labels and an explicit active state. Make the changing title word a real keyboard-operable button with an accessible name describing the destination view. The title interaction should be discoverable through its styling and a brief hint; it must not depend on visitors guessing that ordinary heading text is clickable. The project remains **星散 · Scattered Stars**; 星星散 / 星星聚 are its interactive title states.

Switching preserves the selected organization and its profile panel. Each view retains its own viewport during the current session. Device positioning belongs to 散; never place the visitor's location in 聚 or reinterpret graph positions as proximity. Search/filter state and a separate list/map switch are not first-release requirements.

### Gathering and dispersal animation

When entering 聚, stars move inward toward the center before settling into the graph; returning to 散 disperses them toward their geographic positions. Use a short, interruptible transition, retain selection, and keep controls usable. Nodes without geographic anchors enter or leave without invented map coordinates. Gathering at the center is a visual metaphor, not an assertion that the organizations met or merged.

Respect reduced-motion preferences with an immediate switch or restrained fade. Avoid continuous drift, flashing flames, forced animation delays, and effects that obscure labels or evidence. The fire metaphor can inform warmth, color, and a sense of collective energy without requiring a literal flame effect.

### Nodes

Each node represents one published organization or community initiative, admitted through the existing editorial scope rules. Use one generic star style, consistent baseline size, an accessible name, and a readable selected/focused state. Do not encode organizational category or institution type through color, shape, or size. Degree, funding, age, reach, and prominence do not change a star's size or visibility priority.

Organizations without recorded relationships remain visible and selectable. Online-only or country-only entities remain discoverable in 聚 and through accessible node navigation without inventing precise map positions. Institution visibility follows the relationship context so the map remains an atlas of diaspora civic life, not every institution in a city.

### Connections

Edges represent approved organizational relationships, including co-organized events/projects, space/resource sharing, funding/support, knowledge exchange, referrals, and sustained cooperation. Merely mentioning or recommending another organization does not establish an edge.

Use one generic link style for approved cooperation. Do not display bonding/bridging/linking colors, cooperation-type patterns, arrows as separate link types, or classification badges. A neutral link does not assert reciprocal support: any documented direction, concrete form, period, evidence, or uncertainty is explained in the selected organization’s profile. Past cooperation is described as past rather than silently presented as current.

Links do not open a separate inspector in the first release; cooperation details belong in the selected star’s profile or its GitHub record. Link-type filters are deferred. Links may be hidden or simplified at crowded scales rather than implying prominence through thicker lines. A bare mention still does not establish a link; geographic absence or approximate positions must not be mistaken for lack of cooperation.

### Profiles

A selected star opens a compact profile panel. Its initial reading view prioritizes the name, short summary, approximate scope, interview/public-information label, and useful public/repository links. Keep it concise; longer evidence lists and secondary facts can remain in GitHub. Information available for the panel includes:

- Original/translated names with clear language fallback.
- City/country or online/transnational scope.
- A short description and public activities, without category/type badges.
- Organization-owned websites/social profiles and safe public organizational contact routes where documented.
- Founding year and documented reach when useful and available; fuller context can remain in GitHub.
- Connected entities, concrete cooperation, direction, periods, and evidence.
- Sources, evidence basis, last verification, uncertainty, and correction/removal routes.

Founding year and reach are secondary descriptive context. They do not determine importance or form a composite score. Organizational depth is excluded.

### Profile cards — interview / public information

Clicking or tapping a star, or activating it with the keyboard, opens the same compact profile panel in either view. Only one organization panel is open at a time; selecting another star replaces its contents. The panel includes a link to the organization’s fuller record/evidence in GitHub instead of requiring a separate full-profile website page. The card should make its information basis visible: **Public information / 公开资料**, **Interview / 访谈**, or **Both / 两者兼有**. Identify organization-contributed or organization-reviewed material where applicable; an interview is a source type, not automatically organizational approval.

Click/tap elsewhere on the empty canvas closes the panel and clears its selection; an explicit close button and Escape provide equivalent dismissal. Clicking inside the panel does not dismiss it. Panning, zooming, or dragging a node is not a dismissal click. Title/view controls perform their own action while retaining the selected panel; About replaces it with the information destination. Restore focus to the selected star or an appropriate canvas control after keyboard dismissal. Hover or focus alone must not open a profile.

Public-information cards provide original factual summaries, public source links, and verification dates. Interview material may add a consented quotation, collaboration example, or narrative excerpt, with an interview date and safe attribution. Label the basis of individual claims when a card combines both, and preserve disagreement or uncertainty instead of blending accounts into an unqualified statement.

Interview participation is optional and does not determine inclusion, prominence, ordering, or card size. Publish only approved excerpts and attribution; keep raw recordings, transcripts, private contact details, and consent records outside the public repository. Interview subjects' identities must not appear by default: use approved organizational attribution or omit an excerpt when safe attribution is unavailable. These cards describe organizations, not personal organizer profiles.

### Phone and desktop

Both phone and desktop use the same borderless canvas and minimal floating title/About controls. Desktop profiles can float beside a selected star or along an edge; phone profiles can use a compact bottom sheet with an explicit close action. Panels should occupy only the space needed for reading and leave enough canvas exposed for outside-tap dismissal. Respect mobile safe areas, dynamic viewport height, portrait/landscape layouts, and long bilingual text.

In 聚, touch dragging moves nodes, canvas dragging pans, and pinch gestures zoom; distinguish these targets and preserve normal page scrolling outside the canvas. Provide tap selection, reset/recenter controls, keyboard-operable stars and an on-demand accessible node picker so dragging or multi-touch is never required to discover a community or inspect evidence. Desktop supports pointer dragging and keyboard access to equivalent selection and navigation controls. Keep toggles reachable, touch targets generous, focus predictable, and panels usable in portrait and landscape.

## 5. Core visitor journeys

1. Arrive directly on the borderless 散 map, with community stars and minimal floating controls.
2. Zoom in/out and move the map to discover communities; there is no search or filter interface.
3. Activate a star to read its profile and public-information/interview evidence.
4. Activate another star to replace the profile; click/tap empty canvas, press Escape, or use close to dismiss it.
5. Switch through **星星散 ↔ 星星聚** to explore the same collection as a gathered, draggable constellation.
6. Inspect documented cooperation through the selected profile, without choosing a link category.
7. Open About for essential project information, then follow GitHub for full records, data, methodology, contributions, and development details.
8. Activate the icon-only location button to center 散 near the device position after permission.
9. Use the visible EN/CN button to switch language without losing the current view or selected profile.

Profiles retain their public-information/interview evidence labels in both views. Search, category filters, a persistent directory, standalone website profiles, and website submission/download pages are future extensions rather than prerequisites for this minimal release.

Auto-location is optional. Manual exploration works when permission is denied, location is unavailable, or the map provider fails. Device position does not silently restrict the displayed collection or rank organizations by proximity. No continuous tracking is needed.

## 6. Discovery, outreach, and questionnaire

The atlas begins with public websites/social accounts, event announcements/archives, public directories, news/interviews, institutional records, and community recommendations. Inclusion does not require a response to outreach. Automated discovery may assist a later version where permitted; this release uses manual curation and human publication review.

Future direct outreach can use public organizational mailboxes/social accounts, events, or introductions. It must be personalized, transparent, and non-intrusive. This specification does not authorize the development agent to send messages or contact organizations automatically.

A voluntary questionnaire may support editorial research, through a documented process linked from GitHub. An on-site questionnaire form is deferred. The questionnaire is intended to take about five minutes:

1. What does your organization do?
2. Which organizations or institutions have you worked with?
3. What forms did those relationships take?
4. Can you describe one concrete collaboration?
5. Are there other initiatives the atlas should include?
6. Which information may be published?

Explain whether material will be submitted publicly or privately, request explicit publication permission, and keep confidential responses outside the public repository. Follow-up interviews can investigate histories, local relationships, constraints, and participation. Interviews are research methods, not requirements for inclusion or automated publication.

## 7. Evidence and editorial principles

**Map organizations inclusively; document relationships carefully.** Credible public evidence can support inclusion regardless of whether a group responds to outreach. Limiting the collection to respondents would bias it against small, less connected, and less visible initiatives.

Distinguish publicly documented information, organization-contributed/reviewed information, approved relationships, and unverified submissions. Proposed relationships remain outside public network outputs until reviewed. Organizational testimony requires attribution and permission for publication; confidential notes are not public evidence files.

Primary sources are preferred. Contested claims need corroboration. Dates describe the evidenced period and verification, not a promise that a relationship still exists. Insufficient or conflicting evidence remains uncertain. Duplicate suggestions assist editors but never merge records automatically.

Explain sources, coverage gaps, participation bias, verification dates, and the difference between relationship characteristics and cooperation forms. Counts describe recorded coverage, not population, representativeness, social isolation, or civic success.

## 8. Privacy and safety

- Publish organizations and institutions, never private individuals, members, attendance patterns, or organizer profiles.
- Use city-level approximate locations by default. Country-only or online-only scope is available when truthful; withhold an entry if even coarse disclosure creates a risk.
- Public organizational contact information means a verified organization-owned contact page or general role mailbox. Do not publish personal addresses/numbers or private invitation links.
- Review sensitive relationships independently of node safety: publishing a harmless organization does not make every partner/funder connection safe.
- Keep confidential interviews, private submissions, consent records, precise locations, and raw source archives out of Git history and public exports.
- Visitor device coordinates remain temporary browser memory; they do not enter URLs, storage, exports, analytics, or application logs. Explain that viewport tile requests can expose the approximate viewed area to the map provider.
- Provide correction/removal routes for nodes, edges, and individual details. For credible safety concerns, hide first and investigate privately.
- Removing an organization also removes its current incident relationships and connected institutions that no longer qualify. Do not restore deleted sensitive material during rollback.

Public Issues/PRs remain public, including history. Warn before submission. A dummy development contact must not accept sensitive reports or imply delivery. A real private contact and tested submission route are prerequisites for public launch. Current removal cannot guarantee deletion from old downloads, caches, public history, or third-party copies.

## 9. Participation and governance

Organizations and readers can nominate initiatives, correct records, add evidenced relationships, supply context, translate, report inactive groups, and propose improvements. GitHub contains source, public datasets, schemas, translation resources, criteria, editorial procedures, privacy rules, and roadmap.

The minimal website directs public nominations, corrections, translations, and documented cooperation proposals to GitHub from About or the selected profile. An on-site contribution form is future work. Private reporting uses a real private channel; sensitive interview/questionnaire material must not be uploaded to public Issues or the repository. Submission remains a proposal, never immediate publication.

Maintainers document evidence standards, review outcomes, appeals, disputes, sensitive reporting, licenses, and responsibilities. Open-source participation does not mean all submitted information must become public. Public-source summaries and reusable reference data must have appropriate provenance and licenses; source attribution alone does not authorize copying text or media.

## 10. Visual identity

**Cute · Vivid · Queer spirit · Improvised · Playful · Experimental · Living**

Let the map and stars carry the identity. Use restrained color accents, original star shapes, translucent floating surfaces, and the gathering/dispersal motion. Earlier zine, sticker, decorative-hero, dense-directory and dashboard treatments are not requirements for this release. Playfulness should come from exploration and the 散/聚 transition rather than extra interface furniture.

**聚是一团火，散是满天星** is the central motion and interaction motif. The 散/聚 toggle and 星星散 ↔ 星星聚 title make it part of navigation, while gathering/dispersal transitions express connection without implying uniformity or ranking.

Playfulness must preserve accessible contrast, readable Chinese/English text, predictable map controls, visible evidence distinctions, keyboard access, and reduced-motion support. Use stars as a visual motif; actual lines on the map mean documented relationships, not invented decorative connections between real entities.

**Working name: 星散 · Scattered Stars.** Alternatives remain **散根 · Scattered Roots**, **散生 · Growing Apart, Growing Together**, **散是满天星**, and **自由生长 · Growing Freely**. Dispersion and sowing seeds inspire the identity: separation can also make new forms of life possible.

## 11. Research and journalistic value

The atlas can support interviews, case studies, organizational histories, and public-interest reporting about emergence, sustainability, host-society relationships, circulation of practices/resources, and overlooked civic participation.

Exploratory network analysis must acknowledge missing data, selection bias, uncertain periods, and unequal source visibility. It must not presume that greater connectivity produces more substantial outcomes. Founding year and documented reach may provide context, but there are no impact scores, leaderboards, centrality-driven node sizes, or separate durability/depth/reach maps.

## 12. Product acceptance and document ownership

First-release acceptance requires a borderless bilingual 散/聚 canvas on phones and desktops; minimal floating title/About controls, an icon-only location button, and a visible EN/CN language button; discovery by zooming/panning with no search interface; one generic star node and one generic documented link; title/language switching that retains viewport/selection; draggable exploration with accessible alternatives and reduced-motion behavior; profiles opened only by star activation and dismissed by outside click, close, or Escape; visible public-information/interview provenance; optional device positioning; no precision/personal-data leaks; About containing essential information, a real private reporting route at launch, and the GitHub repository link. Detailed records and contributor/data workflows belong in the repository. Type systems, search, classification filters, persistent directories, dashboards, and expanded website pages are deferred.

The implementation document supplies exact schemas, route/filter rules, test cases, dependencies, performance budgets, and release gates. Changes to those mechanics must preserve this product's inclusive collection, evidenced relationships, and privacy rules.

**Revision boundary:** v0.7 retains the EU-first open proposal and 散/聚 concept, and adopts the owner's minimal-map direction referencing Queering the Map. It supersedes earlier requirements for differentiated node/link styles, classification controls, a persistent directory, decorative page framing, standalone profile/data pages, and on-site contribution/questionnaire forms. One generic organizational node and one generic cooperation link are the initial model; richer types remain future work. The v0.5 implementation and technical plan still describe the earlier, broader interface and must be reconciled before development of this revision. This document does not claim the redesigned UI already exists or authorize outreach.

**Core proposition:** 星散 is a participatory atlas of Chinese diaspora communities and their relationships with wider civic ecosystems. Make dispersed collective life discoverable, and invite contribution, correction, and continued growth.
