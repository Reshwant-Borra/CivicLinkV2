# Page override: Home (`/`)

Overrides **`design-system/MASTER.md`** for this route.

## Architecture: Tab-based civic dashboard shell

The homepage uses route group `(home)` with a minimal layout (no site header or footer).
It renders a self-contained elevated app shell on a soft-paper canvas, with a tab system
that switches the main content canvas between feature areas.

```
<soft paper canvas #F7F5F2, 12px padding>
  <white shell rounded-[24px] shadow-elevated border(#E7E5E4/60)>
    <SidebarNav 216–232px>
    <main panel flex-col>
      <HomeHeader 56px (location + search + notifications + avatar)>
      <TabStrip (Today | Vote | Bills | Events | My Area)>
      <content row flex-1 min-h-0 overflow-hidden>
        <scrollable main flex-1 px-5 pt-5 overflow-y-auto>
          [Tab content: TodayContent | VoteContent | BillsContent | EventsContent | MyAreaContent]
        <CivicCalendarRail 272px (xl+)>
```

## Color tokens (warm light palette — v2)

| Role             | Value                                                        | Notes                                          |
| ---------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| Canvas bg        | `#F7F5F2`                                                    | Soft Paper — warm off-white ground             |
| Shell surface    | `#FFFFFF`                                                    | Warm White — elevated glass app shell          |
| Card surface     | `#FFFFFF`                                                    | All content cards                              |
| Primary          | `#5B7C99`                                                    | Dusty Blue — CTA, active nav, tab underline    |
| Text primary     | `#2B2B2B`                                                    | Deep Ink — headings, labels                    |
| Text secondary   | `#6B7280`                                                    | Soft Gray — body, descriptions                 |
| Text tertiary    | `#9CA3AF`                                                    | Eyebrows, metadata, inactive nav               |
| Accent           | `#D6A75E`                                                    | Warm Amber — deadlines, urgency                |
| Border           | `#E7E5E4`                                                    | Warm Gray — card and panel edges               |
| Border subtle    | `#D1CFC8`                                                    | Hover-state borders                            |
| Shell shadow     | `0 24px 64px rgba(0,0,0,0.09), 0 4px 16px rgba(0,0,0,0.05)` | App shell elevation                            |

## Atmospheric blooms (page background layer)

Two large radial blooms fixed behind the shell (pointer-events-none):

- Upper-left: dusty blue bloom — `rgba(91,124,153,0.11)`, 600px, blur 60px, translated -30%/-30%
- Lower-right: warm amber bloom — `rgba(214,167,94,0.09)`, 500px, blur 60px, translated +30%/+30%

## Tab system

Five homepage tabs switch the main content canvas. The tabs are **not** full sidebar pages — they are preview slices of each feature area.

| Tab     | Default? | Content                                               |
| ------- | -------- | ----------------------------------------------------- |
| Today   | Yes      | Greeting, stat cards, featured card, priorities grid  |
| Vote    | No       | Election countdown, polling/ballot/reg quick actions  |
| Bills   | No       | 3 featured bills with local impact + plain-language   |
| Events  | No       | This week's civic events with date/time/location      |
| My Area | No       | County/district cards, representatives, issue watch   |

Active tab: `#2B2B2B` text, `#5B7C99` 2px underline, `font-semibold`
Inactive tab: `#6B7280` text, no underline, `font-medium`
Hover: `bg-[#F7F5F2]` background tint

## Today tab layout

```
pt-1  Greeting: "Good evening, Jane." (tertiary) + h1 headline (primary bold)
      Subline: location + timestamp + data source link

grid-cols-2 lg:grid-cols-4   Summary stat cards (4 equal)
  - Next election (CalendarDays, #5B7C99, "12 days")
  - Reg. deadline (Clock, #D6A75E, "Oct 7")
  - New bills (Scale, #7A9ABB, "4")
  - Events (CalendarDays, #8B9E8C, "3")

grid-cols-1 lg:grid-cols-3   Featured + Priority
  [col-span-2] FeaturedCivicCard — large, SB-247 transit
  [col-span-1 flex flex-col gap-3]
    PriorityCard — School Board tonight (amber)
    PriorityCard — Senate vote SB-247 (blue)
    PriorityCard — Registration closes (sage)

h-px divider #E7E5E4

TodaysPriorities — "Today's priorities" 2×2 card grid
  - Find My Polling Place
  - Review My Ballot
  - Registration Deadline
  - Local Events This Week
```

## Featured card design

- Full height in its grid column (`h-full`)
- Soft hover tint from `top-left` radial gradient
- Two badge pills: category badge + status badge (animated pulse dot)
- Title in `text-[17px] font-bold`
- Plain-language summary in `text-[13px] text-secondary`
- "Why it matters" tinted box (`rgba(91,124,153,0.06)` bg)
- CTA link with `ArrowRight` icon

## Civic Calendar Rail (right panel, xl+)

```
p-4 space-y-4
  Header: "Civic calendar" label + prev/next month arrows
  Month label: "April 2026"
  Mini calendar grid (7 columns, Sunday start)
    Highlighted days:
      today=14: filled circle #5B7C99, white text
      deadline=16: soft amber tint rgba(214,167,94,0.18)
      event=22: soft sage tint rgba(139,158,140,0.18)
      vote=28: soft blue tint rgba(122,154,187,0.18)
  Legend: Deadline (amber) / Event (sage) / Vote (blue)
  Divider
  Upcoming events timeline
    Vertical track (thin line, gradient fade)
    4 items with colored dot + card: label / date+time / location
  Link: "View full calendar" → /events
```

## Sidebar nav items (updated)

| Label   | Route       | Icon        |
| ------- | ----------- | ----------- |
| Home    | `/`         | Home        |
| Vote    | `/voting`   | CheckSquare |
| Bills   | `/federal`  | Scale       |
| Events  | `/events`   | Calendar    |
| My Area | `/local`    | MapPin      |
| Learn   | `/about-data` | BookOpen  |
| Settings (bottom) | `/settings` | Settings |

## Components

| Component             | Path                                              |
| --------------------- | ------------------------------------------------- |
| `HomeDashboard`       | `components/home/home-dashboard.tsx`              |
| `SidebarNav`          | `components/home/sidebar-nav.tsx`                 |
| `HomeHeader`          | `components/home/home-header.tsx`                 |
| `CivicCalendarRail`   | `components/home/civic-calendar-rail.tsx`         |

## IA & tone

- **Tab system is the primary navigation** for homepage feature preview
- **Today tab is the default** — answers "what matters now in my area?"
- **Featured card is the editorial anchor** — one prominent civic issue per day
- **Today's Priorities** replaces generic CTA grids with civic-specific actions
- **Civic Calendar rail** gives the right panel editorial weight
- **No analytics KPIs** — numbers are dates and counts, not vanity metrics
- **Editorial tone**: "Good evening." / "Here's what matters" / "Why it matters"

## Trust

- "Updated just now" timestamp in greeting subline
- "About our data" link in greeting subline → `/about-data`
- No fake analytics, no dark patterns

## Anti-patterns (do not regress)

- No dark glass / neon / electric colors — palette is warm light only
- No enterprise dashboard aesthetic — this is a civic briefing tool
- No tab strip that replaces or competes with sidebar navigation
- No heavy motion — gentle pulse dots and 150–300ms transitions only
- No emoji icons — Lucide only
- Discovery rails (Bills/Events tabs) must preserve editorial hierarchy
- Do not make every card identical — vary scale: featured (large) > priority (medium) > stat (small)
