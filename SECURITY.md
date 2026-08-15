# Security Policy

## Supported Versions

Only the latest published version of `@fbuireu/fbuireu-cli` on npm is
supported. Fixes ship as a new release; older versions are never patched.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| older   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub
issues.**

If you discover a security vulnerability, please report it privately:

### Preferred Method: GitHub Private Vulnerability Reporting

1. Go to the [Security tab](https://github.com/fbuireu/fbuireu-cli/security)
2. Click "Report a vulnerability"
3. Fill in the details about the vulnerability

### Alternative: Email

Send an email to **fbuireu@gmail.com** with:

- Type of issue (e.g., arbitrary file write, malicious download, supply-chain
  concern, etc.)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept if possible
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: we'll acknowledge receipt within 48 hours
- **Updates**: we'll provide updates on the fix progress
- **Timeline**: we aim to fix critical issues within 7 days
- **Credit**: we'll credit you in the security advisory (unless you prefer to
  remain anonymous)
- **Disclosure**: we follow a 90-day responsible disclosure policy

## Where to Look

The CLI's footprint is deliberately tiny, which makes the interesting surface
easy to name:

- **The CV download** — the one network fetch and the one filesystem write in
  the whole program. The bytes are verified to be a PDF before anything
  touches disk.
- **The published bundle** — a single ESM file with zero runtime dependencies,
  published with npm provenance, so what runs is attestably what this
  repository built.

The CLI stores nothing between sessions, reads no configuration, and sends no
telemetry.
