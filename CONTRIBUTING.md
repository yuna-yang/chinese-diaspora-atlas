# Contributing to Scattered Stars

Read [the product design](Design%20Doc.md) and [implementation specification](Implementation%20Doc.md). The development build supports reviewed nodes and relationships; public launch remains subject to the documented editorial and quality gates.

## Data proposals

Use the public Issue templates for non-sensitive organization, correction, translation, or relationship proposals. Provide organization-owned public sources, an original factual summary, geographic scope at city/country level, and evidence for every substantive claim. Independent governance and institutional sponsorship are different claims; shared ethnicity, mentions, or attendance do not establish cooperation.

Never submit member/organizer names, personal contacts, precise meeting/refuge/residential locations, private invitation links, confidential interviews, raw sensitive archives, or unapproved testimony. Public proposals and Git history cannot serve as a private reporting channel. The dummy development contact is nonfunctional; real private reporting must be configured before launch.

Candidates are not published records. A maintainer checks scope, evidence, source reuse, duplicates, translations, claim periods, node/edge safety, and publication permission. Contested/sensitive cases need a second reviewer. Nonresponse to outreach is not grounds to exclude a publicly documented eligible organization.

Only reviewed nodes belong in `data/organizations/`; reviewed relationships belong in `data/relationships/`. Node schema version 2 and relationship schema version 1 are implemented. Keep synthetic examples under `tests/fixtures/`. Do not fabricate entries or connections to meet coverage targets.

## Code changes

Use a focused branch and relevant failing regression tests before implementation. Run data validation/review, type checks, lint/format, unit tests, and production browser tests. Browser fixtures mock every external request. Keep schema-generated types synchronized and build outputs/secrets/private reports out of Git.

Document scope/interface changes in the owning design or technical document and the delivery plan. State actual checks and known limitations in the PR. Do not publish a demo as verified data or enable deployment before release gates are met.

## License and review

Code/original UI contributions use MIT. Original curated data is intended for CC BY 4.0, subject to owner confirmation and upstream compatibility. Submit material only when you have the relevant rights; neither project license overrides source/reference obligations. Original factual summaries and source attribution are preferred to copied text/media.

Maintainers explain safe public decisions and permit corrections/appeals. Sensitive details stay private. For removal, rebuild all affected nodes/edges/profiles/exports/counts and never roll back to a version that restores removed sensitive content.

[简体中文](CONTRIBUTING.zh-CN.md)
