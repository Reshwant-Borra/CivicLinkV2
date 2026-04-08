# Page override: About data (`/about-data`)

Overrides **`design-system/MASTER.md`** for this route.

## Layout & density

- Prefer **clear sections** (`Neutrality`, `Planned sources`, `Research`, `Voting & events`) with **short paragraphs** and **data tables** for source lists.
- **No hype** or campaign-style visuals; this page is **trust infrastructure**.
- Use **Fira Code only for headings**; body stays **Fira Sans** at comfortable line height for long reading.

## Content rules

- Every data domain must name **primary sources** and **licenses** where relevant (e.g. LegiScan CC-BY).
- Explicitly state **CivicLink is not a government site** and that users should **verify election and voting details** with official state/local materials.
- Point to the **research PDF** in the repo root by filename; do not imply the PDF is hosted in production until it is published.

## Motion

- **Minimal motion** on this page: no decorative scroll effects; respect **`prefers-reduced-motion`** (inherited from global CSS).

## Components

- Favor **semantic `<table>`** with `<caption>` or surrounding heading for planned integrations; support **narrow viewports** with horizontal scroll only inside a rounded bordered wrapper if needed.
