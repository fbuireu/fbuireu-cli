# 5. semantic-release replaces the manual publish dispatch

Date: 2026-07-30

## Status

Accepted.

## Context

`publish-package.yml` released this package by hand: a `workflow_dispatch` with a `major | minor | patch` choice, feeding two independent publish jobs. It had three defects, and they compounded.

It ran `npm ci` in a repository that has no `package-lock.json`: the lockfile here is [`pnpm-lock.yaml`](../../pnpm-lock.yaml), and `packageManager` pins pnpm. That step could only ever fail, which means the workflow had not successfully published anything for some time and nobody had noticed.

The job named *Build and Test* neither built nor tested; it installed dependencies and stopped. With a bundle now standing between the sources and the published artefact ([ADR 0003](./0003-dependencies-are-bundled-and-dist-is-not-committed.md)), a release job that does not build cannot produce a working package at all.

And `npm version --no-git-tag-version` ran twice, once per registry, in two jobs with no shared state and no commit back to the repository. The version in `main` therefore describes nothing (it says `2.0.0` regardless of what has been published), and npm and GitHub Packages could land on different numbers from the same commit.

The conservative repair was to keep the manual dispatch and fix all three. It leaves the version number as something a human chooses in a dropdown, which is where the drift came from in the first place.

## Decision

Releases are driven by semantic-release on `main`. Conventional commit messages determine the version; `commitlint` on a `commit-msg` hook enforces their shape at the point of writing. One job installs with pnpm, runs lint, typecheck, tests and build, and only then publishes, to npm and to GitHub Packages from the same resolved version, before committing [`package.json`](../../package.json) and `CHANGELOG.md` back and tagging.

The manual dispatch is removed rather than kept alongside. Two paths to publish is how the two registries diverged.

## Consequences

- The version number stops being a decision anyone makes. It is a consequence of the commits, and `main` cannot describe a version different from the one on the registries.
- Commit messages become load-bearing. A change released under the wrong verb is released under the wrong version, and `fix:` on a breaking change is not caught by anything: the hook validates form, not honesty.
- Nothing is published unless lint, typecheck, tests and build all pass. A red build is now a blocked release, which is the point; the previous workflow would happily publish whatever was in the tree.
- Releasing requires a `NPM_AUTH_TOKEN` with publish rights and the workflow's own `GITHUB_TOKEN` for GitHub Packages, plus `contents: write` for the tag and the changelog commit. That commit is authored by the release bot and must not trigger the workflow again.
- Publishing from a working copy is no longer a supported path. If the release job is broken, the fix is to the job.
