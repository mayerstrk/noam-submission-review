# Progress & Commits

> Update after EVERY task. Agent: check the box, add timestamp, note deviations.

## Status

| Phase | Status | Done |
|-------|--------|------|
| 0: Scaffold | ✅ Complete | 6/6 |
| 1: API Layer | ✅ Complete | 8/8 |
| 2: UI Pages | ✅ Complete | 9/9 |
| 3: Polish & QA | 🔄 In Progress | 6/7 |

**Current task:** 3.7 in progress (rate limit optimization). Ready for final cleanup.
**Blockers:** None.

---

## Phase 0: Scaffold
- [x] 0.1 — Init project | Vite + React 18.3 + TS scaffolded (downgraded from React 19)
- [x] 0.2 — Install deps | TanStack Router/Query, Axios, Lucide, shadcn (button, card, dialog, badge, skeleton, scroll-area), Tailwind v4. Radix UI via individual @radix-ui/react-* packages (React 18 compatible)
- [x] 0.3 — Dark theme | Blue-tinted dark theme CSS vars from ARCHITECTURE.md, class="dark" on html
- [x] 0.4 — Router setup | File-based routes: __root.tsx, index.tsx (redirect → /repositories), repositories.tsx, developers.tsx. TanStack Router plugin in vite.config.ts. Route tree auto-generated.
- [x] 0.5 — Root layout | __root.tsx has Navbar shell (sticky header, "Github Explorer" title) + Outlet. main.tsx wraps app with QueryClientProvider + RouterProvider. Type-safe router registration.
- [x] 0.6 — QA verify | Playwright: dark theme OK, navbar OK, /repositories renders, /developers renders, redirect from / works, zero console errors

## Phase 1: API Layer
- [x] 1.1 — TS interfaces | Repository, RepositorySearchResponse, Contributor, Developer in types/github.ts
- [x] 1.2 — Axios instance | api/client.ts with baseURL, Accept header, RateLimitError class, 403 interceptor
- [x] 1.3 — API validation | Validated real GitHub API shapes via curl, confirmed license can be null
- [x] 1.4 — Mock data | api/mocks/repositories.ts (10 JS repos), api/mocks/contributors.ts (10 contributors), toggle via VITE_USE_MOCKS
- [x] 1.5 — Service functions | fetchRepositories() (JS repos, per_page=10), fetchContributors(repoFullName, per_page=10)
- [x] 1.6 — Query hooks | useRepositories (10s refetch, keepPreviousData, rate-limit retry), useContributors (on-demand, enabled flag)
- [x] 1.7 — Rate-limit handling | RateLimitError class, no retry on rate-limit, gcTime keeps stale data
- [x] 1.8 — Timestamp hook | useQueryTimestamp reads dataUpdatedAt. All 3 endpoints verified manually via test buttons (repos, developers, contributors)

## Phase 2: UI Pages
- [x] 2.1 — Navbar | flex-col centered on mobile, grid-cols-3 on md+. Title+Code2+UpdatedAtBadge left, Links centered, empty right col. isError badge (amber AlertTriangle on any error).
- [x] 2.2 — RepositoryCard | Responsive widths (85vw/350/420/480px). Stacked detail rows: description paragraph, license row, forks row, issues row. Name+stars flex-col on mobile, sm:flex-row. min-w-0 truncation throughout.
- [x] 2.3 — HorizontalScroll | overflow-x-auto, snap scroll, items-stretch, thin dark scrollbar. Inner px-6 for navbar alignment.
- [x] 2.4 — Repositories page | StatusOverlay + HorizontalScroll + RepositoryCard[] + ContributorsModal. Vertically centered. hasData prop for rate-limit messaging.
- [x] 2.5 — ContributorsModal | shadcn Dialog, isPlaceholderData loading on repo switch, per-repo cache, dark scrollbar, truncated names, green contribution count.
- [x] 2.6 — DeveloperCard | Responsive widths (85vw/350/420/480px). min-w-0 overflow-hidden on CardHeader. Truncated login + repo name + stars. Large centered avatar.
- [x] 2.7 — Developers page | useRepositories dedup, Developer[] mapping, HorizontalScroll, vertically centered. hasData prop.
- [x] 2.8 — StatusOverlay | Loading: responsive skeleton widths. Error: AlertCircle+retry with px-6 py-2. Rate-limited: centered w-fit banner, hasData-aware messaging, always-visible Retry. Empty: message.
- [x] 2.9 — Visual QA | Playwright verified at 1440px, 375px, 287px, 241px. Navbar wraps correctly, cards responsive, truncation works, error states styled.

## Pre-Phase 3: Fetch Optimization
- [x] Opt.1 — localStorage persistence | PersistQueryClientProvider + createAsyncStoragePersister. Entire query cache (repos + contributors) persisted to localStorage, updated after every fetch (1s throttle). maxAge 20h. On refresh/new tab, data loads instantly; stale queries refetch in background.
- [x] Opt.2 — Focus-only polling | refetchIntervalInBackground: false on useRepositories. Background tabs make zero API requests. Polling resumes on tab focus.
- [x] Opt.3 — Contributors gcTime bump | 10min → 30min. Contributor data changes rarely, survives longer in cache and localStorage.

## Pre-Phase 3: Visual Enhancement (hover-tilt)
- [x] HT.1 — Install hover-tilt, TS types, web component import in main.tsx
- [x] HT.2 — Wrap RepositoryCard + DeveloperCard with `<hover-tilt>` web component
- [x] HT.3 — CSS hover-tilt effects: 5-layer neon shadow, idle resting shadow, border glow, ::part() selectors
- [x] HT.4 — Custom gradients: luminance beam (repo cards), aurora sweep (dev cards) via data-gradient attributes
- [x] HT.5 — Grey theme: background hsl(222 18% 20%), darker cards hsl(222 22% 14%), brighter muted-foreground
- [x] HT.6 — Fix card clipping: -my-10 py-10 pb-14 padding trick on HorizontalScroll
- [x] HT.7 — Playwright verification: both pages render, hover effects work, modal functional, zero new errors
- [x] HT.8 — Card parity + typography rebalance: shared `CARD_BASE_DIMENSIONS` for equal card dimensions, larger DeveloperCard visual content (avatar/text), stronger responsive RepositoryCard typography (`sm`/`lg`) with 4-line description baseline
- [x] HT.9 — Repository visual weight retune: refined repo typography emphasis (title/stars/meta/button), retained responsive/mobile fit, and updated RepositoryCard hover-tilt config (`tilt-factor=0.5`, `scale-factor=1.03`, `glare-intensity=1.3`, `glare-mask-mode=luminance`, `blend-mode=soft-light`, `shadow`)

## Phase 3: Polish & QA
- [x] 3.1 — Code review | DRY refactor: extracted constants (query keys, timing, skeleton count) to `lib/constants.ts`, shared Tailwind classes (scrollbar, page layout, card dimensions) to `lib/card-styles.ts`. Exposed `isRateLimited` from `useRepositories()` — pages no longer import `RateLimitError`. Removed duplicate `.dark` CSS block, cleaned `api/github.ts` formatting, removed comments from hooks. Updated docs: removed mock references, clarified no-retry on rate-limit rationale.
- [x] 3.2 — Rate-limit test | Automated via Playwright E2E: 403 with header, 403 with message body, non-rate-limit 403 → generic error, no-retry verification
- [x] 3.3 — Responsive check | Automated via Playwright E2E: 1440/768/375px viewports, mobile modal usability, no body overflow
- [x] 3.4 — Full walkthrough | Automated via Playwright E2E: navigation (redirect, nav links, active state), repo cards (all fields, null handling), contributors modal (open/data/close), developers cards (name/repo/stars/avatar), horizontal scroll
- [x] 3.5 — Console + network audit | Automated via Playwright E2E: correct API endpoint + params, contributors lazy-loaded on modal open, query deduplication across pages, retry behavior on 500
- [x] 3.6 — Contributors modal enhancements | Virtualized list (`@tanstack/react-virtual`), total count header with 80+ cap indicator, rate-limit/error handling with retry, capped fetch to 80 per request (`CONTRIBUTORS_PER_PAGE`)
- [x] 3.7 — Rate limit optimization | Proactive rate limit awareness: read headers from all responses (success+error), handle 403+429, parse retry-after/x-ratelimit-reset, separate search/core bucket tracking, adaptive polling (10s normal, ms-until-reset when limited), free /rate_limit startup check, canMakeRequest gate for contributors queryFn, UI countdown in StatusOverlay and ContributorsModal, RateLimitError enhanced with resetAt field. ETags confirmed useless for unauthenticated (per GitHub docs).

---

## QA Reports

### Task 0.6 — Scaffold QA
| Scenario | Status | Notes |
|----------|--------|-------|
| Dark theme | ✅ | Blue-tinted dark background, white text |
| Navbar | ✅ | Sticky header, "Github Explorer" title |
| / redirect | ✅ | Redirects to /repositories |
| /repositories | ✅ | Renders heading |
| /developers | ✅ | Renders heading |
| Console errors | ✅ | Zero errors (only React DevTools info msg) |

### Task 1.8 — API Verification
| Scenario | Status | Notes |
|----------|--------|-------|
| Repositories fetch | ✅ | Top 10 JS repos logged, sorted by stars desc |
| Developers derivation | ✅ | 10 developers derived from repo owners, same query (TanStack Query dedup) |
| Contributors fetch | ✅ | On-demand fetch for ryanmcdermott/clean-code-javascript, contributors logged |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |

### Phase 2 — Manual Visual Check (user verified at localhost:5173)
| Scenario | Status | Notes |
|----------|--------|-------|
| Navbar layout | ✅ | Title + timestamp left, links centered, active state works |
| Repository cards | ✅ | 10 cards render, all fields shown, horizontal scroll works |
| Contributors modal | ✅ | Opens per repo, loading skeletons on switch, dark scrollbar, caches per repo |
| Developers page | ✅ | Cards render with avatar, name, repo+stars |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |
| UI polish needed | ⚠️ | User wants further adjustments to card sizing, layout, etc. |

### Task 2.9 — Responsive UI Refactor & Visual QA (Playwright)
| Scenario | Status | Notes |
|----------|--------|-------|
| Navbar 1440px | ✅ | Grid-cols-3: title+badge left, links centered |
| Navbar 375px | ✅ | Flex-col: title+badge centered, links below centered |
| Navbar 287px | ✅ | Wraps correctly, no overflow |
| Repo cards responsive | ✅ | 85vw on mobile, scales up at sm/lg/xl breakpoints |
| Dev cards responsive | ✅ | Same breakpoints, truncation works for long names |
| Dev card 241px | ✅ | Long login/repo names truncate, no layout break |
| Edge-to-edge scroll | ✅ | Cards extend full viewport, px-6 inner alignment |
| Stacked card rows | ✅ | Each detail (license, forks, issues) on own row |
| Rate-limit state | ✅ | Centered banner, hasData-aware message, Retry always visible |
| Error state | ✅ | AlertCircle + Retry, proper padding |
| StatusOverlay skeletons | ✅ | Responsive widths matching card breakpoints |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |

### hover-tilt Enhancement — Playwright QA
| Scenario | Status | Notes |
|----------|--------|-------|
| Grey theme renders | ✅ | Background #2b2f3a, cards darker, text readable |
| Repo cards hover | ✅ | Blue border glow, neon shadow, scale 1.05, tilt active |
| Dev cards hover | ✅ | Same effects with cyan aurora sweep gradient |
| Card clipping | ✅ | Fixed — padding trick prevents overflow cut |
| Custom gradients applied | ✅ | data-gradient attrs set, CSS vars computed correctly |
| Contributors modal | ✅ | Opens, shows data, closes — unaffected by changes |
| Console errors | ✅ | Zero new errors (pre-existing Radix ref warning — fixed in subsequent bug fix task) |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |

### Bug Fix — Radix Dialog `forwardRef` (Contributors Modal)
| Scenario | Status | Notes |
|----------|--------|-------|
| Console error on modal open | ✅ Fixed | `Function components cannot be given refs` — `DialogOverlay` and `DialogContent` were plain function components (shadcn React 19 style) but project runs React 18 |
| Fix applied | ✅ | Converted `DialogOverlay` + `DialogContent` to `React.forwardRef` + `.displayName` in `src/components/ui/dialog.tsx` |
| Playwright re-verify | ✅ | Clicked View Contributors — 0 console errors |

### HT.8 — Card Dimension + Typography Rebalance
| Scenario | Status | Notes |
|----------|--------|-------|
| Equal outer card dimensions | ✅ | RepositoryCard and DeveloperCard both use `CARD_BASE_DIMENSIONS` (`min-h-[24rem]` + shared responsive widths) |
| Developer content sizing | ✅ | Larger avatar (`w-32 h-32`) and larger text to reduce visual emptiness |
| Repository typography on large screens | ✅ | Title/body/meta/button text scales up at `sm`/`lg`, improving readability in wide cards while preserving mobile sizing |
| Repository description baseline | ✅ | `line-clamp-4` with fixed visual block height for consistent card rhythm |
| Responsive check (manual fallback) | ✅ | User-verified screenshots at desktop and mobile show no layout break |
| Playwright MCP session | ⚠️ | `browser_navigate` and `browser_resize` aborted; used manual localhost verification + lint checks for this iteration |

### HT.9 — Repository Typography + Tilt Retune (manual verify)
| Scenario | Status | Notes |
|----------|--------|-------|
| Repository text presence | ✅ | Title/link emphasis, star/meta visibility, and CTA text weight increased to avoid empty feel on large cards |
| Responsive behavior | ✅ | Mobile still fits cleanly; typography gains are weighted toward larger breakpoints |
| Hover profile update | ✅ | RepositoryCard now uses stronger luminance/soft-light hover-tilt parameters with shadow enabled |
| Manual screenshots | ✅ | User-provided desktop/mobile screenshots confirm layout remains intact |

### Task 3.6 — Contributors Modal Enhancements
| Scenario | Status | Notes |
|----------|--------|-------|
| Virtualized list renders | ✅ | `@tanstack/react-virtual` with `useVirtualizer`, only visible rows in DOM, overscan of 5 |
| Total count header | ✅ | Shows exact count when < 80, shows `80+` when hitting the per-page cap |
| Rate-limit handling | ✅ | Amber warning banner with cached-data-aware message, no retry on `RateLimitError` |
| Generic error + retry | ✅ | `AlertCircle` icon + "Failed to load contributors." + Retry button calling `refetch()` |
| Reopen modal shows data | ✅ | `VirtualContributorList` sub-component remounts with dialog, fresh virtualizer each open |
| Single API request | ✅ | Fetch capped at `per_page=80`, no pagination loop, conserves rate limit |
| E2E test for count | ✅ | New test verifies `(3)` count appears for 3 mock contributors |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |

### Tasks 3.2–3.5 — Automated E2E Test Suite (Playwright)
33 tests, 6 files, all passing consistently (~7–9s). API mocked via `page.route()`.

| File | Tests | Status | Notes |
|------|-------|--------|-------|
| `navigation.spec.ts` | 5 | ✅ | Root redirect, nav links, active styling, timestamp badge |
| `repositories.spec.ts` | 8 | ✅ | Card count, all fields, null license/description, contributors modal open/data/close |
| `developers.spec.ts` | 4 | ✅ | Card count, name/repo/stars, avatar image, horizontal scroll container |
| `error-states.spec.ts` | 4 | ✅ | 403 rate-limit banner, 500 error + retry, retry recovery, cross-page error |
| `responsive.spec.ts` | 4 | ✅ | Desktop 1440, tablet 768, mobile 375, modal at mobile |
| `api.spec.ts` | 8 | ✅ | Endpoint params, lazy contributor fetch, correct repo URL, rate-limit (header + message), non-rate-limit 403, query dedup, 500 retries |

### Task 3.7 — Rate Limit Optimization
| Scenario | Status | Notes |
|----------|--------|-------|
| Success headers tracked | ✅ | Axios success interceptor reads x-ratelimit-remaining/reset/resource from every 200 response |
| Error headers tracked | ✅ | Error interceptor reads headers from 403/429 responses too |
| 429 status handled | ✅ | Both 403 and 429 detected as rate limit (per GitHub docs) |
| retry-after parsed | ✅ | Stored as retryAfter (epoch ms) in rate limit state, used by getNextFetchDelay |
| x-ratelimit-reset parsed | ✅ | Stored as resetAt (epoch ms), used for countdown and polling delay |
| Separate search/core tracking | ✅ | Each resource has independent remaining/limit/resetAt/retryAfter |
| Dynamic refetchInterval | ✅ | Returns 10s normally, ms-until-reset when rate limited. Never returns false. |
| Contributors pre-check | ✅ | canMakeRequest('core') in queryFn prevents wasted 403. Throws RateLimitError locally with resetAt. |
| Free startup check | ✅ | checkRateLimitStatus() calls /rate_limit (free per docs) and seeds state via seedRateLimitState |
| StatusOverlay countdown | ✅ | Shows "Next refresh in Xs" or "Next refresh at HH:MM" when search is rate limited |
| ContributorsModal countdown | ✅ | Shows "Retry available in Xs" + Retry button when core is rate limited |
| RateLimitError.resetAt | ✅ | Enhanced with resetAt field (fallback: now + 60s) |
| TypeScript | ✅ | Zero errors (`npx tsc --noEmit`) |
| Linter | ✅ | Zero errors across all modified files |

---

## Deviations Log
| Task | Deviation | Reason |
|------|-----------|--------|
| 2.6, 2.7 | DeveloperCard uses HorizontalScroll instead of Grid | Mockup shows horizontal scroll for both pages |
| 2.1 | Navbar uses grid-cols-3 with title+timestamp on left (not UpdatedAt on right) | Matches mockup layout more closely |
| 2.2, 2.6 | Cards responsive (85vw/350/420/480px) instead of fixed w-[400px] | User feedback: larger on wide screens, responsive on small |
| 2.2 | Each card detail on own row (not grouped) | User feedback: more symmetrical layout matching mockup |
| 2.5 | ContributorsModal uses isPlaceholderData for loading state | Prevents flicker when switching repos while keeping per-repo cache |
| 1.5 | fetchRepositories sorts client-side by stargazers_count | Prevents jarring reorder on 10s refetch |
| layout | Removed max-w-7xl from main, edge-to-edge scroll | Mockup shows cards extending to viewport edge |
| 2.1 | UpdatedAtBadge uses isError (generic) not isRateLimited | User simplification: amber indicator on any error |
| 2.8 | StatusOverlay has hasData prop, rate-limit always shows Retry | User preference: always offer retry action |
| HT | CSS element selectors instead of class selectors on hover-tilt | React 18 sets className as `classname` attribute on web components — classes don't apply |
| HT | data-gradient attrs + CSS attr selectors for custom gradients | Inline style on web component causes `setProperty` crash in React 18 |
| HT | Theme shifted from near-black navy to gentle grey | User request: make shadows/effects visible, match hover-tilt site aesthetic |
| HT.8 | Playwright MCP fallback to manual verification for this pass | MCP browser actions aborted in-session; validated visually via localhost screenshots and lint/type checks |
| HT.9 | Repository hover profile diverges from earlier `data-gradient=luminance-beam` pattern | Intentional visual tuning for stronger, clearer repo-card presence |
| dialog.tsx | `DialogOverlay` + `DialogContent` converted to `React.forwardRef` | shadcn scaffolds React 19-style plain functions; React 18 requires forwardRef for Radix Slot/Presence ref passing |
| 2.5/3.6 | Contributors fetch capped at 80 (no pagination loop) | Pagination loop drained rate limit fast (multiple requests per modal open); single request with `per_page=80` is sufficient |
| 2.5/3.6 | `VirtualContributorList` extracted as sub-component | Virtualizer must remount with dialog to avoid stale scroll state; sub-component unmounts with `DialogContent` |
| 3.7 | Contributors rate limit gate in queryFn instead of `enabled` prop | Using `canMakeRequest('core')` in queryFn instead of gating `enabled` avoids reactivity issues where `enabled: false` would show a perpetual loading state. The queryFn approach properly enters error state with RateLimitError. |
| 3.7 | ETags not implemented | Confirmed via GitHub docs: conditional requests only exempt from rate limits when authenticated. Zero benefit for unauthenticated calls. |

---

## Commit Log

Format: conventional commits
```
<type>(<scope>): <short description>

<body — what was done, key decisions>

Tasks: X.X–X.X
```

### Phase 0 Commit — ⬜ Pending
```
<!-- filled after phase 0 -->
```
Files changed:

### Phase 1 Commit — ✅
```
feat(api): implement API layer with types, hooks, mocks, and rate-limit handling
```
Files changed:
- `src/types/github.ts` — Repository, RepositorySearchResponse, Contributor, Developer interfaces
- `src/api/client.ts` — Axios instance, RateLimitError class, 403 interceptor
- `src/api/github.ts` — fetchRepositories (JS repos), fetchContributors (per_page=10)
- `src/api/mocks/repositories.ts` — 10 realistic mock JS repos
- `src/api/mocks/contributors.ts` — 10 realistic mock contributors
- `src/api/mocks/index.ts` — VITE_USE_MOCKS toggle
- `src/hooks/queries/useRepositories.ts` — 10s refetch, keepPreviousData, rate-limit retry
- `src/hooks/queries/useContributors.ts` — on-demand, enabled flag
- `src/hooks/queries/useQueryTimestamp.ts` — reads dataUpdatedAt for navbar
- `src/routes/repositories.tsx` — temp test buttons (repos + contributors)
- `src/routes/developers.tsx` — temp test button (developers derived from repos)
- `.ai-docs/API_STRATEGY.md` — updated endpoints, contributor per_page, developer derivation
- `.ai-docs/ARCHITECTURE.md` — clarified shared query pattern
- `.ai-docs/TASKS.md` — updated task 2.7 description

### Phase 2 Commit (initial) — ✅
```
feat(ui): implement Phase 2 UI pages — navbar, cards, scroll, modal, status overlay
```
Files changed:
- `src/components/Navbar.tsx` — grid layout, Router Links, UpdatedAtBadge, rate-limit indicator
- `src/components/UpdatedAtBadge.tsx` — 24H timestamp, Clock icon, amber AlertTriangle
- `src/components/RepositoryCard.tsx` — w-[400px], truncation, all fields, View Contributors button
- `src/components/HorizontalScroll.tsx` — overflow-x-auto, snap, items-stretch, dark scrollbar
- `src/components/ContributorsModal.tsx` — shadcn Dialog, isPlaceholderData loading, dark scrollbar
- `src/components/DeveloperCard.tsx` — w-[400px], avatar, name, repo+stars
- `src/components/StatusOverlay.tsx` — loading skeletons, error+retry, rate-limit banner, empty
- `src/routes/__root.tsx` — uses Navbar component
- `src/routes/repositories.tsx` — composed page with cards, scroll, modal, vertical centering
- `src/routes/developers.tsx` — composed page with dev cards, scroll, vertical centering
- `src/hooks/queries/useQueryTimestamp.ts` — 24H format (en-GB, hour12: false)
- `src/api/github.ts` — client-side sort by stargazers_count for stable ordering

### Phase 2 Commit (refactor) — ✅
```
refactor(ui): responsive layout, stacked card rows, edge-to-edge scroll, error states
```
Files changed:
- `src/routes/__root.tsx` — removed max-w-7xl from main, header py-3 instead of h-14
- `src/components/Navbar.tsx` — flex-col centered on mobile, grid-cols-3 on md+, isError badge
- `src/components/UpdatedAtBadge.tsx` — renamed isRateLimited → isError for generic error indicator
- `src/components/HorizontalScroll.tsx` — px-6 inner alignment with navbar
- `src/components/RepositoryCard.tsx` — responsive widths (85vw/350/420/480px), stacked detail rows, min-w-0 truncation
- `src/components/DeveloperCard.tsx` — responsive widths, min-w-0 overflow-hidden on CardHeader, truncation
- `src/components/StatusOverlay.tsx` — hasData prop, responsive skeleton widths, centered rate-limit banner, always-visible Retry
- `src/routes/repositories.tsx` — hasData prop to StatusOverlay
- `src/routes/developers.tsx` — hasData prop to StatusOverlay
- `src/hooks/queries/useRepositories.ts` — minor cleanup
- `src/api/mocks/index.ts` — mock toggle change

### Pre-Phase 3 Commit (fetch optimization) — ✅
```
feat(query): add localStorage persistence and focus-only polling
```
Files changed:
- `package.json` — added @tanstack/query-async-storage-persister, @tanstack/react-query-persist-client
- `src/main.tsx` — PersistQueryClientProvider, createAsyncStoragePersister, global gcTime 10min, maxAge 20h
- `src/hooks/queries/useRepositories.ts` — refetchIntervalInBackground: false, removed per-query gcTime
- `src/hooks/queries/useContributors.ts` — gcTime bumped to 30min
- `.ai-docs/API_STRATEGY.md` — updated query config, rate-limit table, key decisions
- `.ai-docs/PROGRESS.md` — added optimization entries

### hover-tilt Enhancement Commit (initial) — ✅
```
feat(ui): add hover-tilt 3D card effects with grey theme
```
Files changed:
- `package.json` — added hover-tilt ^1.0.0
- `src/types/hover-tilt.d.ts` — new: JSX IntrinsicElements types for web component
- `src/main.tsx` — import hover-tilt/web-component registration
- `src/index.css` — hover-tilt CSS (::part selectors, 3-layer blue shadow, border glow)
- `src/components/RepositoryCard.tsx` — wrapped with `<hover-tilt>`, removed old hover classes
- `src/components/DeveloperCard.tsx` — wrapped with `<hover-tilt>`, removed old hover classes

### hover-tilt Enhancement Commit (enhanced) — ✅
```
feat(ui): grey theme, enhanced hover-tilt effects, fix card clipping
```
Files changed:
- `src/index.css` — grey theme colors (bg hsl(222 18% 20%), card hsl(222 22% 14%)), 5-layer neon shadow, idle resting shadow, luminance-beam + aurora-sweep custom gradient CSS
- `src/components/HorizontalScroll.tsx` — -my-10 py-10 pb-14 clipping fix
- `src/components/RepositoryCard.tsx` — data-gradient="luminance-beam", scale-factor=1.05, glare-intensity=0.4, blend-mode=overlay
- `src/components/DeveloperCard.tsx` — data-gradient="aurora-sweep", scale-factor=1.05, glare-intensity=0.4, blend-mode=overlay
- `.ai-docs/ARCHITECTURE.md` — updated theme, component specs, tech stack
- `.ai-docs/PROGRESS.md` — added hover-tilt entries + commit log
- `.ai-docs/TASKS.md` — added hover-tilt task section

### Bug Fix Commit — ✅
```
fix(ui): convert DialogOverlay and DialogContent to forwardRef for React 18 compatibility
```
Files changed:
- `src/components/ui/dialog.tsx` — `DialogOverlay` and `DialogContent` converted from plain functions to `React.forwardRef` with `.displayName`. Eliminates "Function components cannot be given refs" warning thrown by Radix UI's Slot/Presence mechanism on every contributors modal open.

### UI Tuning Commit — ⬜ Pending
```
refactor(ui): unify card dimensions and strengthen responsive card typography
```
Files changed:
- `src/lib/card-styles.ts` — shared base width and dimensions constants for card parity
- `src/components/DeveloperCard.tsx` — larger avatar and text sizing while keeping shared card dimensions
- `src/components/RepositoryCard.tsx` — stronger responsive typography and 4-line description baseline
- `.ai-docs/ARCHITECTURE.md` — updated typography/card specs
- `.ai-docs/TASKS.md` — added HT.7/HT.8 tracking entries
- `.ai-docs/PROGRESS.md` — added QA/deviation notes and pending commit entry

### UI Tuning Commit (retune) — ⬜ Pending
```
refactor(ui): retune repository card typography and hover profile for better desktop presence
```
Files changed:
- `src/components/RepositoryCard.tsx` — typography/weight refinements and updated hover-tilt parameters
- `.ai-docs/ARCHITECTURE.md` — synchronized RepositoryCard spec and typography wording
- `.ai-docs/TASKS.md` — added HT.9 tracking row
- `.ai-docs/PROGRESS.md` — added HT.9 status, QA notes, and deviation entry

### E2E Test Suite Commit — ⬜ Pending
```
test(e2e): add 33 Playwright E2E tests covering UI, API, errors, and responsive layout
```
Files changed:
- `playwright.config.ts` — new: Playwright config with chromium, webServer, baseURL
- `e2e/fixtures/mock-data.ts` — new: deterministic mock repos (3) and contributors (3)
- `e2e/helpers/api-mock.ts` — new: reusable `page.route()` interceptors + localStorage clear
- `e2e/navigation.spec.ts` — new: 5 tests (redirect, nav links, active state, timestamp)
- `e2e/repositories.spec.ts` — new: 8 tests (cards, fields, null handling, contributors modal)
- `e2e/developers.spec.ts` — new: 4 tests (cards, name/repo/stars, avatar, scroll)
- `e2e/error-states.spec.ts` — new: 4 tests (rate-limit, error+retry, recovery, cross-page)
- `e2e/responsive.spec.ts` — new: 4 tests (1440/768/375px, mobile modal)
- `e2e/api.spec.ts` — new: 8 tests (endpoint params, lazy fetch, dedup, rate-limit detection, retries)
- `package.json` — added `e2e` and `e2e:ui` scripts

### Contributors Enhancement Commit — ⬜ Pending
```
feat(contributors): virtualized list, total count, rate-limit handling, capped fetch
```
Files changed:
- `package.json` — added `@tanstack/react-virtual`
- `src/lib/constants.ts` — added `CONTRIBUTORS_PER_PAGE = 80`
- `src/api/github.ts` — replaced pagination loop with single `per_page=80` request
- `src/hooks/queries/useContributors.ts` — added `RateLimitError` no-retry logic, exposes `isRateLimited`
- `src/components/ContributorsModal.tsx` — virtualized list (`VirtualContributorList` sub-component), total count header with `80+` cap indicator, rate-limit amber banner, generic error + Retry button
- `e2e/api.spec.ts` — added test for contributor count display
- `.ai-docs/API_STRATEGY.md` — updated contributor endpoint, query config, key decisions
- `.ai-docs/ARCHITECTURE.md` — updated tech stack, folder structure, ContributorsModal spec, useContributors note
- `.ai-docs/TASKS.md` — updated task 2.5 description
- `.ai-docs/PROGRESS.md` — added 3.6 status, QA report, deviations, commit log

### Rate Limit Optimization Commit — ⬜ Pending
```
feat(api): proactive rate limit awareness with smart polling pauses and UI countdown

- Read rate limit headers from every response (success + error), not just 403s
- Handle both 403 and 429 status codes (per GitHub docs)
- Parse retry-after and x-ratelimit-reset headers per docs priority order
- Separate tracking for search (10 req/min) and core (60 req/hour) buckets
- Dynamic refetchInterval: 10s normally, ms-until-reset when rate limited (never stops)
- canMakeRequest() pre-check in contributors queryFn prevents wasted 403 requests
- Free /rate_limit endpoint check on startup seeds budget before first real call
- UI countdown: StatusOverlay shows "Next refresh in 45s", ContributorsModal shows "Retry available at 14:30"
- RateLimitError enhanced with resetAt field for downstream timing
- ETags confirmed useless for unauthenticated (per GitHub docs)

Tasks: 3.7
```
Files changed:
- `src/api/rate-limit-state.ts` — **new**: singleton rate limit state manager + useRateLimitState hook + useCountdown hook (one file)
- `src/api/client.ts` — enhanced interceptors: success handler reads headers, error handler adds 429 + retry-after + secondary rate limit detection, RateLimitError has resetAt
- `src/api/github.ts` — added checkRateLimitStatus() (free /rate_limit endpoint)
- `src/hooks/queries/useRepositories.ts` — dynamic refetchInterval via getNextFetchDelay('search', 10_000)
- `src/hooks/queries/useContributors.ts` — canMakeRequest('core') pre-check in queryFn
- `src/components/StatusOverlay.tsx` — countdown display using useRateLimitState('search') + useCountdown
- `src/components/ContributorsModal.tsx` — countdown + Retry button using useRateLimitState('core') + useCountdown
- `src/lib/constants.ts` — added FALLBACK_RESET_DELAY
- `src/main.tsx` — checkRateLimitStatus() call on startup
- `.ai-docs/API_STRATEGY.md` — updated rate limit strategy, budgets, error handling priority
- `.ai-docs/PROGRESS.md` — added 3.7 status, QA report, commit log

### Phase 3 Commit — ⬜ Pending
```
<!-- filled after phase 3 -->
```
Files changed:
