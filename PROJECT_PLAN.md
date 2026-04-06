# CivicLink — Project Plan

## Primary reference (authoritative source)

**This plan is derived from the research document in this repository. For full context—discovery tables, nuanced tradeoffs, numbered citations, and the complete source bibliography—always treat the following file as the main reference:**

| Reference | Path |
|-----------|------|
| **Main reference (data & APIs)** | `Federal Legislation _ Federal Government Actions (1).pdf` |
| **Main reference (UI/UX quality)** | [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — in-repo: `.cursor/skills/ui-ux-pro-max/` (Cursor skill) and `ui-ux-pro-max-skill/` (clone); generated: `design-system/MASTER.md` |

If **data or API** details in this markdown conflict with the PDF, **the PDF wins**. If **visual design** conflicts with committed **`design-system/MASTER.md`** or the **UI/UX Pro Max** workflow, follow the **Design and UI reference** section unless the team overrides for accessibility or brand. Use the PDF for API limits (as of the research date), endpoint specifics, and vendor positioning.

---

## Design and UI reference (UI/UX Pro Max)

CivicLink is planned as a **polished, beautiful web app**. The repo includes **[UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)**—design intelligence (styles, palettes, typography, UX guidelines, stack-specific patterns, anti-patterns)—in two places:

| Artifact | Path | Role |
|----------|------|------|
| **Cursor skill (installed)** | `.cursor/skills/ui-ux-pro-max/` | **`SKILL.md`** is loaded by Cursor; for **any UI/UX work** (layout, components, review, fix), the agent should **follow this skill** so output stays professional and consistent. |
| **GitHub clone (upstream)** | `ui-ux-pro-max-skill/` | Full upstream repo: `src/`, `cli/`, docs; use for **browsing templates**, comparing versions, or running **`uipro`** (`npm i -g uipro-cli`; `uipro update`) to refresh the Cursor install. |

**Mandatory UI workflow (do not skip for “beautiful UI”):**

1. **Python 3.x** must be available on the dev machine (the skill’s design-system CLI is Python). Windows: typically `python`; macOS/Linux: often `python3`.
2. **Generate a CivicLink-specific design system** (reasoned palette, typography, layout pattern, effects, checklist—**not** generic AI purple gradients). From the **CivicLink repo root**, run—for example:

   ```bash
   python .cursor/skills/ui-ux-pro-max/scripts/search.py "civic dashboard government transparency neutral trustworthy accessible" --design-system --persist -p "CivicLink" -f markdown
   ```

   Adjust the query to stress **Next.js**, **Tailwind**, **dashboard**, or **shadcn** if the skill docs support stack flags; align recommendations with the actual stack in §12.

3. **Commit `design-system/`** — After `--persist`, the skill creates **`design-system/MASTER.md`** (global source of truth) and optionally **`design-system/pages/<page>.md`** for per-route overrides. Treat these files as **first-class project artifacts**: review them, commit them, and **point Cursor at them** when implementing screens (“read `design-system/MASTER.md` before building the Federal bills page”).

4. **Build UI against the Master** — Implement Tailwind tokens, fonts, and components to match **MASTER.md**; add page-only deltas in `design-system/pages/` when a view needs exceptions.

5. **Ongoing** — Re-run the design-system command when product positioning changes; use **`uipro update`** periodically so `.cursor/skills/ui-ux-pro-max/` stays current with upstream.

**Conflict rule:** For **data APIs and civic scope**, the **PDF** wins. For **visual design, typography, motion, and UX patterns**, **UI/UX Pro Max + committed `design-system/*.md`** win unless the team explicitly overrides for accessibility or brand.

---

## 1. Purpose and product vision

**CivicLink** is envisioned as a neutral, high-impact civic dashboard that combines:

- **Official** legislative and election data (Congress, GPO, state sources, Google Civic).
- **Civic-tech** aggregators (OpenStates, LegiScan, CDP/Councilmatic patterns).
- **Modern tooling** (search indexing, NLP summarization, monitoring, optional fact-check context).

The PDF’s **Executive Summary** and **Final Verdict** define the optimal hybrid strategy: phased rollout, free tiers first, then paid and AI depth.

---

## 2. Scope by domain (from PDF)

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

## 3. Phased delivery (PDF “Phased Stack Recommendations”)

### Phase 1 — MVP

| Area | Stack (per PDF) |
|------|-----------------|
| Federal | Congress.gov API + GovInfo bulk |
| State | OpenStates API + LegiScan |
| Local | Few major city APIs (e.g. NYC Legistar) |
| Events | Eventbrite + Meetup |
| Voting | Google Civic Info |
| Geocoding | Census + Google (as needed) |
| Trust | Google FactCheck |

**Reasoning in PDF:** Free tiers, core use cases, avoid high cost early.

### Phase 2 — Scaling

- Paid: **BillTrack50** (legislation), **DemocracyWorks** (voting).
- **VolunteerMatch / All For Good**.
- Expand local via **CDP** and custom scrapers.
- **AI summarizers** and **alerts**.

### Phase 3 — Advanced

- Predictive bill alerts (ML).
- Deeper context: **MediaCloud / GDELT** sentiment and timelines.
- Full trust layer: automated fact-check suggestions.
- Broader localization (major metros).

---

## 4. Cross-cutting technical workstreams

Derived from PDF add-ons and executive summary—plan explicit tasks for each.

1. **ETL / normalization** — Open Civic Data-style models; dedupe across Congress.gov, GovInfo, LegiScan, OpenStates.
2. **Bulk & scheduled jobs** — GovInfo BillStatus ~4h; LegiScan weekly; RSS diffs; GitHub Actions or cron on servers (PDF examples).
3. **Search** — Elasticsearch/Solr on bill text + metadata; relevance for “topic” search.
4. **NLP** — Plain-English summaries of bills/actions; optional diff summaries for amendments.
5. **Caching** — Redis/CDN for bill text and static legislator data; reduce quota burn.
6. **Observability** — API uptime, data freshness per source/state/city; failover to alternate source (PDF: LegiScan fallback, scrapers, manual).
7. **Geospatial** — ZIP/address pipeline; district labels for UI; map components.
8. **Events pipeline** — Daily pull, dedupe, geocode, civic classifier.
9. **Compliance & attribution** — LegiScan CC-BY; API terms for Google, Congress.gov, GovInfo, etc. (verify current terms in vendor docs, not only PDF).
10. **Security & privacy** — Minimize stored PII; secure API keys; transparent sourcing in UI.

---

## 5. Risks and mitigations (PDF “Biggest Risks”)

| Risk | Mitigation |
|------|------------|
| Local fragmentation | Prioritize populous areas; generic scrapers; user feedback for priority cities; manual/minutes fallback. |
| Stale or inconsistent updates | Frequent polling; bulk feeds for history; freshness monitoring. |
| API limits / cost | Aggressive caching; multi-source redundancy; nonprofit discounts; planned paid tier. |
| Schema heterogeneity | Shared internal models; disciplined ETL; systematic dedupe. |
| Misinformation | Primary-source links; fact-check where available; clear “unverified” heuristics. |

---

## 6. Product / UX implications (inferred from PDF)

- **Personalization by location:** Address/ZIP → districts → filter bills, events, voting, local agendas.
- **Layers:** Federal / state / local tabs or unified feed with jurisdiction tags.
- **Transparency:** Every card links to official or documented third-party source.
- **Accessibility & trust copy:** Disclose data lag, coverage gaps (especially local and fact-check sparse areas).

---

## 7. Milestone suggestions (planning aid)

| Milestone | Outcomes |
|-----------|----------|
| M0 — Foundations | Repo, secrets management, CI, staging DB, choice of stack (web/mobile) **outside PDF** but required for implementation. |
| M1 — Geo core | Census + GeoNames path; store normalized jurisdiction IDs for a test user. |
| M2 — Federal slice | Congress.gov + optional GovInfo text for bookmarked bills; basic UI. |
| M3 — State slice | OpenStates + LegiScan alignment for 1–3 pilot states. |
| M4 — Voting slice | Google Civic polling lookup + Vote Smart deadline surfacing. |
| M5 — Events slice | Eventbrite + Meetup ingestion + civic filter + map list. |
| M6 — Local pilot | One Legistar city + one open-data portal (PDF cites Austin-style portals). |
| M7 — Hardening | Monitoring, caching, rate-limit handling, runbooks. |
| M8 — Phase 2 prep | Evaluate BillTrack50/DemocracyWorks ROI; bulk job scale-up. |

*(Adjust milestones to your actual engineering capacity; PDF does not prescribe sprint length.)*

---

## 8. Open decisions (not fully specified in PDF)

These require product/engineering choices beyond the PDF:

- Exact **application stack** (e.g. Next.js, mobile native, etc.).
- **Auth** (accounts, saved bills, alerts).
- **Alert channels** (email, push, SMS) and vendor selection.
- **Legal review** for scraping targets and ToS.
- **Data retention** policy for user addresses.

---

## 9. API keys, accounts, and prerequisites (checklist)

Use the **PDF** and current vendor documentation for up-to-date steps.

- [ ] Congress.gov / Data.gov API key  
- [ ] GovInfo API key  
- [ ] LegiScan API key (30k/mo awareness)  
- [ ] OpenStates API key  
- [ ] Google Cloud project (Civic Info, Fact Check Tools, optional Geocoding)  
- [ ] Eventbrite API key  
- [ ] Meetup OAuth app  
- [ ] VolunteerMatch (and optionally All For Good) access  
- [ ] GeoNames account (if using postal API)  
- [ ] Per-city Legistar/Granicus keys as you expand local  
- [ ] Future: BillTrack50, DemocracyWorks (contracting)

**Python:** PDF notes Python 3.x for some legislative tooling in related ecosystems; align with whatever search/summarization scripts you adopt.

---

## 10. Source bibliography (from PDF)

The PDF’s closing section lists official documentation and references (Congress.gov API, GovInfo GitHub, LegiScan, ProPublica bulk, BillTrack50, OpenStates, DemocracyWorks Elections API, Council Data Project, NYC Council API, Apify Municode scraper, Councilmatic, Austin open data, VolunteerMatch, Census Geocoder docs, Google Fact Check API, etc.). **Reproduce and verify URLs from the PDF file** when citing externally; link rot should be checked at implementation time.

---

## 11. How to use this document

1. **Product owners** — Use §2–§3 for scope and phasing; §5 for risk register; **§12** for build order; **Design and UI reference** for how the product should look and feel.  
2. **Engineers** — Use §4, §7, §9, and **§12** for backlogs; confirm all limits and endpoints in the **PDF** + live docs; implement UI against **`design-system/MASTER.md`** and **UI/UX Pro Max** (`.cursor/skills/ui-ux-pro-max/`).  
3. **Design / frontend** — Follow **Design and UI reference (UI/UX Pro Max)**; regenerate or extend **`design-system/`** when adding major surfaces.  
4. **Compliance** — Use §9 + PDF for licensing and attribution.  
5. **Everyone** — For **data and APIs**, the **PDF** is the main reference. For **visual design**, use **UI/UX Pro Max** + committed **`design-system/*.md`**.

---

## 12. Thorough implementation roadmap (numbered build plan)

This section is the **step-by-step engineering plan** for a **single clean web application** (recommended stack: Next.js + TypeScript + Tailwind + PostgreSQL; server-side API routes for all third-party keys). **Main numbers (1, 2, 3, …)** are the major parts being built; **decimal numbers (1.1, 1.2, …)** are concrete work packages inside each part.

**Reference hierarchy:** For *what* to integrate (APIs, risks, phased data strategy), use **`Federal Legislation _ Federal Government Actions (1).pdf`** and **§2–§5** above. For *visual design and UX quality*, use **`Design and UI reference (UI/UX Pro Max)`** and committed **`design-system/MASTER.md`**. This **§12** defines *how* to sequence the build.

---

### 1. Foundation and platform

**1.1** Initialize repository: version control, `.gitignore`, README with local run instructions.  
**1.2** Scaffold web app (e.g. Next.js App Router, TypeScript strict mode).  
**1.3** Configure linting and formatting (ESLint, Prettier); enforce consistent style in CI or pre-commit.  
**1.4** Environment variables: `.env.example`, document every key; never expose secrets to the browser.  
**1.5** Choose hosting targets (e.g. app host + managed PostgreSQL); document deploy pipeline.  
**1.6** Add health check route (`/api/health` or equivalent) for uptime monitoring.  
**1.7** Install **Python 3.x** and verify `python` / `python3` runs, for **UI/UX Pro Max** design-system generation (see **Design and UI reference** and **2.1** below).

---

### 2. Design system and application shell (clean, beautiful UI)

**2.1** Run **UI/UX Pro Max** `--design-system --persist` for **CivicLink** (query: civic dashboard, government, trustworthy, accessible, Next.js/Tailwind as appropriate); produce **`design-system/MASTER.md`**. Use script path: `.cursor/skills/ui-ux-pro-max/scripts/search.py` (see **Design and UI reference**).  
**2.2** Translate **MASTER.md** into code: **design tokens** (color, typography, spacing, radii, shadows) via CSS variables and **Tailwind theme** extension—no ad-hoc one-off colors that contradict the Master.  
**2.3** Adopt a headless component layer (e.g. **shadcn/ui** + Radix) and style it to match the Master; follow **UI/UX Pro Max** anti-patterns checklist (e.g. avoid clichéd “AI” gradients if the design system says so).  
**2.4** Build global layout: header, main, footer; responsive breakpoints (mobile-first); apply recommended **pattern** (e.g. dashboard vs marketing) from the design-system output.  
**2.5** Implement navigation to main feature areas: Home, Federal, State, Voting, Events, Local (pilot), Settings/Account (stub).  
**2.6** Standardize page patterns: page title, description, primary action, content region.  
**2.7** Build reusable states: **loading** (skeletons), **empty** (helpful copy + next step), **error** (retry + support), **offline/unavailable** (upstream API failure).  
**2.8** Accessibility baseline: focus visibility, keyboard navigation, semantic headings, sufficient contrast (target WCAG AA)—**Inclusive / Accessible & Ethical**-style guidance from the PDF aligns with civic trust; reinforce with the skill’s UX guidelines.  
**2.9** Motion: respect `prefers-reduced-motion`; use transition timing from design system (typically 150–300ms).  
**2.10** Add “Data sources” or “About data” surface: link to official sources; align with PDF emphasis on neutrality and citations.  
**2.11** For each major route later (Federal list, State list, Voting, Events), optionally run **UI/UX Pro Max** with `--page "<name>"` to create **`design-system/pages/<name>.md`** overrides; implement pages **Master-first**, then page file.  
**2.12** When implementing any new screen, **invoke Cursor UI/UX work** so the **installed `.cursor/skills/ui-ux-pro-max/` skill** applies; keep **`ui-ux-pro-max-skill/`** clone as reference and run **`uipro update`** when refreshing the skill.

---

### 3. Location and jurisdiction resolution (spine of the product)

**3.1** Specify user input: ZIP-first and optional full address; validate US formats.  
**3.2** Server-only **geocoding pipeline**: e.g. GeoNames or ZIP gazetteer → lat/long + city/state (per PDF §2.6 / MVP stack).  
**3.3** Integrate **US Census Geocoder** (or equivalent) for congressional & state legislative district context from coordinates.  
**3.4** Optional cross-check: **Google Civic Information API** for OCD division IDs and elected offices (same PDF section).  
**3.5** Normalize output into an internal `JurisdictionContext` model (state, districts, display labels, raw codes for APIs).  
**3.6** Persist “current location” for logged-in users in DB; for anonymous users use secure cookie or session.  
**3.7** UI: Location panel on home or sticky shell—show resolved jurisdictions; allow change/revert.  
**3.8** Edge cases: ambiguous ZIP, rural addresses, PO boxes—document behavior and fallback copy.  
**3.9** Cache geocode results (DB or Redis later) to reduce repeated external calls.

---

### 4. Backend architecture, API layer, and data persistence

**4.1** Provision **PostgreSQL**; add migrations (e.g. Prisma, Drizzle, or SQL migrations).  
**4.2** Implement **server-side only** clients for third-party APIs (no keys in client bundles).  
**4.3** Define internal DTOs/types for `Bill`, `Legislator`, `Event`, `ElectionInfo`, etc.—UI consumes only normalized shapes.  
**4.4** Add **caching tables** or columns: `fetched_at`, `payload` or normalized fields, `source` enum, `external_id`.  
**4.5** Central **error handling** and logging for upstream failures; user-facing safe messages.  
**4.6** Rate-limit awareness: backoff, combine requests, respect quotas (Congress.gov, LegiScan, etc.—see PDF).  
**4.7** Optional: background job runner later (Phase 2)—document hook points; MVP may use on-demand fetch + cache.  
**4.8** API route structure: `/api/...` grouped by domain (`federal`, `state`, `voting`, `events`, `geo`).

---

### 5. Federal legislation feature

**5.1** Obtain and configure **Congress.gov API** key; read current official docs (PDF §2.1).  
**5.2** Implement search/list endpoint: filters (chamber, congress, text query) as supported by API.  
**5.3** Implement detail endpoint: metadata, summary, sponsors, latest action, committees where available.  
**5.4** Store/cache responses in DB; expose “last updated” in UI.  
**5.5** UI: Federal list page with filters + pagination; link each item to detail.  
**5.6** UI: Detail page with clear **“View on Congress.gov”** (or GovInfo) outbound link.  
**5.7** (Phase 1.5) Optional: **GovInfo API** integration for full bill text when product requires it (PDF).  
**5.8** (Fallback) Wire **LegiScan** federal path when needed for redundancy or simpler payloads (PDF).  
**5.9** Empty states: no results, API limit, or API down—with guidance.

---

### 6. State legislation feature

**6.1** Obtain **OpenStates API** key; implement list/search by state derived from `JurisdictionContext`.  
**6.2** Implement bill detail from OpenStates; map fields to shared `Bill` UI components where possible.  
**6.3** Add **LegiScan** state parameter as supplement or fallback (PDF MVP stack).  
**6.4** Pilot rollout: configure **priority states** first (e.g. CA, NY, TX per PDF); then expand.  
**6.5** UI: State page mirrors Federal patterns; show **state name** and session context.  
**6.6** Track data freshness per state; surface stale data warnings if last fetch is old.  
**6.7** Document OpenStates vs LegiScan attribution/licensing in UI where required.

---

### 7. Voting information feature

**7.1** Enable **Google Civic Information API**; implement voter info query by address (from location spine).  
**7.2** UI: polling place / contests when returned; graceful degradation when Google returns no data.  
**7.3** Integrate **Vote Smart** (or equivalent) for registration deadlines and supplemental election tools (PDF).  
**7.4** Prominent **disclaimers**: verify with state/local officials; CivicLink is informational, not official election administration.  
**7.5** Link out to **Vote.org**, state SOS pages, and NASS-style resources as cited in PDF.  
**7.6** Optional later: **Open 5070** / **DemocracyWorks** when scaling (PDF Phase 2).  
**7.7** Optional: curated **state ID rules** table (static or periodically updated) for FAQ-style UX.

---

### 8. Civic and political events feature

**8.1** Integrate **Eventbrite API** with location + keyword filters (“town hall”, “civic”, etc.—tune to reduce noise, PDF).  
**8.2** Integrate **Meetup API** (OAuth as required); fetch upcoming events near user coordinates.  
**8.3** Integrate **VolunteerMatch** (and later **All For Good**) for volunteer-style engagement listings (PDF).  
**8.4** Normalization: single `CivicEvent` model; dedupe by title, time, and approximate location in DB.  
**8.5** UI: event cards, date/time, location, external link, source badge.  
**8.6** Classification layer (rules first, ML later): filter obvious non-civic spam.  
**8.7** Scheduled refresh job or nightly pull once volume grows (PDF ingestion pipeline).  
**8.8** Optional: ICS export / Google Calendar link (PDF add-on).

---

### 9. Local government pilot (defer until 5–8 are stable)

**9.1** Select **one** high-value jurisdiction: e.g. **Legistar/Granicus** city with documented API **or** strong open-data portal (PDF cites NYC, Austin-style datasets).  
**9.2** Implement single integration end-to-end: agendas/legislation subset only; avoid full national local scope.  
**9.3** Map items to user via county/city from geolocation pipeline where possible.  
**9.4** UI: “Local pilot” section with coverage disclaimer (only certain cities).  
**9.5** Plan scraper/Municode/Apify path only after official API path is learned (PDF risk: breakage).  
**9.6** Evaluate **Council Data Project** patterns for reuse when expanding (PDF).

---

### 10. User accounts, saved items, and engagement

**10.1** Add authentication (e.g. NextAuth with email/OAuth, or hosted provider).  
**10.2** User profile: default location, notification preferences (stub OK at first).  
**10.3** Save/follow bills (federal + state) stored in DB; “My civic feed” view.  
**10.4** Optional alerts: email digest of new actions on followed bills (batch job).  
**10.5** Rate-limit user actions to prevent abuse of your API routes.  
**10.6** Privacy: minimal PII; document retention; secure session cookies / JWT.

---

### 11. Trust, transparency, and optional fact context

**11.1** Every data card: **primary source link**, **provider name**, **retrieved/freshness** timestamp.  
**11.2** Implement **Google Fact Check Tools API** queries for optional “related fact-checks” on news/claim surfaces (PDF §2.7).  
**11.3** Wikipedia/Wikidata enrichment for legislator/topic stubs—clearly label as tertiary context.  
**11.4** Avoid presenting unverified user content as fact; no anonymous rumor feed in v1.  
**11.5** Later: Media Cloud / GDELT only if product has clear UX for “context” (PDF Phase 3).

---

### 12. Quality assurance, performance, and operations

**12.1** Unit tests for normalization and geocoding edge cases; contract tests for API adapters (mocked).  
**12.2** E2E smoke tests for critical paths: set location → federal list → detail.  
**12.3** Performance: DB indexes on external IDs and user saves; pagination everywhere.  
**12.4** Observability: error tracking (e.g. Sentry), structured logs, dashboards for API failure rates.  
**12.5** Data freshness monitoring per source (PDF: stale feed detection).  
**12.6** Security review: OWASP basics, SSRF protection on any user-supplied URLs, secret rotation.  
**12.7** Load/usage review before enabling heavy polling or bulk jobs.

---

### 13. Phase 2 and beyond (from PDF—after v1 is stable)

**13.1** **GovInfo BillStatus bulk** ingestion + diff detection for historical and change alerts.  
**13.2** **Elasticsearch/OpenSearch** for full-text bill search at scale.  
**13.3** **NLP summarization** for long bill text; human-review policy for high-risk summaries.  
**13.4** Paid tiers: **BillTrack50**, **DemocracyWorks Elections API** where ROI is clear.  
**13.5** **Redis** + worker queue for caching and scheduled jobs.  
**13.6** Expand local coverage with OCD scrapers, CDP, and partnerships (OpenGov) per PDF.

---

### Roadmap dependency order (quick reference)

Build in roughly this order: **1** (includes **1.7** Python for UI CLI) → **2** (starts with **2.1** UI/UX Pro Max design-system + **MASTER.md**) → **3 → 4 → 5 → 6 → 7 → 8 → 10** (auth/saves can overlap late in 5–8), then **9**, then **12** continuously, then **11** as needed, then **13**. **2.11–2.12** repeat across features as new pages ship.

---

*Plan generated from the CivicLink research PDF. Filename on disk: `Federal Legislation _ Federal Government Actions (1).pdf`.*
