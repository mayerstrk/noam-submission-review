import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchRepositories } from "@/api/github"
import { RateLimitError } from "@/api/client"
import {
  QUERY_KEYS,
  REPOS_REFETCH_INTERVAL,
  REPOS_STALE_TIME,
  MAX_RETRY_COUNT,
} from "@/lib/constants"

export function useRepositories() {
  const query = useQuery({
    queryKey: QUERY_KEYS.repositories,
    queryFn: ({ signal }) => fetchRepositories(signal),
    refetchInterval: REPOS_REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: REPOS_STALE_TIME,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) =>
      error instanceof RateLimitError ? false : failureCount < MAX_RETRY_COUNT,
  })

  return {
    ...query,
    isRateLimited: query.error instanceof RateLimitError,
  }
}
