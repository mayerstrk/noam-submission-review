# Architecture & Conventions

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 18.3 (functional components, hooks only) |
| Language | TypeScript strict, no `any` |
| Routing | TanStack Router (file-based) |
| Data Fetching | TanStack Query (cache + refetch) |
| HTTP | Axios (single centralized instance) |
| UI Components | shadcn/ui (dark theme) |
| Icons | Lucide React |
| Styling | Tailwind CSS v4 |
| Virtualization | @tanstack/react-virtual (virtualized lists) |
| Card Effects | hover-tilt (Web Component) |
| Build | Vite |
| State Mgmt | None — TanStack Query cache is sufficient |

---

## Folder Structure

```
src/
├── api/
│   ├── client.ts              # Axios instance + interceptors
│   └── github.ts              # API service functions
├── components/
│   ├── ui/                    # shadcn primitives (auto-generated)
│   ├── Navbar.tsx
│   ├── RepositoryCard.tsx
│   ├── DeveloperCard.tsx
│   ├── ContributorsModal.tsx
│   ├── HorizontalScroll.tsx
│   ├── UpdatedAtBadge.tsx
│   └── StatusOverlay.tsx      # Shared loading/error/rate-limit
├── hooks/
│   └── queries/
│       ├── useRepositories.ts # Exposes isRateLimited
│       ├── useContributors.ts # Exposes isRateLimited, no-retry on rate-limit
│       └── useQueryTimestamp.ts
├── types/
│   ├── github.ts              # ALL interfaces here
│   └── hover-tilt.d.ts        # Web Component JSX types
├── lib/
│   ├── utils.ts               # cn() helper
│   ├── constants.ts           # Query keys, timing, skeleton count, contributors per-page cap
│   └── card-styles.ts         # Shared Tailwind class constants
├── routes/
│   ├── __root.tsx             # Layout (Navbar + Outlet)
│   ├── index.tsx              # Redirect → /repositories
│   ├── repositories.tsx
│   └── developers.tsx
├── index.css
└── main.tsx
```

---

## Key Patterns

**Data flow:** `Component → useQuery hook → API service fn → Axios instance → GitHub API`

- ALL HTTP through `api/client.ts` — never import axios elsewhere
- ALL server data through query hooks — components never call API directly
- ALL types in `types/github.ts` — no inline type definitions
- Pages are thin — compose components + wire hooks
- Both pages share the same `useRepositories()` query (TanStack Query deduplicates via queryKey — one API call serves both)
- Developers page derives Developer[] by mapping each repo to its owner

## Naming

| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `RepositoryCard.tsx` |
| Hooks | camelCase, `use` prefix | `useRepositories.ts` |
| Types | PascalCase | `Repository`, `Contributor` |
| API fns | camelCase, verb prefix | `fetchRepositories()` |
| No comments | Code is self-explanatory | Clear names instead |

## DRY Checklist — Read Before Creating Any File
- [ ] Does a similar component/hook/utility already exist?
- [ ] Am I importing axios directly instead of `api/client.ts`?
- [ ] Am I fetching data in a component instead of a query hook?
- [ ] Am I duplicating error/loading UI instead of using `StatusOverlay`?
- [ ] Am I defining types outside `types/github.ts`?
- [ ] Am I using magic numbers instead of constants from `lib/constants.ts`?
- [ ] Am I duplicating Tailwind class strings instead of using `lib/card-styles.ts`?
- [ ] Am I checking for RateLimitError in a page instead of using `isRateLimited` from `useRepositories()`?

---

## Design System

### Theme — Gentle Grey with Blue Accents

```css
:root {
  --background:         222 18% 20%;         /* Soft blue-grey (#2b2f3a) */
  --foreground:         210 40% 98%;         /* Off-white */
  --card:               222 22% 14%;         /* Darker card (#1c2030) — inset depth */
  --card-foreground:    210 40% 98%;
  --muted:              222 15% 24%;
  --muted-foreground:   215 15% 60%;         /* Brighter for readability */
  --primary:            217.2 91.2% 59.8%;   /* Vivid blue #3B82F6 */
  --primary-foreground: 210 40% 98%;
  --secondary:          222 15% 24%;
  --secondary-foreground: 210 40% 98%;
  --accent:             222 15% 24%;
  --accent-foreground:  210 40% 98%;
  --border:             222 15% 28%;         /* Visible on grey bg */
  --input:              222 15% 28%;
  --ring:               224.3 76.3% 48%;
  --destructive:        0 62.8% 50%;
  --destructive-foreground: 210 40% 98%;
  --radius: 0.625rem;
}
```

### Typography
System font stack (shadcn default). Page titles: `text-2xl font-bold`. Card titles: `text-lg font-semibold` on mobile with larger responsive scaling on wider screens where needed. Body: `text-sm` baseline with selective `lg:text-base` scaling on repository content for readability on wide cards. Meta: `text-xs text-muted-foreground`.

### Layout Rules
- Header: `sticky top-0`, `px-6 py-3`, `bg-background/80 backdrop-blur-sm border-b`
- Main: no max-width constraint (cards extend edge-to-edge), `py-6`
- HorizontalScroll inner container: `px-6` for alignment with navbar
- **hover-tilt 3D effects** on all cards — subtle tilt, scale, glare, and neon shadow on hover
- Cards have idle resting shadow for depth; on hover, border glows blue and hover-tilt shadow takes over
- Dark mode only (no theme toggle)

### Component Specs

**Navbar:** Sticky top, `bg-background/80 backdrop-blur-sm border-b border-border`. Mobile: `flex flex-col items-center gap-2` — title+badge centered, links centered below. Desktop (md+): `grid grid-cols-3` — left = Code2 icon + "Github Explorer" title + UpdatedAtBadge, center = TanStack Router Links with `activeProps` (border + text-primary), right = empty spacer. Error indicator: amber AlertTriangle icon next to timestamp (shown on any query error, not just rate-limit).

**RepositoryCard:** Wrapped in `<hover-tilt>` web component with a stronger luminance profile (`tilt-factor=0.5`, `scale-factor=1.03`, `glare-intensity=1.3`, `glare-mask-mode=luminance`, `blend-mode=soft-light`, shadow enabled). shadcn Card with shared base dimensions: `min-h-[24rem]` + responsive widths `w-[85vw] sm:w-[350px] lg:w-[420px] xl:w-[480px]`. Shows: truncated name (link + ExternalLink icon, title tooltip) with stars — flex-col on mobile, sm:flex-row. Name/stars and key copy are visually stronger on larger breakpoints for better presence on wide cards. Description uses `line-clamp-4` with fixed visual block height for consistency. Each detail on its own row: license (null-safe), forks, issues — each with icon + text. "View Contributors" button (`variant="outline"`) at bottom via CardFooter. `min-w-0 overflow-hidden` throughout for flexbox truncation.

**HorizontalScroll:** Outer: `overflow-x-auto`, thin dark custom scrollbar (`bg-muted` track, `bg-muted-foreground/30` thumb), `-my-10 py-10 pb-14` padding trick to prevent hover-tilt clipping. Inner: `flex items-stretch gap-4 px-6` — px-6 aligns cards with navbar content. Snap scroll.

**ContributorsModal:** shadcn Dialog, controlled via `repoFullName` state (open when non-null). Uses `isPlaceholderData` from TanStack Query to show loading skeletons when switching repos (prevents stale data flicker from `keepPreviousData`). Each repo's contributors cached independently via queryKey. Virtualized list via `@tanstack/react-virtual` (`useVirtualizer`) — only visible rows rendered in DOM, keeping performance stable even with 80 contributors. Extracted `VirtualContributorList` sub-component ensures the virtualizer remounts cleanly each time the dialog opens. Header shows total count with `80+` indicator when the result hits the `CONTRIBUTORS_PER_PAGE` cap. Rate-limit handling mirrors `StatusOverlay`: amber warning banner (with cached-data-aware messaging) on `RateLimitError`, generic error state with `AlertCircle` + Retry button on other failures. Dark scrollbar matching HorizontalScroll style. Avatar `rounded-full w-8 h-8`, truncated names, green contribution count.

**DeveloperCard:** Wrapped in `<hover-tilt>` web component (tilt-factor=0.4, scale-factor=1.05, glare-intensity=0.4, blend-mode=overlay, aurora sweep custom gradient). shadcn Card with shared base dimensions: `min-h-[24rem]` + responsive widths `w-[85vw] sm:w-[350px] lg:w-[420px] xl:w-[480px]` (matches RepositoryCard). Data derived from Repository (owner = developer). Shows: truncated developer name (`owner.login`, bold, `min-w-0 truncate`) with larger text, truncated repo name + stars sub-line (`min-w-0 truncate` on text, `shrink-0` on stars), larger centered avatar (`owner.avatar_url`, `rounded-full w-32 h-32`) for stronger visual weight. `CardHeader` has `min-w-0 overflow-hidden`.

**StatusOverlay:** Props: `isLoading, isError, isRateLimited, isEmpty, hasData, onRetry`. Loading → skeleton cards (count from `SKELETON_COUNT`) with responsive widths from `CARD_BASE_WIDTH`, `px-6`. Rate-limited → centered `w-fit` amber banner with hasData-aware message ("Using cached data" vs "Please wait"), no Retry button (retrying during rate-limit extends the cooldown). Error → `AlertCircle` + Retry, `px-6 py-2`. Empty → friendly message, `px-6 py-12`. Shared by both pages.

### Icons (Lucide React)

Stars→`Star`, Forks→`GitFork`, Issues→`CircleDot`, License→`Scale`, Link→`ExternalLink`, Time→`Clock`, Contributors→`Users`, Error→`AlertCircle`, RateLimit→`AlertTriangle`, Logo→`Code2`. Default: `w-4 h-4 text-muted-foreground`. Stars: `text-yellow-500`.

---

## MCP Tools

### Context7 — Library Docs
**When:** Before using any TanStack Router, TanStack Query, or shadcn API.
**How:** Resolve library → fetch docs for the specific feature. Never rely on training data for API signatures.

### Playwright — Visual QA & Debugging
**When:** After any UI task, and during QA phase.
**Workflow:**
1. `playwright_navigate` → `http://localhost:5173`
2. `playwright_screenshot` → verify layout
3. Check console for errors (zero tolerance for `console.error`)
4. Test interactions: nav links, scroll, modal open/close
5. Screenshot after each interaction

### QA Test Scenarios

| # | Scenario | Verify |
|---|----------|--------|
| 1 | Initial load | Dark theme, navbar, redirect to /repositories, no console errors |
| 2 | Repositories page | 10 cards in horizontal scroll, all fields shown |
| 3 | Contributors modal | Opens on button click, shows avatars/names, closes cleanly |
| 4 | Navigation | Both pages work, no timer reset on page switch |
| 5 | Developers page | Horizontal scroll of cards with name, repo+stars, avatar |
| 6 | Updated-at timestamp | Changes every ~10s, persists across navigation |
| 7 | Rate-limit fallback | Stale data shown, amber indicator, no crash |
| 8 | Responsive | No broken layouts at 1440/1024/768px |

**Console policy:** Zero `console.error` in normal operation. Rate-limit errors caught by interceptor, not thrown. React StrictMode warnings are acceptable.

**QA report format** — add to `PROGRESS.md`:
```
| Scenario | Status | Notes |
|----------|--------|-------|
| Initial Load | ✅ | No errors |
| ...          | ⚠️ | Needs fix at 768px |
```
