# AI session rules — progress files and handoff

> **Audience:** Cursor Agent, Claude Code, and both humans.  
> **Goal:** AI always knows what is already done and what is **off limits** so two people vibe-coding with AI do not collide.

---

## Files you must use

| File | Purpose |
|------|---------|
| **`docs/PROGRESS_PERSON_A.md`** | Person **A** only — active branch, files in progress, completed log. |
| **`docs/PROGRESS_PERSON_B.md`** | Person **B** only — same structure. |
| **`docs/AI_PROGRESS_RULES.md`** | This file — mandatory session protocol and shared baseline. |
| **`docs/CONTRIBUTING.md`** | Branch rules, hot files, merge discipline. |

Replace "Person A / B" in your heads with real names if you want; the **filenames stay** so paths in this doc never break.

---

## At the START of every AI session (mandatory)

Before reading code, editing files, or planning implementation:

1. Read **`docs/AI_PROGRESS_RULES.md`** (this file) — especially **Shared baseline** below.
2. Read **`docs/PROGRESS_PERSON_A.md`** in full.
3. Read **`docs/PROGRESS_PERSON_B.md`** in full.
4. Read **`docs/CONTRIBUTING.md`** — hot files and "one AI driver per branch".
5. The **human** must state which role this session is for: **Person A** or **Person B** (or "shared / docs only" for chores that touch neither active area).

**Rules:**

- Treat every path listed under **Files / paths I am touching** in the **other** person’s progress file as **do not edit** unless the other person explicitly cleared it or gave written OK in chat/issue.
- If both files show overlapping paths, **stop** and ask the human to resolve before editing.

---

## At the END of every AI session — or after each mergeable slice (mandatory)

The human tells the AI which role to update (**Person A** or **Person B**). That role’s AI **must** update **only** the matching file:

1. Set **Last updated** (date, time, timezone).
2. **Current session:** clear or update branch, focus, and timestamps when work pauses or finishes.
3. **Files / paths I am touching:** remove rows for work that is **merged or abandoned**; add rows before starting new edits on a path.
4. **Recently completed:** append a bullet (date + short summary + optional PR/issue link).
5. **Notes / blockers:** update if something blocks the other person or depends on them.

**Do not** leave stale "I am editing `site-header.tsx`" rows after you are done — that blocks your partner’s AI incorrectly.

If the session touched **only** docs or shared rules with no Person A/B claim, update **both** progress files’ "Last updated" with a one-line note under **Notes** only if needed; otherwise update the stated role’s file only.

---

## Which progress file to edit

| Who is driving the session | Edit this file |
|----------------------------|----------------|
| Person A (you or your AI) | **`docs/PROGRESS_PERSON_A.md`** only |
| Person B (friend or their AI) | **`docs/PROGRESS_PERSON_B.md`** only |

Never bulk-edit the other person’s progress file to "help" — coordinate in GitHub issue or chat first.

---

## Shared baseline — already on `main` (do not redo unless fixing)

These are shipped unless your issue explicitly says refactor. **Skim `git log` if unsure.**

- Next.js app under **`web/`** — App Router, TypeScript, Tailwind v4, ESLint, Prettier, Vitest.
- **Shell:** `web/app/(site)/layout.tsx`, skip link, header (desktop + mobile), footer, `PageTemplate`, `primaryNav` in **`web/components/layout/nav-config.ts`**.
- **Pages:** Home (demo empty/loading/error), **About data**, **Settings** (location form + clear), stub **Federal / State / Voting / Events / Local**.
- **Geo:** `web/lib/geo/*`, **`POST /api/geo/resolve`**, **`DELETE` jurisdiction**, signed cookie, optional **`geocode_cache`** (Drizzle) — see **`docs/OWNER_MANUAL_CHECKLIST.md`**.
- **Health:** **`GET /api/health`**.
- **Design system:** **`design-system/MASTER.md`**, **`design-system/pages/home.md`**, **`about-data.md`**.
- **Agent docs:** **`AGENTS.md`**, **`CLAUDE.md`**, **`docs/BUILD_PLAN.md`**, **`docs/CONTRIBUTING.md`**, this file.

**Not done (typical next work):** real federal/state API clients and UI, voting UI with disclaimers, events, auth, extra DB tables — see **`docs/BUILD_PLAN.md`**.

---

## UI and AI slop

For any **`web/`** UI work, follow **`CLAUDE.md`** and **`AGENTS.md`**: **UI/UX Pro Max first**, then **`design-system/`**.

---

## Quick checklist copy-paste for humans

**Start session:** "Read `docs/AI_PROGRESS_RULES.md`, `PROGRESS_PERSON_A.md`, `PROGRESS_PERSON_B.md`, and `CONTRIBUTING`. I am Person **\_** today."

**End session:** "Update `docs/PROGRESS_PERSON_*.md` for Person **\_**: clear locks, append completed work, set Last updated."
