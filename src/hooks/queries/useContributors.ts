import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchContributors } from "@/api/github"
import { RateLimitError } from "@/api/client"
import {
  QUERY_KEYS,
  CONTRIBUTORS_STALE_TIME,
  CONTRIBUTORS_GC_TIME,
  MAX_RETRY_COUNT,
} from "@/lib/constants"

export function useContributors(repoFullName: string, enabled: boolean) {
  const query = useQuery({
    queryKey: QUERY_KEYS.contributors(repoFullName),
    queryFn: ({ signal }) => fetchContributors(repoFullName, signal),
    enabled,
    staleTime: CONTRIBUTORS_STALE_TIME,
    gcTime: CONTRIBUTORS_GC_TIME,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) =>
      error instanceof RateLimitError ? false : failureCount < MAX_RETRY_COUNT,
  })

  return {
    ...query,
    isRateLimited: query.error instanceof RateLimitError,
  }
}
