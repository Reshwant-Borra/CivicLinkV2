# Owner manual checklist — what you must do (agents cannot do for you)

This file lists **account, infrastructure, secrets, and local operator steps** that require **your** accounts, billing, legal acceptance, or physical choice of vendors. Code in the repo cannot substitute for these.

Update this doc when you add integrations or new env vars.

---

## Segment 3 (location / jurisdiction) — implementation status

Plan items **3.1** through **3.9** are implemented in **`web/`** (validation, geo pipeline, types, cookie persistence, Settings UI + header chip, edge-case docs, Postgres `geocode_cache`).

There is **no** dedicated admin or “cache viewer” UI for geocode rows. The product surfaces resolution via **Settings** (form + preview + clear) and the **header location chip**. Inspecting cache data is an **operator** task (SQL, `db:studio`, or a future internal tool).

---

## Environment and secrets (`web/.env.local`)

1. **Copy the template:** duplicate **`web/.env.example`** → **`web/.env.local`** and fill values. Never commit `.env.local`.

2. **`JURISDICTION_COOKIE_SECRET`** (Segment 3.6)  
   Generate a long random value (e.g. `openssl rand -base64 32`) and set it on every server environment. Without it, the app still resolves location but **does not** set the signed cookie.

3. **`DATABASE_URL`** (Segments 3.9 cache + later Segment 4 persistence)  
   - **You** provision Postgres (Neon, Supabase, RDS, local Docker, etc.).  
   - **You** paste the connection string into `.env.local` (and production env).  
   - Without `DATABASE_URL`, geocoding still works; **server geocode cache is skipped** (always a live resolve).

4. **`GEO_CACHE_TTL_SECONDS`** (optional, Segment 3.9)  
   Defaults in code to 86400 if unset. Override only if you want a different TTL.

5. **Geo and Civic API keys** (Segments 3.2–3.4) — **you** create developer accounts / keys where applicable:

   | Variable | You must… |
   |----------|-----------|
   | `GEONAMES_USERNAME` | Register at GeoNames; free tier needs username. |
   | `NOMINATIM_USER_AGENT` | Set a truthful contact string per OSM policy (no “bot” abuse). |
   | `CENSUS_GEOCODER_BASE_URL` | Usually leave default public Census URL unless you have a reason to change it. |
   | `GOOGLE_CIVIC_API_KEY` | Google Cloud project, enable Civic Information API, restrict key appropriately. |

   Read each vendor’s **current** terms, quotas, and attribution rules; the PDF + `.env.example` comments are guidance only.

---

## Database table for Segment 3.9 (`geocode_cache`)

The schema is defined in code (**`web/lib/db/schema.ts`**) and a migration lives under **`web/drizzle/`**.

**You** must apply it to **your** Postgres instance (agents do not run against your cloud DB):

From **`web/`**, with `DATABASE_URL` set:

- **`npm run db:push`** — quick align for development (Drizzle push).  
- Or **`npm run db:migrate`** after **`npm run db:generate`** when you evolve the schema in a migration-first workflow.

Optional: **`npm run db:studio`** to browse tables locally (still requires your `DATABASE_URL`).

If you never set `DATABASE_URL`, you **do not** need this step for caching — but you also get **no** server-side geocode cache.

---

## Deploy and production

1. **You** choose host (e.g. Vercel + managed Postgres) and configure the **same** env vars in the host’s dashboard.  
2. **You** own domain, DNS, HTTPS, and any compliance review for civic/election-adjacent copy.  
3. Plan item **1.5** (document deploy target in README) may still be on you if not already done.

---

## Legal, billing, and product decisions

- Accepting vendor ToS, paid tiers, and **what** to show users (disclaimers, voting freshness) are **your** decisions.  
- **Pilot city** or Legistar keys (Segment 2.3 / local) are **your** vendor relationships — not automated here.

---

## Visual / UI summary (Segment 3)

| What exists | Where |
|-------------|--------|
| Set location (ZIP + optional street), see resolution preview | **`/settings`** — `LocationForm` |
| Clear saved jurisdiction | Settings — clear control + `DELETE /api/geo/jurisdiction` |
| Compact saved location label | **Site header** — chip linking to Settings |
| Explain sources and edge cases | **`/about-data`** + **`docs/geo-edge-cases.md`** |

There is **no** separate screen to browse `geocode_cache` rows or analytics dashboards for geo — that would be a later product or internal tooling choice.

---

## Quick reference: commands (from `web/`)

```bash
npm install
npm run test
npm run lint
npm run build
# After DATABASE_URL is set:
npm run db:push
```

If anything in this list goes out of date (new env vars, new tables), update **this file** and **`web/.env.example`** together.
