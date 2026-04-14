# Page override: Home (`/`)

Overrides **`design-system/MASTER.md`** for this route.

## Layout: Full-screen glass app shell

The homepage uses its own route group `(home)` with a minimal layout (no site
header or footer). It renders a self-contained glass shell:

```
<dark canvas #060A14>
  <glass shell rounded-[32px] backdropBlur-xl>
    <SidebarNav 216px>
    <main panel flex-col>
      <HomeHeader 56px>
      <content row>
        <scrollable main>
          HeroSection (greeting + CivicPulseVisualizer + FloatingInsightCards)
          ActionGrid (6 mixed-size glass action cards)
          LowerModules (ImportantDatesTimeline + BillSpotlightCard)
        <CivicSnapshotRail 272px (xl+)>
```

## Color tokens (dark-only surface)

| Role               | Value                | Notes                             |
|--------------------|----------------------|-----------------------------------|
| Canvas bg          | `#060A14`            | Very deep navy-black              |
| Shell surface      | `rgba(255,255,255,0.025)` | Frosted glass                |
| Card surface       | `rgba(255,255,255,0.065)` | Slightly lifted glass       |
| Accent cobalt      | `#2563EB`            | Primary CTA, active nav, glow     |
| Text primary       | `#F0F4FF` / `white`  | Headings                          |
| Text muted         | `#6B80A8`            | Body, descriptions                |
| Border             | `rgba(255,255,255,0.07–0.10)` | Shell and card edges    |
| Green accent       | `#34D399`            | Positive signals, live status     |
| Amber accent       | `#FBBF24`            | Deadlines, warnings               |
| Violet accent      | `#818CF8`            | Bills, legislative                |

## Animations (globals.css)

`civic-float-{1–5}` — satellite node floating (7–9s loops, async offsets)  
`civic-float-b`, `civic-float-c` — floating insight cards gentle bob  
`civic-pulse-orb` — central orb breathe (4.5s)  
All guarded by `prefers-reduced-motion: reduce` → collapsed to 0.01ms.

## Components introduced

| Component | Path |
|-----------|------|
| `SidebarNav` | `components/home/sidebar-nav.tsx` |
| `HomeHeader` | `components/home/home-header.tsx` |
| `CivicPulseVisualizer` | `components/home/civic-pulse-visualizer.tsx` |
| `HeroSection` | `components/home/hero-section.tsx` |
| `ActionGrid` | `components/home/action-grid.tsx` |
| `CivicSnapshotRail` | `components/home/civic-snapshot-rail.tsx` |
| `ImportantDatesTimeline` | `components/home/important-dates-timeline.tsx` |
| `BillSpotlightCard` | `components/home/bill-spotlight-card.tsx` |

## IA & tone

- **Wayfinding first:** hero surfaces Find Polling Place, View Ballot, Deadlines, Events as 4 primary CTAs
- **Civic pulse visualizer** is the hero focal point — represents SB-247 with 5 satellite impact areas (Education, Transit, Housing, Community, Cost of Living)
- **Right rail** ("Your civic snapshot") is supportive and personal — election countdown, registration status, next-steps checklist, this-week timeline
- **No analytics/KPI vibes** — cards are action cards, not metric widgets

## Trust

- "Data from official government sources" disclaimer in hero
- Linked `About our data` route
- No fake analytics, no dark patterns, no KPI numbers
