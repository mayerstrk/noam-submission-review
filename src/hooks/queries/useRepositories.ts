import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { fetchRepositories } from "@/api/github"
import {
  QUERY_KEYS,
  REPOS_REFETCH_INTERVAL,
  REPOS_STALE_TIME,
} from "@/lib/constants"
import type { AxiosError } from "axios"

export function useRepositories() {
  const query = useQuery({
    queryKey: QUERY_KEYS.repositories,
    queryFn: ({ signal }) => fetchRepositories(signal),
    refetchInterval: REPOS_REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: REPOS_STALE_TIME,
    placeholderData: keepPreviousData,
    retry: false
  })

  return {
    ...query,
    error: query.error as AxiosError || null
  }
}
