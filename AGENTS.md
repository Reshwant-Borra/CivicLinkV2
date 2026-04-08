# CivicLink — agent guidance

**Canonical plan:** **`PROJECT_PLAN.md`** — especially **Plan at a glance**, **§0.3 CivicLink agent playbook** (which of the **56** local skills to use per tier), and **§12** segments 1–13.

## Superpowers ([obra/superpowers](https://github.com/obra/superpowers))

This repo includes the **Superpowers** skill set under **`.cursor/skills/`** (e.g. `using-superpowers`, `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`, `subagent-driven-development`).

1. For substantial features or refactors, read **`.cursor/skills/using-superpowers/SKILL.md`** first, then apply the relevant workflow skills.
2. Prefer **planning and TDD** flows from Superpowers alongside **`PROJECT_PLAN.md`** and the legislative PDF.
3. **UI work** still follows **`.cursor/skills/ui-ux-pro-max/SKILL.md`** and any committed **`design-system/`** files.
4. **Segment 2.12 (PROJECT_PLAN):** Before changing anything under **`web/`** that affects layout, visual design, or UX, load **`.cursor/skills/ui-ux-pro-max/SKILL.md`**, then check **`design-system/pages/<route>.md`** when it exists before **`design-system/MASTER.md`**.

### Optional: Cursor marketplace install

For automatic updates and session hooks, install the official plugin in Cursor Agent chat: **`/add-plugin superpowers`** or search the plugin marketplace ([Superpowers README — Cursor](https://github.com/obra/superpowers#cursor-via-plugin-marketplace)).

### Updating the bundled copy

- Upstream clone: **`superpowers/`** — pull with `git -C superpowers pull`, then re-copy skills into `.cursor/skills/` if you rely on the bundled files rather than only the marketplace plugin.

---

## Wondel.ai skills ([wondelai/skills](https://github.com/wondelai/skills))

**41** methodology skills (product, UX, marketing, code craft, systems) are copied into **`.cursor/skills/`** as sibling folders (e.g. `refactoring-ui`, `ux-heuristics`, `clean-code`, `system-design`, `mom-test`, `jobs-to-be-done`). Invoke them by name when relevant, e.g. *“use the ux-heuristics skill”*.

- Browse descriptions: [skills.wondel.ai](https://skills.wondel.ai) and the [repo README](https://github.com/wondelai/skills).
- **Claude Code plugin:** `/plugin marketplace add wondelai/skills` then install bundles like `ux-design@wondelai-skills` (optional; local **`wondelai-skills/`** + **`.cursor/skills/`** copy already provides Cursor access).
- **CLI (optional):** `npx skills add wondelai/skills` per [their install docs](https://github.com/wondelai/skills#via-skillssh).
- **Refresh local copy:** `git -C wondelai-skills pull`, then copy each folder that contains **`SKILL.md`** into `.cursor/skills/` again (same filter as install).
