# 星散 · Scattered Stars

An open-source bilingual atlas of mainland Chinese diaspora communities and their documented civic connections.

- [Product design](Design%20Doc.md): vision, scope, editorial framework, safety, and visual identity.
- [Technical implementation specification](Implementation%20Doc.md): schemas, interaction contracts, architecture, verification, and release gates.
- [Delivery plan](docs/superpowers/plans/2026-10-13-minimal-atlas.md): task order, interfaces, and actual progress.
- [简体中文](README.zh-CN.md)

## Development status

This development build implements the minimal bilingual atlas: borderless geography with star markers, a draggable gathered graph, the 星星散/星星聚 title toggle, icon-only location, EN/CN, small zoom/reset controls, About and selection-only profile panels. Cards distinguish public sources from explicitly approved interviews and link to fuller GitHub records. Search, typed filters, a permanent directory and website forms are deferred; records, contributions and full JSON/CSV exports live in the repository. See [verification evidence and launch gates](docs/verification.md).

The canonical reviewed collection is empty. Demo records are synthetic, visibly labelled, and kept in test fixtures. A demo build must never be presented as verified community data. The private reporting contact is a nonfunctional development placeholder until the owner supplies a real channel.

## Local setup

Requires Node 24.x and npm 11.x. Exact packages are pinned in `package-lock.json`.

```sh
npm ci
npm run dev:demo
```

Open [the English atlas](http://127.0.0.1:3000/en/) or [中文地图](http://127.0.0.1:3000/zh-CN/).

On Windows PowerShell, use `npm.cmd` instead of `npm` if the `.ps1` wrapper is blocked. Ensure Node is on PATH; a newly installed runtime may require a new terminal. Do not change your execution policy just to run npm. Machine-specific setup notes stay local.

`npm run dev` uses only canonical reviewed records. `npm run build:demo` creates a clearly labelled synthetic static preview; `npm run build` rebuilds canonical data and removes old exported pages. `npm run serve` previews the export at `http://127.0.0.1:4173`.

## Checks

```sh
npm run data:validate
npm run data:review
npm run data:build
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build:demo
npx playwright install chromium
npm run test:e2e
```

Browser tests serve the production static export and mock external requests. Use an explicit demo build for fixture-driven browser tests. For subpath verification, set `NEXT_PUBLIC_BASE_PATH=/atlas-test` for both the build and test command. Do not run a local dev server on the static test port during CI checks.

## Contributions and safety

Read the product criteria before proposing nodes or relationships. Use public organization sources and original summaries; do not add precise venues, personal contacts, private invitations, membership/attendance records, confidential interviews, or sensitive connections. A proposal is never automatic publication.

Public GitHub Issues, Pull Requests, and Git history remain public. Do not use them for sensitive removal reports. The real private channel is not configured yet; the development placeholder cannot receive reports. Human evidence/safety review is required before real records enter the canonical collection.

The owner has authorized this public repository. Public site deployment remains gated on reviewed data, a real private reporting channel, license/provenance decisions, and passing checks. See the implementation document for removal-safe recovery.

## License

Application code and original UI assets use MIT. Original curated dataset contributions are intended for CC BY 4.0, with owner confirmation/provenance review required before data publication. Neither license overrides third-party source/reference terms or map-provider attribution obligations. No real organization dataset is currently published.
