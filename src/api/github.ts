import apiClient from "@/api/client"
import type { Contributor, RepositorySearchResponse } from "@/types/github"
import { CONTRIBUTORS_PER_PAGE } from "@/lib/constants"

export async function fetchRepositories(
  signal?: AbortSignal,
): Promise<RepositorySearchResponse> {
  const { data } = await apiClient.get<RepositorySearchResponse>(
    "/search/repositories",
    {
      params: {
        q: "language:javascript",
        sort: "stars",
        order: "desc",
        per_page: 10,
      },
      signal,
    },
  )

  return data
}

export async function fetchContributors(
  repoFullName: string,
  signal?: AbortSignal,
): Promise<Contributor[]> {
  const { data } = await apiClient.get<Contributor[]>(
    `/repos/${repoFullName}/contributors`,
    { params: { per_page: CONTRIBUTORS_PER_PAGE }, signal },
  )
  return data
}
