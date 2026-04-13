# CivicLink — development updates

This log summarizes significant batch work on the repository. For how agents and Claude Code should run, see **`AGENTS.md`** and **`CLAUDE.md`**; for data and vendor strategy, see **`Federal Legislation _ Federal Government Actions (1).pdf`**.

---

## 2026-04-07 — Segment 2 application shell and verification

### What shipped

- **Segment 2.4–2.8:** Next.js App Router shell under `web/app/(site)/` with skip link, sticky header (mobile menu + desktop nav), landmarked `main`, footer, shared **`PageTemplate`**, and **`AppEmpty` / `AppLoading` / `AppError`** components. Stub routes: Home, Federal, State, Voting, Events, Local, Settings.
- **Segment 2.9:** Motion tokens (`--civic-duration*`, `--civic-ease-standard`) and interaction timing in `web/app/globals.css`; `prefers-reduced-motion` handling (including scroll behavior and static loader under reduced motion).
- **Segment 2.10:** **`/about-data`** page (sources roadmap table, neutrality copy, PDF filename and conflict rule) and footer link **About data & sources**.
- **Segment 2.11:** Page-level design notes in **`design-system/pages/about-data.md`** and **`design-system/pages/home.md`**; **`design-system/MASTER.md`** updated with a Motion section.
- **Segment 2.12:** **`AGENTS.md`** updated so UI work explicitly loads **`.cursor/skills/ui-ux-pro-max/SKILL.md`** and prefers **`design-system/pages/<route>.md`** when present.

### Verification (local)

- **`npm run lint`**, **`npm run format:check`**, and **`npm run build`** were run in `web/`; **Prettier** was applied so **`format:check`** passes.
- **Segment 1.7:** `python .cursor/skills/ui-ux-pro-max/scripts/search.py --help` succeeds (UI/UX Pro Max CLI available).
- Structured review followed Superpowers **`requesting-code-review`** / **`code-reviewer.md`** and **`verification-before-completion`** (evidence before completion claims).

### Git / GitHub

- **`web/`** is tracked as normal files inside this monorepo (an accidental nested **`web/.git`** was removed so the Next.js app is not an embedded submodule).
- Pushed to **`origin`** on branch **`main`** (repository: **CivicLinkV2** on GitHub).

### Not in this batch

- **`superpowers/`**, **`wondelai-skills/`**, **`ui-ux-pro-max-skill/`**, and the full **`.cursor/skills/`** tree are optional upstream clones; they may remain untracked or ignored locally depending on team preference. **`AGENTS.md`** documents how to refresh them.
- **Segment 3+** (geo, DB, API integrations) is not started in this update.
