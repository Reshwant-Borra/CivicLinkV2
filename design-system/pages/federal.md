# Federal Legislation — Page Design Notes

> **Authority order:** This file → `design-system/MASTER.md`

---

## Layout & IA

- **List page** (`/federal`): search bar at top, then paginated bill list. No hero — jump straight to data.
- **Detail page** (`/federal/[billId]`): bill header block, then status/actions timeline, then content sections (summary, sponsors).
- Max content width: `max-w-5xl` for list, `max-w-4xl` for detail. Consistent with `PageTemplate`.

---

## Search Bar

- Full-width `<input type="search">` with a "Search" `<button>` inside a `<form method="GET">`.
- Placeholder: `"Search bills by keyword, title, or sponsor…"`
- On empty submit, clears the `q` param and shows recent bills.
- No client-side debounce in Phase 1 — form submit navigates to new URL (clean RSC pattern).
- Input: `border border-border rounded-lg px-4 py-2 bg-background text-foreground focus-visible:ring-2 focus-visible:ring-ring`
- Submit button: primary variant from `Button`.

---

## Bill Card

Compact data card — scan first, click second.

```
[ TYPE BADGE ]  H.R. 1234  ·  119th Congress
Title of the bill truncated to two lines
Sponsor: Rep. Jane Smith (D-CA)  ·  Introduced Jan 7, 2025
Latest action: Referred to Committee on…  (date)
[ POLICY AREA TAG ]  [ STATUS BADGE ]
```

- Card: `rounded-lg border border-border bg-card p-4 hover:bg-muted/40 transition-colors cursor-pointer`
- Bill number + congress: `font-mono text-xs text-muted-foreground`
- Title: `font-semibold text-foreground line-clamp-2`
- Sponsor / action line: `text-sm text-muted-foreground`
- The entire card is a link (`<Link>`) — no nested interactive elements inside.

---

## Status Badges

Map `deriveBillStatus()` result to color:

| Status       | Tailwind classes                                    |
|--------------|-----------------------------------------------------|
| introduced   | `bg-muted text-muted-foreground`                    |
| in-committee | `bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300` |
| passed       | `bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300` |
| signed       | `bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300` |
| failed       | `bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300` |
| unknown      | `bg-muted text-muted-foreground`                    |

Use the shadcn `Badge` component as the base.

---

## Bill Type Badges

Small monospace badge showing chamber origin:
- `H.R.` → primary-ish: `bg-primary/10 text-primary`
- `S.` → secondary: `bg-secondary/10 text-secondary`
- Others (resolutions) → `bg-muted text-muted-foreground`

---

## Pagination

- Simple `← Previous` / `Next →` links at bottom of list.
- Show result count: `Showing X–Y of Z bills`.
- Use `Button variant="outline"` for prev/next; disable (muted, no hover) when at boundary.
- Link to same page with `?q=...&offset=N`.

---

## Bill Detail Page

```
[ Back to Federal ]

H.R. 1234  ·  119th Congress  ·  [ STATUS BADGE ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full Title of the Bill

Introduced: Jan 7, 2025  ·  Policy Area: Health  ·  Origin: House

[ Sponsor block ]
[ Summary section — CRS text if available, otherwise "No summary yet" ]
[ Actions timeline ]
[ External links → Congress.gov ]
```

- Back link: small, `text-muted-foreground` with `←` arrow.
- Title: `text-2xl font-semibold`.
- Metadata row: `text-sm text-muted-foreground` with `·` separators.
- **Summary**: prose-width (`max-w-prose`), rendered as plain text (no HTML injection — Congress.gov may include markup, strip tags server-side).
- **Actions timeline**: vertical list ordered oldest → newest. Each row: date (monospace, fixed width) + action text. Use `border-l-2 border-border pl-4` for the timeline rail.
- **External link**: `ExternalLink` Lucide icon + "View on Congress.gov" — opens in new tab with `rel="noopener noreferrer"`.

---

## Anti-Patterns (in addition to MASTER.md)

- Do not render raw HTML from Congress.gov summaries — strip tags first.
- Do not show stub `"Coming in Segment X"` copy — if data is absent show `AppEmpty` with link to Congress.gov.
- Do not block the page on summary load — summaries are secondary, use `Suspense` or load in parallel.
- No auto-pagination / infinite scroll in Phase 1 — explicit prev/next links only.
