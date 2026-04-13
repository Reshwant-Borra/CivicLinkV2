# CivicLink

Civic dashboard: federal and state legislation, voting tools, and civic events—**data strategy and vendors** in **`Federal Legislation _ Federal Government Actions (1).pdf`**; **agents and Claude Code** in **`AGENTS.md`** and **`CLAUDE.md`**.

## Repository layout

| Path | Purpose |
|------|---------|
| **`web/`** | Next.js (App Router) + TypeScript + Tailwind — **main application** |
| `AGENTS.md` | **Cursor** + repo skills: **Superpowers**, **Wondel**, **ui-ux-pro-max** |
| `CLAUDE.md` | **Claude Code** entry: truth sources, skill usage, **`web/`** layout |
| [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) | Phased roadmap, two-person task matrix, backlog |
| [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) | Branch rules, conflict avoidance, AI agent rules |
| [`docs/AI_PROGRESS_RULES.md`](docs/AI_PROGRESS_RULES.md) | **AI:** read at session start; update progress files at session end |
| [`docs/PROGRESS_PERSON_A.md`](docs/PROGRESS_PERSON_A.md) | **Person A** — branch, files in progress, done log |
| [`docs/PROGRESS_PERSON_B.md`](docs/PROGRESS_PERSON_B.md) | **Person B** — same |
| **`.cursor/skills/`** | **Superpowers** + **[Wondel.ai skills](https://github.com/wondelai/skills)** + **ui-ux-pro-max** |
| **`superpowers/`** | Git clone of [obra/superpowers](https://github.com/obra/superpowers) (source of truth for updates) |
| **`wondelai-skills/`** | Git clone of [wondelai/skills](https://github.com/wondelai/skills) (41 `SKILL.md` packs) |
| `ui-ux-pro-max-skill/` | Upstream UI/UX Pro Max repo (optional reference) |

The app lives under **`web/`** because the parent folder name is not a valid npm package name.

## Cursor Agent: enable all skill plugins

Full checklist (Superpowers + UI/UX Pro Max + Wondel) lives in **`AGENTS.md`** under **Cursor Agent: Superpowers, UI/UX Pro Max, and Wondel**. Short version:

1. **Superpowers** — In Cursor Agent: **`/add-plugin superpowers`**
2. **UI/UX Pro Max** — From repo root: `npx uipro-cli@latest init --ai cursor`, then restart Cursor ([Cursor guide](https://www.mintlify.com/nextlevelbuilder/ui-ux-pro-max-skill/platforms/cursor))
3. **Wondel (41 skills)** — Already under **`.cursor/skills/`**; optional marketplace bundles or `npx skills add wondelai/skills` to refresh

**Claude Code:** open the repo root (or **`web/`**), read **`CLAUDE.md`**, install **Superpowers** + optional **wondelai/skills** plugins, invoke skills (`using-superpowers`, `writing-plans`, TDD, etc.) per that file.

## Superpowers (agent workflow)

[Jesse Vincent’s Superpowers](https://github.com/obra/superpowers) is installed in two ways:

1. **`superpowers/`** — full upstream tree (docs, hooks, version **5.0.7** per `plugin.json`).
2. **`.cursor/skills/`** — skill folders copied from `superpowers/skills/` so Cursor can load **`SKILL.md`** files next to **ui-ux-pro-max**.

Optional: in **Cursor Agent**, run **`/add-plugin superpowers`** for marketplace integration, session hooks, and updates ([install instructions](https://github.com/obra/superpowers#cursor-via-plugin-marketplace)).

To refresh the copied skills after `git -C superpowers pull`, copy `superpowers/skills/*` into `.cursor/skills/` again (or reinstall the marketplace plugin).

## Wondel.ai skills (product, UX, engineering)

[Wondel.ai skills](https://github.com/wondelai/skills) adds **41** agent skills (JTBD, Refactoring UI, UX heuristics, Lean Startup, DDD, DDIA, etc.). They live in **`wondelai-skills/`** and are mirrored under **`.cursor/skills/<skill-name>/`** so Cursor can load them.

Optional: install via Claude marketplace **`wondelai/skills`** or run `npx skills add wondelai/skills` — see the [repository README](https://github.com/wondelai/skills#installation).

## Quick start (local)

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health).

### Scripts (in `web/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (CI) |

## Environment variables

Copy **`web/.env.example`** → **`web/.env.local`** and fill in keys as you integrate each API. Comments in `.env.example` summarize **what each API returns** and how auth works (verify against current vendor docs).

## Hosting (defaults)

Document your real choices when locked in. A typical MVP stack:

| Layer | Default suggestion | Notes |
|-------|-------------------|--------|
| App | **Vercel** (or any Node host) | `web/` is a standard Next.js app. |
| Database | **Neon**, **Supabase Postgres**, or **RDS** | When you add server-backed persistence—not required for local UI-only work. |

## Bootstrap (done)

- [x] Git + root `.gitignore` + this README  
- [x] Next.js scaffold in `web/`  
- [x] ESLint + Prettier (`eslint-config-prettier`)  
- [x] **`web/.env.example`** — integration vars and comments (federal, state, local pilot, events, voting, geo, trust, DB/Redis, auth placeholders, observability); copy to **`web/.env.local`**. Root `.gitignore` explicitly allows `web/.env.example`.  
- [x] Hosting notes (defaults above; swap when decided)  
- [x] **`GET /api/health`** — JSON `{ ok, service, time }` at `web/app/api/health/route.ts`  
- [x] Python 3 + **UI/UX Pro Max** CLI from repo root, e.g. `python .cursor/skills/ui-ux-pro-max/scripts/search.py --help`; use **`--design-system --persist`** when you want generated output in **`design-system/`**  

**Next work:** track in issues; for UI, follow **`design-system/`** and **`AGENTS.md`**.

## License

Add a license when you are ready.
