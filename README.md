# CivicLink

Civic dashboard: federal and state legislation, voting tools, and civic events—see **`PROJECT_PLAN.md`** and **`Federal Legislation _ Federal Government Actions (1).pdf`** for data strategy.

## Repository layout

| Path | Purpose |
|------|---------|
| **`web/`** | Next.js (App Router) + TypeScript + Tailwind — **main application** |
| `PROJECT_PLAN.md` | Product + implementation roadmap |
| `AGENTS.md` | How coding agents should use **Superpowers**, **Wondel skills**, and **ui-ux-pro-max** |
| **`.cursor/skills/`** | **Superpowers** + **[Wondel.ai skills](https://github.com/wondelai/skills)** + **ui-ux-pro-max** |
| **`superpowers/`** | Git clone of [obra/superpowers](https://github.com/obra/superpowers) (source of truth for updates) |
| **`wondelai-skills/`** | Git clone of [wondelai/skills](https://github.com/wondelai/skills) (41 `SKILL.md` packs) |
| `ui-ux-pro-max-skill/` | Upstream UI/UX Pro Max repo (optional reference) |

The app lives under **`web/`** because the parent folder name is not a valid npm package name.

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

## Hosting (Segment 1.5 — default path)

Document your real choices when locked in. A typical MVP stack:

| Layer | Default suggestion | Notes |
|-------|-------------------|--------|
| App | **Vercel** (or any Node host) | `web/` is a standard Next.js app. |
| Database | **Neon**, **Supabase Postgres**, or **RDS** | Needed from **Segment 4** onward—not required for local UI-only work. |

## Segment 1 status

- [x] **1.1** Git + root `.gitignore` + this README  
- [x] **1.2** Next.js scaffold in `web/`  
- [x] **1.3** ESLint + Prettier (`eslint-config-prettier`)  
- [x] **1.4** **`web/.env.example`** — full template aligned with **PROJECT_PLAN.md** §2 (federal, state, local pilot, events, voting, geo, trust, DB/Redis, auth placeholders, observability, Phase 2/3); copy to **`web/.env.local`**. Root `.gitignore` explicitly allows `web/.env.example`.  
- [x] **1.5** Hosting notes (defaults above; swap when decided)  
- [x] **1.6** **`GET /api/health`** — JSON `{ ok, service, time }` at `web/app/api/health/route.ts`  
- [x] **1.7** Python 3 available + **UI/UX Pro Max** CLI runnable from repo root, e.g. `python .cursor/skills/ui-ux-pro-max/scripts/search.py --help` (use **`--design-system --persist`** in Segment 2 per **PROJECT_PLAN.md**)  

**Segment 1 is complete.** Next: **PROJECT_PLAN.md** Segment 2 (design system + shell).

## License

Add a license when you are ready.
