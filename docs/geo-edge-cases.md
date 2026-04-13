# CivicLink — geolocation & jurisdiction edge cases

Companion to **Segment 3** (`POST /api/geo/resolve`, Census layers, optional GeoNames / Nominatim / Google Civic). For operators and support — not legal advice.

## PO Boxes and non-structure addresses

- **PO Box / CMRA-only** addresses often **do not geocode** to a voter-style structure the way a street address does.
- **Census** and **Google Civic** coverage is **address- and data-vintage-dependent**. Treat “no match” as a normal outcome, not a silent success.
- **Product UX:** prefer asking for **ZIP + optional street**; when the user only supplies a ZIP, centroid sources (GeoNames / Nominatim) provide a **statistical center**, not a mailbox.

## Multi-district ambiguity

- **Congressional and state legislative** layers come from **Census benchmarks/vintages** (and may differ from what a state SOS site lists for the same text address).
- **Split precincts**, **redistricting**, and **pending map updates** can produce **multiple or shifting** district labels over time.
- **Cross-sources:** when **Google Civic** is enabled (`GOOGLE_CIVIC_API_KEY`), CivicLink compares **state-level OCD alignment** when possible. **Disagreements** should surface as **warnings** in the API response — users should still confirm with **official** state/local materials for voting.

## ZIP-only vs street-augmented input

- **ZIP-only** flows depend on **GeoNames** (`GEONAMES_USERNAME`) and/or **Nominatim** (`NOMINATIM_USER_AGENT`) for **place context** before Census **oneline** or **coordinates** lookups.
- **Street + ZIP** generally **improves** Census match quality. We **do not** echo full street lines in the **header chip** label (chip uses place + state + ZIP where available).

## Server geocode cache (Segment 3.9)

- When **`DATABASE_URL`** is set, `POST /api/geo/resolve` uses a **`geocode_cache`** PostgreSQL table: **read-through** on each request, **write-back** after a live resolution.
- Keys are a **SHA-256** hash of normalized `{ zip5, zipPlus4, street }` (see `geocodeCacheKey`). Rows expire after **`GEO_CACHE_TTL_SECONDS`** (default **86400** in application code).
- Cache hits add a **warning** string so clients and support can tell replayed results from a fresh upstream resolution.
- Apply schema with **`npm run db:push`** (dev) or **`npm run db:migrate`** after **`npm run db:generate`** when evolving the table.
- **Privacy:** payloads can include **matched address text** from Census and **Google Civic divisions**; treat the table like **operational PII-adjacent** data (access control, retention, no public dumps).

## Cookie persistence (Segment 3.6)

- The browser receives an **httpOnly**, **signed** cookie (`civiclink_jurisdiction`) when **`JURISDICTION_COOKIE_SECRET`** is set server-side.
- The stored payload is **schema versioned** (`schemaVersion: 1`); large responses may **skip** the cookie if the signed value would exceed safe cookie size (see `JURISDICTION_COOKIE_MAX_BYTES` in code).
- **Google Civic `divisions` maps** are **not** stored in the cookie (size and sensitivity). Only slim flags (`enabled`, `stateAligned`) persist.
- **Clear:** Settings → **Clear saved location** calls `DELETE /api/geo/jurisdiction`.

## Privacy and logging

- Do **not** log raw **street addresses** or cookies in production analytics. Prefer **aggregated** metrics and **correlation IDs** without PII.

## References (verify against current docs)

- [US Census Geocoder](https://geocoding.census.gov/)
- [GeoNames web services](https://www.geonames.org/export/web-services.html)
- [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/)
- [Google Civic Information API](https://developers.google.com/civic-information/docs/using_api)
