import axios from "axios"

export class RateLimitError extends Error {
  constructor() {
    super("GitHub API rate limit exceeded. Showing last updated data.")
    this.name = "RateLimitError"
  }
}

// Per-resource rate limit info read from GitHub response headers.
// "search" and "core" are separate budgets tracked by GitHub:
//   search = 10 req/min (used by /search/repositories)
//   core   = 60 req/hour (used by /repos/*/contributors)
export const rateLimitInfo = {
  search: { remaining: Infinity, limit: 0 },
  core: { remaining: Infinity, limit: 0 },
}

const apiClient = axios.create({
  baseURL: "https://api.github.com",
  headers: { Accept: "application/vnd.github.v3+json" },
})

apiClient.interceptors.response.use(
  (response) => {
    const resource: string = response.headers["x-ratelimit-resource"] ?? ""
    if (resource === "search" || resource === "core") {
      const remaining = parseInt(String(response.headers["x-ratelimit-remaining"]), 10)
      const limit = parseInt(String(response.headers["x-ratelimit-limit"]), 10)
      if (!isNaN(remaining)) rateLimitInfo[resource].remaining = remaining
      if (!isNaN(limit)) rateLimitInfo[resource].limit = limit
    }
    return response
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message ?? ""
    const rateLimitRemaining = error.response?.headers?.["x-ratelimit-remaining"]

    const isRateLimited =
      (status === 403 || status === 429) &&
      (message.toLowerCase().includes("rate limit") || rateLimitRemaining?.toString() === "0")

    if (isRateLimited) {
      throw new RateLimitError()
    }
    throw error
  },
)

export default apiClient
