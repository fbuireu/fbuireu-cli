# fbuireu-cli

> An executable business card: Ferran Buireu's portfolio, in your terminal.

[![npm version](https://img.shields.io/npm/v/@fbuireu/fbuireu-cli)](https://www.npmjs.com/package/@fbuireu/fbuireu-cli)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENCE)

## What it is

One interactive command. You run it, meet a person, and leave — ideally in
under a minute. No install, no configuration, no analytics, nothing written to
disk except a CV you explicitly ask for.

```bash
npx @fbuireu/fbuireu-cli
```

A visit walks four Sections:

- **Profile** — who this person is and what they are like to work with
- **Roles** — positions held, with the accomplishments and technologies of each
- **CV** — download the PDF, in the edition matching your language
- **Contact** — ways to reach out, actionable without leaving the terminal

Everything a visitor can see exists in **English, Spanish and Catalan**; the
CLI picks up your locale and falls back gracefully.

> [!NOTE]
> **Status:** the v1 implementation has been retired and the TypeScript
> rewrite is in progress. The design it follows is settled and recorded — see
> [ARCHITECTURE.md](./ARCHITECTURE.md) for the shape and
> [docs/adr/](./docs/adr/) for the decisions.

## How it's built

The scope is deliberately closed: a feature that does not help introduce this
person to a stranger in under a minute does not belong. Under the hood it is a
functional core with an imperative shell — pure content, i18n and presentation
layers, with every side effect confined to one infrastructure folder.

- [ARCHITECTURE.md](./ARCHITECTURE.md) — the layer map, a session end to end, build and release
- [CONTEXT.md](./CONTEXT.md) — the domain glossary the code speaks
- [docs/adr/](./docs/adr/) — why each shape was chosen

The published package bundles everything into a single ESM file and declares
**zero runtime dependencies**, with npm provenance enabled.

## Development

```bash
# Requires the Node version in engines and pnpm (see packageManager in package.json)
# Always pnpm — there is no package-lock.json and npm ci cannot work here
pnpm install

pnpm run start          # run the CLI from source
pnpm run check          # lint + typecheck + coverage
pnpm run validate       # check + build — what the release job runs
```

Releases are automated with semantic-release from conventional commits; there
is no manual publish step.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) and the
[Code of Conduct](./CODE_OF_CONDUCT.md). Security issues follow the
[Security Policy](./SECURITY.md) — never a public issue.

## License

[MIT](./LICENCE)
