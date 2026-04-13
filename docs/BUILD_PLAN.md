# CivicLink — Build Plan & Team Workflow

> Generated from a full repo audit. Grounded in what actually exists in the codebase today.

---

## Current state (what is built)

| Area | Status | Key files |
|------|--------|-----------|
| **Scaffold** | Done | `web/` — Next.js 16, React 19, Tailwind v4, shadcn/ui (Radix), Zod v4, Drizzle ORM |
| **Shell + nav** | Done | `app/(site)/layout.tsx` — skip link, sticky header (mobile + desktop), footer, `PageTemplate` |
| **Design system** | Done | `design-system/MASTER.md` + `pages/home.md` + `pages/about-data.md` — palette, fonts, motion tokens, anti-patterns |
| **Geo pipeline** | Done | `lib/geo/*` — GeoNames, Nominatim, Census, Google Civic → `JurisdictionContext`; `POST /api/geo/resolve`, signed cookie, cache table |
| **Settings** | Done | `LocationForm`, `ClearLocationButton`, header location chip |
| **About data** | Done | `/about-data` — sources table, neutrality copy, disclaimers |
| **Health** | Done | `GET /api/health` |
| **Tests** | Partial | 5 test files in `lib/geo/` (vitest); no component or e2e tests yet |
| **DB** | Schema only | `geocode_cache` table via Drizzle; no other tables |
| **Federal, State, Voting, Events, Local** | Stub pages | Empty-state placeholders; zero API integration |
| **Auth** | Not started | env placeholders only |

---

## A — Start-to-finish build roadmap

### Phase 1: Federal legislation (weeks 1–2)

**Goal:** First real data on screen — search and browse federal bills.

**Outcomes:**
- `/federal` shows a search bar + paginated bill list (title, sponsor, status, date).
- Clicking a bill opens `/federal/[billId]` with summary, actions timeline, sponsors, link to Congress.gov.
- Data comes from **Congress.gov API** (primary) with optional **LegiScan** fallback (per PDF recommendation).

**Technical work:**
- `lib/federal/congress-gov.ts` — typed client (search, bill detail, actions).
- `lib/federal/legiscan.ts` — optional typed client (getBill, getMasterList).
- `app/api/federal/search/route.ts` — server route (keys hidden).
- `app/api/federal/[billId]/route.ts` — detail route.
- `app/(site)/federal/page.tsx` — search UI + list (replace stub).
- `app/(site)/federal/[billId]/page.tsx` — detail page (new).
- `design-system/pages/federal.md` — page-level design notes.
- Tests for API client parsing and edge cases.

**Dependencies:** Congress.gov API key (human signs up at data.gov).

**Verification:**
```bash
cd web
npm run test
npm run lint
npm run format:check
npm run build
```

**Risks:** Congress.gov rate limit (1,000/hr). Mitigation: server cache with Drizzle (reuse `geocode_cache` pattern or new `federal_cache` table), stale-while-revalidate.

---

### Phase 2: State legislation (weeks 2–3)

**Goal:** State bills scoped to the user's saved jurisdiction.

**Outcomes:**
- `/state` shows bills for the user's state (from jurisdiction cookie) or a state picker.
- Bill list + detail view like Federal.
- Source: **OpenStates API** (primary), **LegiScan** (supplement).

**Technical work:**
- `lib/state/openstates.ts` — typed client (bills, search by jurisdiction).
- `app/api/state/search/route.ts`, `app/api/state/[billId]/route.ts`.
- `app/(site)/state/page.tsx` + `app/(site)/state/[billId]/page.tsx`.
- `design-system/pages/state.md`.

**Dependencies:** OpenStates API key; jurisdiction cookie for state scoping.

**Risks:** OpenStates coverage gaps for some states. Mitigation: LegiScan fallback; show honest "no data" with link to official state site.

---

### Phase 3: Voting information (weeks 3–4)

**Goal:** Polling places, upcoming elections, and official disclaimers.

**Outcomes:**
- `/voting` shows elections list, polling locations, and voter-registration links for user's address.
- **Prominent disclaimer**: "This is informational only — verify with your state/local election office."
- Data: **Google Civic Information API** (already partially integrated in geo pipeline).

**Technical work:**
- `lib/voting/google-civic-elections.ts` — `voterInfoQuery`, `electionQuery`.
- `lib/voting/vote-smart.ts` — optional (candidate info, voting records).
- `app/api/voting/info/route.ts`.
- `app/(site)/voting/page.tsx` — replace stub.
- `design-system/pages/voting.md` — trust-heavy copy rules.

**Dependencies:** Google Civic API key (already in `.env.example`); Vote Smart key (optional).

**Risks:** Google Civic coverage is partial outside election season. Mitigation: clear "no active elections" state; link to official sources.

---

### Phase 4: Civic events (weeks 4–5)

**Goal:** Town halls, volunteer opportunities near the user.

**Outcomes:**
- `/events` shows upcoming civic-relevant events, filterable by location and type.
- Sources: **Eventbrite** (civic/government keyword filter) + **VolunteerMatch**.

**Technical work:**
- `lib/events/eventbrite.ts`, `lib/events/volunteer-match.ts`.
- `app/api/events/search/route.ts`.
- `app/(site)/events/page.tsx` — replace stub.
- `design-system/pages/events.md`.

**Dependencies:** Eventbrite private token; VolunteerMatch key.

**Risks:** Eventbrite results are noisy. Mitigation: keyword + category filtering server-side; manual moderation later.

---

### Phase 5: Polish, auth, local (weeks 5–6)

**Goal:** User accounts, saved preferences, and local government pilot.

**Outcomes:**
- Auth (NextAuth or similar) — login, saved location persisted to DB instead of cookie-only.
- `/local` — pilot city (Legistar/Granicus) if a city is selected; otherwise honest empty state.
- Responsive polish, loading states, error boundaries for all data pages.

**Technical work:**
- `lib/auth/` — NextAuth config, session provider.
- `lib/db/schema.ts` — `users`, `saved_locations` tables.
- `app/(site)/local/page.tsx` — pilot integration if Legistar key available.
- Component-level tests; optional Playwright e2e for critical flows.
- Sentry or error reporting wiring.

**Dependencies:** Auth provider choice (human decision); pilot city vendor relationship.

---

### Phase 6+: Scale (post-MVP)

- **Full-text search** (Elasticsearch or pg_trgm) across bills.
- **AI summaries** (OpenAI/Anthropic) for bill plain-English digest.
- **Redis caching** for hot API responses.
- **Dark mode** (design system already uses CSS variables).
- **BillTrack50** (paid) for comprehensive coverage.
- **Push notifications** for tracked bills.

---

## B — Distributed work: two humans

### Branching model

| Rule | Detail |
|------|--------|
| **Default branch** | `main` — always deployable |
| **Branch naming** | `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>` |
| **Policy** | Rebase onto `main` before push: `git pull --rebase origin main` |
| **Merge style** | Squash merge via PR (keeps `main` history clean) |
| **Draft PRs** | Open **draft** as soon as you push your first commit so the other person sees direction |

### Conflict avoidance rules

1. **`package-lock.json`** — only ONE person adds/upgrades deps per PR. Coordinate: "I'm adding X today."
2. **Shared layout files** (`site-header.tsx`, `nav-config.ts`, `globals.css`, `layout.tsx`) — serialize edits. Person A merges first if both touched it.
3. **One AI driver per branch** — if Cursor/Claude is editing files on your branch, your friend does NOT also run an agent on that branch.
4. **`npm run format`** before every commit — eliminates whitespace conflicts.
5. **Small PRs** — aim for <300 lines changed. Merge within 1–2 days max.

### GitHub Issues

**Labels (minimal):**

| Label | Color | Meaning |
|-------|-------|---------|
| `feat` | green | New feature |
| `fix` | red | Bug fix |
| `chore` | gray | Tooling, deps, docs |
| `blocked` | orange | Waiting on something |
| `person-a` | blue | Assigned to Person A |
| `person-b` | purple | Assigned to Person B |

**Issue template (prose):**

```
Title: [feat/fix/chore] Short description

## What
One sentence of what this delivers.

## Acceptance criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] `npm run build` passes
- [ ] `npm run lint` clean

## Out of scope
- Things explicitly NOT in this issue

## Files likely touched
- web/lib/...
- web/app/(site)/...
```

**Link PRs:** use `Fixes #12` or `Refs #12` in PR description.

### Two-column task matrix (weeks 1–6)

#### Week 1–2

| Person A (Federal back-end + API) | Person B (Federal front-end + UI) |
|------------------------------------|-------------------------------------|
| Create `lib/federal/congress-gov.ts` client | Create `design-system/pages/federal.md` |
| Create `lib/federal/legiscan.ts` fallback | Build `app/(site)/federal/page.tsx` search UI |
| Create `app/api/federal/search/route.ts` | Build `app/(site)/federal/[billId]/page.tsx` detail |
| Create `app/api/federal/[billId]/route.ts` | Style bill cards, list, loading/error states |
| Write tests for API client parsing | Visual QA against design system |
| **Shared file:** `nav-config.ts` if adding subnav → A merges first | |

#### Week 2–3

| Person A (State back-end + API) | Person B (State front-end + UI) |
|------------------------------------|-------------------------------------|
| Create `lib/state/openstates.ts` | Build `app/(site)/state/page.tsx` with jurisdiction scoping |
| Create `app/api/state/search/route.ts` | Build `app/(site)/state/[billId]/page.tsx` |
| Create `app/api/state/[billId]/route.ts` | Add state picker component for users without saved location |
| Write tests | Visual QA, responsive checks |

#### Week 3–4

| Person A (Voting back-end) | Person B (Events back-end + front-end) |
|------------------------------------|-------------------------------------|
| `lib/voting/google-civic-elections.ts` | `lib/events/eventbrite.ts` + `volunteer-match.ts` |
| `app/api/voting/info/route.ts` | `app/api/events/search/route.ts` |
| **Voting page** UI (disclaimer-heavy — pair on copy) | `app/(site)/events/page.tsx` |
| Write tests | Write tests |
| **Pair together:** review voting disclaimer copy | |

#### Week 5–6

| Person A (Auth + DB) | Person B (Local pilot + polish) |
|------------------------------------|-------------------------------------|
| `lib/auth/` NextAuth setup | `app/(site)/local/page.tsx` (Legistar pilot if key available) |
| Expand `lib/db/schema.ts` — users, saved_locations | Responsive sweep of all pages (375–1440px) |
| Migrate cookie-based location to DB-backed | Loading/error state audit across all routes |
| **Shared file:** `layout.tsx` if adding session provider → A merges first | Add component tests (vitest + testing-library) |

### Sync cadence

- **Daily async** (text/Slack): "I'm on branch `feat/X`, touching `lib/Y/` and `app/Z/`."
- **Pair when:** voting disclaimer copy, shared layout changes, debugging a cross-cutting issue.
- **Solo when:** isolated API client work, isolated UI page, tests.

### Definition of Done (per task)

- [ ] `npm run build` passes
- [ ] `npm run lint` clean
- [ ] `npm run format:check` clean
- [ ] `npm run test` passes (if tests exist for that area)
- [ ] A11y spot-check: keyboard nav, focus visible, WCAG contrast on new UI
- [ ] Civic/voting tasks: disclaimer copy present and reviewed by both people
- [ ] PR open, linked to issue, reviewed by the other person

---

## C — Cursor vs Claude Code

### When to use Cursor

- **Tight edit loops:** rename, inline refactor, extract component.
- **Diagnostics:** see lint errors inline, jump to type definitions.
- **Running scripts:** `npm run dev`, `npm run test`, `npm run build` in the integrated terminal.
- **Quick multi-file search/replace.**
- **UI work with hot reload** — edit component, see result immediately.

### When to use Claude Code

- **Long autonomous slices:** "implement the entire OpenStates client with tests."
- **Skill-driven workflow:** invoke `using-superpowers`, `brainstorming`, `writing-plans`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`.
- **Design system generation:** run `python .cursor/skills/ui-ux-pro-max/scripts/search.py "civic dashboard" --design-system --persist` to refresh design system files.
- **Multi-file orchestration** that benefits from the Superpowers planning + execution loop.

### Rules to prevent chaos

1. **Never two agents editing the same branch at the same time.** One driver, one branch.
2. **Serialize hot files.** If `globals.css`, `layout.tsx`, or `site-header.tsx` are involved, only one person/agent touches them per PR.
3. **Plans live in GitHub Issues**, not in duplicate markdown files or chat history.
4. **After a Claude Code session:** always `git status`, review the diff, run `npm run build && npm run test` before pushing.
5. **After a Cursor agent session:** same — verify before push.

---

## D — UI build rules (UI/UX Pro Max is primary)

**UI/UX Pro Max** (`.cursor/skills/ui-ux-pro-max/`) is the **primary** source for visual and UX decisions so work does not default to generic AI styling. **`design-system/`** carries CivicLink commits and route overrides. **Claude Code** must invoke the **`ui-ux-pro-max`** skill (or read **`SKILL.md`**) before implementing UI.

### For every UI task

1. **Before writing any UI code** — in order:
   - Invoke or read **UI/UX Pro Max** — **`.cursor/skills/ui-ux-pro-max/SKILL.md`**; run **`search.py`** as needed (`--domain`, `--stack` for Next.js).
   - **`design-system/pages/<route>.md`** if it exists for that route.
   - **`design-system/MASTER.md`**
2. **Create `design-system/pages/<route>.md`** for each new data page (federal, state, voting, events, local) before building the UI (optionally seed from **`search.py --design-system --persist`**).
3. **Tokens only** — use `--color-primary`, `--space-md`, `--civic-duration`, etc. from `MASTER.md`. No ad-hoc hex values or pixel padding.
4. **Icons:** Lucide only (already installed). No emojis-as-icons.
5. **Motion:** 150–300ms; always honor `prefers-reduced-motion`.
6. **Contrast:** ≥ 4.5:1 (WCAG AA). Check with browser devtools.
7. **Responsive:** test at 375, 768, 1024, 1440.

### Design system persistence

When creating a new major page or component area, run from repo root:

```bash
python .cursor/skills/ui-ux-pro-max/scripts/search.py "<page description>" --design-system --persist -p "CivicLink"
```

This generates/updates files in `design-system/`. Review and commit the output — it becomes the source of truth for that page's visual direction.

### Component strategy

- **shadcn/ui** (already installed) for primitives: Button, Card, Dialog, DropdownMenu, Table, Tabs, etc.
- Add shadcn components on-demand: `npx shadcn@latest add <component>` from `web/`.
- **Custom components** in `web/components/` follow the same token system.
- **No CSS modules or styled-components** — Tailwind utility classes + CSS variables only.

---

## Prioritized backlog (paste into GitHub Issues)

| # | Title | Person | Phase |
|---|-------|--------|-------|
| 1 | `[feat]` Congress.gov API client (`lib/federal/congress-gov.ts`) | A | 1 |
| 2 | `[feat]` Federal search API route (`app/api/federal/search/route.ts`) | A | 1 |
| 3 | `[feat]` Federal detail API route (`app/api/federal/[billId]/route.ts`) | A | 1 |
| 4 | `[feat]` Federal page design notes (`design-system/pages/federal.md`) | B | 1 |
| 5 | `[feat]` Federal search + list UI (`app/(site)/federal/page.tsx`) | B | 1 |
| 6 | `[feat]` Federal bill detail page (`app/(site)/federal/[billId]/page.tsx`) | B | 1 |
| 7 | `[feat]` LegiScan client (optional fallback) (`lib/federal/legiscan.ts`) | A | 1 |
| 8 | `[feat]` OpenStates API client (`lib/state/openstates.ts`) | A | 2 |
| 9 | `[feat]` State search + detail API routes | A | 2 |
| 10 | `[feat]` State page design notes + UI | B | 2 |
| 11 | `[feat]` State bill detail page | B | 2 |
| 12 | `[feat]` State picker for users without saved location | B | 2 |
| 13 | `[feat]` Voting — Google Civic elections client | A | 3 |
| 14 | `[feat]` Voting page UI + disclaimers | A | 3 |
| 15 | `[feat]` Events — Eventbrite client | B | 3 |
| 16 | `[feat]` Events — VolunteerMatch client | B | 3 |
| 17 | `[feat]` Events page UI | B | 3 |
| 18 | `[feat]` Voting page design notes | B | 3 |
| 19 | `[feat]` Auth — NextAuth setup | A | 4 |
| 20 | `[feat]` DB schema expansion (users, saved_locations) | A | 4 |
| 21 | `[feat]` Local government pilot page | B | 4 |
| 22 | `[chore]` Responsive audit — all pages | B | 4 |
| 23 | `[chore]` Component tests (vitest + testing-library) | B | 4 |
| 24 | `[chore]` Error reporting (Sentry) | A | 4 |

---

## Next 3 actions (for you, right now)

1. **Sign up for a Congress.gov API key** at [api.data.gov](https://api.data.gov/signup/) — paste into `web/.env.local` as `CONGRESS_GOV_API_KEY`. This unblocks Phase 1.

2. **Create the first 6 GitHub Issues** from the backlog table above (issues #1–#6). Assign #1–#3 to Person A, #4–#6 to Person B.

3. **Share this doc + `docs/CONTRIBUTING.md`** with your friend so you are both reading the same branching rules and conflict avoidance habits before either of you starts coding.
