import type { Page } from "@playwright/test"
import { MOCK_REPOS, MOCK_CONTRIBUTORS } from "../fixtures/mock-data"

export async function mockGitHubAPI(page: Page) {
  await page.route("**/api.github.com/search/repositories*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_REPOS),
    }),
  )

  await page.route("**/api.github.com/repos/**/contributors*", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_CONTRIBUTORS),
    }),
  )
}

export async function mockGitHubAPIRateLimit(page: Page) {
  await page.route("**/api.github.com/search/repositories*", (route) =>
    route.fulfill({
      status: 403,
      contentType: "application/json",
      headers: { "x-ratelimit-remaining": "0" },
      body: JSON.stringify({ message: "API rate limit exceeded" }),
    }),
  )
}

export async function mockGitHubAPIError(page: Page) {
  await page.route("**/api.github.com/search/repositories*", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ message: "Internal Server Error" }),
    }),
  )
}

export async function clearPersistedState(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.clear()
    } catch {}
  })
}
