# CivicLink — Master Project Plan

This document is the **single orchestration guide** for CivicLink: **data strategy** (PDF), **application architecture** (`web/`), **visual design** (UI/UX Pro Max + `design-system/`), and **how humans and agents execute work** ([Superpowers](https://github.com/obra/superpowers), [Wondel.ai skills](https://github.com/wondelai/skills)).  

**Numbered segments 1–13** in [§12 Master implementation roadmap](#12-master-implementation-roadmap-segments-113) are the authoritative build sequence; everything above §12 provides context and constraints.

---

## Plan at a glance

1. **Truth:** `Federal Legislation _ Federal Government Actions (1).pdf` + live vendor docs define **what** to integrate; this file defines **order** and **architecture**.
2. **Stack:** Next.js App Router in **`web/`**, server-only Route Handlers for keys, PostgreSQL from Segment 4, Redis/queues in Segment 13.
3. **Build spine:** **1 → 2 → 3 → 4** (platform, design shell, geo, persistence), then **5–8** (federal, state, voting, events), overlap **10**, then **9**, **11**, continuous **12**, scale **13**.
4. **Agents:** **Superpowers** = delivery discipline (plans, TDD, debug, review). **UI/UX Pro Max** = visual system. **Wondel** = depth by workstream—**not** all 41 at once; use [§0.3](#03-civiclink-agent-playbook-full-inventory--tiers).
5. **Non-negotiables for CivicLink:** primary-source links, freshness/disclaimer copy (especially **voting**), WCAG-oriented UX, and **no dark patterns** on civic or election-adjacent flows.

---

## Primary references (authority order)

| Layer | Source | Role |
|-------|--------|------|
| **Data, APIs, risks, phased data strategy** | `Federal Legislation _ Federal Government Actions (1).pdf` | **Wins** on coverage, vendors, mitigations, bibliography. |
| **Visual & interaction design** | [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) + committed **`design-system/MASTER.md`** | **Wins** on palette, type, motion, anti-patterns; override only for legal a11y/brand. |
| **Agent workflow (planning, TDD, debug, review)** | [obra/superpowers](https://github.com/obra/superpowers) → `.cursor/skills/` + `superpowers/` | Mandatory **process** quality; see [§0.1](#01-superpowers-when-to-use-which-skill). |
| **Method playbooks (product, UX, craft, systems)** | [wondelai/skills](https://github.com/wondelai/skills) → `.cursor/skills/` + `wondelai-skills/` | **Optional depth** on demand; see [§0.2](#02-wondel-skills-suggested-by-segment). |
| **Repo agent entrypoint** | **`AGENTS.md`** | Short pointer; full **Tier S/A/B** skill map in **§0.3** below. |

**Conflict rule:** PDF overrides this markdown for **factual API claims**. **`design-system/MASTER.md`** overrides ad-hoc UI taste. **Superpowers** overrides “skip tests / rush.”

---

## 0. Engineering context (what exists in this repo)

| Path | Purpose |
|------|---------|
| **`web/`** | **Production app:** Next.js (App Router), TypeScript, Tailwind, ESLint + Prettier. All UI routes and `app/api/*` live here. |
| **`web/.env.example`** | Documented third-party keys and **what each API returns**; copy to **`web/.env.local`**. |
| **`.cursor/skills/`** | **56** skill roots with `SKILL.md`: **14 Superpowers** (workflow), **1** UI/UX Pro Max, **41** Wondel (methodology). See [§0.3](#03-civiclink-agent-playbook-full-inventory--tiers). |
| **`superpowers/`** | Upstream clone; refresh with `git -C superpowers pull` + re-copy `superpowers/skills/*` if not using `/add-plugin superpowers`. |
| **`wondelai-skills/`** | Upstream clone; refresh similarly; re-copy folders containing `SKILL.md` into `.cursor/skills/`. |
| **`ui-ux-pro-max-skill/`** | Upstream; `uipro update` or `uipro init --ai cursor` for refreshes. |

**Target architecture (short):**

- **Frontend:** React 19 + Next.js, server components where possible; client components for interactivity; Tailwind; eventually **shadcn/ui** (Segment 2).
- **Backend (same monolith):** Next **Route Handlers** under `web/app/api/**` — **all third-party API keys server-only**; no secrets in `NEXT_PUBLIC_*` except safe origins.
- **Data:** PostgreSQL + migrations (Prisma or Drizzle) from Segment 4 onward; Redis deferred to Segment 13 for cache/queues.
- **Observability:** Sentry (or similar) + structured logs + `/api/health` (Segment 1).

---

### 0.1 Superpowers: when to use which skill

Use **[Superpowers](https://github.com/obra/superpowers)** as **mandatory process**, not optional etiquette.

| Phase | Skill folder (`.cursor/skills/`) | When |
|-------|-----------------------------------|------|
| Ideation / scope | `brainstorming` | New major feature, unclear problem, or pivot before any UI mock. |
| Parallel risky work | `using-git-worktrees` | Large refactors or long-lived branches; isolate from `main`. |
| After design agreed | `writing-plans` | Produce **bite-sized tasks** with file paths, verification steps (align with §12 decimals). |
| Execution | `subagent-driven-development` or `executing-plans` | Run the plan with reviews/checkpoints. |
| Every feature slice | `test-driven-development` | **Red → green → refactor** for domain logic, geocoding normalization, API adapters. |
| Defects | `systematic-debugging`, `verification-before-completion` | No guessing; reproduce, narrow, prove fix. |
| Gates | `requesting-code-review` | Before merge; severity-bucket findings. |
| Close branch | `finishing-a-development-branch` | Tests green, PR/merge hygiene. |

**Entry read:** `.cursor/skills/using-superpowers/SKILL.md` at project kickoff and when onboarding new contributors.

**Cursor marketplace (optional):** `/add-plugin superpowers` for hooks and auto-updates — [Superpowers — Cursor](https://github.com/obra/superpowers#cursor-via-plugin-marketplace).

**Reviewer loop:** After you run **`requesting-code-review`**, use **`receiving-code-review`** when *you* implement fixes so feedback is triaged, traced, and closed cleanly.

---

### 0.2 Wondel skills: suggested by segment

Invoke by folder name in prompts, e.g. *“Apply `ux-heuristics` to this flow.”* Full catalog: [skills.wondel.ai](https://skills.wondel.ai).  

**Prefer the curated Tier B/C lists in [§0.3](#03-civiclink-agent-playbook-full-inventory--tiers)** over raw exploration—Wondel includes strong **sales and growth** skills that are **out of scope** for core engineering unless you are explicitly doing GTM.

| Segment | Suggested Wondel skills |
|---------|-------------------------|
| **1** | `pragmatic-programmer`, `release-it` |
| **2** | `refactoring-ui`, `ux-heuristics`, `design-everyday-things`, `web-typography`, `microinteractions`, `lean-ux`, `top-design` (landing only) |
| **3** | `domain-driven-design`, `software-design-philosophy` |
| **4** | `clean-architecture`, `domain-driven-design`, `ddia-systems`, `system-design`, `release-it` |
| **5–8** | `inspired-product`, `continuous-discovery`, `jobs-to-be-done`, `mom-test`; `clean-code`, `refactoring-patterns` |
| **8** (events) | `cro-methodology` (ethical signup only), `hooked-ux` / `contagious` only under [§0.3 ethics](#03-civiclink-agent-playbook-full-inventory--tiers) |
| **9** | `lean-startup`, `design-sprint` |
| **10** | `drive-motivation`, `influence-psychology` **only** with transparent, user-serving patterns |
| **11** | `made-to-stick`, `storybrand-messaging` (explain sourcing, not hype) |
| **12** | `high-perf-browser`, `release-it`, `system-design` |
| **13** | `ddia-systems`, `system-design`, `clean-architecture`, `high-perf-browser` |

---

### 0.3 CivicLink agent playbook (full inventory & tiers)

**Why tiers:** CivicLink is a **high-trust civic product**. The right default is **Superpowers for rigor** + **UI/UX Pro Max for visuals** + **a small Wondel subset per task**. Spraying “marketing optimization” skills onto voting or legislation flows **hurts** credibility.

#### Tier S — Start here (almost every session)

| Skill | Folder | Use |
|-------|--------|-----|
| Using Superpowers | `using-superpowers` | Skill selection discipline; read at kickoff. |
| UI (when touching UI) | `ui-ux-pro-max` | Any layout, component, token, or UX review—after **`design-system/MASTER.md`** exists. |

#### Tier A — Core delivery loop (mandatory for substantive work)

| Skill | Folder | Use |
|-------|--------|-----|
| Brainstorming | `brainstorming` | New feature area, unclear IA, or pivot **before** coding. |
| Writing plans | `writing-plans` | Break §12 decimals into PR-sized tasks with verification steps. |
| Test-driven development | `test-driven-development` | Adapters: geo, API mappers, normalization, classifiers—**red → green → refactor**. |
| Executing plans | `executing-plans` | Linear execution when the plan is already written. |
| Subagent-driven development | `subagent-driven-development` | Parallel UI + API workstreams with review gates. |
| Systematic debugging | `systematic-debugging` | Any non-trivial defect; no speculative fixes. |
| Verification before completion | `verification-before-completion` | Before “done”: especially voting/geo **without logging PII**. |
| Requesting code review | `requesting-code-review` | Pre-merge checklist for author or reviewer. |
| Receiving code review | `receiving-code-review` | Implementing review feedback systematically. |
| Finishing a development branch | `finishing-a-development-branch` | Merge-ready hygiene. |
| Parallel experiments | `using-git-worktrees` | Risky integrations (local pilot, bulk ingest spikes). |
| Parallel agents / spikes | `dispatching-parallel-agents` | Segment 13 evaluations, multi-API comparison benches. |

#### Tier B — Meta / maintenance (Rare for CivicLink app work)

| Skill | Folder | Use |
|-------|--------|-----|
| Writing skills | `writing-skills` | Only when **authoring or stress-testing Cursor skills** in-repo—not for product features. |

#### Wondel — Recommended for CivicLink (high signal)

| Theme | Skills | Notes |
|-------|--------|------|
| **Product & problem clarity** | `continuous-discovery`, `inspired-product`, `jobs-to-be-done`, `mom-test`, `lean-ux`, `lean-startup`, `design-sprint` | Use **before** locking scope on Segments 5–9. |
| **UX & visual craft** | `ux-heuristics`, `design-everyday-things`, `refactoring-ui`, `web-typography`, `microinteractions` | Default stack for civic UI; pairs with UI/UX Pro Max. |
| **Retention / clarity (not growth hacks)** | `improve-retention` | Friction removal, comprehension, return visits—**not** deceptive patterns. |
| **Engineering quality** | `clean-code`, `clean-architecture`, `refactoring-patterns`, `domain-driven-design`, `software-design-philosophy`, `pragmatic-programmer`, `release-it` | Segments 3–4, 12–13. |
| **Distributed systems lens** | `ddia-systems`, `system-design` | Caching, search tier, queues, bulk—Segment 13. |
| **Browser performance** | `high-perf-browser` | Segment 12+; Core Web Vitals, list virtualization. |
| **Trust narratives** | `made-to-stick`, `storybrand-messaging` | Explain **why we cite sources** and **coverage limits**—Segment 11, disclaimers. |

#### Wondel — Use sparingly or with guardrails (civic ethics)

| Skill | Folder | Rule |
|-------|--------|------|
| Hooked UX | `hooked-ux` | **Audit only:** habit loops must not obscure election dates, polling info, or sources. |
| Contagious | `contagious` | **No viral dark patterns**; optional for **opt-in** share-after-save with clear labeling. |
| Influence psychology | `influence-psychology` | **Transparency mandates** (voting disclaimers, data freshness). No manufactured scarcity of civic facts. |
| CRO methodology | `cro-methodology` | Signup funnels **after** trust copy is true; A/B test **without** misleading claims. |
| Drive motivation | `drive-motivation` | Onboarding progression **without** manipulative streaks on civic outcomes. |

#### Wondel — Deprioritized until GTM / ops (do not block MVP)

These are valuable for **launch, positioning, or org scaling**—not for core legislative integration:

`blue-ocean-strategy`, `crossing-the-chasm`, `obviously-awesome`, `one-page-marketing`, `predictable-revenue`, `scorecard-marketing`, `traction-eos`, `hundred-million-offers`, `negotiation`, `top-design` (ok for **one** later marketing landing), `ios-hig-design` (**skip** unless you ship a native iOS app).

#### Standard agent session recipe

1. Open **`AGENTS.md`** + **`using-superpowers`** when starting cold.  
2. **Data question?** → PDF + `web/.env.example`. **UI question?** → `design-system/MASTER.md` + **`ui-ux-pro-max`**.  
3. **New scope?** → `brainstorming` → **`writing-plans`** mapped to §12 decimals.  
4. **Implement** → **`test-driven-development`** for anything with branches (geo, mappers, dedupe).  
5. **Ship** → `requesting-code-review` → fix with `receiving-code-review` → **`finishing-a-development-branch`**.  
6. **Stuck?** → `systematic-debugging`; **before marking done on sensitive paths** → `verification-before-completion`.

---

## Design and UI reference (UI/UX Pro Max)

CivicLink is a **trusted civic dashboard**; visual language must feel **official-adjacent, calm, and accessible**.

| Artifact | Path |
|----------|------|
| Cursor skill | `.cursor/skills/ui-ux-pro-max/` |
| Upstream | `ui-ux-pro-max-skill/` |

**Workflow:** Python 3 → run `search.py` with `--design-system --persist -p "CivicLink"` → commit **`design-system/MASTER.md`** and optional **`design-system/pages/*.md`** → implement Tailwind + components to match Master. See prior detailed steps in git history or **`AGENTS.md`** if you need the exact command line.

**Pairing:** Wondel **`refactoring-ui`** + **`web-typography`** complement UI/UX Pro Max for implementation detail; Master still wins for project-specific tokens.

---

## 1. Purpose and product vision

**CivicLink** is a **neutral civic dashboard**: federal and state legislation, voting helpers, civic events, optional local pilot — anchored on **primary sources** and **clear coverage disclaimers**.

**Principles from the PDF:** hybrid official + civic-tech data; phased rollout; free first; bulk + search + NLP later; local last.

---

## 2. Scope by domain (from PDF)

**Authoritative nuance:** For discovery tables, nuanced tradeoffs, numbered citations in the research doc, rate-limit **as-of-research-date** figures, and the full bibliography — always cross-check **`Federal Legislation _ Federal Government Actions (1).pdf`**. This section mirrors the PDF’s structure so engineers can scan without opening the file; **if anything disagrees, the PDF wins.**

### 2.1 Federal legislation / federal government actions

**Goals:** Bill metadata, summaries, sponsors, actions/status, committees, timelines, votes; full bill text when needed.

**Discovery sources (PDF §1):** Congress.gov API, GovInfo API, GovInfo Bulk, LegiScan API, ProPublica bulk, BillTrack50 (paid), Open States (state-focused; noted in federal table for contrast), Democracy Works Elections API (paid), Google Civic Info API, Vote Smart API. *Note: GovTrack and Sunlight APIs are defunct per PDF.*

**Shortlisted (PDF §2):**

| Tier | Source | Role in CivicLink |
|------|--------|-------------------|
| Core free | **Congress.gov API** | Authoritative federal metadata; daily updates; JSON/XML; rate limits (e.g. 1,000/hr cited in PDF). |
| Core free | **GovInfo API** | Full text (BILLS), BillStatus; ~36k calls/hr cited; package model = more parsing. |
| Core free | **LegiScan API** | Unified JSON; federal + state; 30k calls/mo free tier; CC-BY. |
| Bulk free | **GovInfo BillStatus bulk** | ~4h updates; backend cache / change detection. |
| Historical | **ProPublica bulk** | Historical federal bulk; heavier ingest. |
| Paid scale | **BillTrack50** | Single commercial layer; subscription includes API per PDF. |

**Add-ons (PDF):** Open Civic Data / Councilmatic-style normalization; RSS/bulk monitoring (e.g. scheduled jobs, diffs); Elasticsearch/Solr; NLP summarization; Sentry/Datadog-style observability.

**Recommendations (PDF §3):** MVP = LegiScan + Congress.gov; scale = add GovInfo API + BillTrack50 + bulk pipelines; “official” = Congress.gov + GovInfo; “cheapest” = LegiScan + Google Civic Info; **best combination stack** = Congress.gov + LegiScan + GovInfo bulk + Elasticsearch + NLP; elections layer = Google Civic + Eventbrite/VolunteerMatch (cross-ref events section).

**Hard parts (PDF):** Multi-endpoint aggregation; rate limits; less summary/sponsor convenience on GovInfo vs Congress.gov.

---

### 2.2 State legislation / governor actions / state-level

**Goals:** State bills, text, status, sponsors, votes, committees, legislators; governor-related actions where exposed.

**Discovery sources (PDF):** OpenStates API, LegiScan API, Ballotpedia (scrape/API variability), per-state government APIs, LegiScan weekly datasets, BillTrack50, Quorum, state CMS/Open Data portals, NY Open Legislation / LegiSearch, CA OpenLegislation (civic/scrape).

**Shortlisted free (PDF):**

| Source | Use in CivicLink |
|--------|------------------|
| **OpenStates API** | Primary state aggregator; REST/GraphQL; standardized schema; all 50 + DC/PR; some local. |
| **LegiScan API** | Same as federal; `state` parameter; cross-state comparison. |
| **State official APIs** | High-demand states (e.g. NY, WA examples in PDF); ad-hoc integration. |
| **LegiScan weekly bulk** | Initial DB population / archival per state. |

**Paid (PDF):** BillTrack50, Quorum.

**Add-ons (PDF):** OCD/Pupa scrapers; IFTTT/Zapier-style alert fan-out; CDN/Redis caching; data-quality monitoring (e.g. last fetch per state); NLP for state bills.

**Recommendations (PDF §3):** MVP = **OpenStates + LegiScan**, prioritize large states (CA, NY, TX); scale = state official feeds + BillTrack50; maintain DB of state sessions; local boards/schools may need CSV/HTML ingest.

**Anticipated difficulty (PDF):** Calendar variation, PDF bills, uneven coverage—mitigate with API-first states, OCD community, periodic updates.

---

### 2.3 Local government (meetings, agendas, ordinances)

**Goals:** Council bills, agendas, minutes, votes where machine-readable; ordinances; school board docs when feasible.

**Discovery sources (PDF):** Granicus Legistar API, Municode/CivicPlus scrapers (e.g. Apify), Councilmatic/OCD deployments, city open data portals, public meeting aggregators, school board sites, Council Data Project (CDP), OpenGov/Open Agenda (paid).

**Shortlisted free (PDF):**

| Source | Use in CivicLink |
|--------|------------------|
| **Legistar / Granicus APIs** | Major cities (NYC, LA County, etc.); per-city keys. |
| **Municode scraper (Apify)** | Broad ordinance/minutes coverage; unofficial, breakage risk. |
| **City/county open data** | e.g. Austin council agendas; per-jurisdiction discovery. |
| **Council Data Project** | Uniform schema where deployed; some instances stale. |

**Paid (PDF):** OpenGov meeting module API (partnership/integration angle).

**Add-ons (PDF):** OCR/transcription (e.g. AssemblyAI); GeoIP/reverse lookup to map ZIP → jurisdictions; UptimeRobot-style monitoring; RSS/iCal; Nextdoor/Meetup as soft complement to events.

**Recommendations (PDF §3):** MVP = **major city Legistar APIs + state legislature agendas**; smaller locales via OpenStates events or defer; scale = OCD scrapers, OpenGov partnerships, targeted manual coverage.

**Risk (PDF):** Local is the hardest—nearly every jurisdiction differs; mitigate with populous regions first and reusable scrapers.

---

### 2.4 Civic / political events

**Goals:** Town halls, forums, drives, meetups near the user; deduplication and relevance.

**Discovery sources (PDF):** Eventbrite API, Meetup API, VolunteerMatch API, All For Good API, Idealist, Facebook Events (deprecated/restricted—poor fit), CiviCRM/ActBlue (indirect), local news calendars (scrape).

**Shortlisted free (PDF):** Eventbrite, Meetup, VolunteerMatch, All For Good.

**Paid note (PDF):** Facebook/Instagram Graph for public events (token/permission friction); Meetup Pro / Eventful as alternatives.

**Add-ons (PDF):** Mapbox/Google geocoding & proximity; AI categorization (town hall vs block party); cron ingestion + dedupe; ICS/Google Calendar export; push/email reminders.

**Recommendations (PDF §3):** MVP = **Eventbrite + Meetup + VolunteerMatch**; scale = All For Good + optional Facebook; **cheapest** stack may use OpenStreetMap geocoding; combine pipelines into one events DB with ZIP/geo filter and classification.

**Challenge (PDF):** Fragmentation and spam—filters/AI, API limit backoff.

---

### 2.5 Voting information

**Goals:** Polling places, early vote, contests, sample ballots where available; registration deadlines, ID rules, election dates.

**Discovery sources (PDF):** Google Civic Information API, Vote Smart API, DemocracyWorks/TurboVote (paid), Ballotpedia (scrape), state election boards, NASS, USA.gov, Open 5070 API (Democracy Works), Vote.org API (uncertainty noted in PDF).

**Shortlisted free (PDF):** Google Civic Info (`voterinfoQuery` etc.), Vote Smart (including ElectionTools/deadlines), Open 5070, state SOS/board sources (fragmented).

**Paid (PDF):** DemocracyWorks Elections API—comprehensive; subscription.

**Add-ons (PDF):** Geocoding; Twilio/email reminders; curated state ID requirement table; sample ballot links; voting FAQ chatbot.

**Recommendations (PDF §3):** MVP = **Google Civic Info + Vote Smart** + links to Vote.org/state sites; scale = DemocracyWorks/Open 5070 + UI for state rules; **hardest** = ID laws and local variation.

---

### 2.6 ZIP / geolocation / district resolution

**Goals:** Map user input (address/ZIP) to lat/long, census geographies, congressional & state legislative districts, OCD-style IDs for downstream APIs.

**Discovery sources (PDF):** US Census Geocoder API, FCC Census Block API, Google Geocoding (paid), Nominatim (OSM), GeoNames Postal Code API, ZipCodeAPI.com, Google Civic Information API, Overpass API, USPS (no real API), TIGER/Line shapefiles.

**Shortlisted free (PDF):** Census Geocoder, Google Civic (key), GeoNames (ZIP → place), Nominatim fallback.

**Paid (PDF):** Google Maps Geocoding—accuracy and quota.

**Add-ons (PDF):** CivicsML / OCD mapping libraries; local gazetteer DB; Redis/S2 geo cache; reverse geocode; Leaflet/Mapbox maps.

**Recommendations (PDF §3):** MVP = **GeoNames or Census for ZIP→location**, then **Census Geocoder** for districts (all free); scale = Google Maps/Civic; cache ZIP→lat/lng; handle PO boxes/rural edge cases.

---

### 2.7 Trust / misinformation / claim context (optional)

**Goals:** Credibility signals, fact-check cross-links, “what we know” without replacing journalism.

**Discovery sources (PDF):** Google Fact Check Tools API, Media Cloud API, GDELT, OpenCV (charts), ChainAPI/ClaimBuster, NewsAPI.org, PolitiFact (limited/scrape), Wikipedia/Wikidata, WaPo paid APIs.

**Shortlisted free (PDF):** Google Fact Check Tools (ClaimReview), Media Cloud, GDELT, Wikipedia/Wikidata.

**Paid (PDF):** Premium claim-checking class services (PDF uses hypothetical example).

**Add-ons (PDF):** NLP claim detection; source credibility labels; URL scanning to official docs; OpenSecrets/CourtListener-style deep dives; balanced ML summaries.

**Recommendations (PDF §3):** MVP = **Google Fact Check API + Wikipedia/Wikidata** + links to PolitiFact/AP where relevant; scale = MediaCloud, partnerships; **risk** = sparse coverage for local issues—mitigate with primary-source linking and heuristics.

---

## 3. Phased delivery (PDF)

### Phase 1 — MVP

| Area | Stack (per PDF) |
|------|-----------------|
| Federal | Congress.gov API + GovInfo bulk posture |
| State | OpenStates API + LegiScan |
| Local | Few major city APIs (e.g. Legistar) or defer |
| Events | Eventbrite + Meetup |
| Voting | Google Civic Info (+ Vote Smart as product requires) |
| Geocoding | Census + GeoNames (+ Google as needed) |
| Trust | Google Fact Check optional |

**PDF reasoning:** Free tiers first; core journeys without heavy commercial dependency.

### Phase 2 — Scaling

- Paid or broadened: **BillTrack50** (legislation), **DemocracyWorks** (voting depth).
- **VolunteerMatch / All For Good** expansion for civic engagement listings.
- Local via **CDP**, targeted scrapers, more Legistar cities.
- **AI summarization** and **user alerts** (email/push) once stability proven.

### Phase 3 — Advanced

- Predictive bill alerts (ML), deeper timelines.
- **MediaCloud / GDELT**-style context where UX supports it responsibly.
- Full trust-layer automation **without** replacing official sources.
- Broader localization for major metros.

---

## 4. Cross-cutting technical workstreams

| ID | Workstream | Frontend (`web/`) | Backend / ops |
|----|------------|-------------------|----------------|
| A | **ETL & normalization** | — | Shared types in `web/lib/` or `packages/`; single `Bill` / `Event` model. |
| B | **Caching** | SWR/React Query optional for client | DB + Redis (later); `Cache-Control` for safe GETs. |
| C | **Search** | Search UI, filters | Postgres full-text → OpenSearch (Segment 13). |
| D | **Jobs** | — | Cron / queue (Segment 13); MVP use on-demand + DB timestamps. |
| E | **Observability** | — | Sentry, logs, per-source freshness table. |
| F | **Compliance** | Attribution UI strings | Store license/terms notes; LegiScan CC-BY. |
| G | **Security** | CSP, no secrets in client | Rate limit API routes; validate inputs; SSRF guards on URLs. |

---

## 5. Risks and mitigations (PDF)

| Risk | Mitigation |
|------|------------|
| Local fragmentation | Pilot cities; generic scrapers; user voting for next city. |
| Stale APIs | Freshness badges; bulk fallbacks; alerts on ingest failures. |
| Quota / cost | Cache; multi-source; paid tier roadmap. |
| Schema drift | Version adapters; contract tests; `writing-plans` for migrations. |
| Misinformation | No user rumor core; primary links; fact-check sidebar optional. |

---

## 6. Product / UX implications

- **Location-first** shell: every feature reads `JurisdictionContext`.
- **Jurisdiction labels** on every card (federal vs state vs local).
- **Empty / loading / error** as first-class; never raw JSON.
- **Accessibility:** WCAG AA; civic apps skew toward **`ux-heuristics`** + **`design-everyday-things`**.

---

## 7. Milestone map (aligned to segments)

| Milestone | Segments |
|-----------|----------|
| M0 | **1** complete |
| M1 Design language | **2** (Master + shell) |
| M2 Personalization | **3** |
| M3 Platform | **4** |
| M4 Federal | **5** |
| M5 State | **6** |
| M6 Voting | **7** |
| M7 Events | **8** |
| M8 Local pilot | **9** |
| M9 Accounts | **10** |
| M10 Trust UX | **11** |
| M11 Production hardening | **12** |
| M12 Scale | **13** |

---

## 8. Resolved vs open decisions

| Decision | Status |
|----------|--------|
| Web framework | **Next.js App Router** in `web/` |
| Package name | App in `web/` (parent folder not npm-valid) |
| Styling | **Tailwind**; **shadcn/ui** in Segment 2 |
| API secrets | **Server-only** Route Handlers |
| Auth | **Open** — NextAuth vs Clerk (Segment 10) |
| DB host | **Open** — Neon / Supabase / RDS |
| Email / SMS | **Open** — Segment 10+ |

---

## 9. API keys checklist

See **`web/.env.example`**. Confirm limits in live docs, not only PDF: Congress.gov, GovInfo, LegiScan, OpenStates, Google Civic & Fact Check, Eventbrite, Meetup, VolunteerMatch, GeoNames; later BillTrack50, DemocracyWorks.

---

## 10. Source bibliography

Reproduce URLs from **`Federal Legislation _ Federal Government Actions (1).pdf`** (end of document); verify before shipping integrations.

---

## 11. How to use this document

1. **Skim [Plan at a glance](#plan-at-a-glance)** then **[§0.3 agent playbook](#03-civiclink-agent-playbook-full-inventory--tiers)** so each session defaults to **Tier S/A** skills.  
2. **`AGENTS.md`** — short entry; this file is the full map.  
3. **PDF** — data/API truth; confirm limits in live vendor docs.  
4. **§12** — build order (segments 1–13).  
5. **Superpowers** — plans, TDD, debug, **requesting-code-review** + **receiving-code-review**, merge hygiene.  
6. **Wondel** — use §0.3 themes; defer sales/GTM skills until explicit launch work.  
7. **UI/UX Pro Max + `design-system/`** — visual system of record.

---

## 12. Master implementation roadmap (segments 1–13)

**Convention:** Each segment lists **outcomes**, **`web/` work**, **backend & data**, and **agent tools** (Superpowers + Wondel + UI Pro Max).  
**Decimals (e.g. 1.1)** are checkable tickets suitable for `writing-plans`.

### Roadmap dependency order

**1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 10** (overlap 10 late) **→ 9 → 11** (as needed) **→ 12** (continuous) **→ 13**.  
Repeat **2.11–2.12** per major new route.

---

### 1. Foundation and platform

**Outcomes:** Clean repo; `web/` runs locally; lint/format/health; Python for design CLI; env template documents all vendors.

| # | Task |
|---|------|
| **1.1** | Git, root **`.gitignore`**, **`README.md`** (structure, `cd web`). |
| **1.2** | Next.js + TS + Tailwind + ESLint in **`web/`**; `npm run build` passes. |
| **1.3** | Prettier + `eslint-config-prettier`; `format` / `lint` scripts. |
| **1.4** | **`web/.env.example`** — all planned integration vars + what each API returns (see **PROJECT_PLAN.md** §2); keep updated as vendors change. |
| **1.5** | Document deploy target (e.g. Vercel + Postgres host) in README. |
| **1.6** | **`GET /api/health`** returns JSON OK (App Router route). |
| **1.7** | Python 3 for **UI/UX Pro Max** `search.py` (verify `python .cursor/skills/ui-ux-pro-max/scripts/search.py --help`). |

**Superpowers:** `using-superpowers` (onboard); `writing-plans` for Segment 1 checklist PR.  
**Wondel:** `pragmatic-programmer`, `release-it` (failure modes early).  
**UI/UX Pro Max:** —

---

### 2. Design system and application shell

**Outcomes:** `design-system/MASTER.md` committed; tokens in Tailwind; shell + nav + global empty/loading/error; a11y baseline; “About data” page.

| # | Task |
|---|------|
| **2.1** | Run UI/UX Pro Max `--design-system --persist` for CivicLink (civic, trustworthy, accessible, Next). |
| **2.2** | Map Master → CSS variables + `tailwind.config` / v4 theme. |
| **2.3** | Add **shadcn/ui** (or equivalent) aligned to Master. |
| **2.4** | Layout: header / main / footer; mobile-first breakpoints. |
| **2.5** | Routes (stubs OK): Home, Federal, State, Voting, Events, Local, Settings. |
| **2.6** | Page template: title, description, primary CTA region. |
| **2.7** | Shared **Empty**, **Loading**, **Error** components. |
| **2.8** | Focus rings, landmarks, contrast (WCAG AA). |
| **2.9** | Motion per Master; `prefers-reduced-motion`. |
| **2.10** | **`/about-data`** or section — list sources, neutrality, PDF pointer. |
| **2.11** | Optional `--page` overrides under `design-system/pages/`. |
| **2.12** | Any UI change: load **`.cursor/skills/ui-ux-pro-max/SKILL.md`**. |

**`web/`:** `app/(marketing)/...`, `app/(dashboard)/...` as appropriate; `components/ui/*`.  
**Backend:** static routes only.

**Superpowers:** `brainstorming` if IA unclear; `test-driven-development` for a11y-critical utilities (contrast helpers).  
**Wondel:** `refactoring-ui`, `ux-heuristics`, `design-everyday-things`, `web-typography`, `microinteractions`.  
**UI/UX Pro Max:** **Primary** for segment.

---

### 3. Location and jurisdiction resolution

**Outcomes:** `JurisdictionContext` from ZIP/address; persisted per user or cookie; drives API queries in later segments.

| # | Task |
|---|------|
| **3.1** | Input: ZIP + optional street; US validation. |
| **3.2** | Server: GeoNames or ZIP table → lat/lng. |
| **3.3** | Census Geocoder → congressional + state leg districts. |
| **3.4** | Optional Google Civic cross-check. |
| **3.5** | Type `JurisdictionContext` + serialization. |
| **3.6** | Persistence: DB column or encrypted cookie. |
| **3.7** | UI: location chip / modal; clear “change location.” |
| **3.8** | Edge cases documented (PO Box, multi-district ambiguity). |
| **3.9** | Cache geocode responses (DB table). |

**`web/`:** Location form component; server action or API route `POST /api/geo/resolve`.  
**Backend:** Normalize all external calls in `web/lib/geo/*`; **no client-side keys**.

**Superpowers:** `test-driven-development` for parsing/normalization; `systematic-debugging` for odd Census responses.  
**Wondel:** `domain-driven-design`, `software-design-philosophy`.  
**UI/UX Pro Max:** Follow Master for form layout.

---

### 4. Backend architecture, API layer, and persistence

**Outcomes:** Postgres schema; migrations; domain modules; Route Handler layout; caching primitives.

| # | Task |
|---|------|
| **4.1** | Postgres + Prisma or Drizzle; migration workflow. |
| **4.2** | `lib/http/*` fetch wrappers (timeout, retry, logging). |
| **4.3** | DTOs: `Bill`, `BillAction`, `Legislator`, `CivicEvent`, `ElectionInfo`. |
| **4.4** | Cache tables: `external_id`, `source`, `fetched_at`, `payload` or normalized columns. |
| **4.5** | Global error mapper → safe client JSON. |
| **4.6** | Rate-limit helper (per route / per IP). |
| **4.7** | Stub `lib/jobs/*` for future workers. |
| **4.8** | `app/api/federal/*`, `state/*`, `voting/*`, `events/*`, `geo/*`. |

**`web/`:** Thin route handlers delegating to services.  
**Backend:** All integration logic server-side.

**Superpowers:** `writing-plans` before large schema PRs; `test-driven-development` for mappers; `requesting-code-review` on migrations.  
**Wondel:** `clean-architecture`, `domain-driven-design`, `release-it`; `ddia-systems` for read-model planning.  
**UI/UX Pro Max:** —

---

### 5. Federal legislation feature

**Outcomes:** Search/list/detail; Congress.gov as primary; optional GovInfo text; LegiScan fallback; source links.

| # | Task |
|---|------|
| **5.1** | Congress.gov client + env wiring. |
| **5.2** | `GET /api/federal/bills` search. |
| **5.3** | `GET /api/federal/bills/[id]` detail. |
| **5.4** | DB cache + `updated_at` surfaced in UI. |
| **5.5** | Pages: list + filters + pagination. |
| **5.6** | Detail: sponsors, status, **link to Congress.gov**. |
| **5.7** | GovInfo optional for full text. |
| **5.8** | LegiScan fallback path. |
| **5.9** | Empty/error states using Segment **2** global components **2.7** (Empty / Loading / Error). |

**Superpowers:** `subagent-driven-development` for parallel UI+API tasks; **TDD** for adapters.  
**Wondel:** `inspired-product`, `continuous-discovery`, `clean-code`, `refactoring-patterns`.  
**UI/UX Pro Max:** `design-system/pages/federal.md` optional; Master typography for dense tables.

---

### 6. State legislation feature

**Outcomes:** OpenStates-first by `JurisdictionContext.state`; LegiScan supplement; shared bill UI with federal.

| # | Task |
|---|------|
| **6.1** | OpenStates client + routes. |
| **6.2** | Detail normalization to shared DTO. |
| **6.3** | LegiScan state parameter fallback. |
| **6.4** | Pilot CA/NY/TX then expand. |
| **6.5** | State list/detail pages. |
| **6.6** | Freshness indicator per state. |
| **6.7** | Attribution strings in UI/footer. |

**Superpowers:** same as 5.  
**Wondel:** `jobs-to-be-done` (what “job” is user hiring state bills for?), `mom-test` if interviewing users.  
**UI/UX Pro Max:** dense list readability (line height, truncation).

---

### 7. Voting information feature

**Outcomes:** Google Civic voter info where available; Vote Smart supplements; strong disclaimers; SOS links.

| # | Task |
|---|------|
| **7.1** | Google Civic client + `voterInfoQuery`. |
| **7.2** | UI: polling place / contests / fallback messaging. |
| **7.3** | Vote Smart deadlines/tools. |
| **7.4** | Disclaimer component (not official election mail). |
| **7.5** | Vote.org + NASS + state board links. |
| **7.6** | Open 5070 / DemocracyWorks later. |
| **7.7** | Optional static ID-rules reference table. |

**Superpowers:** `verification-before-completion` (test with real sample addresses in staging only; no PII logs).  
**Wondel:** `design-everyday-things` (error clarity), `storybrand-messaging` **only** to clarify user-as-hero journey ethically.  
**UI/UX Pro Max:** high-trust, calm alert patterns.

---

### 8. Civic and political events feature

**Outcomes:** Merged event feed; dedupe; civic keyword filters; VolunteerMatch integration path.

| # | Task |
|---|------|
| **8.1** | Eventbrite search near lat/lng. |
| **8.2** | Meetup OAuth + upcoming events. |
| **8.3** | VolunteerMatch (GraphQL) opportunities. |
| **8.4** | `CivicEvent` table + dedupe key. |
| **8.5** | Event cards + map optional. |
| **8.6** | Rule-based civic classifier v1. |
| **8.7** | Nightly cron stub / manual refresh MVP. |
| **8.8** | Optional ICS export. |

**Superpowers:** `executing-plans` (many integrations); **TDD** for dedupe + classifier.  
**Wondel:** `cro-methodology` (funnel to signup — ethical only), `hooked-ux` **review for ethics** (habit vs manipulation).  
**UI/UX Pro Max:** card grid spacing; date/time hierarchy.

---

### 9. Local government pilot

**Outcomes:** One city or portal integrated end-to-end; honest coverage messaging.

| # | Task |
|---|------|
| **9.1** | Select Legistar or open-data pilot (PDF examples). |
| **9.2** | Adapter + `/api/local/*`. |
| **9.3** | Match items to user county/city. |
| **9.4** | UI “pilot” banner + gaps. |
| **9.5** | Scraper plan deferred. |
| **9.6** | CDP/OCD research note in `docs/`. |

**Superpowers:** `using-git-worktrees` (experimental integrations).  
**Wondel:** `lean-startup` (smallest pilot), `design-sprint` if workshop needed.  
**UI/UX Pro Max:** avoid overstating coverage.

---

### 10. User accounts, saved items, and engagement

**Outcomes:** Auth; saved bills; optional digest; rate limits; privacy policy hooks.

| # | Task |
|---|------|
| **10.1** | Auth provider integration. |
| **10.2** | Profile + default location. |
| **10.3** | Saved bills / tags. |
| **10.4** | Email digest job (optional). |
| **10.5** | Abuse-resistant API limits. |
| **10.6** | Privacy policy + data retention doc. |

**Superpowers:** `receiving-code-review` on auth PRs.  
**Wondel:** `inspired-product` (discovery vs delivery), `drive-motivation` for ethical engagement copy.  
**UI/UX Pro Max:** account settings layout.

---

### 11. Trust, transparency, and optional fact context

**Outcomes:** Every card has source + fetched time; optional Fact Check sidebar; no anonymous claims feed.

| # | Task |
|---|------|
| **11.1** | `SourceAttribution` component. |
| **11.2** | Google Fact Check API integration (server). |
| **11.3** | Wikidata enrichment (labeled tertiary). |
| **11.4** | Content policy: UGC scope (if any). |
| **11.5** | MediaCloud/GDELT deferred to **13** research spike. |

**Superpowers:** `brainstorming` for trust UX controversies.  
**Wondel:** `made-to-stick` / `storybrand-messaging` for **transparent** explanation of sourcing, not hype.  
**UI/UX Pro Max:** subtle callouts; never alarmist.

---

### 12. Quality assurance, performance, and operations

**Outcomes:** CI green; E2E smoke; perf budgets; Sentry; security baseline; freshness dashboard internal.

| # | Task |
|---|------|
| **12.1** | Unit + contract tests for adapters & geo. |
| **12.2** | Playwright (or similar) smoke: location → federal detail. |
| **12.3** | Indexes, pagination audit, image/font budget. |
| **12.4** | Sentry + log queryability. |
| **12.5** | `data_source_health` table + alert. |
| **12.6** | OWASP pass; SSRF review; secret rotation runbook. |
| **12.7** | Load test before bulk jobs enabled. |

**Superpowers:** `finishing-a-development-branch` each release; `verification-before-completion` on incidents.  
**Wondel:** `high-perf-browser`, `release-it`, `system-design`.  
**UI/UX Pro Max:** performance-friendly motion (Master).

---

### 13. Phase 2 and beyond (scale)

**Outcomes:** Bulk ingest, search tier, NLP, commercial APIs, Redis queue, broad local.

| # | Task |
|---|------|
| **13.1** | GovInfo BillStatus bulk + diff alerts. |
| **13.2** | Elasticsearch/OpenSearch. |
| **13.3** | NLP summaries with risk review. |
| **13.4** | BillTrack50 / DemocracyWorks evaluation + integration. |
| **13.5** | Redis + worker queue (BullMQ etc.). |
| **13.6** | Local expansion playbook. |

**Superpowers:** `dispatching-parallel-agents` for spiking 13.x in isolation.  
**Wondel:** `ddia-systems`, `system-design`, `clean-architecture`.  
**UI/UX Pro Max:** dashboard density / “pro” tier IA if needed.

---

*Legislative research PDF on disk: `Federal Legislation _ Federal Government Actions (1).pdf`.*
