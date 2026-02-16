import apiClient from "@/api/client"
import type { Contributor, RepositorySearchData } from "@/types/github"
import { CONTRIBUTORS_PER_PAGE } from "@/lib/constants"
import type { AxiosResponse } from "axios"

export async function fetchRepositories(
  signal?: AbortSignal,
): Promise<AxiosResponse<RepositorySearchData>> {
  const response = await apiClient.get<RepositorySearchData>(
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

  return response
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
