# Master Plan

## Project Overview
**Goal:** React dashboard showing popular JavaScript GitHub repos — two pages (Repositories & Developers), 10s auto-refresh, graceful rate-limit handling.

**Stack:** React + TypeScript, TanStack Router, TanStack Query, Axios, shadcn/ui, Lucide React. No state management library (Query cache is sufficient).

---

## Phase Flow

```
  PHASE 0          PHASE 1          PHASE 2          PHASE 3
  Scaffold  ──────▶  API    ──────▶   UI     ──────▶  Polish
  + Config         Layer           Pages            + QA
     │                │               │                │
     ▼                ▼               ▼                ▼
  COMMIT ①        COMMIT ②        COMMIT ③        COMMIT ④
  + REVIEW        + REVIEW        + REVIEW        + REVIEW
```

---

## Agent Roles

```
  Task type?
     │
     ├─ Setup / Structure ───▶ 🏗️  ARCHITECT
     ├─ Build feature ────────▶ 🔨  IMPLEMENTER
     ├─ Styling / Layout ────▶ 🎨  DESIGNER
     ├─ Audit / Refactor ────▶ 🔍  REVIEWER
     └─ Visual / Functional ─▶ 🧪  QA ENGINEER
     
  After ANY task → update PROGRESS.md
  After ANY phase → propose commit → STOP for review
```

### 🏗️ Architect (Phase 0, new patterns)
- Read `ARCHITECTURE.md` FIRST — ensure files fit defined structure
- Use **Context7 MCP** to verify library setup guides before scaffolding
- Create config, folder structure, base layouts, type contracts
- Does NOT implement logic/UI or make styling decisions
- Output: clean scaffold, zero errors

### 🔨 Implementer (Phase 1–2)
- Implement ONLY what the current task specifies
- Check `ARCHITECTURE.md` DRY checklist before writing code
- For API tasks → read `API_STRATEGY.md` first
- For UI tasks → read `ARCHITECTURE.md` design system section first
- Use **Context7 MCP** to verify library APIs before using them
- No comments — self-explanatory code only
- Does NOT refactor outside task scope or over-engineer

### 🎨 Designer (Phase 2, styling tasks)
- Owns all visual decisions: layout, spacing, color application, component aesthetics
- Follows the design system in `ARCHITECTURE.md` strictly (dark theme, blue accents, no animations)
- Uses shadcn/ui components as base, customizes with Tailwind utilities
- Creates wireframe-level layout specs (ASCII or description) before implementing complex components
- Ensures visual consistency across pages — same card patterns, same spacing, same icon sizing
- Uses **Playwright MCP** to screenshot and verify visual output matches intent
- Does NOT change data flow, hook logic, or API layer

### 🔍 Reviewer (Phase 3, on-demand)
- Audit all files against `ARCHITECTURE.md` conventions
- DRY violations, naming consistency, unused code, `any` types
- Verify: all API calls through Axios instance, all data through query hooks, all pages handle loading/error/rate-limit
- **Checklist:** no comments, no `any`, no direct axios imports, no fetching in components, no duplicate UI patterns, types centralized in `types/github.ts`

### 🧪 QA Engineer (Phase 3, after UI tasks)
- Use **Playwright MCP** for ALL checks — never assume, always verify
- Navigate pages, screenshot, check console, test interactions
- Test: navigation, horizontal scroll, modal open/close, timestamp updates, rate-limit fallback, responsive breakpoints
- Output: pass/fail report added to `PROGRESS.md`

**Role transitions:** Reviewer → finds issue → Implementer fixes → Reviewer re-checks. QA → finds bug → Implementer fixes → QA re-tests.

---

## Phase 0: Scaffold & Config

**Role:** Architect → QA

| # | Task | Output |
|---|------|--------|
| 0.1 | Init Vite + React + TS | `package.json`, `vite.config.ts` |
| 0.2 | Install deps (tanstack query/router, axios, shadcn, lucide) | `package.json` |
| 0.3 | Configure shadcn dark theme + blue accents | `tailwind.config.ts`, `globals.css` |
| 0.4 | Set up TanStack Router file-based routes | `src/routes/` |
| 0.5 | Root layout with Navbar shell + QueryClientProvider | `__root.tsx` |
| 0.6 | Verify clean start (Playwright MCP) | Zero console errors |

→ COMMIT → REVIEW

---

## Phase 1: API Layer

**Role:** Implementer

```
  GitHub API ──▶ Axios Instance ──▶ TanStack Query Cache ──▶ Components
       │              │                    │
  Rate Limit?    Interceptor          10s refetch
       │         (detect 403)         (staleTime)
       ▼              │                    │
  Return cached   Flag as             Serve stale
  data (gcTime)   rate-limited        if error
```

| # | Task | Output |
|---|------|--------|
| 1.1 | Define TS interfaces for all API responses | `src/types/github.ts` |
| 1.2 | Create Axios instance with rate-limit interceptor | `src/api/client.ts` |
| 1.3 | Make real API calls, validate response shapes match types | Adjusted types |
| 1.4 | Build mock data matching real API shapes exactly | `src/api/mocks/` |
| 1.5 | Implement API service functions | `src/api/github.ts` |
| 1.6 | Create TanStack Query hooks (10s refetch, cache config) | `src/hooks/queries/` |
| 1.7 | Rate-limit detection + fallback-to-cache logic | In hooks |
| 1.8 | Last-updated timestamp tracking for navbar | `useQueryTimestamp` |

→ COMMIT → REVIEW

---

## Phase 2: UI Pages & Components

**Role:** Implementer + Designer

```
  __root.tsx (Layout)
  ├── Navbar
  │   ├── NavLinks (Repositories | Developers)
  │   └── UpdatedAtBadge
  ├── /repositories
  │   └── HorizontalScroll
  │       └── RepositoryCard[] → ContributorsModal
  └── /developers
      └── HorizontalScroll
          └── DeveloperCard[]
```

| # | Task | Output |
|---|------|--------|
| 2.1 | Navbar with routing + "Updated At" + rate-limit indicator | `Navbar.tsx` |
| 2.2 | RepositoryCard (name, stars, desc, license, forks, issues, button) | `RepositoryCard.tsx` |
| 2.3 | Horizontal scroll container | `HorizontalScroll.tsx` |
| 2.4 | Repositories page composing cards + scroll | `repositories.tsx` |
| 2.5 | ContributorsModal (fetches on open, shadcn Dialog) | `ContributorsModal.tsx` |
| 2.6 | DeveloperCard (avatar, name, repo, stars) | `DeveloperCard.tsx` |
| 2.7 | Developers page with horizontal scroll (derived from repo data) | `developers.tsx` |
| 2.8 | Shared StatusOverlay (loading/error/rate-limit/empty) | `StatusOverlay.tsx` |
| 2.9 | Visual verification (Playwright MCP) | QA pass |

→ COMMIT → REVIEW

---

## Phase 3: Polish & QA

**Role:** Reviewer → QA

| # | Task | Output |
|---|------|--------|
| 3.1 | Full code review (DRY, naming, no comments, structure) | Refactored |
| 3.2 | Rate-limit scenario testing with mocks | Verified fallback |
| 3.3 | Responsive check (1440/1024/768px) | CSS fixes |
| 3.4 | Playwright full walkthrough (both pages, modal, scroll) | QA pass |
| 3.5 | Console + network audit (zero errors, no redundant calls) | Clean |
| 3.6 | Performance (re-renders, query efficiency, contributors on-demand) | Optimized |
| 3.7 | Final cleanup (unused imports, dead code, update PROGRESS) | Ship-ready |

→ COMMIT → FINAL REVIEW

---

## Rules for All Phases
1. Before creating any file → check `ARCHITECTURE.md`
2. Before any API work → read `API_STRATEGY.md`
3. After every task → update `PROGRESS.md`
4. **Commit after every subtask** (0.1 → 0.2 → 0.3 etc.) — small, atomic commits
5. **Big changes/refactors** → commit BEFORE and AFTER for sanity
6. After every phase → STOP for review
7. Use **Context7 MCP** for library docs — never guess at APIs
8. Use **Playwright MCP** to verify UI after visual tasks
