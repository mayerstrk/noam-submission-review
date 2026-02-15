export const QUERY_KEYS = {
  repositories: ["repositories"] as const,
  contributors: (repoFullName: string) => ["contributors", repoFullName] as const,
}

export const REPOS_REFETCH_INTERVAL = 10_000
export const REPOS_STALE_TIME = 10_000
export const DEFAULT_GC_TIME = 10 * 60 * 1000
export const PERSIST_MAX_AGE = 20 * 60 * 60 * 1000
export const CONTRIBUTORS_STALE_TIME = 5 * 60 * 1000
export const CONTRIBUTORS_GC_TIME = 30 * 60 * 1000
export const MAX_RETRY_COUNT = 2

export const CONTRIBUTORS_PER_PAGE = 80

export const SKELETON_COUNT = 5

export const RATE_LIMIT_WARNING_THRESHOLD = 5
