# 2. The Portfolio ships with the package, the CV does not

Date: 2026-07-30

## Status

Accepted.

## Context

The Portfolio and the CV say the same things about the same person, so the instinct is to treat them the same way — either both bundled into the package, or both fetched at runtime. They decay differently, though. The Profile and the Roles change a handful of times a year and are worth a release when they do; the CV is a document that gets tweaked and re-exported far more often, and re-publishing to npm to correct a line in a PDF is a poor trade.

Fetching everything was rejected outright: a Visitor who runs the CLI to be introduced to someone should not be met with a network error, and a talk or a plane is exactly where this gets demonstrated.

Fetching nothing was the other candidate — carry the PDF inside the tarball. It makes a Session hermetic and a Download infallible, at the cost of a stale CV being served indefinitely by every `npx` that resolves an older version, and of every visitor paying for a PDF that most of them will not ask for.

The v1 already attempted the split, and got it wrong in a way worth recording: it fetched `https://github.com/fbuireu/fbuireu/blob/main/assets/pdf/CV-English.pdf`, which is GitHub's **HTML page** for a file rather than the file, and named a PDF that does not exist — `assets/pdf/` holds exactly one document, `Ferran-Buireu-CV.pdf`. Every Download therefore wrote a saved web page to disk under a `.pdf` extension, and nobody noticed, because nothing asserted that the bytes were a PDF.

## Decision

The Profile, the Roles and the Contacts are typed data inside `content/`, bundled into the package and fixed for the lifetime of a released version. No CV Edition is shipped: each is retrieved from the CV Source at Download time, over the raw content host, which serves the bytes rather than a page describing them.

The package holds no offline copy of any edition — a stale CV silently substituted for the current one is worse than a Download that failed and said so. A failed Download is reported to the Visitor and ends that Section; it never ends the Session, because the rest of the Portfolio is still perfectly readable without a network. Which edition is asked for is [ADR 0004](./0004-the-locale-selects-the-cv-edition.md); a Locale with no edition of its own falls back to English, and that is a success, not a failure.

## Consequences

- Every Section except the CV works offline. The CV is the single point in the CLI where an outside system can make it fail, which is what makes its failure path worth writing carefully.
- The CV Source is load-bearing and is not an implementation detail: renaming or moving `assets/pdf/Ferran-Buireu-CV.pdf` in the `fbuireu/fbuireu` repository breaks every published version of this CLI at once, including versions that can no longer be patched. Nothing in CI can catch it — the file lives in another repository.
- The retrieved bytes must be verified as a PDF before anything is written to the Downloads Folder. This is the specific defect v1 shipped, and the reason it survived so long is that "the fetch succeeded" and "we got the document" were treated as the same thing. They are not.
- Correcting the CV requires no release of this package. Correcting the Profile or a Role does, and that is deliberate: the Portfolio is versioned copy, and a given version of the package says exactly one thing forever.
