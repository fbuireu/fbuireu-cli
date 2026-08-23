# CLAUDE.md

Agent-facing guide for **@fbuireu/fbuireu-cli**, an executable business card: Ferran Buireu's portfolio,
run with `npx`. [CONTEXT.md](./CONTEXT.md) is the domain glossary (Visitor, Session, Section, CV Edition,
Fallback…); do not duplicate it here, and use its words rather than synonyms. [ARCHITECTURE.md](./ARCHITECTURE.md)
is the big picture: layer map, a Session end to end, build and release, and the ADR index.

## What this is

A single interactive command. A Visitor runs it, walks four Sections (Profile, Roles, CV, Contact) and
leaves. Nothing is remembered between Sessions and nothing is written to disk except a downloaded CV.
The scope is deliberately closed: no games, no analytics, no configuration file. A feature that does not
help introduce this person to a stranger in under a minute does not belong.

**`src/` does not exist yet.** The v1 `index.js` was deleted and the TypeScript rewrite has not landed;
the design it must follow is settled and recorded in [docs/adr/](./docs/adr/). Read those before writing
code: they are decisions, not suggestions, and three of them exist specifically to stop defects the v1
already shipped from being reintroduced.

## Stack

- **TypeScript 7** with `verbatimModuleSyntax` and `isolatedModules`: type-only imports must be written
  `import type { … }` or `import { type X }`, or the build breaks. `resolveJsonModule` is on, which is how
  the locale bundles are imported and type-checked.
- **esbuild** bundles to one ESM file (`platform: node`, `target: node20`), **Vitest** (v8 coverage),
  **Biome** (lint + format), **semantic-release** + commitlint, **husky** + lint-staged.
- `@inquirer/prompts`, `chalk` and `ora` are **devDependencies on purpose**: they are inlined into the
  bundle, so the published package declares no runtime dependencies. Do not "fix" this by moving them.

## Commands

`pnpm`, always. There is no `package-lock.json` and `npm ci` cannot work here.

| Command | Does |
| --- | --- |
| `pnpm run start` | Run the CLI from source via `tsx` |
| `pnpm run build` | Bundle to `dist/` with esbuild |
| `pnpm run lint` / `lint:all` / `lint:all:fix` | Biome lint: the root command the variants pass paths to |
| `pnpm run format` / `format:all` / `format:check` | Biome check with `--write`, over the tree, and read-only for CI |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run test:ut` / `test:ut:watch` / `test:ut:coverage` | Vitest once, in watch mode, and with the 85% threshold |
| `pnpm run test:ut:changed` | Vitest over what changed |
| `pnpm run verify` | `format:check` + typecheck + coverage + build: the one gate CI, the release job and `pre-push` share |

## Conventions

- **Path aliases across folders, relative paths inside one.** `@content/*`, `@i18n`,
  `@presentation/*`, `@infrastructure/*` are declared in [`tsconfig.json`](./tsconfig.json) and mirrored into the bundle by
  [`esbuild.config.ts`](./esbuild.config.ts), which derives its alias map from that same file. Adding an alias means adding it to
  `tsconfig.json` only.
- **Purity is the load-bearing rule.** `content`, `i18n` and `presentation` must not import `node:*`,
  must not call `fetch`, and must not read the clock. Every side effect lives in `infrastructure`. A test
  that needs a mock is a test of `infrastructure`; if a pure module needs one, a boundary has been crossed.
- **Three languages or it does not ship.** Every string a Visitor can see exists in English, Spanish and
  Catalan. The bundles are typed against each other, so a missing key is a compile error. A key left
  untranslated is not, and nothing will catch it for you.
- **A successful fetch is not a successful Download.** Verify the bytes are a PDF before writing, and tell
  the Visitor which language they actually received. The v1 saved an HTML page as a `.pdf` for months
  because those two things were treated as one.
- **Conventional commits.** The version number is derived from them; `commitlint` runs on `commit-msg`.

## Maintenance contract

When you change something, the documentation that describes it changes in the same commit:

- A new domain word, or a shift in what an existing one means → [CONTEXT.md](./CONTEXT.md). It is a
  glossary and nothing else: no implementation detail, no spec, no scratch pad.
- A decision that is **hard to reverse**, **surprising without context** and **the result of a real
  trade-off** → a new ADR, copied from [0000](./docs/adr/0000-adr-template.md), plus its row in the index in
  [ARCHITECTURE.md §4](./ARCHITECTURE.md#4-where-things-live). All three conditions, or it is not an ADR.
- A change to the folder shape, the Session flow, or the build and release path →
  [ARCHITECTURE.md](./ARCHITECTURE.md).
- Anything you find that contradicts these documents → [ARCHITECTURE.md §5](./ARCHITECTURE.md#5-known-inconsistencies),
  with the evidence, and delete the entry once it is fixed.
