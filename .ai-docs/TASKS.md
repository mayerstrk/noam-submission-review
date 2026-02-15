# Tasks

> Pick the next `TODO` task whose dependencies are all `DONE`.
> Each task = one focused unit of work. Update `PROGRESS.md` after each.
> **Commit after every subtask.** Big changes/refactors → commit BEFORE and AFTER.

---

## Phase 0: Scaffold

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| 0.1 | Init Vite + React + TS | Architect | — | `npm create vite@latest`, verify it compiles |
| 0.2 | Install all deps | Architect | 0.1 | tanstack query/router, axios, lucide, shadcn init + components (button, card, dialog, badge, skeleton, scroll-area). **Context7:** verify shadcn init cmd + TanStack Router install |
| 0.3 | Configure dark theme | Architect | 0.2 | CSS vars from `ARCHITECTURE.md` design system. Dark default, blue accents |
| 0.4 | Set up TanStack Router | Architect | 0.2 | File-based routes: `__root`, `index` (→ /repositories), `repositories`, `developers`. **Context7:** verify router setup |
| 0.5 | Root layout | Architect | 0.3, 0.4 | `__root.tsx` with Navbar shell + `<Outlet/>`, wrap with QueryClientProvider |
| 0.6 | Verify clean start | QA | 0.5 | **Playwright:** dev server runs, both routes render, zero console errors |

→ **COMMIT → STOP → REVIEW**

---

## Phase 1: API Layer

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| 1.1 | Define TS interfaces | Architect | 0.6 | `types/github.ts`: Repository, RepositorySearchResponse, Contributor. See `API_STRATEGY.md` |
| 1.2 | Axios instance | Implementer | 1.1 | `api/client.ts` with baseURL, Accept header, rate-limit interceptor (403 → RateLimitError) |
| 1.3 | Validate API shapes | Implementer | 1.2 | Make real calls, compare responses to interfaces, fix mismatches (esp. nullable fields) |
| 1.4 | ~~Mock data~~ | ~~Implementer~~ | ~~1.3~~ | Removed — app uses real API with localStorage persistence as fallback |
| 1.5 | API service functions | Implementer | 1.2 | `api/github.ts`: `fetchRepositories()`, `fetchContributors(owner, repo)` |
| 1.6 | Query hooks | Implementer | 1.5 | `useRepositories` (10s refetch, keepPreviousData), `useContributors` (enabled flag, on-demand). **Context7:** verify TanStack Query v5 options |
| 1.7 | Rate-limit handling | Implementer | 1.6 | No retry on RateLimitError, gcTime keeps stale data, rate-limit status flag for UI |
| 1.8 | Timestamp hook | Implementer | 1.6 | `useQueryTimestamp` — reads `dataUpdatedAt`, formats for navbar display |

→ **COMMIT → STOP → REVIEW**

---

## Phase 2: UI Pages

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| 2.1 | Navbar | ✅ Done | 1.8 | flex-col centered on mobile, grid-cols-3 on md+. Title+Code2+UpdatedAtBadge left, Links centered. isError badge (generic). |
| 2.2 | RepositoryCard | ✅ Done | 1.6 | Responsive (85vw/350/420/480px), stacked detail rows, name+stars flex-col→sm:flex-row, min-w-0 truncation. Hover border-primary/50 |
| 2.3 | HorizontalScroll | ✅ Done | — | overflow-x-auto, snap scroll, items-stretch, thin dark scrollbar, inner px-6 alignment |
| 2.4 | Repositories page | ✅ Done | 2.1–2.3 | StatusOverlay (hasData) + HorizontalScroll + RepositoryCards + ContributorsModal. Vertically centered. |
| 2.5 | ContributorsModal | ✅ Done | 2.4 | shadcn Dialog, isPlaceholderData for loading on repo switch, per-repo cache, dark scrollbar, truncated names, green contribution count. Virtualized list (`@tanstack/react-virtual`), total count header (80+ cap indicator), rate-limit/error handling with retry |
| 2.6 | DeveloperCard | ✅ Done | 1.6 | Responsive (85vw/350/420/480px), min-w-0 overflow-hidden on CardHeader, truncated login+repo. Large centered avatar. |
| 2.7 | Developers page | ✅ Done | 2.1, 2.6 | useRepositories dedup, Developer[] mapping, HorizontalScroll, vertically centered, hasData prop |
| 2.8 | StatusOverlay | ✅ Done | 2.4, 2.7 | Responsive skeleton widths, hasData-aware rate-limit messaging (no retry — retrying during rate-limit extends cooldown), proper padding on all states. Shared. |
| 2.9 | Visual verification | ✅ Done | 2.8 | Playwright verified at 1440/375/287/241px. Responsive layout, truncation, error states all correct. |

→ **COMMIT → STOP → REVIEW**

---

## Pre-Phase 3: Visual Enhancement (hover-tilt)

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| HT.1 | Install hover-tilt + TS types | ✅ Done | 2.9 | npm install hover-tilt, web component import in main.tsx, JSX type declaration |
| HT.2 | Wrap cards with hover-tilt | ✅ Done | HT.1 | `<hover-tilt>` wrapper on RepositoryCard + DeveloperCard, CSS ::part() selectors |
| HT.3 | Enhanced shadow + gradients | ✅ Done | HT.2 | 5-layer neon underglow, idle resting shadow, luminance-beam + aurora-sweep custom gradients |
| HT.4 | Grey theme | ✅ Done | HT.2 | bg hsl(222 18% 20%), card hsl(222 22% 14%), brighter muted-foreground for readability |
| HT.5 | Fix card clipping | ✅ Done | HT.2 | -my-10 py-10 pb-14 padding trick on HorizontalScroll outer div |
| HT.6 | Playwright verification | ✅ Done | HT.3-5 | Both pages render, hover effects work, modal functional, zero new console errors |
| HT.7 | Card dimension parity + content sizing rebalance | ✅ Done | HT.6 | Shared `CARD_BASE_DIMENSIONS` (`min-h-[24rem]` + responsive widths) for RepositoryCard and DeveloperCard. Developer card uses larger avatar/text. Repository description uses 4-line baseline + stronger responsive typography on wider screens. |
| HT.8 | Verification fallback when Playwright MCP fails | ✅ Done | HT.7 | If MCP session aborts, use localhost manual checks and user-provided screenshots, then continue with lint/type checks and document limitation in PROGRESS.md. |
| HT.9 | Repository card visual weight retune | ✅ Done | HT.8 | Increased repository text presence (title/stars/meta/button), kept mobile-safe sizing, and switched RepositoryCard hover-tilt profile to stronger luminance/soft-light settings while preserving shared card dimensions. |

→ **COMMIT → STOP → REVIEW**

---

## Tooling Notes

### Playwright MCP — Getting it to work
If `browser_navigate` fails with **"Opening in existing browser session" → immediate exit**, the Playwright MCP Chrome profile cache is stale/locked.

**Fix:** Delete the stale profile directory and retry:
```bash
rm -rf ~/Library/Caches/ms-playwright/mcp-chrome-*
```
Then call `browser_install` once, then `browser_navigate` again — it will launch a fresh Chrome instance.

**Screenshots** go in `.playwright-mcp/` (not project root).

---

## Phase 3: Polish & QA

| # | Task | Role | Deps | Key Details |
|---|------|------|------|-------------|
| 3.1 | Code review | ✅ Done | 2.9 | Full audit: DRY, naming, no comments, no `any`, conventions. See reviewer checklist in `MASTER_PLAN.md` |
| 3.2 | Rate-limit test | ✅ Done | 3.1 | Automated: Playwright `api.spec.ts` + `error-states.spec.ts` — 403 header/message detection, no-retry, non-rate-limit 403 → generic error |
| 3.3 | Responsive check | ✅ Done | 3.1 | Automated: Playwright `responsive.spec.ts` — 1440/768/375px, mobile modal usability, no body overflow |
| 3.4 | Full walkthrough | ✅ Done | 3.2, 3.3 | Automated: Playwright `navigation.spec.ts`, `repositories.spec.ts`, `developers.spec.ts` — redirect, nav, cards, fields, modal, scroll |
| 3.5 | Console + network audit | ✅ Done | 3.4 | Automated: Playwright `api.spec.ts` — correct endpoint/params, lazy contributors, query dedup, retry on 500 |
| 3.6 | Performance | Reviewer | 3.5 | Re-renders, memo usage, query efficiency, contributors only fetched when modal open |
| 3.7 | Final cleanup | Reviewer | 3.6 | Remove unused imports/dead code, final DRY pass, update PROGRESS.md |

→ **COMMIT → FINAL REVIEW**
