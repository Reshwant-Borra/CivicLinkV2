# CivicLink — agent guidance

**Scope and priorities:** Use your issue tracker and agreed milestones—not a monolithic repo plan file. **Data and vendor truth:** **`Federal Legislation _ Federal Government Actions (1).pdf`** (factual API claims beat markdown). **Claude Code:** read root **`CLAUDE.md`**; **`web/CLAUDE.md`** includes **`AGENTS.md`** from the repo root.

**Human-only setup** (secrets, Postgres hosting, vendor signups, applying DB migrations to your cloud): **`docs/OWNER_MANUAL_CHECKLIST.md`**.

**Two-person + AI progress:** At **every** AI session start, read **`docs/AI_PROGRESS_RULES.md`**, **`docs/PROGRESS_PERSON_A.md`**, and **`docs/PROGRESS_PERSON_B.md`**. After work, update the progress file for the role the human names (**A** or **B**) per **`docs/AI_PROGRESS_RULES.md`**. Do not touch paths the other person has claimed in their file.

## UI building: UI/UX Pro Max is mandatory (avoid AI slop)

**Primary authority for all visual and UX work in `web/`** is **UI/UX Pro Max** at **`.cursor/skills/ui-ux-pro-max/`**. Agents and **Claude Code** must **invoke / read the `ui-ux-pro-max` skill** (or **`SKILL.md`**) **before** writing or refactoring layout, styling, components, or page structure — not generic model taste.

**Apply in this order:**

1. **UI/UX Pro Max** — skill + `scripts/search.py` (`--domain`, `--stack`, `--design-system --persist` when shaping or refreshing the design system).
2. **`design-system/pages/<route>.md`** when it exists (CivicLink route: trust, density, civic tone).
3. **`design-system/MASTER.md`** — committed tokens and global rules.

**Do not ship** improvised purple-gradient SaaS templates, emoji icons, random palettes, or decorative motion that violates the skill and **`design-system/`** anti-patterns. Optional Wondel skills (**`refactoring-ui`**, **`ux-heuristics`**) refine work **after** UI/UX Pro Max — they do not replace it.

## Cursor Agent: Superpowers, UI/UX Pro Max, and Wondel

Use this checklist so Cursor's Agent has the same workflows as your local **`.cursor/skills/`** copy (plugins add hooks, marketplace updates, and discovery—not a second source of truth for CivicLink rules).

| Tooling | Install in Cursor |
|--------|---------------------|
| **Superpowers** | In Agent chat: **`/add-plugin superpowers`** (or marketplace search *superpowers*). Hooks such as **sessionstart** apply automatically. [Superpowers — Cursor](https://github.com/obra/superpowers#cursor-via-plugin-marketplace) |
| **UI/UX Pro Max** | From **repo root**: `npx uipro-cli@latest init --ai cursor` (installs/refreshes **`.cursor/skills/ui-ux-pro-max/`**). Restart Cursor. Updates: `npx uipro-cli@latest update`. [Official Cursor guide](https://www.mintlify.com/nextlevelbuilder/ui-ux-pro-max-skill/platforms/cursor) |
| **Wondel.ai skills** | This repo already mirrors the **41** packs under **`.cursor/skills/<name>/`**. Optional: open the Cursor plugin marketplace and add **wondelai/skills** bundles if you want auto-updates outside the repo; otherwise refresh from **`wondelai-skills/`** per the section below. **Claude Code:** `/plugin marketplace add wondelai/skills` then e.g. `ux-design@wondelai-skills`. |

## Superpowers ([obra/superpowers](https://github.com/obra/superpowers))

This repo includes the **Superpowers** skill set under **`.cursor/skills/`** (e.g. `using-superpowers`, `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`, `subagent-driven-development`).

1. For substantial features or refactors, read **`.cursor/skills/using-superpowers/SKILL.md`** first, then apply the relevant workflow skills.
2. Prefer **planning and TDD** flows from Superpowers alongside the legislative PDF when integrations touch real vendors or jurisdictions.
3. **UI work under `web/`** is **led by UI/UX Pro Max** (skill + CLI + `data/`), then **`design-system/pages/<route>.md`**, then **`design-system/MASTER.md`** — see **UI building: UI/UX Pro Max is mandatory** above.
4. **Before changing anything under `web/`** that affects layout, visual design, or UX: invoke or read **`ui-ux-pro-max`** first; then **`design-system/pages/<route>.md`**; then **`design-system/MASTER.md`**.

### Optional: Cursor marketplace install

See the **Cursor Agent: Superpowers, UI/UX Pro Max, and Wondel** table above (Superpowers: **`/add-plugin superpowers`**).

### Updating the bundled copy

- Upstream clone: **`superpowers/`** — pull with `git -C superpowers pull`, then re-copy skills into `.cursor/skills/` if you rely on the bundled files rather than only the marketplace plugin.

---

## Wondel.ai skills ([wondelai/skills](https://github.com/wondelai/skills))

**41** methodology skills (product, UX, marketing, code craft, systems) are copied into **`.cursor/skills/`** as sibling folders (e.g. `refactoring-ui`, `ux-heuristics`, `clean-code`, `system-design`, `mom-test`, `jobs-to-be-done`). Invoke them by name when relevant, e.g. *“use the ux-heuristics skill”*.

- Browse descriptions: [skills.wondel.ai](https://skills.wondel.ai) and the [repo README](https://github.com/wondelai/skills).
- **Claude Code:** `/plugin marketplace add wondelai/skills` then install bundles like `ux-design@wondelai-skills`. **Cursor:** optional marketplace bundles, or use the repo's **`.cursor/skills/`** copy only (see table at top).
- **CLI (optional):** `npx skills add wondelai/skills` per [their install docs](https://github.com/wondelai/skills#via-skillssh).
- **Refresh local copy:** `git -C wondelai-skills pull`, then copy each folder that contains **`SKILL.md`** into `.cursor/skills/` again (same filter as install).
