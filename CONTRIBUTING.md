# Contributing to Zorua

We welcome contributions. Please keep merge requests small and focused. This guide explains the standards and workflow.

**Required reading before you start:**

- `AGENTS.md` in this repo — the codebase conventions. Your AI tool should load this file automatically.

## What we accept

### Bug fixes

One bug, one merge request. Fix exactly one thing. Don't bundle unrelated changes, don't sneak in refactors, don't "clean up while you're in there." Small, focused MRs get reviewed fast. Large ones sit.

When the bug was introduced by an identifiable prior commit, add a `Regression-of: <short-sha>` trailer to the bottom of your commit message. See AGENTS.md "Attributing Regressions" for the convention.

### New features and significant changes

Every feature MR should clearly explain what problem it solves and why it belongs in Zorua. Use an AI coding agent for implementation.

If you have an idea for a feature:

1. Build a minimal proof-of-concept first.
2. Prove it works and get user feedback.
3. Open an issue to discuss integration before submitting a full MR.

## Required tools

- **Claude Sonnet 4+ or equivalent frontier model** — quality depends on model quality.
- **An AI coding agent** — [Marlowe](https://marlowe.shakespeare.wtf), [OpenCode](https://opencode.ai), Cursor, or similar.
- **Node.js 22+** and npm 10.9.4+.

## The contribution workflow

Follow these steps in order.

### 1. Read the codebase conventions

Read `AGENTS.md` in the repo root. This is the single source of truth for how code should be written in this project. Your AI tool should load this file automatically.

### 2. Plan before you code

Start your AI tool in **plan mode** (or research/think mode). Spend the first few prompts:

- Exploring the existing codebase to understand how similar features are implemented
- Reading the files you'll need to modify
- Proposing an approach

Do not write code until you have a plan.

### 3. Implement

Switch to code mode and implement your plan.

### 4. Run the test suite

```sh
npm run test
```

This runs type-checking, linting, unit tests, and a production build. All must pass.

### 5. Self-review

Run this prompt against your diff:

```
Review this diff as if you are a senior maintainer of this codebase.

- [ ] Does the diff contain changes that weren't requested?
- [ ] Is there dead code, commented-out blocks, or debug artifacts left in?
- [ ] For every value displayed to a user, can you trace it from source to render?
- [ ] Are error, loading, and empty states all handled?
- [ ] Is there a read/write path that assumes fresh data but could get stale cache?
- [ ] For replaceable/addressable Nostr events: is fetchFreshEvent used before mutation?
- [ ] Are Nostr queries efficient (combined kinds, relay-level filtering)?
- [ ] Are user inputs sanitized before use in queries or rendered content?
- [ ] Does the code use the `any` type anywhere?
- [ ] Is the code Capacitor-compatible (no <a download>, no window.open())?
- [ ] Are new Nostr event kinds documented in NIP.md?
- [ ] Is any data from a Nostr event used in a security-sensitive context without validation?
- [ ] Were AGENTS.md conventions followed?
```

Address every finding before submitting.

### 6. Update changelog and version

Before committing, update `CHANGELOG.md`, `public/CHANGELOG.md`, bump the version in `package.json` and `android/app/build.gradle`, and update `public/llms.txt`. See AGENTS.md for details.

### 7. Deploy a live preview

Deploy your branch so reviewers can test it:

```sh
npm run build
npx surge dist your-branch-name.surge.sh
```

Include the live preview URL in your MR description.

### 8. Submit

Fill out the MR description with: what changed, why, live preview URL, and before/after screenshots for any UI changes.

## What gets your MR closed without review

- Incomplete MR description
- Failing test suite
- Changes beyond what was asked for
- Placeholder or dead code
- Security issues (dangerouslySetInnerHTML, eval, innerHTML, unsanitized user input)
- Large binary assets committed to git (images >100KB, fonts, videos)
- Undocumented new Nostr event kinds (new kinds must be in NIP.md)
- Missing changelog / version bump

## Upstream

Zorua is a fork of [Ditto](https://gitlab.com/soapbox-pub/ditto) by Soapbox. Upstream changes are periodically merged. If you find a bug that also exists in upstream Ditto, consider reporting it there too.

We appreciate your interest in contributing. These standards exist because reviewing a low-quality MR takes longer than doing the work ourselves.
