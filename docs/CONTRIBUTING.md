# CivicLink — Contributing (two-person vibe coding guide)

> This file is read by **both humans** and **AI agents** (Cursor, Claude Code).
> Follow these rules to avoid merge conflicts, wasted AI work, and GitHub pain.

---

## AI + two-person progress (read every session)

**Mandatory for any AI-driven coding session:**

1. **`docs/AI_PROGRESS_RULES.md`** — when to read/update, shared baseline of what is already done.
2. **`docs/PROGRESS_PERSON_A.md`** and **`docs/PROGRESS_PERSON_B.md`** — who owns which branch/files right now; **do not edit paths listed in the other person’s "Files I am touching" table**.

**End of session:** the human says which person (**A** or **B**) the AI must update; the AI edits **only** that person’s progress file (last updated, locks cleared, completed bullets). See **`docs/AI_PROGRESS_RULES.md`** for the full checklist.

---

## Branch rules

- **Default branch:** `main` — always deployable.
- **Naming:** `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- **One person per branch.** If it is your branch, only you (or your AI agent) edits it.
- **Open a draft PR** after your first push so the other person can see what you are working on.

## Before every push

```bash
cd web
npm run format          # normalize whitespace
npm run lint            # catch issues
npm run build           # verify nothing is broken
npm run test            # run existing tests
git pull --rebase origin main   # get latest main under your commits
```

If rebase conflicts appear, fix them locally before pushing.

## Merge style

**Squash merge** via GitHub PR. This keeps `main` history clean (one commit per feature).

Link PRs to issues: use `Fixes #12` or `Refs #12` in the PR description.

## Hot files (serialize edits)

These files are touched by many features. **Only one PR at a time should modify them.** Coordinate who goes first.

| File | Why it is hot |
|------|---------------|
| `web/app/(site)/layout.tsx` | Wraps every page; session providers, global UI |
| `web/app/layout.tsx` | Root layout; fonts, metadata |
| `web/app/globals.css` | CSS variables, motion tokens |
| `web/components/layout/site-header.tsx` | Nav, location chip |
| `web/components/layout/nav-config.ts` | Route list used by header |
| `web/package.json` / `package-lock.json` | Dependencies |
| `design-system/MASTER.md` | Design tokens; changes ripple everywhere |

**Rule:** if two PRs both need to touch a hot file, **merge PR #1 first**, then the second person rebases.

## Dependency changes (`package.json`)

Only **one person** adds or upgrades npm packages per PR. Text each other: "I'm adding `@tanstack/react-query` in my PR."

After the other person's dep PR merges, you run:

```bash
cd web
git pull --rebase origin main
npm install
```

## AI agent rules (Cursor and Claude Code)

1. **One AI driver per branch.** If Cursor agent is editing on your branch, do not also run Claude Code on the same branch.
2. **Review AI output before committing.** Always run `git diff`, read what changed, then `npm run build && npm run test`.
3. **AI must not commit directly to `main`.** Always use a feature branch + PR.
4. **AI must read before writing.** Both Cursor and Claude Code should read `AGENTS.md` / `CLAUDE.md` at session start.
5. **AI must use UI/UX Pro Max as the primary UI authority** — invoke or read **`.cursor/skills/ui-ux-pro-max/SKILL.md`** (skill **`ui-ux-pro-max`**) **before** writing JSX, Tailwind, or CSS under `web/`. Use **`python .cursor/skills/ui-ux-pro-max/scripts/search.py`** from the repo root for style/color/typography/stack guidance; use **`--design-system --persist -p "CivicLink"`** when defining a new surface. Then align with **`design-system/pages/<route>.md`** and **`design-system/MASTER.md`**. Do not ship generic "AI slop" layouts.
6. **AI must not invent colors, fonts, or spacing** outside what UI/UX Pro Max + **`design-system/MASTER.md`** specify.
7. **AI must not skip linting.** Run `npm run lint` and `npm run format:check` before claiming work is done.
8. **Claude Code sessions:** invoke **`using-superpowers`** at the start; for any **`web/`** UI work invoke **`ui-ux-pro-max`** before editing components; use **`verification-before-completion`** before finishing.

## Issue workflow

| Step | What to do |
|------|-----------|
| **Pick an issue** | Assign yourself; move to "In Progress" if using a project board. |
| **Create branch** | `git checkout -b feat/issue-short-name` |
| **Work** | Make changes; commit often with clear messages. |
| **Push + draft PR** | `git push -u origin HEAD` → open draft PR, link to issue. |
| **Self-check** | Run full verification (format, lint, build, test). |
| **Ready for review** | Mark PR as "Ready for review"; tag the other person. |
| **Review** | The other person reviews and approves (or requests changes). |
| **Merge** | Squash merge on GitHub. Delete the branch. |

## Definition of Done

- [ ] `npm run build` passes
- [ ] `npm run lint` clean
- [ ] `npm run format:check` clean
- [ ] `npm run test` passes
- [ ] A11y: keyboard navigation works, focus rings visible, contrast ≥ 4.5:1
- [ ] Civic/voting features: disclaimer copy is present and reviewed
- [ ] PR linked to issue and approved by the other person

## Daily sync (async)

Send a short message to each other daily:

> "Today: branch `feat/federal-api`, touching `lib/federal/` and `app/api/federal/`. No shared files."

This prevents two people from accidentally working on the same area.

## When to pair (synchronous)

- Writing **voting disclaimer copy** (trust and legal implications).
- Changing **shared layout files** (header, root layout, CSS variables).
- **Debugging** a cross-cutting issue that spans API + UI.
- **Dependency upgrades** that affect multiple files.
