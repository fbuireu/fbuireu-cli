# 3. Dependencies are bundled, and `dist/` is not committed

Date: 2026-07-30

## Status

Accepted.

## Context

Nobody installs this CLI. It is run as `npx @fbuireu/fbuireu-cli`, once, by someone who has been handed the command and is deciding within seconds whether it was worth typing. Everything that happens between the Enter key and the first frame of the menu is the first impression, and with ordinary runtime dependencies that window is spent resolving and installing the `@inquirer/prompts`, `chalk` and `ora` trees: dozens of packages, fetched over whatever connection the Visitor happens to have.

Bundling collapses that to a single tarball with an empty dependency graph. The cost is real: a bundled dependency no longer benefits from the consumer's deduplication, stack traces point into generated code, and every dependency patch requires a fresh build and release rather than resolving on its own.

Whether to commit the result is a separate question, and the usual reason to answer yes does not apply here. A bundle belongs in git when something consumes the repository tree directly and never installs. A JavaScript GitHub Action, for instance, is run straight from the tree at the referenced ref, so its bundle has to be committed or it does not exist. A package distributed through a registry has an install step by definition: the registry serves a tarball built at publish time, and the tree itself is only ever read by contributors.

## Decision

`esbuild` bundles `src/index.ts` into a single `dist/index.js` with the runtime dependencies inlined, targeting the Node version pinned in `.nvmrc`. The published package declares no runtime `dependencies`; `@inquirer/prompts`, `chalk` and `ora` are `devDependencies`, because at publish time that is what they are.

`dist/` is git-ignored and built by CI immediately before publishing. It is never committed: the constraint that forces a bundle into the tree, being consumed without an install step, does not exist for a package distributed through a registry, so committing it would buy nothing and add a generated diff to every change.

## Consequences

- A Session starts with no dependency installation at all: one tarball, no graph to resolve.
- The published artefact is only ever produced by the release job. There is no way to publish by hand from a working copy without reproducing that job's steps, which is intended: a hand-built bundle is exactly how a package ends up containing something that is not in `main`.
- A patch to a bundled dependency reaches Visitors only through a release of this package. Renovate updating a lockfile changes nothing until something is published, so dependency updates and releases are the same event here, not two.
- `bin` and `main` in `package.json` point at `dist/index.js`, and `files` must keep `dist/` in the tarball. A publish that ships without `dist/` produces a package whose entry point does not exist, and nothing in the repository can catch that, since the tree is expected not to contain it.
- Debugging a released version means reading generated code. Source maps are emitted for that reason and are worth keeping even though they enlarge the tarball.
