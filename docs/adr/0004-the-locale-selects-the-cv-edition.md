# 4. The Locale selects the CV Edition, with an English fallback

Date: 2026-07-30

## Status

Accepted.

## Context

Every string in v1 was an English literal sitting in the branch that printed it, and "add language support" was one of the TODOs at the bottom of the file that never happened. Retrofitting locales is not hard, but it is invasive in a way that never feels urgent, so it does not get done — which is the argument for paying for it while there is almost no copy to convert.

The counter-argument is that a translation layer over four Sections is ceremony for its own sake, and the halfway option — route every string through a lookup that only ever has one bundle behind it — pays the cost without buying anything.

The harder question is how far the Locale reaches. Keeping it purely presentational is the tidy answer: interface in three languages, one language-agnostic document for everyone. It is also the wrong one here, because CV Editions in other languages do exist and handing a Catalan-speaking Visitor an English PDF when a Catalan one has been written is a worse outcome than any amount of tidiness buys.

That reach comes with a fact that has to be designed around rather than wished away: **editions are published as they are written, not as a complete set**. Today `fbuireu/fbuireu` publishes exactly one — `assets/pdf/Ferran-Buireu-CV.pdf` — so every non-English Visitor currently falls back. A design that assumes a matching PDF per Locale is a design that 404s in two of its three languages. The v1 already made this mistake in miniature: it fetched `CV-English.pdf`, a filename that promises a `CV-Spanish.pdf` sibling that has never existed.

## Decision

The Portfolio is rendered in English, Spanish and Catalan from the outset. The Locale is resolved from the Visitor's environment and can be overridden with a `--lang` flag; an unrecognised or unsupported value falls back to English rather than failing, because nobody should be locked out of an introduction by their shell configuration.

The Locale also selects the CV Edition. A Download asks for the edition matching the Visitor's Locale and falls back to the English edition when that edition does not exist — a missing edition is an expected outcome, not a failure, and the CLI tells the Visitor which language it actually handed over rather than silently substituting one.

The set of published editions is **not** hardcoded as a list in the CLI. A list in the package would go stale the moment an edition is published or withdrawn, and every version already released would keep believing the old list. The Fallback is driven by what the CV Source actually serves.

## Consequences

- Every string added to the Portfolio has to be added three times. That is the running cost, and it is the reason this decision is only cheap while the copy is small — taking it later would mean paying it retroactively across the whole surface.
- The locale bundles are typed against each other so that a key missing from one language is a compile error rather than a blank line in front of a Visitor. Nothing detects a key that is present but left untranslated.
- Publishing a new CV Edition requires no release of this CLI: it starts being served as soon as it exists at the CV Source under the expected name. That is the whole benefit of not carrying a list, and it makes the **naming convention at the CV Source load-bearing** — renaming a PDF there silently demotes that Locale back to the Fallback, and nothing in this repository can detect it.
- A Download now has two possible successful outcomes, requested edition and Fallback, and they must be distinguishable to the Visitor. A Fallback reported as a plain success is the same class of defect as v1 saving an HTML page as a `.pdf`: the operation "succeeded" while delivering something other than what was asked for. See [ADR 0002](./0002-the-portfolio-ships-with-the-package-the-cv-does-not.md).
- Accepting a `--lang` flag means the CLI parses arguments, which v1 did not do at all. That entry point stays small: argument parsing lives in `index.ts` and is not a general-purpose command interface.
