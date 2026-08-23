# Support

`fbuireu-cli` is a personal CV and portfolio, printed in a terminal. It is published on npm so anyone can run
it, and maintained by one person in their spare time.

## Running it

```bash
npx @fbuireu/fbuireu-cli
```

There is nothing to install and nothing to configure. The locale selects the edition, and what it prints is
what the package ships: [ADR 0004](./docs/adr/0004-the-locale-selects-the-cv-edition.md) records that decision
and its consequences.

## Where to ask

| You want to | Go to |
| --- | --- |
| Report something broken (garbled output, a colour that vanishes, a crash) | [Bug report](https://github.com/fbuireu/fbuireu-cli/issues/new?template=bug_report.yml) |
| Suggest something | [Feature request](https://github.com/fbuireu/fbuireu-cli/issues/new?template=feature_request.yml) |
| Report a vulnerability | [Security policy](https://github.com/fbuireu/fbuireu-cli/security/policy), never a public issue |
| Reach me about the contents rather than the code | The links the CLI itself prints |

Terminals differ more than anything else here, so a rendering bug needs the terminal emulator, its version and
the operating system to be reproducible. `npx @fbuireu/fbuireu-cli` pulls the latest published version: say
which one you ran if you pinned an older one.

There are no Discussions on this repository. A question is fine as an issue.
