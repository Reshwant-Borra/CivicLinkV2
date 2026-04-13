# CivicLink — Claude Code

## Read first

**`AGENTS.md`** (repository root) — Superpowers, **UI/UX Pro Max (mandatory for UI)**, Wondel skills, plugin install table, and UI workflow (`design-system/`).

### Session start / end (two humans + AI — mandatory)

- **Start:** Read **`docs/AI_PROGRESS_RULES.md`**, **`docs/PROGRESS_PERSON_A.md`**, **`docs/PROGRESS_PERSON_B.md`**, and **`docs/CONTRIBUTING.md`**. The human states **Person A** or **Person B** for this session. Do not edit paths the **other** person lists as in progress.
- **End:** Update **only** `docs/PROGRESS_PERSON_A.md` **or** `docs/PROGRESS_PERSON_B.md` (whichever role was stated): **Last updated**, clear finished **Files I am touching** rows, append **Recently completed**.

## Where the app lives

All product code is under **`web/`** (Next.js App Router). Route Handlers live in **`web/app/api/`**. When you run Claude Code from **`web/`**, root **`AGENTS.md`** is still loaded via **`web/CLAUDE.md`**.

## UI / UX: UI/UX Pro Max is primary (Claude Code must use it)

**Non-negotiable:** Do not improvise visual design from model defaults ("AI slop"). For **any** work that adds or changes layout, typography, color, spacing, motion, components, or page structure under **`web/`**, **UI/UX Pro Max is the primary authority**.

1. **Invoke the `ui-ux-pro-max` skill** (Claude Code **Skill** tool) **before** writing JSX, Tailwind classes, or new CSS — or read **`.cursor/skills/ui-ux-pro-max/SKILL.md`** in full if the Skill tool is unavailable.
2. **Use the skill’s data and CLI** from repo root — not guesswork:
   - `python .cursor/skills/ui-ux-pro-max/scripts/search.py --help`
   - Examples: `--domain style`, `--domain color`, `--domain typography`, `--stack nextjs` (or `nextjs` per CLI help) for stack-specific guidance.
3. **Persist CivicLink decisions** into the repo: for a new surface or major UI slice, run **`--design-system --persist -p "CivicLink"`** (and optional **`--page "<route>"`**) so output lands under **`design-system/`**, then implement to match **`design-system/MASTER.md`** and **`design-system/pages/<route>.md`**.
4. **Order of application:** UI/UX Pro Max skill and CLI outputs first → **`design-system/pages/<route>.md`** (route overrides) → **`design-system/MASTER.md`** (tokens and global rules). If **`design-system/`** conflicts with the skill on a civic/trust/legal line, **prefer `design-system/`** for product copy and trust; otherwise prefer **UI/UX Pro Max** for visual system discipline.
5. **Forbidden without explicit skill + design-system support:** generic purple gradients, interchangeable "SaaS landing" patterns, emoji-as-icons, random font stacks, ad-hoc hex colors, heavy decorative motion, or ignoring WCAG / **`prefers-reduced-motion`**.

Wondel skills like **`refactoring-ui`** or **`ux-heuristics`** are **optional refinements** after UI/UX Pro Max — not replacements for it.

## Truth sources (no master plan file)

- **Data strategy, vendors, coverage, risks:** **`Federal Legislation _ Federal Government Actions (1).pdf`** — wins on factual API claims.
- **UI / visual system (primary):** **UI/UX Pro Max** — **`.cursor/skills/ui-ux-pro-max/`** (skill + `data/` + `scripts/search.py`). **Repo commits:** **`design-system/MASTER.md`** and **`design-system/pages/<route>.md`**.

## Using Claude Code effectively here

1. **Plugins:** [Superpowers](https://github.com/obra/superpowers) (`/plugin marketplace` / install as documented in **`AGENTS.md`**). Optional: **`wondelai/skills`** bundles (e.g. `ux-design@wondelai-skills`) — **after** UI/UX Pro Max for UI work, not instead of it.
2. **Skills:** Invoke **`using-superpowers`** at kickoff. For **UI under `web/`**: invoke **`ui-ux-pro-max` first**, then **`brainstorming`** if scope is unclear, then **`writing-plans`** for multi-step slices. For logic: **`test-driven-development`**, **`systematic-debugging`**, **`verification-before-completion`** before claiming done.
3. **UI/UX Pro Max CLI** (repo root): `python .cursor/skills/ui-ux-pro-max/scripts/search.py --help` — use **`--design-system --persist`** when establishing or extending **`design-system/`** (see [Cursor UI/UX Pro Max guide](https://www.mintlify.com/nextlevelbuilder/ui-ux-pro-max-skill/platforms/cursor)).
4. **Roadmap:** Use GitHub issues, short plans from **`writing-plans`**, and team agreement — not a checked-in monolithic plan.
