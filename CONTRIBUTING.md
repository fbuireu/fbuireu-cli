# Contributing to fbuireu-cli

Thanks for considering it, with one caveat up front: this is an executable
business card for one specific person, and its scope is deliberately closed.
**A feature that does not help introduce this person to a stranger in under a
minute does not belong**: no games, no analytics, no configuration file. The
contributions that fit are bug fixes, tooling improvements, translation
corrections, and accessibility of the terminal output.

If you want the shape of the codebase, that is
[ARCHITECTURE.md](./ARCHITECTURE.md). If you want the vocabulary, that is
[CONTEXT.md](./CONTEXT.md); use its words, not synonyms. If you want the
*why*, that is [docs/adr/](./docs/adr/); the ADRs are decisions, not
suggestions.

> [!NOTE]
> **`src/` does not exist yet.** The v1 implementation was retired and the
> TypeScript rewrite has not landed. Read the ADRs before writing code:
> three of them exist specifically to stop defects the v1 already shipped
> from being reintroduced.

## Code of Conduct

By participating you are expected to uphold the
[Code of Conduct](./CODE_OF_CONDUCT.md). In short:

- **Be respectful**: different viewpoints and experiences are valuable
- **Be constructive**: focus on what is best for the project
- **Be collaborative**: work together towards common goals
- **Be patient**: we all have different levels of experience

## How can I contribute?

Check the existing issues first, then use the
[bug report template](.github/ISSUE_TEMPLATE/bug_report.yml) or the
[feature request template](.github/ISSUE_TEMPLATE/feature_request.yml).
Security issues go through the [Security Policy](./SECURITY.md), not a public
issue.

## Getting started

```bash
# Requires the Node version in engines and pnpm (see packageManager in package.json)
# Always pnpm: there is no package-lock.json and npm ci cannot work here
pnpm install

pnpm run start          # run the CLI from source via tsx
```

## Checks

```bash
pnpm run lint:all       # biome lint (run format:all to autofix)
pnpm run typecheck      # tsc --noEmit
pnpm run test:ut        # vitest
pnpm run verify         # format:check + typecheck + coverage (85% threshold) + build
```

Husky runs lint-staged on pre-commit, commitlint on commit-msg and `pnpm verify` on pre-push.

## Conventions that will bite you if you skip them

- **Purity is the load-bearing rule.** `content`, `i18n` and `presentation`
  must not import `node:*`, call `fetch`, or read the clock; every side
  effect lives in `infrastructure`. If a pure module's test needs a mock, a
  boundary has been crossed.
- **Three languages or it does not ship.** Every visitor-facing string exists
  in English, Spanish and Catalan. A missing key is a compile error; an
  untranslated one is not, so check.
- **Type-only imports must say so**, with `import type { … }`, or the build
  breaks under `verbatimModuleSyntax`.
- **Path aliases across folders, relative paths inside one.** Aliases are
  declared in `tsconfig.json` only; esbuild derives its map from there.
- **Conventional commits are mandatory**: semantic-release derives the
  version from them, and commitlint rejects anything else.
- **The docs move with the code.** A new domain word updates
  [CONTEXT.md](./CONTEXT.md); a change to the folder shape, Session flow or
  release path updates [ARCHITECTURE.md](./ARCHITECTURE.md); a hard-to-reverse,
  surprising trade-off gets an ADR, all in the same commit.

## Pull requests

1. Fork, branch from `main`, make the change.
2. Run `pnpm run verify`; fill in the PR template.
3. After merge to `main`, semantic-release versions and publishes to npm
   automatically; there is no manual release step.

Thanks for contributing! 🎉
