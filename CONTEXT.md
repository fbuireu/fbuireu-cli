# Portfolio CLI

The domain of introducing one person, Ferran Buireu, to whoever runs `npx @fbuireu/fbuireu-cli`. Everything here is about what the Visitor is shown and what they can take away with them; nothing about prompts, terminals or the libraries that draw them.

## The visit

**Visitor**:
Whoever runs the CLI. They are anonymous, arrive with no configuration and are assumed to be leaving within a minute.
_Avoid_: user, client, recruiter, audience

**Session**:
One visit, from launch to exit. It is the unit of time in this domain: nothing is remembered between Sessions, and a Session leaves nothing behind except a Download.
_Avoid_: execution, run, instance, process

**Section**:
One top-level area of the Portfolio the Visitor can enter and leave: the profile, the roles, the CV, the ways to make contact. Sections are the whole surface of the CLI; there is nothing outside them.
_Avoid_: page, screen, view, menu item, command

## The content

**Portfolio**:
Everything the CLI knows about the person it introduces. It is fixed at publish time: a given version of the package says exactly one thing, forever.
_Avoid_: profile, data, bio, site

**Profile**:
The narrative part of the Portfolio: who this person is, what they care about, what they are like to work with.
_Avoid_: about, bio, intro, summary

**Role**:
One position held at one organisation over one period. Roles are the whole of the experience Section: accomplishments and technologies belong to a Role, never float free of one.
_Avoid_: job, position, experience, gig, entry

**Contact**:
One way of reaching the person, stated so a Visitor can act on it without leaving the terminal.
_Avoid_: link, social, channel, handle

**CV**:
The published PDF document. It is the only part of the Portfolio that does not travel inside the package, and the only part that exists in more than one edition.
_Avoid_: resume, résumé, curriculum, document

**CV Edition**:
The CV in one particular language. Not every Locale has one: editions are published as they are written, and the English edition is the one guaranteed to exist.
_Avoid_: version, variant, translation, copy

## Language

**Locale**:
The language the Portfolio is rendered in. It is chosen from the Visitor's environment unless they override it, and it governs the wording, the date presentation and which CV Edition a Download reaches for.
_Avoid_: language, translation, region, i18n

**Fallback**:
Serving the English edition to a Visitor whose Locale has no CV Edition of its own. It is the normal outcome, not an error, and the CLI says which language it handed over rather than pretending the request was satisfied.
_Avoid_: default, fail-over, degradation

## Taking the CV away

**Download**:
Retrieving the CV from its Source and writing it into the Visitor's Downloads Folder. It is the only act in this domain with an effect that outlives the Session, and the only one that can fail for reasons outside the CLI.
_Avoid_: save, export, fetch, get

**CV Source**:
The canonical published location a CV Edition is retrieved from. It is authoritative: a CV obtained anywhere else may be stale, and the package deliberately holds no copy of its own to fall back on.
_Avoid_: url, endpoint, remote, mirror

**Downloads Folder**:
Where a Download lands: the Visitor's own downloads directory, not wherever they happened to be standing when they ran the CLI.
_Avoid_: destination, output directory, target, cwd
