# 星散 · Scattered Stars

### An Open Atlas of Chinese Diaspora Communities and Civic Connections

**Product Design — v0.5**  
**Updated:** 2026-10-12  
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

The main directory prioritizes publicly identifiable, self-organized initiatives associated with the contemporary mainland Chinese diaspora:

- Cultural, literary, artistic, and intellectual collectives.
- Civic, political, feminist, LGBTQ+, environmental, and social initiatives.
- Mutual-aid groups and community support networks.
- Independent media and publishing initiatives.
- Reading groups, student/alumni/professional initiatives, and informal communities.
- Religious groups and other independent organizations contributing to collective life.

Coverage is global and grows incrementally from credible public information and community contributions. A primary listing needs evidence of mainland Chinese diaspora service abroad or online; names alone do not establish identity, nationality, audience, or political affiliation.

Government-operated groups, individual people, and purely commercial businesses are excluded from the primary directory. Taiwan diaspora organizations are outside this project's community scope because of their distinct political and civic context. This is not a rule about individuals or host geography: an eligible mainland diaspora initiative located in Taiwan is not automatically excluded. Mixed-audience initiatives can qualify when their mainland diaspora activity is documented.

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

Primary organizations and connected institutions must be distinguishable in the interface, exports, and counts. Institutions do not become primary diaspora organizations merely because they appear on the same map. A connected institution must participate in at least one approved relationship with a primary organization; there is no unlimited recursive expansion into unrelated institutions.

### Independence

Independence concerns governance and autonomy, not whether a group has received public funding or collaborated with public institutions. Prioritize independent civic life without presuming independence from silence or restricting inclusion to organizations that respond to outreach.

A publicly documented, self-organized initiative can be listed while its wider affiliations remain unclear. Government operation excludes it as a primary organization; evidenced sponsorship can be described without equating sponsorship with operation. Ambiguous or contested claims stay explicitly uncertain. Political orientation alone is not an exclusion criterion.

### First release

The release includes the map, searchable directory, bilingual profiles/interface, opt-in visitor auto-location, documented organizational connections, relationship filters and evidence, contribution forms, GitHub proposals, reviewed maintenance, JSON/CSV downloads, and descriptive coverage counts.

The newly supplied civic-network design supersedes the earlier decision to defer organizational relationships. It also permits documented past relationships to appear with their periods; a time slider, archived dataset browser, and comprehensive organizational history remain future extensions.

Automated discovery/addition of new sources, Hong Kong, an events calendar, a researcher API, organizational rankings, advanced graph analysis, and separate durability/depth/reach maps are deferred. The development tools remain unrestricted.

## 3. Bonding · Bridging · Linking

These categories describe **relationships**, not the organizations themselves.

| Characteristic | Meaning | Illustrative example |
| --- | --- | --- |
| **Bonding** | Connections within a shared community or closely related networks | Two Chinese-language reading groups jointly organize a discussion |
| **Bridging** | Meaningful interaction across social, cultural, or community boundaries | A Chinese feminist collective collaborates with a local feminist association |
| **Linking** | Connections involving institutional authority, resources, or decision-making asymmetry | A municipality provides support to a diaspora initiative |
| **Unclassified** | A documented relationship with insufficient evidence for these characteristics | A joint project is confirmed, but its social/institutional context is unclear |

Classification is evidence-based. A shared Chinese background does not automatically establish bonding; a partner's location or label does not automatically establish bridging or linking. Multiple characteristics may coexist. The relationship's concrete form—such as funding or co-organization—is distinct from these analytical characteristics.

**Connectivity does not imply success, importance, scope, or impact.** A locally rooted initiative with few recorded partners may play a substantial role; a long partner list may say little about durable activity. Missing connections may be informal, private, undocumented, or deliberately undisclosed. No recorded connection must never be presented as social isolation.

One research proposition is that connections across community and institutional boundaries may provide resources, knowledge, legitimacy, and opportunities. It remains a question, not a predetermined conclusion: organizational success can attract partners, and partnerships can also introduce dependencies or constraints.

## 4. One integrated geographical and relational atlas

The main experience combines organization locations and documented civic connections on **one map**. Do not split them into separate geographic/network products, a ranking, or an impact dashboard. The directory and profile relationship lists provide equivalent access when map interaction is unsuitable.

### Nodes

Each node represents an organization or connected institution. Use consistent baseline size, differentiated symbols/labels, and readable selection states. Degree, funding, age, reach, and prominence do not change a node's size or determine result order.

Organizations without recorded relationships remain visible and searchable. Online-only or country-only entities remain discoverable in the directory and relation lists without inventing precise map positions. Institution visibility follows the relationship context so the map remains an atlas of diaspora civic life, not every institution in a city.

### Connections

Edges represent approved organizational relationships, including co-organized events/projects, space/resource sharing, funding/support, knowledge exchange, referrals, and sustained cooperation. Merely mentioning or recommending another organization does not establish an edge.

Bonding, bridging, linking, and unclassified connections use distinct accessible colors/line patterns. Multiple characteristics and direction must be intelligible without relying on color. Selection opens a compact explanation with endpoints, cooperation form, period, evidence, and uncertainty. Past relationships are labelled; they are not silently presented as current.

Visitors can filter characteristics without hiding primary organizations that have no matching relationships. Edges are hidden or simplified at crowded scales rather than implying prominence through thicker lines. Geographic absence or approximate positions must not be mistaken for lack of a relationship.

### Profiles

Compact node profiles and shareable full profiles show:

- Original/translated names with clear language fallback.
- City/country or online/transnational scope.
- Short descriptions, activities, and categories.
- Organization-owned websites/social profiles and safe public organizational contact routes where documented.
- Founding year and documented reach when available.
- Connected entities, concrete cooperation, direction, periods, and evidence.
- Sources, evidence basis, last verification, uncertainty, and correction/removal routes.

Founding year and reach are secondary descriptive context. They do not determine importance or form a composite score. Organizational depth is excluded.

## 5. Core visitor journeys

1. Explore primary organizations geographically or through the directory.
2. Search both languages by name, city, country, or public interests.
3. Filter by location, activity, and organization type.
4. Choose **“Use my location / 使用我的位置”** and, after browser permission, automatically center the map nearby.
5. Select a group and understand its activities and evidence.
6. Follow a documented relationship to a partner and inspect its form, period, and sources.
7. Filter bonding/bridging/linking/unclassified characteristics.
8. Suggest a missing organization or relationship, correct facts, or contribute translations through the web form or GitHub.
9. Follow public organization links to learn about activities.
10. Download attributed records and understand coverage limitations.

Auto-location is optional. Manual exploration works when permission is denied, location is unavailable, or the map provider fails. Device position does not silently change search results or rank organizations by proximity. No continuous tracking is needed.

## 6. Discovery, outreach, and questionnaire

The atlas begins with public websites/social accounts, event announcements/archives, public directories, news/interviews, institutional records, and community recommendations. Inclusion does not require a response to outreach. Automated discovery may assist a later version where permitted; this release uses manual curation and human publication review.

Future direct outreach can use public organizational mailboxes/social accounts, events, or introductions. It must be personalized, transparent, and non-intrusive. This specification does not authorize the development agent to send messages or contact organizations automatically.

Offer a voluntary questionnaire intended to take about five minutes:

1. What does your organization do?
2. Which organizations or institutions have you worked with?
3. What forms did those relationships take?
4. Can you describe one concrete collaboration?
5. Are there other initiatives the atlas should include?
6. Which information may be published?

Explain whether material will be submitted publicly or privately, request explicit publication permission, and keep confidential responses outside the public repository. Follow-up interviews can investigate histories, local relationships, constraints, and participation. Interviews are research methods, not requirements for inclusion or automated publication.

## 7. Evidence and editorial principles

**Map organizations inclusively; document relationships carefully.** Credible public evidence can support inclusion regardless of whether a group responds to outreach. Limiting the directory to respondents would bias it against small, less connected, and less visible initiatives.

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

A bilingual web contribution form supports people unfamiliar with GitHub. It provides a preview and makes publication permissions explicit. Submitting is a proposal, never immediate publication. Until a real submission channel is configured, local development can validate and download a proposal while clearly indicating that it has not been sent.

Maintainers document evidence standards, review outcomes, appeals, disputes, sensitive reporting, licenses, and responsibilities. Open-source participation does not mean all submitted information must become public. Public-source summaries and reusable reference data must have appropriate provenance and licenses; source attribution alone does not authorize copying text or media.

## 10. Visual identity

**Cute · Vivid · Queer spirit · Improvised · Playful · Experimental · Living**

Use scattered stars/constellations, bright irregular combinations, hand-drawn accents, organic lines, zine-inspired elements, small animations, and an unfinished sense of continuing growth. Avoid the institutional feel of conventional organizational directories and analytical dashboards.

Playfulness must preserve accessible contrast, readable Chinese/English text, predictable map controls, visible evidence distinctions, keyboard access, and reduced-motion support. Use stars as a visual motif; actual lines on the map mean documented relationships, not invented decorative connections between real entities.

**Working name: 星散 · Scattered Stars.** Alternatives remain **散根 · Scattered Roots**, **散生 · Growing Apart, Growing Together**, **散是满天星**, and **自由生长 · Growing Freely**. Dispersion and sowing seeds inspire the identity: separation can also make new forms of life possible.

## 11. Research and journalistic value

The atlas can support interviews, case studies, organizational histories, and public-interest reporting about emergence, sustainability, host-society relationships, circulation of practices/resources, and overlooked civic participation.

Exploratory network analysis must acknowledge missing data, selection bias, uncertain periods, and unequal source visibility. It must not presume that greater connectivity produces more substantial outcomes. Founding year and documented reach may provide context, but there are no impact scores, leaderboards, centrality-driven node sizes, or separate durability/depth/reach maps.

## 12. Product acceptance and document ownership

First-release acceptance requires usable bilingual geographic/network exploration; discoverability of unconnected groups; evidenced relation profiles and filters; optional device positioning; no precision/personal-data leaks; contributor preview and a real delivery/private reporting channel at launch; reusable node/edge exports; and clearly qualified coverage counts.

The implementation document supplies exact schemas, route/filter rules, test cases, dependencies, performance budgets, and release gates. Changes to those mechanics must preserve this product's inclusive directory, evidenced relationships, and privacy rules.

**Core proposition:** 星散 is a participatory atlas of Chinese diaspora communities and their relationships with wider civic ecosystems. Make dispersed collective life discoverable, and invite contribution, correction, and continued growth.
