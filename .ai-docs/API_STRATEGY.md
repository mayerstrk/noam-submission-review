# API Strategy

## Endpoints

| Endpoint | Purpose | Refetch |
|----------|---------|---------|
| `GET /search/repositories?q=language:javascript&sort=stars&order=desc&per_page=10` | Top 10 JS repos | 10s interval |
| `GET /repos/{owner}/{repo}/contributors?per_page=80` | Repo contributors (capped at 80) | On-demand (modal open) |

**Developers page** — derived from the same top 10 JS repos query (no separate endpoint). Both pages share the same TanStack Query cache via `queryKey: ['repositories']`, so only one API call is made:
- `owner.login` → developer name
- `name` → repo name
- `stargazers_count` → stars in that repo
- `owner.avatar_url` → developer profile image
- Same developer may appear more than once if they own multiple top repos
- List is ordered by stars (desc), with client-side sort in `fetchRepositories()` for stable ordering across refetches

---

## Implementation Order

### 1. Make Real Calls First
Before any abstraction, hit the actual endpoints and study the response:
```ts
const res = await fetch('https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc&per_page=10');
const data = await res.json();
console.log(JSON.stringify(data.items[0], null, 2));
```
This reveals the exact shape, nullable fields (license is often null), and nested structures.

### 2. Define Clear Interfaces
Based on real responses — only fields we display:
```ts
// types/github.ts
interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  license: { name: string } | null;
  owner: { login: string; avatar_url: string };
}

interface RepositorySearchResponse {
  total_count: number;
  items: Repository[];
}

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  contributions: number;
}

// Derived from the same top 10 JS repos query — NOT a separate API call
// Each repo maps to one developer entry (same owner can appear multiple times)
interface Developer {
  login: string;        // owner.login
  avatar_url: string;   // owner.avatar_url
  repoName: string;     // repo.name
  repoStars: number;    // repo.stargazers_count
}
```

---

## Axios Client

```ts
// api/client.ts
const apiClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});

// Rate limit budget from response headers, per resource.
// GitHub tracks "search" (10 req/min) and "core" (60 req/hour) separately.
export const rateLimitInfo = {
  search: { remaining: Infinity, limit: 0 },
  core: { remaining: Infinity, limit: 0 },
}

// Success interceptor: read x-ratelimit-remaining + x-ratelimit-resource
apiClient.interceptors.response.use(
  (response) => {
    const resource = response.headers['x-ratelimit-resource']
    if (resource === 'search' || resource === 'core') {
      rateLimitInfo[resource].remaining = parseInt(headers['x-ratelimit-remaining'])
      rateLimitInfo[resource].limit = parseInt(headers['x-ratelimit-limit'])
    }
    return response
  },
  (error) => {
    // Handle both 403 and 429 (per GitHub docs, rate limits return either status)
    if ((status === 403 || status === 429) && isRateLimitMessage) {
      throw new RateLimitError()
    }
    throw error
  }
);
```

### ETag / Conditional Requests
ETags do **NOT** save rate limit for unauthenticated requests. Per GitHub docs: "Making a conditional request does not count against your primary rate limit if a 304 response is returned **and the request was made while correctly authorized with an Authorization header**." Since this project is unauthenticated, ETags provide zero rate limit benefit.

---

## TanStack Query Config

**Repositories** (polled):
```ts
{
  queryKey: ['repositories'],
  queryFn: fetchRepositories,
  refetchInterval: 10_000,
  refetchIntervalInBackground: false,   // Stop polling when tab is unfocused
  staleTime: 10_000,
  placeholderData: keepPreviousData,    // Show old data during refetch
  retry: (count, error) => error instanceof RateLimitError ? false : count < 2,
}
```

**Contributors** (on-demand):
```ts
{
  queryKey: ['contributors', repoFullName],
  queryFn: () => fetchContributors(repoFullName),
  enabled,                              // Only when modal is open
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,              // 30 min — contributor data changes rarely
  placeholderData: keepPreviousData,
  retry: (count, error) => error instanceof RateLimitError ? false : count < 2,
}
```

**QueryClient defaults** (main.tsx):
```ts
gcTime: 10 * 60 * 1000                 // 10 min global default
```

**Persistence** (main.tsx):
```ts
PersistQueryClientProvider + createAsyncStoragePersister({
  storage: window.localStorage          // Entire cache persisted, updated after every fetch (1s throttle)
})
persistOptions: { maxAge: 20 * 60 * 60 * 1000 }  // 20h — prefer stale data over no data
```

### Key Decisions
- **Single repos query shared** between Repositories page and Developers page (zero extra calls)
- **Contributors cached per repo** — same modal opened twice doesn't re-fetch within staleTime. `isPlaceholderData` used in UI to show loading skeletons instead of stale data from a different repo
- **Contributors capped at 80** — single request with `per_page=80` (constant `CONTRIBUTORS_PER_PAGE`). Avoids pagination loops that drain rate limit. Modal header shows `80+` when response hits the cap
- **refetchInterval is global** — doesn't reset on navigation between pages
- **Minimize calls:** 1 polled endpoint + on-demand contributors only
- **localStorage persistence** — entire query cache (repos + contributors) persisted. On refresh/new tab, data loads instantly; stale queries refetch in background. If refetch fails (rate limit/network), user sees last good data with warning indicators
- **Focus-only polling** — background tabs make zero API requests. Polling resumes on tab focus
- **Generous maxAge (20h)** — better to show old data with stale indicators (navbar timestamp + amber warning + overlay message) than no data at all
- **Rate limit header tracking** — success interceptor reads `x-ratelimit-remaining` and `x-ratelimit-resource` from every response. Stored in a plain `rateLimitInfo` object per resource (`search`, `core`)
- **429 status code handling** — error interceptor checks both 403 and 429 (per GitHub docs, rate limits can return either)
- **Approaching-limit warning** — when remaining requests drop to `RATE_LIMIT_WARNING_THRESHOLD` (5), StatusOverlay and ContributorsModal show a subtle "API quota low (X/Y remaining)" banner
- **ETags not used** — conditional requests only exempt from rate limits when authenticated (per GitHub docs). No benefit for unauthenticated calls

---

## Rate-Limit Behavior

| Scenario | What Happens |
|----------|--------------|
| Normal | Fresh data every 10s |
| Approaching limit (remaining ≤ 5) | Subtle amber warning: "API quota low (X/Y requests remaining)" |
| 403 or 429 rate-limited | Query fails → `placeholderData` keeps last good data visible |
| Rate-limited + no cache | StatusOverlay shows friendly error |
| Rate limit clears | Next 10s tick succeeds, UI auto-updates |
| Tab unfocused | Polling stops completely, zero requests |
| Tab refocused | Immediate refetch if data is stale |
| Page refresh | Cached data from localStorage shown instantly, background refetch |
| Refresh + rate-limited | Persisted data shown, navbar shows last update time, amber warning |

### Rate Limit Budgets (Unauthenticated)
| Resource | Limit | Used By |
|----------|-------|---------|
| `search` | 10 req/min | `/search/repositories` — at 10s polling = 6 req/min (60% usage) |
| `core` | 60 req/hour | `/repos/*/contributors` — on-demand only |

**Core rule:** User ALWAYS sees data. Old data > no data.
