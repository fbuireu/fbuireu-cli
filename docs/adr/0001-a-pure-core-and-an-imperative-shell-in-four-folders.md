# 1. A pure core and an imperative shell, in four folders

Date: 2026-07-30

## Status

Accepted.

## Context

The v1 of this CLI was a single `index.js` of some 200 lines in which the menu loop, the copy shown to the Visitor, the `fetch` of the CV and the write to disk were all interleaved in the same functions. Nothing in it could be tested without a terminal attached, and the one piece of real logic it had, resolving the download path per platform, sat inside the same function that performed the network call.

The obvious fix was full Domain-Driven Design(ish) layering: seven directories behind path aliases (application, domain, config, infrastructure, presentation, i18n, shared) with an import table stating what each may reach for. That shape earns its keep across dozens of source files of genuine business logic. This project has one use case, four Sections and no business rules to speak of; most of those seven directories would hold a single file, and a layer with one file in it teaches a reader nothing while still costing them a lookup.

The opposite temptation, half a dozen flat modules in `src/`, is honest about the size but writes down nothing about where I/O may live, which is precisely the property that decayed in v1.

## Decision

The source is split into four folders plus an entry point, and the boundary that matters is purity, not depth:

```
src/
  index.ts          entry: reads argv/env, starts the session, never rejects
  cli.ts            the session flow: which Section follows which
  content/          pure: the Portfolio as typed data
  i18n/             pure: locale bundles and lookup
  presentation/     pure: data in, string out
  infrastructure/   the only folder that may touch the network or the filesystem
```

`content`, `i18n` and `presentation` are a **functional core**: no `node:fs`, no `fetch`, no clock, no prompt. `infrastructure` is the **imperative shell** and owns every side effect the CLI has, namely retrieving the CV from its Source and writing it into the Downloads Folder. `cli.ts` sequences them and is the only module allowed to know about both.

Full seven-layer DDD(ish) was rejected as premature for a project this size, and a flat `src/` was rejected because it leaves the I/O boundary unwritten. What is kept is the *principle* (a pure core, a shell that owns the side effects), not the file tree that usually comes with it.

## Consequences

- Three quarters of the code is testable with no terminal, no network and no temporary directory. Any test that needs a mock is a test of `infrastructure`, and that is the signal that a layer boundary was crossed.
- Anything reaching for `node:fs`, `node:os` or `fetch` outside `infrastructure/` is a defect, however convenient; that is the single rule this ADR exists to protect. Path resolution for the Downloads Folder is I/O, not logic, and lives there too.
- A reader who expects the usual DDD(ish) directory set will find the familiar vocabulary attached to a smaller tree. That is intended, and this ADR is the answer to "why isn't this layered the usual way".
- The shape has room to grow: a Section that needs data of its own adds a file to `content/`, not a folder. If a fifth folder ever becomes necessary, that is worth its own ADR, since this one has been outgrown at that point.
